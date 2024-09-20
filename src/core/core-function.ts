/**---------------------------------------------------------------------------------------------------------------------
 * Error thrown when attempting to divide by zero
 *--------------------------------------------------------------------------------------------------------------------*/

export class DivisionByZeroError extends Error {
    public constructor(a: number) {
        super(`Can't divide ${a} by 0`);
    }
}

/**---------------------------------------------------------------------------------------------------------------------
 * Parameters for the sum function
 *--------------------------------------------------------------------------------------------------------------------*/

export interface Divide {
    /** The first number */
    a: number;
    /** The second number */
    b: number;
}

/**---------------------------------------------------------------------------------------------------------------------
 * Divide two numbers
 *
 * @param parameters The values to divide
 * @return a divided by b
 *--------------------------------------------------------------------------------------------------------------------*/

export function divide({ a, b }: Divide) {
    if (0 === b) {
        throw new DivisionByZeroError(a);
    }
    return a / b;
}
