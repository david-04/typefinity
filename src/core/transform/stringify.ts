import { DescriptiveError } from "../error/descriptive-error.js";

/**---------------------------------------------------------------------------------------------------------------------
 * Stringify objects
 *--------------------------------------------------------------------------------------------------------------------*/

export namespace stringify {
    /**-----------------------------------------------------------------------------------------------------------------
     * Convert an error into a single message
     *
     * @param error The error to stringify into a message
     * @return The normalized error message with leading "Error:", "DescriptiveError:" removed
     *----------------------------------------------------------------------------------------------------------------*/

    export function errorMessage(error: unknown) {
        return normalizeErrorMessage(`${error}`);
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Stringify an error. If it's a DescriptiveError, only the message will be returned. Otherwise, the error will be
     * rendered with nested causes and stack traces.
     *
     * @param error The error to stringify
     * @return A string representation of the error
     *----------------------------------------------------------------------------------------------------------------*/

    export function error(error: unknown): string {
        if (error instanceof DescriptiveError) {
            return errorMessage(error);
        } else if (error instanceof Error) {
            const causedBy = error.cause ? `\ncaused by: ${stringify.error(error.cause)}` : "";
            return normalizeErrorMessage(`${error.stack ?? errorMessage(error)}${causedBy}`);
        } else {
            return `${error}`.replace(/^ERROR:\s*/i, "");
        }
    }
}

/**-----------------------------------------------------------------------------------------------------------------
 * Utility function to normalize an error message
 *----------------------------------------------------------------------------------------------------------------*/

export function normalizeErrorMessage(message: string) {
    return message.replace(new RegExp(`^(Error|${DescriptiveError.name}):\\s`), "").replace(/^ERROR:\s*/i, "");
}
