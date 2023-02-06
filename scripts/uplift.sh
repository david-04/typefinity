#!/usr/bin/env bash

set -e
cd "`dirname "${BASH_SOURCE[0]}"`/.."

echo Updating dependencies...

NODE_VERSION=$(scripts/get-node-version.sh)

mkdir -p build
cat package.json
    | sed "s|\"@types/node\": \"[^\"]*\"|\"@types/node\": \"^$NODE_VERSION\"|" \
    > build.package.json.tmp
mv -f build.package.json.tmp package.json
cat package/package.json \
    | sed "s|\"@types/node\": \"[^\"]*\"|\"@types/node\": \"^$NODE_VERSION\"|" \
    > build.package.json.tmp
mv -f build.package.json.tmp package/package.json
yarn upgrade "*@latest" -i
scripts/update-version-information.sh
