#!/usr/bin/env bash

function __tf_validate_changelog_links() {
    unset -f __tf_validate_changelog_links

    if [[ -f "bin/validate-changelog-links.sh" ]]; then
        if ! cd bin; then
            echo "ERROR: Failed to cd to bin directory" >&2
            return 1
        fi
    fi

    local URL="^https://david-04.github.io/typefinity/"
    local EXIT_CODE=0
    local URL_PATHS
    local URL_PATH

    URL_PATHS="$(sed 's|[(]|\n|g;s|[)].*$||g' ../CHANGELOG.md | grep "${URL?}" | sed "s|${URL?}||" | sort | uniq)"

    for URL_PATH in ${URL_PATHS?}; do
        if [[ ! -f "../build/typedoc/${URL_PATH?}" ]]; then
            if [[ ${EXIT_CODE?} -eq 0 ]]; then
                echo ""
            fi
            echo "ERROR: CHANGELOG.md references non-existent path build/typedoc/${URL_PATH?}" >&2
            EXIT_CODE=1
        fi
    done
    if [[ ${EXIT_CODE?} -ne 0 ]]; then
        echo ""
        return ${EXIT_CODE?}
    fi
}

__tf_validate_changelog_links "$@"
