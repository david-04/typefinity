import { tft as tft$assert } from "./assertion-types";

export namespace tft {

    /** Extract all types from "T" that extend those in "S" (complement of TypeScript's built-in "Exclude" type) */
    export type Extract<T, S> = Exclude<T, Exclude<T, S>>;

    /** Extract all writable arrays from "T" (excluding read-only arrays) */
    export type ExtractWritableArrays<T> = Extract<T, unknown[]>;

    /** Extract all arrays from "T" (including read-only and writable) */
    export type ExtractArrays<T> = Extract<T, readonly unknown[]>;

    /** Extract all read-only arrays from "T" */
    export type ExtractReadonlyArrays<T> = Exclude<ExtractArrays<T>, ExtractWritableArrays<T>>;

    /** Extract all scalar/non-array types */
    export type ExtractScalars<T> = Exclude<T, ExtractArrays<T>>;

    /** Extract all array item types */
    export type ExtractArrayElements<T> = tft$assert.IfNever<
        ExtractArrays<T>,
        never,
        ExtractArrays<T> extends ReadonlyArray<infer R> ? R : never
    >;

    /** Extract all scalar types and the types of array elements */
    export type ExtractScalarsAndArrayElements<T> = tft$assert.IfNever<
        ExtractScalars<T>,
        ExtractArrayElements<T>,
        tft$assert.IfNever<ExtractArrayElements<T>, ExtractScalars<T>, ExtractArrayElements<T> | ExtractScalars<T>>
    >;
}
