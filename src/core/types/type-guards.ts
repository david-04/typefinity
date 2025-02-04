/**---------------------------------------------------------------------------------------------------------------------
 * Verify if the given value is falsy
 *
 * @param value The value to check
 * @returns True if the value is falsy
 *--------------------------------------------------------------------------------------------------------------------*/

export function isFalsy(value: unknown): value is undefined | null | 0 | false | "" {
    return !value;
}

/**---------------------------------------------------------------------------------------------------------------------
 * Verify if the given value is truthy
 *
 * @param value The value to check
 * @returns True if the value is truthy
 *--------------------------------------------------------------------------------------------------------------------*/

export function isTruthy<T>(value: T): value is Exclude<T, undefined | null | 0 | false | ""> {
    return !!value;
}
