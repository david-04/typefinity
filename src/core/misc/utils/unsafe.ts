/**-----------------------------------------------------------------------------------------------------------------
 * Wrappers for operations that cause TypeScript or SonarQube warnings
 *----------------------------------------------------------------------------------------------------------------*/

export namespace unsafe {

    /** Alias for TypeScript's built-in "any" type */
    export type Any = any; // NOSONAR

    /** An array of any element type */
    export type AnyArray = Any[];

    /** Any read-only array of any element type */
    export type AnyReadonlyArray = ReadonlyArray<Any>;

    /** Any function that returns "T" */
    export type AnyFunction<T = Any> = (...param: Any[]) => T;

    /** Any (potentially asynchronous) function that returns "T" either directly or wrapped in a promise */
    export type AnyAsyncFunction<T = Any> = (...param: Any[]) => T | Promise<T>;

    /**-------------------------------------------------------------------------------------------------------------
     * Cast any value to type "any"
     *
     * @param   value The value to cast
     * @return  The parameter value typed as "any"
     *------------------------------------------------------------------------------------------------------------*/

    export function asAny(value: unknown): Any {
        return value;
    }
}
