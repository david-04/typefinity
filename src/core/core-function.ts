/**---------------------------------------------------------------------------------------------------------------------
 * This is a core interface
 *--------------------------------------------------------------------------------------------------------------------*/

export interface CoreInterface {
    /** property description */
    property: string;
}

/**---------------------------------------------------------------------------------------------------------------------
 * This is a core function.
 *
 * It does this and that.
 *
 * @return Returns some more data
 *--------------------------------------------------------------------------------------------------------------------*/

export function coreFunction(
    /** data passed to the function */
    data: CoreInterface
) {
    return JSON.stringify(data);
}
