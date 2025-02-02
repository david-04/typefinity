/**---------------------------------------------------------------------------------------------------------------------
 * Synonym for throw new Error(...)
 *
 * @param message The error message
 * @param cause The underlying error that triggered this crash
 *--------------------------------------------------------------------------------------------------------------------*/

export function crash(message: string, cause?: unknown): never {
    throw new Error(message, { cause });
}
