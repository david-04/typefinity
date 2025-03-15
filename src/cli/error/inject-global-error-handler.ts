import { stringifyError } from "../../core/transform/stringify/stringify-error.js";

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
    for (const line of `${messagePrefix} ${stringifyError(error)}`.trim().split(/\r?\n/)) {
        //console.error(/^\s+at\s+/.exec(line) ? line : ansi.fgRed(line));
        console.error(line);
    }
    return process.exit(1);
}
