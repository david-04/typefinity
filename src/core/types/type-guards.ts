/**---------------------------------------------------------------------------------------------------------------------
 * Check if the given value is a boolean.
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
 * Check if the given value is a string
 *
 * @param value The value to check
 * @returns True if the value is a string
 *--------------------------------------------------------------------------------------------------------------------*/

export function isString(
    value: null | undefined | boolean | number | bigint | symbol | object | Function
): value is never;
export function isString<T extends string>(
    value: T | null | undefined | boolean | number | bigint | symbol | object | Function
): value is string extends T ? string : T;
export function isString(value: unknown): value is string;
export function isString(value: unknown) {
    return "string" === typeof value;
}
