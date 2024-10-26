BEGIN {
    DIVIDER = "------------------------------------------------------------------------------------------------------------------------";
    section = "";
    indent = 0;
    hasPrintedErrors = 0;
}

#-----------------------------------------------------------------------------------------------------------------------
# Collect error sections
#-----------------------------------------------------------------------------------------------------------------------

/^[ \t]*not ok/ {
    if (section) {
        print section;
        hasPrintedErrors = 1;
    }
    section = DIVIDER;
    indent = match($0, /[^ ]/);
}

/^[ \t]*#/ {
    if (section) {
        print section;
        hasPrintedErrors = 1;
    }
    section = "";
}

/^[ \t]*location: .*$/ {
    gsub(/\\\\?/, "/");
}

/^[ \t]*type: 'suite'[ \t]*$/ {
    section = ""; # suppress test suite failures
}

section && ! /^[ \t]*(---|duration_ms:.*|\.\.\.|[0-9]+\.\.\.?[0-9]+)[ \t]*$/{
    section = section "\n" substr($0, indent);
}

#-----------------------------------------------------------------------------------------------------------------------
# Collect counters
#-----------------------------------------------------------------------------------------------------------------------

/^# [a-z]+ [0-9]+$/ || /^# duration_ms [0-9]+(\.[0-9]*)*$/ {
    counters[$2] = $3 + 0;
}

#-----------------------------------------------------------------------------------------------------------------------
# Create summary
#-----------------------------------------------------------------------------------------------------------------------

END {
    output = "";
    exitCode = 0;
    if (!(counters["fail"] + counters["cancelled"] + counters["skipped"] + counters["todo"] + counters["pass"])) {
        output = "🟥 No test cases found";
        exitCode = 1;
    } else if (counters["fail"] + counters["cancelled"]) {
        output = append(output, getFailed());
        output = append(output, getSkipped());
        output = append(output, getPassed());
        exitCode = 1;
    } else if (counters["skipped"] + counters["todo"]) {
        output = append(output, getPassed());
        output = append(output, getSkipped());
    } else {
        duration = counters["duration_ms"] ? sprintf(" in %.1fs", counters["duration_ms"] * 0.001 + 0.05) : "";
        output = "✓ " counters["pass"] " test" (1 == counters["pass"] ? "" : "s")  " passed" duration;
    }
    if (hasPrintedErrors) {
        print DIVIDER;
    }
    print output;
    if (exitCode) {
        print "";
    }
    exit(exitCode);
}

function getFailed() {
    if (counters["fail"] && counters["cancelled"]) {
        return append(result, "🟥 " (counters["fail"] + counters["cancelled"]) " failed/cancelled");
    } else if (counters["fail"]) {
        return append(result, "🟥 " counters["fail"] " failed");
    } else if (counters["cancelled"]){
        return append(result, "🟥 " counters["cancelled"] " cancelled");
    }
    return "";
}

function getSkipped() {
    if (counters["skipped"] && counters["todo"]) {
        return append(result, "🟨 " (counters["skipped"] + counters["todo"]) " skipped/todo");
    } else if (counters["skipped"]) {
        return append(result, "🟨 " counters["skipped"] " skipped");
    } else {
        return append(result, "🟨 " counters["todo"] " todo");
    }
    return "";

}

function getPassed() {
    return counters["pass"] ? "🟩 " counters["pass"] " passed" : "";
}

function append(string1, string2) {
    if (string1 && string2) {
        return string1 " " string2;
    } else {
        return string1 ? string1 : string2;
    }
}

