#!/usr/bin/env bash

sed -i -E 's|/\*\*\s*-{10,}\s*$|/**|g;s|-{10,}\s*\*/$|*/|g' "$@"
