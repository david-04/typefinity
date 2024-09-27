# tests 25
# suites 14
# pass 24
# fail 0
# cancelled 0
# skipped 1
# todo 0
# duration_ms 186.2533

/^# [a-z]+ [0-9]+$/ {
    counters[$2] = $3 + 0
}

END {
    output = ""
    output = append(output, getFailed())
    output = append(output, getPassed())
    output = append(output, getSkipped())
    print output
}

function getFailed(   result) {
    result = ""
    if (counters["fail"] && counters["cancelled"]) {
        result = append(result, "🟥 " (counters["fail"] + counters["cancelled"]) " failed/cancelled")
    } else if (counters["fail"]) {
        result = append(result, "🟥 " counters["fail"] " failed")
    } else if (counters["cancelled"]){
        result = append(result, "🟥 " counters["cancelled"] " cancelled")
    }
    return result
}

function getSkipped(    result) {
    result = ""
    if (counters["skipped"] && counters["todo"]) {
        result = append(result, "🟨 " (counters["skipped"] + counters["todo"]) " skipped/todo")
    } else if (counters["skipped"]) {
        result = append(result, "🟨 " counters["skipped"] " skipped")
    } else {
        result = append(result, "🟨 " counters["todo"] " todo")
    }
    return result
}

function getPassed(   result) {
    return counters["pass"] ? "🟩 " counters["pass"] " passed" : ""
}


function append(string1, string2) {
    if (string1 && string2) {
        return string1 " " string2
    } else if (string1) {
        return string1
    } else {
        return string2
    }

}
