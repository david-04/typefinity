export namespace tfu {
    /**
     * Check if the given string is empty.
     * @param string The string to check
     * @returns A boolean value indicating if string is empty
     */
    export function isEmpty(string: string) {
        return !!string.trim().length;
    }
}
