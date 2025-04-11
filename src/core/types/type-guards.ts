/**---------------------------------------------------------------------------------------------------------------------
 * Check if the given value is a boolean
 *
 * @param value The value to check
 * @returns True if the value is a boolean
 *--------------------------------------------------------------------------------------------------------------------*/

export function isBoolean(
    value: null | undefined | number | bigint | string | symbol | object | Function
): value is never;
export function isBoolean(
    value: true | null | undefined | number | bigint | string | symbol | object | Function
): value is true;
export function isBoolean(
    value: false | null | undefined | number | bigint | string | symbol | object | Function
): value is false;
export function isBoolean<T extends boolean>(
    value: T | null | undefined | number | bigint | string | symbol | object | Function
): value is boolean extends T ? boolean : T;
export function isBoolean(value: unknown): value is boolean;
export function isBoolean(value: unknown) {
    return "boolean" === typeof value;
}

/**---------------------------------------------------------------------------------------------------------------------
 * Check if the given value is falsy
 *
 * @param value The value to check
 * @returns True if the value is falsy
 *--------------------------------------------------------------------------------------------------------------------*/

export function isFalsy(value: unknown): value is undefined | null | 0 | bigint | false | "" {
    return !value;
}

/**---------------------------------------------------------------------------------------------------------------------
 * Check if the given value is not a boolean.
 *
 * @param value The value to check
 * @returns True if the value is not a boolean
 *--------------------------------------------------------------------------------------------------------------------*/

export function isNotBoolean<T>(
    value: T
): value is T extends boolean ? (unknown extends T ? T : never) : Exclude<T, boolean> {
    return !isBoolean(value);
}

/**---------------------------------------------------------------------------------------------------------------------
 * Check if the given value is not a number
 *
 * @param value The value to check
 * @returns True if the value is not a number
 *--------------------------------------------------------------------------------------------------------------------*/

export function isNotNumber<T>(
    value: T
): value is T extends number ? (unknown extends T ? T : never) : Exclude<T, number> {
    return !isNumber(value);
}

/**---------------------------------------------------------------------------------------------------------------------
 * Check if the given value is a number
 *
 * @param value The value to check
 * @returns True if the value is a number
 *--------------------------------------------------------------------------------------------------------------------*/

export function isNumber(
    value: null | undefined | boolean | bigint | string | symbol | object | Function
): value is never;
export function isNumber<T extends number>(
    value: T | null | undefined | boolean | bigint | string | symbol | object | Function
): value is number extends T ? number : T;
export function isNumber(value: unknown): value is number;
export function isNumber(value: unknown) {
    return "number" === typeof value;
}

/**---------------------------------------------------------------------------------------------------------------------
 * Check if the given value is truthy
 *
 * @param value The value to check
 * @returns True if the value is truthy
 *--------------------------------------------------------------------------------------------------------------------*/

export function isTruthy<T>(value: T): value is Exclude<T, undefined | null | 0 | false | ""> {
    return !!value;
}
