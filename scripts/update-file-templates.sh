#!/usr/bin/env bash

set -e
cd "`dirname "${BASH_SOURCE[0]}"`/.."

echo Updating file templates...

OUTPUT=src/core/resources/file-templates.ts

echo "export const FILE_TEMPLATES = {" > "$OUTPUT"

for file in ` find resources/templates -type f`
do
    echo "    \"$file\": \`" | sed 's|resources/templates/||g;' >> "$OUTPUT"
    sed -E "s/[\\\`]|\\$\{/\\\&/g" "$file" >> "$OUTPUT"
    echo '`.trim() + "\n",' >> "$OUTPUT"
done

echo "} as const;" >> "$OUTPUT"
