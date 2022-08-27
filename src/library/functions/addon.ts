export namespace tfi {

    /**-----------------------------------------------------------------------------------------------------------------
     * Wrappers for currying function
     *----------------------------------------------------------------------------------------------------------------*/

    export namespace Addon {

        /**-------------------------------------------------------------------------------------------------------------
         * Create a lazy loader that invokes the underlying function only once and caches its return value.
         *
         * @param   fn The function to call
         * @return  A wrapper that invokes the underlying function only once and caches the result
         *------------------------------------------------------------------------------------------------------------*/

        export function cacheResult<P extends unknown[], R>(fn: (...args: P) => R) {
            let cachedResult: { readonly value: R; } | undefined;
            return (...args: P) => {
                const result = cachedResult ?? { value: fn(...args) };
                cachedResult = result;
                return result.value;
            };
        }
    }
}

/** Wrappers for currying function */
export const addon = tfi.Addon;
