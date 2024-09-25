#!/usr/bin/env bash

# shellcheck disable=SC2164
[[ -f "bin/run-tests.sh" ]] && cd "bin"

echo "Running tests..."

if ! node --test --test-concurrency=true --enable-source-maps --test-reporter=spec --test-reporter-destination=../build/test-runner.spec --test-reporter=tap --test-reporter-destination=../build/test-runner.tap ../build/tsc; then
    echo
    cat ../build/test-runner.spec
    echo
    awk '/^# (pass|fail) [0-9]+$/ { if ($3) print $3 " test cases " $2 "ed" }' ../build/test-runner.tap
    # shellcheck disable=SC2317
    return 1 || exit 1
else
    awk '/^# (pass|fail) [0-9]+$/ { if ($3) print $3 " test cases " $2 "ed" }' ../build/test-runner.tap
fi
