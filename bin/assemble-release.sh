#!/usr/bin/env bash

#-----------------------------------------------------------------------------------------------------------------------
# Initialization
#-----------------------------------------------------------------------------------------------------------------------

set -e
[[ -f "bin/assemble-release.sh" ]] && cd "bin"

echo "Assembling release..."

VERSION_NUMBER=$(./get-version-number.sh)

#-----------------------------------------------------------------------------------------------------------------------
# Create the npm packages
#-----------------------------------------------------------------------------------------------------------------------

for BUNDLE in cli web; do

    [[ -d "../dist/${BUNDLE?}" ]] && rm -rf "../dist/${BUNDLE??}"
    mkdir -p "../dist/${BUNDLE?}"

    for FILE in README.md LICENSE CHANGELOG.md; do
        cp "../${FILE?}" "../dist/${BUNDLE?}/"
    done

    sed "s|0\\.0\\.0|${VERSION_NUMBER?}|" "../resources/packages/package.${BUNDLE?}.json" >"../dist/${BUNDLE?}/package.json"

    cp ../build/bundle/typefinity-${BUNDLE?}.mjs "../dist/${BUNDLE?}/index.mjs"
    cp ../build/bundle/typefinity-${BUNDLE?}.d.ts "../dist/${BUNDLE?}/index.d.ts"

    if [[ ${BUNDLE?} == "web" ]]; then
        mkdir -p "../dist/${BUNDLE?}/test"
        cp ../build/bundle/typefinity-test.mjs "../dist/${BUNDLE?}/test/index.mjs"
        cp ../build/bundle/typefinity-test.d.ts "../dist/${BUNDLE?}/test/index.d.ts"
    fi

done

#-----------------------------------------------------------------------------------------------------------------------
# Copy the API documentation
#-----------------------------------------------------------------------------------------------------------------------

cd ../docs
git checkout -q docs
cd ../bin
rm -rf ../docs/*
cp -r ../build/typedoc/* ../docs
