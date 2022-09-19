import { COPYRIGHT_YEARS, VERSION_NUMBER } from "../../../core/resources/typefinity-metadata";

//----------------------------------------------------------------------------------------------------------------------
// Supported command line parameters
//----------------------------------------------------------------------------------------------------------------------

export const COMMANDS = {
    INIT: "init",
    UPLIFT: "uplift",
} as const;

//----------------------------------------------------------------------------------------------------------------------
// Show version information
//----------------------------------------------------------------------------------------------------------------------

export function showVersionInfo() {
    print(
        `typefinity ${VERSION_NUMBER}`,
        `Copyright (c) ${COPYRIGHT_YEARS} David Hofmann`,
        "License: MIT <https://opensource.org/licenses/MIT>",
    );
}

//----------------------------------------------------------------------------------------------------------------------
// Show help
//----------------------------------------------------------------------------------------------------------------------

export function showHelp() {
    print(
        "Initialize or customize a typefinity project.",
        "",
        "Usage: typefinity [command]",
        "",
        "Commands:",
        "",
        `  ${COMMANDS.INIT}      set up configuration and build scripts`,
        `  ${COMMANDS.UPLIFT}    perform post-migration steps after upgrading typefinity`,
        "",
        "Project page: https://github.com/david-04/typefinity/blob/main/README.md"
    );
}


//----------------------------------------------------------------------------------------------------------------------
// Show an error message
//----------------------------------------------------------------------------------------------------------------------

export function showError(message: string) {
    console.error(message);
    console.error("Try 'typefinity --help' for more information");
}

//----------------------------------------------------------------------------------------------------------------------
// Print messages
//----------------------------------------------------------------------------------------------------------------------

function print(...lines: string[]) {
    lines.forEach(line => console.log(line));
}
