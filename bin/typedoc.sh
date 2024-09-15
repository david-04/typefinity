#!/usr/bin/env bash

set -e

[[ -f "bin/typedoc.sh" ]] && cd "bin"

echo Creating API documentation...

TYPEFINITY_VERSION=0.0.0 # $(scripts/get-typefinity-version.sh)

for TYPE in cli; do #

    ../node_modules/.bin/typedoc \
        --categorizeByGroup \
        --cleanOutputDir true \
        --disableGit \
        --disableSources \
        --excludeExternals \
        --excludeInternal \
        --excludePrivate \
        --excludeProtected \
        --favicon https://david-04.github.io/typefinity/favicon.svg \
        --githubPages false \
        --gitRemote https://github.com/david-04/typefinity.git \
        --hideGenerator \
        --logLevel Warn \
        --name "typefinity-${TYPE?} ${TYPEFINITY_VERSION?}" \
        --navigation.includeCategories false \
        --navigation.includeGroups false \
        --out "../docs/${TYPE?}" \
        --plugin typedoc-plugin-extras \
        --readme ../README.md \
        --searchInComments \
        --sort alphabetical \
        --sort static-first \
        --treatWarningsAsErrors \
        --tsconfig ../resources/tsconfig/tsconfig.typedoc.json \
        ../dist/${TYPE?}.d.ts

done
