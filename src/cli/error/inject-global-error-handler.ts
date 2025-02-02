import { stringify } from "../api/import-cli.js";
import { ANSI_ESC_CODES } from "../print/ansi-escape-codes.js";

/**---------------------------------------------------------------------------------------------------------------------
 * Inject an error handler
 *--------------------------------------------------------------------------------------------------------------------*/

try {
    process.on("uncaughtException", error => printErrorAndExit(error));
    process.on("unhandledRejection", error => printErrorAndExit(error, "ERROR: Unhandled rejection:"));
} catch (_) {}

/**---------------------------------------------------------------------------------------------------------------------
 * Stringify an error via stringify.error(), print it via console.error() and exit the process with exit code 1.
 *
 * @param error The error to print
 * @param messagePrefix An optional message prefix
 *--------------------------------------------------------------------------------------------------------------------*/

function printErrorAndExit(error: unknown, messagePrefix = "ERROR:") {
    for (const line of `${messagePrefix} ${stringify.error(error)}`.trim().split(/\r?\n/)) {
        console.error(/^\s+at\s+/.exec(line) ? line : `${ANSI_ESC_CODES.fgRed}${line}${ANSI_ESC_CODES.reset}`);
    }
    return process.exit(1);
}
