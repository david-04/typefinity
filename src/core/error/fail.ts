import { DescriptiveError } from "./descriptive-error.js";

/**---------------------------------------------------------------------------------------------------------------------
 * Throw an error with a user-friendly error message that does not require a stack trace
 *
 * @param message The error message
 * @param cause The underlying error that triggered this crash
 * @throws DescriptiveError
 *--------------------------------------------------------------------------------------------------------------------*/

export function fail(message: string, cause?: unknown): never {
    throw new DescriptiveError(message, cause);
}
