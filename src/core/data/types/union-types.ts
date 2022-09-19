import { tft } from "./conditional-types";
import { Supplier } from "./function-types";

//----------------------------------------------------------------------------------------------------------------------
// Value or array
//----------------------------------------------------------------------------------------------------------------------

/** A scalar value or a read-only array thereof */
export type ValueOrArray<T> = ValueOrReadonlyArray<T>;

/** A scalar value or a read-only array thereof */
export type ValueOrReadonlyArray<T> = tft.IfHasArrays<T, never, T | readonly T[]>;

/** A scalar value or a writable array thereof */
export type ValueOrWritableArray<T> = tft.IfHasArrays<T, never, T | T[]>;

//----------------------------------------------------------------------------------------------------------------------
// Value or supplier
//----------------------------------------------------------------------------------------------------------------------

/** A scalar value or a supplier thereof */
export type ValueOrSupplier<T> = tft.IfHasFunctions<T, never, T | Supplier<T>>;

//----------------------------------------------------------------------------------------------------------------------
// Value, array, or supplier
//----------------------------------------------------------------------------------------------------------------------

/** A scalar value, a read-only array of values or suppliers, or a supplier of either */
export type ValueArrayOrSupplier<T> = ValueReadonlyArrayOrSupplier<T>;

/** A scalar value, a read-only array of values or suppliers, or a supplier of either */
export type ValueReadonlyArrayOrSupplier<T> = tft.IfHasArrays<
    T,
    // "T" contains arrays
    never,
    // "T" does not contain arrays
    tft.IfHasFunctions<
        T,
        // "T" contains functions
        never,
        // "T" does not contain functions
        T | ReadonlyArray<T | Supplier<T>> | Supplier<T | ReadonlyArray<T | Supplier<T>>>>
>;

/** A scalar value, a writable array of values or suppliers, or a supplier of either */
export type ValueWritableArrayOrSupplier<T> = tft.IfHasArrays<
    T,
    // "T" contains arrays
    never,
    // "T" does not contain arrays
    tft.IfHasFunctions<
        T,
        // "T" contains functions
        never,
        // "T" does not contain functions
        T | Array<T | Supplier<T>> | Supplier<T | ReadonlyArray<T | Supplier<T>>>>
>;
