#!/usr/bin/env bash

# shellcheck disable=SC2317

set -e

[[ -f "bin/create-api-documentation.sh" ]] && cd "bin"

echo "Creating API documentation..."

[[ -d "../build/typedoc" ]] || mkdir -p "../build/typedoc"

../node_modules/.bin/typedoc \
    --categorizeByGroup \
    --cleanOutputDir true \
    --customCss ../resources/typedoc.css \
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
    --name "typefinity" \
    --navigation.includeCategories false \
    --navigation.includeGroups false \
    --out "../build/typedoc" \
    --plugin typedoc-plugin-extras \
    --readme ../README.md \
    --searchInComments \
    --sort alphabetical \
    --sort static-first \
    --treatWarningsAsErrors \
    "../src/typefinity.ts"
