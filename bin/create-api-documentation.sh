#!/usr/bin/env bash

set -e

[[ -f "bin/create-api-documentation.sh" ]] && cd "bin"

echo "Creating API documentation..."

if [[ -d "../build/typedoc" ]]; then
    rm -rf "../build/typedoc/*"
fi
mkdir -p "../build/typedoc"

grep -v "^# typefinity" "../README.md" >"../build/typedoc/README.md"

../node_modules/.bin/typedoc \
    --categorizeByGroup \
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
    "../build/tsc/bundles/bundle-all.d.ts"

rm -rf "../build/typedoc/README.md"

. ./validate-changelog-links.sh
