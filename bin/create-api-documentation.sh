#!/usr/bin/env bash

function __tf_create_api_documentation() {

    if [[ -f "bin/create-api-documentation.sh" ]]; then
        if ! cd bin; then
            echo "ERROR: Failed to change to the bin directory" >&2
            return 1
        fi
    fi

    echo "Creating API documentation..."

    if [[ -d "../build/typedoc" ]]; then
        rm -rf "../build/typedoc/*"
    fi
    mkdir -p "../build/typedoc"

    grep -v "^# typefinity" "../README.md" >"../build/typedoc/README.md"

    if ! ../node_modules/.bin/typedoc --categorizeByGroup \
        --cleanOutputDir false \
        --customCss ../resources/typedoc/typedoc.css \
        --disableGit \
        --disableSources \
        --excludeExternals \
        --excludeInternal \
        --excludePrivate \
        --excludeProtected \
        --favicon ../resources/typedoc/favicon.svg \
        --githubPages false \
        --gitRemote https://github.com/david-04/typefinity.git \
        --hideGenerator \
        --logLevel Warn \
        --name "typefinity" \
        --navigation.includeCategories false \
        --navigation.includeGroups false \
        --out "../build/typedoc" \
        --readme ../build/typedoc/README.md \
        --searchInComments \
        --sort alphabetical \
        --sort static-first \
        --treatWarningsAsErrors \
        --tsconfig "../resources/typedoc/tsconfig.typedoc.json" \
        "../build/tsc/bundles/bundle-all.d.ts" \
        ; then
        return 1
    fi

    rm -f "../build/typedoc/README.md"

    . ./validate-changelog-links.sh
}

__tf_create_api_documentation "$@"
