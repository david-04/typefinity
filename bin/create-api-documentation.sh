#!/usr/bin/env bash

set -e

[[ -f "bin/create-api-documentation.sh" ]] && cd "bin"

echo "Creating API documentation..."

[[ -d "../build/typedoc-src" ]] && rm -rf "../build/typedoc-src"
cp -r "../src" "../build/typedoc-src/"
find "../build/typedoc-src" -type f -name "*.ts" -exec sed -i -E 's|^[ \t]*/\*{2}-{20,}|/**|g;s|-{20,}\*/|*/|' {} \;

grep -v "^# typefinity" "../README.md" >"../build/typedoc-src/README.md"

if [[ -d "../build/typedoc" ]]; then
    rm -rf "../build/typedoc/*"
else
    mkdir -p "../build/typedoc"
fi

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
    --favicon ../resources/typedoc/favicon.svg \
    --githubPages false \
    --gitRemote https://github.com/david-04/typefinity.git \
    --hideGenerator \
    --logLevel Warn \
    --name "typefinity" \
    --navigation.includeCategories false \
    --navigation.includeGroups false \
    --out "../build/typedoc" \
    --readme ../build/typedoc-src/README.md \
    --searchInComments \
    --sort alphabetical \
    --sort static-first \
    --treatWarningsAsErrors \
    --tsconfig "../resources/typedoc/tsconfig.typedoc.json" \
    "../build/typedoc-src/bundles/bundle-all.ts"

rm -rf "../build/typedoc-src"

. ./validate-changelog-links.sh
