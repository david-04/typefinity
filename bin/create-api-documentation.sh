#!/usr/bin/env bash

# shellcheck disable=SC2317

set -e

if [[ $# -ne 1 ]]; then
    echo "Syntax: create-api-documentation.sh [cli|core|web]" >&2
    return 1 || exit 1
fi

[[ -f "bin/create-api-documentation.sh" ]] && cd "bin"

if [[ ! -f "../build/bundle/typefinity-${1?}.d.ts" ]]; then
    echo "ERROR: File build/bundle/typefinity-${1?}.d.ts does not exist" >&2
    return 1 || exit 1
fi

echo "Creating API documentation for $1..."

[[ -d "../build/typedoc" ]] || mkdir -p "../build/typedoc"

../node_modules/.bin/typedoc \
    --categorizeByGroup \
    --cleanOutputDir true \
    --customCss ../resources/typedoc/typedoc.css \
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
    --name "typefinity-${1?}" \
    --navigation.includeCategories false \
    --navigation.includeGroups false \
    --out "../build/typedoc/${1?}" \
    --plugin typedoc-plugin-extras \
    --readme ../README.md \
    --searchInComments \
    --sort alphabetical \
    --sort static-first \
    --treatWarningsAsErrors \
    --tsconfig ../resources/typedoc/tsconfig.typedoc.json \
    "../build/bundle/typefinity-${1?}.d.ts"
