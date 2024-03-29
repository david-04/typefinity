import { unsafe } from "../misc/utils/unsafe";

export namespace tfi {

    /**-----------------------------------------------------------------------------------------------------------------
     * Interceptors to wrap around functions
     *----------------------------------------------------------------------------------------------------------------*/

    export namespace AddInterceptor {

        /**-------------------------------------------------------------------------------------------------------------
         * Create a lazy loader that invokes the underlying function only once and caches its return value
         *
         * @param   fn The function to call
         * @return  A wrapper that invokes the underlying function only once and caches the result
         *------------------------------------------------------------------------------------------------------------*/

        export function cacheResult<T extends unsafe.AnyFunction>(fn: T): T;
        export function cacheResult<P extends unknown[], R>(fn: (...param: P) => R) {
            let cachedResult: { readonly value: R; } | undefined;
            return (...args: P): R => {
                const result = cachedResult ?? { value: fn(...args) };
                cachedResult = result;
                return result.value;
            };
        }

        //     export function ignoreErrorsAndReturn<T>(result: T) {
        //         return <P extends unknown[], R>(fn: (...args: P) => R) => {
        //             return (...args: P) => {
        //                 try {
        //                     return fn(...args);
        //                 } catch (error) {
        //                     return result;
        //                 }
        //             };
        //         };
        //     }
    }
}

/** Interceptors to wrap around functions */
export const addInterceptor = tfi.AddInterceptor;
