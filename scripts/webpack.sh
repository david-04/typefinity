#!/usr/bin/env bash

set -e
cd "`dirname "${BASH_SOURCE[0]}"`/.."

echo "Running webpack..."
rm -rf build/webpack/bundles
yarn webpack --config build/tsc/scripts/build/webpack.js --stats errors-only

for bundle in core node web all cli
do
    sed 's|webpack:///./build/webpack/src/|./src/|g' \
        "build/webpack/bundles/typefinity-$bundle.js.map" \
        > "build/webpack/bundles/typefinity-$bundle.js.map.tmp"
    mv -f "build/webpack/bundles/typefinity-$bundle.js.map.tmp" \
          "build/webpack/bundles/typefinity-$bundle.js.map"
    node --enable-source-maps \
         build/tsc/scripts/build/simplify-module-declarations.js \
         "build/webpack/bundles/typefinity-$bundle.d.ts"
done
