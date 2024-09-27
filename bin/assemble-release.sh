#!/usr/bin/env bash

# shellcheck disable=SC2317

set -e

[[ -f "bin/assemble-release.sh" ]] && cd "bin"

TYPEFINITY_VERSION="$(. ./get-version-number.sh)"

echo "Assembling the release..."

if [[ -d ../dist ]]; then
    rm -rf ../dist/*
else
    mkdir -p ../dist
fi

cp ../build/bundle/typefinity.d.ts ../build/bundle/typefinity.mjs ../dist/ ../dist/
sed -e "s/^\s*\"version\"\s*:.*/  \"version\": \"${TYPEFINITY_VERSION?}\",/g" ../resources/package.json >../dist/package.json

rm -rf ../docs/*/ index.html
cp -r ../build/typedoc/* ../docs/
