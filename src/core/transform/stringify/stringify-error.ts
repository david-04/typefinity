import { DescriptiveError } from "../../error/descriptive-error.js";
import { stringifyErrorMessage } from "./stringify-error-message.js";

/**---------------------------------------------------------------------------------------------------------------------
 * Stringify an error. If it's a DescriptiveError, only the message will be returned. Otherwise, the error will be
 * rendered with nested causes and stack traces.
 *
 * @param error The error to stringify
 * @return A string representation of the error
 *--------------------------------------------------------------------------------------------------------------------*/

export function stringifyError(error: unknown): string {
    if (error instanceof DescriptiveError) {
        return stringifyErrorMessage(error);
    } else if (error instanceof Error) {
        const causedBy = error.cause ? `\ncaused by: ${stringifyError(error.cause)}` : "";
        return stringifyErrorMessage(`${error.stack ?? error}${causedBy}`);
    } else {
        return `${error}`.replace(/^ERROR:\s*/i, "");
    }
}
