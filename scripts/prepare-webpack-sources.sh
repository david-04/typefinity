#!/usr/bin/env bash

set -e
cd "`dirname "${BASH_SOURCE[0]}"`/.."

echo Preparing webpack sources...

mkdir -p build/webpack/src
rsync -r -m -p -A --delete src/ build/webpack/src
node --enable-source-maps build/tsc/scripts/build/normalize-jsdoc-comments.js build/webpack/src
rm -f build/webpack/src/bundle-*.ts \

for compilation in core node web all
do
    echo 'export * as export_core from "./core/export-core";' >> "build/webpack/src/bundle-$compilation.ts"
done

for compilation in core node all
do
    echo 'export * as export_node from "./node/export-node";' >> "build/webpack/src/bundle-$compilation.ts"
done

for compilation in web all
do
    echo 'export * as export_web from "./web/export-web";' >> "build/webpack/src/bundle-$compilation.ts"
done

echo '{"extends":"../../../resources/tsconfig/webpack/tsconfig.webpack.json"}' > build/webpack/src/tsconfig.json
tsc -p build/webpack/src
