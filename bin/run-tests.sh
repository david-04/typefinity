#!/usr/bin/env bash

# shellcheck disable=SC2164
[[ -f "bin/run-tests.sh" ]] && cd "bin"

echo "Running tests..."

if ! node --test --test-reporter=spec --test-reporter-destination=../build/test-runner.log --test-reporter=dot --test-reporter-destination=stdout ../build/tsc; then
    cat ../build/test-runner.log
    # shellcheck disable=SC2317
    return 1 || exit 1
fi
