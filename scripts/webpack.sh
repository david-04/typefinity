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
        | base64 -w 0 \
        | sed 's|^|\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,|' \
        >> build/webpack/bundles/typefinity-$bundle.js
    node --enable-source-maps \
         build/tsc/scripts/build/simplify-module-declarations.js \
         "build/webpack/bundles/typefinity-$bundle.d.ts"
done
