#!/usr/bin/env bash

set -e
cd "`dirname "${BASH_SOURCE[0]}"`/.."

echo Updating version information...

TYPEFINITY_VERSION=$(scripts/get-typefinity-version.sh)
COPYRIGHT_YEARS=$(scripts/get-copyright-years.sh)
NODE_VERSION=$(scripts/get-node-version.sh)

mkdir -p build/temp
cat src/core/resources/typefinity-metadata.ts \
    | sed "s/.*TYPEFINITY_VERSION.*/export const TYPEFINITY_VERSION = \"$TYPEFINITY_VERSION\";/g" \
    | sed "s/.*COPYRIGHT_YEARS.*/export const COPYRIGHT_YEARS = \"$COPYRIGHT_YEARS\";/g" \
    | sed "s/.*NODE_VERSION.*/export const NODE_VERSION = \"$NODE_VERSION\";/g" \
    > build/temp/typefinity-metadata.ts
mv -f build/temp/typefinity-metadata.ts src/core/resources/typefinity-metadata.ts
cat LICENSE \
    | sed 's/.*David Hofmann.*/Copyright (c) $COPYRIGHT_YEARS David Hofmann/' \
    > build/temp/LICENSE
mv -f build/temp/LICENSE LICENSE
cat dist/package.json \
    | sed 's/"version": "[^"]*"/"version": "$TYPEFINITY_VERSION"/g' \
    > build/temp/package.json
mv -f build/temp/package.json dist/package.json
