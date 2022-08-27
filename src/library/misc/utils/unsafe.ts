export namespace tfi {

    /**-----------------------------------------------------------------------------------------------------------------
     * Operations that cause TypeScript or SonarQube warnings
     *----------------------------------------------------------------------------------------------------------------*/

    export namespace Unsafe {

        /**-------------------------------------------------------------------------------------------------------------
         * Cast any value to type "any"
         *
         * @param   value The value to cast
         * @return  The parameter value typed as "any"
         *------------------------------------------------------------------------------------------------------------*/

        export function asAny(value: unknown): any { // NOSONAR
            return value;
        }
    }
}

/** Operations that cause TypeScript or SonarQube warnings */
export const unsafe = tfi.Unsafe;
