#!/usr/bin/env bash

# shellcheck disable=SC2164
[[ -f "bin/run-tests.sh" ]] && cd "bin"

echo "Running tests..."

mkdir -p ../build/test

if ! node --test \
    --test-concurrency=true \
    --enable-source-maps \
    --test-reporter=spec \
    --test-reporter-destination=../build/test/test-results.spec \
    --test-reporter=tap \
    --test-reporter-destination=../build/test/test-results.tap \
    ../build/tsc; then
    echo
    cat ../build/test/test-results.spec
    echo
    awk -f print-test-statistics.awk ../build/test/test-results.tap
    # shellcheck disable=SC2317
    return 1 || exit 1
else
    awk -f print-test-statistics.awk ../build/test/test-results.tap
fi
