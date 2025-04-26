/**---------------------------------------------------------------------------------------------------------------------
 * An error with a self-explaining readable message that does not require a stack trace
 *--------------------------------------------------------------------------------------------------------------------*/

export class DescriptiveError extends Error {
    //
    /**-----------------------------------------------------------------------------------------------------------------
     * Create a new DescriptiveError
     *
     * @param message The descriptive error message
     * @param cause An optional underlying error
     *----------------------------------------------------------------------------------------------------------------*/

    public constructor(message: string, cause?: unknown) {
        super(message, { cause });
    }
}
