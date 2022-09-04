/**-----------------------------------------------------------------------------------------------------------------
 * Wrappers for operations that cause TypeScript or SonarQube warnings
 *----------------------------------------------------------------------------------------------------------------*/

export namespace unsafe {

    /** Alias for TypeScript's built-in "any" type */
    export type Any = any; // NOSONAR

    /** An array of any element type */
    export type AnyArray = Any[];

    /** Any readonly array of any element type */
    export type AnyReadonlyArray = ReadonlyArray<Any>;

    /** Any type of function whose return value conforms to "R" */
    export type AnyFunction<R = Any> = (...param: Any[]) => R;

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
