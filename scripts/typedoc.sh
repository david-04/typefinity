#!/usr/bin/env bash

set -e
cd "`dirname "${BASH_SOURCE[0]}"`/.."

echo Creating API documentation...

TYPEFINITY_VERSION=$(scripts/get-typefinity-version.sh)

rm -rf build/typedoc build/temp/typedoc
mkdir -p build/typedoc build/temp/typedoc
cp -f build/webpack/bundles/typefinity-all-module.d.ts build/temp/typedoc/typefinity.ts
sed -E "s|\\$\{VERSION}|$TYPEFINITY_VERSION|" resources/documentation/typedoc.md > build/temp/typedoc/README.md

yarn typedoc --out build/typedoc \
             --tsconfig resources/tsconfig/typedoc/tsconfig.typedoc.json \
             --name "typefinity" \
             --readme build/temp/typedoc/README.md \
             --githubPages false \
             --gitRemote https://github.com/david-04/typefinity.git \
             --excludePrivate \
             --excludeProtected \
             --excludeExternals \
             --excludeInternal \
             --sort static-first \
             --sort alphabetical \
             --disableSources \
             --hideGenerator \
             --logLevel Warn \
             --treatWarningsAsErrors \
             --cleanOutputDir true \
             --plugin typedoc-plugin-extras \
             --favicon resources/documentation/logo.svg \
             build/temp/typedoc/typefinity.ts
