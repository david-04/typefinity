import { crash } from "../error/crash.js";

/**---------------------------------------------------------------------------------------------------------------------
 * Generate a random boolean
 *
 * @returns true or false
 *--------------------------------------------------------------------------------------------------------------------*/

export function randomBoolean() {
    return 0.5 <= Math.random();
}

/**---------------------------------------------------------------------------------------------------------------------
 * Generate a random falsy value
 *
 * @returns A random falsy value (undefined, null, false, 0 or "")
 *--------------------------------------------------------------------------------------------------------------------*/

export function randomFalsyValue() {
    return randomItem([undefined, null, false, 0, ""]);
}

/**---------------------------------------------------------------------------------------------------------------------
 * Select a random item from an array
 *
 * @param   array The array to select an item from
 * @returns A randomly selected item from the array
 *--------------------------------------------------------------------------------------------------------------------*/

export function randomItem<const T extends ReadonlyArray<unknown>>(array: T): T[number];

/**---------------------------------------------------------------------------------------------------------------------
 * Select a random item
 *
 * @param   item1 The first candidate to choose from
 * @param   item2 The second candidate to choose from
 * @param   rest The other candidates to choose from
 * @returns A randomly selected item from the provided parameters
 *--------------------------------------------------------------------------------------------------------------------*/

export function randomItem<const T>(item1: T, item2: T, ...rest: ReadonlyArray<T>): T;

export function randomItem(...items: ReadonlyArray<unknown>) {
    if (0 === items.length) {
        return crash("No items were passed to randomItem()");
    } else if (1 === items.length) {
        if (Array.isArray(items[0])) {
            return items[0][randomNumber(0, items[0].length - 1)];
        } else {
            return crash("A non-array was passed as the only parameter to randomItem()");
        }
    } else {
        return items[randomNumber(0, items.length - 1)];
    }
}

/**---------------------------------------------------------------------------------------------------------------------
 * Generate a random integer
 *
 * @returns A random integer
 *--------------------------------------------------------------------------------------------------------------------*/

export function randomNumber(): number;

/**---------------------------------------------------------------------------------------------------------------------
 * Generate a random integer between `min` and `max` (inclusive)
 *
 * @param   min The minimum value
 * @param   max The maximum value
 * @returns A random number between `min` and `max` (including the upper and lower bound)
 *--------------------------------------------------------------------------------------------------------------------*/

export function randomNumber(min: number, max: number): number;

/**---------------------------------------------------------------------------------------------------------------------
 * Generate a random number with the specified options
 *
 * @param   options The options
 * @returns A random number
 *--------------------------------------------------------------------------------------------------------------------*/

export function randomNumber(options: randomNumber.Options): number;

export function randomNumber(minOrOptions?: number | randomNumber.Options | undefined, max?: number): number {
    if (undefined === minOrOptions) {
        return randomNumber(RANDOM_NUMBER_DEFAULT_OPTIONS);
    } else if ("number" === typeof minOrOptions) {
        if ("number" === typeof max) {
            return randomNumber({ min: minOrOptions, max });
        } else {
            return crash("randomNumber() received received a maximum value and options (instead of a minimum value)");
        }
    } else {
        return generateRandomNumber(minOrOptions);
    }
}

function generateRandomNumber(options: randomNumber.Options) {
    let { min, max, decimalPlaces } = { ...RANDOM_NUMBER_DEFAULT_OPTIONS, ...options };
    [min, max] = [Math.min(min, max), Math.max(min, max)];
    const result = min + (max - min + 1) * Math.random();
    return 0 === decimalPlaces
        ? Math.floor(result)
        : Math.max(min, Math.min(max, Number(result.toFixed(decimalPlaces))));
}

/** @mergeModuleWith randomNumber */
export namespace randomNumber {
    /** Options for {@link randomNumber} */
    export type Options =
        | {
              /** The minimum value */
              readonly min: number;
              /** The maximum value */
              readonly max: number;
              /** The number of decimal places (defaults to zero/no decimal places) */
              readonly decimalPlaces?: number;
          }
        | {
              /** The number of decimal places */
              readonly decimalPlaces: number;
          };
}

const RANDOM_NUMBER_DEFAULT_OPTIONS = {
    decimalPlaces: 0,
    min: 10,
    max: 99,
} as const satisfies randomNumber.Options;

/**---------------------------------------------------------------------------------------------------------------------
 * Generate a random integer with a prefix
 *
 * @param   prefix The prefix to prepend
 * @returns A random integer with the `prefix` prepended
 *--------------------------------------------------------------------------------------------------------------------*/

export function randomNumberWithPrefix(prefix: string): string;

/**---------------------------------------------------------------------------------------------------------------------
 * Generate a random integer with a prefix
 *
 * @param   prefix The prefix to prepend
 * @param   min The minimum value
 * @param   max The maximum value
 * @returns A random integer between `min` and `max` (inclusive) with the `prefix` prepended
 *--------------------------------------------------------------------------------------------------------------------*/

export function randomNumberWithPrefix(prefix: string, min: number, max: number): string;

/**---------------------------------------------------------------------------------------------------------------------
 * Generate a random integer with the given parameters
 *
 * @param   options The parameters specifying how to generate the random number with prefix
 * @returns A random integer with the `prefix` prepended
 *--------------------------------------------------------------------------------------------------------------------*/

export function randomNumberWithPrefix(options: randomNumberWithPrefix.Options): string;

export function randomNumberWithPrefix(
    prefixOrOptions: string | randomNumberWithPrefix.Options,
    min?: number,
    max?: number
) {
    if ("string" === typeof prefixOrOptions) {
        return "number" === typeof min && "number" === typeof max
            ? `${prefixOrOptions}${randomNumber(min, max)}`
            : `${prefixOrOptions}${randomNumber()}`;
    } else {
        return `${prefixOrOptions?.prefix}${randomNumber(prefixOrOptions)}`;
    }
}

/** @mergeModuleWith randomNumberWithPrefix */
export namespace randomNumberWithPrefix {
    export type Options = { /** The prefix to prepend */ readonly prefix: string } & randomNumber.Options;
}

/**---------------------------------------------------------------------------------------------------------------------
 * Generate a random truthy value
 *
 * @returns A random truthy value (true, 10, "abc", /regexp/ or {key: "value"})
 *--------------------------------------------------------------------------------------------------------------------*/

export function randomTruthyValue() {
    return randomItem([true, 0.1, 10, "abc", " ", /regexp/, { key: "value" }, ["array"]]);
}
