#!/usr/bin/env bash

# shellcheck disable=SC2317

set -e

[[ -f "bin/release.sh" ]] && cd "bin"

TYPEFINITY_VERSION="$(. ./get-version-number.sh)"

echo "Building release ${TYPEFINITY_VERSION?}..."

for TYPE in cli core web; do
    cp ../build/bundle/typefinity-${TYPE?}.d.ts ../dist/typefinity-${TYPE?}/
    cp ../build/bundle/typefinity-${TYPE?}.mjs ../dist/typefinity-${TYPE?}/
    cp ../README.md ../dist/typefinity-${TYPE?}/README.md
    sed -i -e "s/^\s*\"version\"\s*:.*/  \"version\": \"${TYPEFINITY_VERSION?}\",/g" ../dist/typefinity-${TYPE?}/package.json
done

rm -rf ../docs/core ../docs/cli ../docs/web index.html
cp -r ../build/typedoc/* ../docs/
