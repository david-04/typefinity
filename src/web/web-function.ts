/**---------------------------------------------------------------------------------------------------------------------
 * This is a web interface
 *--------------------------------------------------------------------------------------------------------------------*/

export interface WebInterface {
    /** property description */
    property: string;
}

/**---------------------------------------------------------------------------------------------------------------------
 * This is a web function. It does this and that.
 *
 * @param data The data passed to the function
 * @return Returns some more data
 *--------------------------------------------------------------------------------------------------------------------*/

export function webFunction(data: WebInterface) {
    return document.getElementById(data.property)?.innerHTML;
}
