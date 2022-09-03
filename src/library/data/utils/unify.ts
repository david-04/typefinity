import { unsafe } from "../../misc/utils/unsafe";
import { tft as tft$extraction } from "../types/extraction-types";
import { tft as tft$assertion } from "../types/assertion-types";
import { Supplier } from "../types/function-types";

export namespace tfi {

    /**-----------------------------------------------------------------------------------------------------------------
     * Unify union type values by unboxing boxed ones or vice versa
     *----------------------------------------------------------------------------------------------------------------*/

    export namespace Unify {

        export type UnifiedArray<T> = tft$assertion.IfNever<
            tft$extraction.ExtractReadonlyArrays<T>,
            tft$extraction.ExtractScalarsAndArrayElements<T>[],
            readonly tft$extraction.ExtractScalarsAndArrayElements<T>[]
        >;

        export type UnifiedReadonlyArray<T> = readonly tft$extraction.ExtractScalarsAndArrayElements<T>[];

        /**-------------------------------------------------------------------------------------------------------------
         * Wrap the given value into a resolved promise if it isn't a promise already
         *
         * @param   value A promise or a value to wrap into a promise
         * @return  The value wrapped into a promise or the value itself if it is a promise already
         *------------------------------------------------------------------------------------------------------------*/

        export function toPromise<T>(value: T): Promise<T extends Promise<infer R> ? R : T> {
            return value instanceof Promise ? value : unsafe.asAny(Promise.resolve(value));
        }

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
         * If a function is passed, call it an return its return value. Otherwise, return the the parameter as it is.
         *
         * @param   value A function or a non-function value
         * @param   The function's return value if a function is passed and the value itself otherwise
         *------------------------------------------------------------------------------------------------------------*/

        export function toSupplied<T>(value: T extends Function ? never : (T | Supplier<T>)): T {
            return "function" === typeof value ? unsafe.asAny(value)() : value;
        }
    }
}

/** Unify union type values by unboxing boxed ones and vice versa */
export const unify = tfi.Unify;
