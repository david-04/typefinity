/**---------------------------------------------------------------------------------------------------------------------
 * This is a cli interface
 *--------------------------------------------------------------------------------------------------------------------*/

export interface CliInterface {
    /** property description */
    property: string;
}

/**---------------------------------------------------------------------------------------------------------------------
 * This is a cli function. It does this and that.
 *
 * @return Returns some data
 *--------------------------------------------------------------------------------------------------------------------*/

export function cliFunction(
    /** data passed to the function */
    data: CliInterface
) {
    return JSON.stringify(data);
}
