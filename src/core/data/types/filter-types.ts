import { unsafe } from "../../misc/utils/unsafe";

export namespace tft {

    //------------------------------------------------------------------------------------------------------------------
    // Low-level filter aliases
    //------------------------------------------------------------------------------------------------------------------

    /** Extract all types from "T" that extend those in "E" (opposite of TypeScript's built-in "Exclude") */
    export type Extract<T, E> = Remove<T, Remove<T, E>>;

    /** Remove everything from "T" that's included in "R" (alias for TypeScript's built-in "Exclude") */
    export type Remove<T, R> = Exclude<T, R>;

    /** Replace all types in "T" that match "F" with "U" */
    export type Replace<T, S, R> = Remove<T, S> | R;

    //------------------------------------------------------------------------------------------------------------------
    // Arrays
    //------------------------------------------------------------------------------------------------------------------

    /** Extract all arrays (including read-only and writable) with elements of type "E" */
    export type ExtractArrays<T, E = unknown> = Extract<T, readonly E[]>;

    /** Remove all arrays (including read-only and writable) with elements of type "E" */
    export type RemoveArrays<T, E = unknown> = Remove<T, readonly E[]>;

    /** Extract all writable arrays (excluding read-only arrays) with elements of type "E" */
    export type ExtractWritableArrays<T, E = unknown> = Extract<T, E[]>;

    /** Remove all writable arrays (excluding read-only arrays) with elements of type "E" */
    export type RemoveWritableArrays<T, E = unknown> = Remove<T, E[]>;

    /** Extract all read-only arrays (excluding writable) with elements of type "E" */
    export type ExtractReadonlyArrays<T, E = unknown> = Remove<ExtractArrays<T, E>, ExtractWritableArrays<T, E>>;

    /** Remove all read-only arrays (excluding writable) with elements of type "E" */
    export type RemoveReadonlyArrays<T, E = unknown> = Remove<T, ExtractReadonlyArrays<T, E>>;

    //------------------------------------------------------------------------------------------------------------------
    // Arrays (nesting)
    //------------------------------------------------------------------------------------------------------------------

    /** Extract all arrays (including read-only and writable) with elements of type "E" */
    export type ExtractArraysOfArrays<T, E = unknown> = ExtractArrays<T, readonly E[]>;

    /** Remove all arrays (including read-only and writable) with elements of type "E" */
    export type RemoveArraysOfArrays<T, E = unknown> = RemoveArrays<T, readonly E[]>;

    /** Extract all writable arrays (excluding read-only arrays) with elements of type "E" */
    export type ExtractWritableArraysOfArrays<T, E = unknown> = ExtractWritableArrays<T, readonly E[]>;

    /** Remove all writable arrays (excluding read-only arrays) with elements of type "E" */
    export type RemoveWritableArraysOfArrays<T, E = unknown> = RemoveWritableArrays<T, E[]>;

    /** Extract all read-only arrays (excluding writable) with elements of type "E" */
    export type ExtractReadonlyArraysOfArrays<T, E = unknown> = ExtractReadonlyArrays<T, readonly E[]>;

    /** Remove all read-only arrays (excluding writable) with elements of type "E" */
    export type RemoveReadonlyArraysOfArrays<T, E = unknown> = RemoveReadonlyArrays<T, readonly E[]>;

    //------------------------------------------------------------------------------------------------------------------
    // Arrays (unboxing)
    //------------------------------------------------------------------------------------------------------------------

    /** Extract the element types of all arrays (including read-only and writable) */
    export type ExtractArrayElements<T> = ExtractArrays<T> extends ReadonlyArray<infer R> ? R : never;

    /** Extract the element types of all writable arrays (excluding read-only arrays) */
    export type ExtractWritableArrayElements<T> = ExtractWritableArrays<T> extends ReadonlyArray<infer R> ? R : never;

    /** Extract the element types of all read-only arrays (excluding writable arrays) */
    export type ExtractReadonlyArrayElements<T> = ExtractReadonlyArrays<T> extends ReadonlyArray<infer R> ? R : never;

    /** Replace arrays with their element types (and preserve non-array types) */
    export type UnboxArrays<T> = Replace<T, ExtractArrays<T>, ExtractArrayElements<T>>;

    //------------------------------------------------------------------------------------------------------------------
    // Functions
    //------------------------------------------------------------------------------------------------------------------

    /** Extract all functions with a return type conforming to "R" */
    export type ExtractFunctions<T, R = unsafe.Any> = Extract<T, unsafe.AnyFunction<R>>;

    /** Remove all functions with a return type conforming to "R" */
    export type RemoveFunctions<T, R = unsafe.Any> = Extract<T, unsafe.AnyFunction<R>>;

    //------------------------------------------------------------------------------------------------------------------
    // Functions (nesting)
    //------------------------------------------------------------------------------------------------------------------

    /** Extract all functions that return another function whose return type is included in "R" */
    export type ExtractFunctionsReturningFunctions<T, R = unsafe.Any> = ExtractFunctions<T, unsafe.AnyFunction<R>>;

    /** Remove all functions that return another function whose return type is included in "R" */
    export type RemoveFunctionsReturningFunction<T, R = unsafe.Any> = RemoveFunctions<T, unsafe.AnyFunction<R>>;

    //------------------------------------------------------------------------------------------------------------------
    // Functions (unboxing)
    //------------------------------------------------------------------------------------------------------------------

    /** Extract the return types of all functions */
    export type ExtractReturnValues<T> = T extends unsafe.AnyFunction<infer R> ? R : never;

    /** Replace functions with their return values (and preserve non-function types) */
    export type UnboxReturnValues<T> = Replace<T, ExtractFunctions<T>, ExtractReturnValues<T>>;

    //------------------------------------------------------------------------------------------------------------------
    // Promises
    //------------------------------------------------------------------------------------------------------------------

    /** Extract all promises whose value conforms to "V" */
    export type ExtractPromises<T, V = unknown> = T extends Promise<V> ? T : never;

    /** Remove all promises whose value conforms to "V" */
    export type RemovePromises<T, V = unknown> = Remove<T, ExtractPromises<T, V>>;

    //------------------------------------------------------------------------------------------------------------------
    // Promises (nesting)
    //------------------------------------------------------------------------------------------------------------------

    /** Extract all promises of promises whose value conforms to "V" */
    export type ExtractPromisesOfPromises<T, V = unknown> = ExtractPromises<T, Promise<V>>;

    /** Remove all promises of promises whose value conforms to "V" */
    export type RemovePromisesOfPromises<T, V = unknown> = RemovePromises<T, Promise<V>>;

    //------------------------------------------------------------------------------------------------------------------
    // Promise (unboxing)
    //------------------------------------------------------------------------------------------------------------------

    /** Extract the types of all promises' values */
    export type ExtractPromiseValues<T> = T extends Promise<infer R> ? R : never;

    /** Replace promises with their value types (and preserve non-promise types) */
    export type UnboxPromises<T> = Replace<T, ExtractPromises<T>, ExtractPromiseValues<T>>;
}
