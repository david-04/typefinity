export namespace tft {

    /**-----------------------------------------------------------------------------------------------------------------
     *  Result of adding two values
     *----------------------------------------------------------------------------------------------------------------*/

    export interface AddResult {
        /** First value */
        x: number;
        /** Second value */
        y: number;
        /** Sum of both values */
        sum: number;
    }
}

class AddResult implements tft.AddResult {
    public constructor(public readonly x: number, public readonly y: number, public readonly sum: number) {

    }
}

/**---------------------------------------------------------------------------------------------------------------------
 * Add two values
 * @param x first value
 * @param y second value
 * @returns Sum of x+y
 *--------------------------------------------------------------------------------------------------------------------*/

export function add(x: number, /** second value */ y: number): tft.AddResult {
    return new AddResult(x, y, x + y);
}
