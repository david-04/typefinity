/**---------------------------------------------------------------------------------------------------------------------
 * Generate a random boolean
 *
 * @returns true or false
 *--------------------------------------------------------------------------------------------------------------------*/

export function randomBoolean() {
    return 0.5 <= Math.random();
}

/**---------------------------------------------------------------------------------------------------------------------
 * Generate a random integer
 *
 * @param min The minimum value
 * @param max The maximum value
 * @returns A random integer between min and max (inclusive)
 *--------------------------------------------------------------------------------------------------------------------*/

export function randomNumber(min = 0, max = 999) {
    [min, max] = [Math.min(min, max), Math.max(min, max)];
    if (min === max) {
        return min;
    } else {
        return min + Math.floor((max - min + 1) * Math.random());
    }
}

/**---------------------------------------------------------------------------------------------------------------------
 * Generate a random integer with a prefix
 *
 * @param min The minimum value
 * @param max The maximum value
 * @returns A random integer between min and max (inclusive)
 *--------------------------------------------------------------------------------------------------------------------*/

export function randomNumberWithPrefix(prefix: string, min = 0, max = 999) {
    return `${prefix}${randomNumber(min, max)}`;
}

/**---------------------------------------------------------------------------------------------------------------------
 * Select a random item from an array
 *
 * @param array The array to select an item from
 * @returns A randomly selected item from the array
 *--------------------------------------------------------------------------------------------------------------------*/

export function randomItem<const T extends ReadonlyArray<unknown>>(array: T): T[number] {
    return array[randomNumber(0, array.length - 1)];
}
