import { unsafe } from "../../misc/utils/unsafe";
import { tft as tft$condition } from "../types/conditional-types";
import { tft as tft$filter } from "../types/filter-types";
import { Supplier } from "../types/function-types";

export namespace tfi {

    /**-----------------------------------------------------------------------------------------------------------------
     * Convert union type values to a more narrow type
     *----------------------------------------------------------------------------------------------------------------*/

    export namespace Unify {

        /** An array with the union of all scalar types and array element types of "T" */
        export type UnifiedArray<T> = tft$condition.IfNever<
            tft$filter.ExtractReadonlyArrays<T>,
            Array<tft$filter.UnboxArrays<T>>,
            ReadonlyArray<tft$filter.UnboxArrays<T>>
        >;

        /** A read-only array with the union of all scalar and array element types of "T" */
        export type UnifiedReadonlyArray<T> = ReadonlyArray<tft$filter.UnboxArrays<T>>;

        /**-------------------------------------------------------------------------------------------------------------
         * Wrap the given value into an array if it isn't an array already
         *
         * @param   value An array or a value to wrap into an array
         * @return  The value wrapped into an array or the value itself if it is an array already
         *------------------------------------------------------------------------------------------------------------*/

        export function toArray<T>(value: T): UnifiedArray<T> {
            return unsafe.asAny(Array.isArray(value) ? value : [value]);
        }

        /**-------------------------------------------------------------------------------------------------------------
         * Wrap the given value into a read-only array if it isn't an array already
         *
         * @param   value An array or a value to wrap into an array
         * @return  The value wrapped into an array or the value itself if it is an array already
         *------------------------------------------------------------------------------------------------------------*/

        export function toReadonlyArray<T>(value: T): UnifiedReadonlyArray<T> {
            return toArray(value);
        }

        /**-------------------------------------------------------------------------------------------------------------
         * If a function is passed, call it and return its return value. Otherwise, return the parameter value as it is.
         *
         * @param   value A function or a non-function value
         * @return  The function's return value if a function is passed and the value itself otherwise
         *------------------------------------------------------------------------------------------------------------*/

        export function toSupplied<T>(value: T extends Function ? never : (T | Supplier<T>)): T {
            return "function" === typeof value ? unsafe.asAny(value)() : value;
        }

        /**-------------------------------------------------------------------------------------------------------------
         * Wrap the given value into a resolved promise if it isn't a promise already
         *
         * @param   value A promise or a value to wrap into a promise
         * @return  The value wrapped into a promise or the value itself if it is a promise already
         *------------------------------------------------------------------------------------------------------------*/

        export function toPromise<T>(value: T): Promise<T extends Promise<infer R> ? R : T> {
            return value instanceof Promise ? value : unsafe.asAny(Promise.resolve(value));
        }
    }
}

/** Convert union type values to a more narrow type */
export const unify = tfi.Unify;
