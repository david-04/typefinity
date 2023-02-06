#!/usr/bin/env bash

set -e
cd "`dirname "${BASH_SOURCE[0]}"`/.."

echo Packaging...
mkdir -p "build/temp"
mkdir -p "dist/internal"

for bundle in core node web cli
do
    cp -f "build/webpack/bundles/typefinity-$bundle.js" dist/internal/
    cp -f "build/webpack/bundles/typefinity-$bundle.js.map" dist/internal/
done

for bundle in core node web
do
    mkdir -p "dist/$bundle/global"
    cp -f "build/webpack/bundles/typefinity-$bundle-module.d.ts" "dist/$bundle/index.d.ts"
    cp -f "build/webpack/bundles/typefinity-$bundle-global.d.ts" "dist/$bundle/global/index.d.ts"
    node --enable-source-maps \
         build/tsc/scripts/build/create-import-export-wrapper.js \
         ./dist/internal/typefinity-$bundle.js \
        module \
        ./dist/$bundle/index.js \
    && node --enable-source-maps \
        build/tsc/scripts/build/create-import-export-wrapper.js \
        ./dist/internal/typefinity-$bundle.js \
        global \
        ./dist/$bundle/global/index.js
done

rm -rf dist/internal/src dist/internal/typefinity-src.zip
find src | grep -vE "^src/debug.ts|^src/tsconfig.json|^src/scripts|\.test\." \
         | zip -@ -9 -q dist/internal/typefinity-src.zip
mkdir -p "$@/.."
