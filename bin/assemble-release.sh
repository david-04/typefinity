#!/usr/bin/env bash

set -e

function __tf_assemble_release() {
    unset -f __tf_assemble_release

    #-------------------------------------------------------------------------------------------------------------------
    # Initialization
    #-------------------------------------------------------------------------------------------------------------------

    [[ -f "bin/assemble-release.sh" ]] && cd "bin"

    echo "Assembling release..."

    VERSION_NUMBER=$(./get-version-number.sh)

    #-------------------------------------------------------------------------------------------------------------------
    # Verify that the documentation links in the changelog are still valid
    #-------------------------------------------------------------------------------------------------------------------

    . ./validate-changelog-links.sh

    #-------------------------------------------------------------------------------------------------------------------
    # Create the npm packages
    #-------------------------------------------------------------------------------------------------------------------

    local BUNDLE

    for BUNDLE in cli web; do

        [[ -d "../dist/typefinity-${BUNDLE?}" ]] && rm -rf "../dist/typefinity-${BUNDLE?}"
        mkdir -p "../dist/typefinity-${BUNDLE?}"

        cp "../CHANGELOG.md" "../dist/typefinity-${BUNDLE?}/"
        cp "../LICENSE" "../dist/typefinity-${BUNDLE?}/"
        grep -v "^# typefinity" "../README.md" >"../dist/typefinity-${BUNDLE?}/README.md"

        sed "s|0\\.0\\.0|${VERSION_NUMBER?}|" "../resources/packages/package.${BUNDLE?}.json" >"../dist/typefinity-${BUNDLE?}/package.json"

        cp ../build/bundle/typefinity-${BUNDLE?}.mjs "../dist/typefinity-${BUNDLE?}/index.mjs"
        cp ../build/bundle/typefinity-${BUNDLE?}.d.ts "../dist/typefinity-${BUNDLE?}/index.d.ts"

        if [[ ${BUNDLE?} == "web" ]]; then
            mkdir -p "../dist/typefinity-${BUNDLE?}/test"
            cp ../build/bundle/typefinity-test.mjs "../dist/typefinity-${BUNDLE?}/test/index.mjs"
            cp ../build/bundle/typefinity-test.d.ts "../dist/typefinity-${BUNDLE?}/test/index.d.ts"
        fi
    done

    #-------------------------------------------------------------------------------------------------------------------
    # Check dynamic imports
    #-------------------------------------------------------------------------------------------------------------------

    if grep -e 'import[^;]*from\s*"' ../dist/typefinity-web/index.mjs >/dev/null; then
        echo "ERROR: dist/typefinity-web/index.mjs contains import statements (might include code that depends on Node)" >&2
        return 1
    fi

    local BUNDLE

    for BUNDLE in typefinity-cli/index.mjs typefinity-web/test/index.mjs; do
        if sed 's|import[^;]*from\s*"node:||g' "../dist/${BUNDLE?}" | grep -e 'import[^;]*from\s*"' >/dev/null; then
            echo "ERROR: dist/${BUNDLE?} contains dynamic imports that don't start with \"node:\"" >&2
            return 1
        fi
    done

    #-------------------------------------------------------------------------------------------------------------------
    # Copy the API documentation to the docs directory
    #-------------------------------------------------------------------------------------------------------------------

    cd ../docs
    git checkout -q docs
    cd ../bin
    rm -rf ../docs/*
    cp -r ../build/typedoc/* ../docs
}

__tf_assemble_release "$@"
