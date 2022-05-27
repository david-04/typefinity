export namespace tft {

    /**-----------------------------------------------------------------------------------------------------------------
     *  Subtraction result
     *----------------------------------------------------------------------------------------------------------------*/

    export interface SubtractResult {
        /** First value */
        x: number;
        /** Second value */
        y: number;
        /** Difference between x and y */
        difference: number;
    }
}

/**---------------------------------------------------------------------------------------------------------------------
 * Subtract two values.
 * @param x First value
 * @param y Second value
 * @returns The difference between x an y
 *--------------------------------------------------------------------------------------------------------------------*/

export function subtract(x: number, y: number): tft.SubtractResult {
    return { x, y, difference: x - y };
}
