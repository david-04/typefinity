#!/usr/bin/env bash

set -e

[[ -f "bin/typedoc.sh" ]] && cd "bin"

echo Creating API documentation...

TYPEFINITY_VERSION=0.0.0 # $(scripts/get-typefinity-version.sh)

for TYPE in cli; do #

    ../node_modules/.bin/typedoc \
        --out "../docs/${TYPE?}" \
        --name "typefinity-${TYPE?} ${TYPEFINITY_VERSION?}" \
        --githubPages false \
        --gitRemote https://github.com/david-04/typefinity.git \
        --excludePrivate \
        --excludeProtected \
        --excludeExternals \
        --excludeInternal \
        --sort static-first \
        --sort alphabetical \
        --disableSources \
        --hideGenerator \
        --logLevel Warn \
        --treatWarningsAsErrors \
        --cleanOutputDir true \
        --plugin typedoc-plugin-extras \
        --tsconfig ../resources/tsconfig/tsconfig.typedoc.json \
        --favicon https://david-04.github.io/typefinity/favicon.svg \
        --githubPages false \
        --readme ../README.md \
        ../dist/${TYPE?}.d.ts

done
