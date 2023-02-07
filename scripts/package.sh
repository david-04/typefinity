#!/usr/bin/env bash

set -e
cd "`dirname "${BASH_SOURCE[0]}"`/.."

echo Packaging...

TYPEFINITY_VERSION=$(scripts/get-typefinity-version.sh)

rm -rf "build/package"
mkdir -p "build/package/internal"

for bundle in core node web cli
do
    cp -f "build/webpack/bundles/typefinity-$bundle.js" build/package/internal/
done

for bundle in core node web
do
    mkdir -p "build/package/$bundle/global"
    cp -f "build/webpack/bundles/typefinity-$bundle-module.d.ts" "build/package/$bundle/index.d.ts"
    cp -f "build/webpack/bundles/typefinity-$bundle-global.d.ts" "build/package/$bundle/global/index.d.ts"
    node --enable-source-maps \
         build/tsc/scripts/build/create-import-export-wrapper.js \
         ./build/package/internal/typefinity-$bundle.js \
         module \
         ./build/package/$bundle/index.js
    node --enable-source-maps \
         build/tsc/scripts/build/create-import-export-wrapper.js \
         ./build/package/internal/typefinity-$bundle.js \
         global \
         ./build/package/$bundle/global/index.js
done

cp resources/package/package.json build/package/package.json
cp resources/package/README.md build/package/README.md

# Debugging into sources does not work with Yarn PnP
# rm -rf build/package/internal/src
# mkdir -p build/package/internal/src
# rsync -r -m -p -A --delete --exclude="*.test.ts" --exclude="tsconfig.json" src/* build/package/internal/src

cd build/package
