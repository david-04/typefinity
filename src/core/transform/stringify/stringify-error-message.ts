import { DescriptiveError } from "../../error/descriptive-error.js";

const NORMALIZE_ERROR_REGEX = new RegExp(`^(Error|${DescriptiveError.name}):\\s`);

/**---------------------------------------------------------------------------------------------------------------------
 * Stringify an error into a message (without stack trace)
 *
 * @param error The error to stringify into a message
 * @return The normalized error message with leading "Error:" and "DescriptiveError:" removed
 *--------------------------------------------------------------------------------------------------------------------*/

export function stringifyErrorMessage(error: unknown) {
    return `${error}`.replace(NORMALIZE_ERROR_REGEX, "").replace(/^ERROR:\s*/i, "");
}
