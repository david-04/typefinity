#!/usr/bin/env bash

set -e
cd "`dirname "${BASH_SOURCE[0]}"`/.."

COPYRIGHT_FROM=$(grep -E "^## \[[0-9.]+\]" CHANGELOG.md | tail -1 | sed 's|.*[(]||;s|-.*||')
COPYRIGHT_UNITL=$(grep -E "^## \[[0-9.]+\]" CHANGELOG.md | head -1 | sed "s|.*[(]||;s|-.*||")

if [ "$COPYRIGHT_FROM" == "$COPYRIGHT_UNITL" ]
then
    echo "$COPYRIGHT_FROM"
else
    echo "$COPYRIGHT_FROM-$COPYRIGHT_UNITL"
fi
