#!/usr/bin/env bash

set -e
cd "`dirname "${BASH_SOURCE[0]}"`/.."

echo Updating version information...

TYPEFINITY_VERSION=$(scripts/get-typefinity-version.sh)
COPYRIGHT_YEARS=$(scripts/get-copyright-years.sh)
NODE_VERSION=$(scripts/get-node-version.sh)
METADATA_TS=src/core/resources/typefinity-metadata.ts

sed -i "s/.*TYPEFINITY_VERSION.*/export const TYPEFINITY_VERSION = \"$TYPEFINITY_VERSION\";/g" $METADATA_TS
sed -i "s/.*COPYRIGHT_YEARS.*/export const COPYRIGHT_YEARS = \"$COPYRIGHT_YEARS\";/g" $METADATA_TS
sed -i "s/.*NODE_VERSION.*/export const NODE_VERSION = \"$NODE_VERSION\";/g" $METADATA_TS
sed -i 's/.*David Hofmann.*/Copyright (c) $COPYRIGHT_YEARS David Hofmann/' LICENSE
sed -i 's/"version": "[^"]*"/"version": "$TYPEFINITY_VERSION"/g' resources/package/package.json
