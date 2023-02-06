#!/usr/bin/env bash

set -e
cd "`dirname "${BASH_SOURCE[0]}"`/.."

echo Compiling...
tsc -b resources/tsconfig/src/tsconfig.composite-projects.json
