import { unsafe } from "../../misc/utils/unsafe";
import { tft as tft$filter } from "./filter-types";

export namespace tft {

    //------------------------------------------------------------------------------------------------------------------
    // Utilities
    //------------------------------------------------------------------------------------------------------------------

    /** Return "IF" if "T" is of type "never" and "ELSE" otherwise */
    export type IfNever<T, IF, ELSE> = [T] extends [never] ? IF : ELSE;

    //------------------------------------------------------------------------------------------------------------------
    // "any" and "unknown"
    //------------------------------------------------------------------------------------------------------------------

    /** Return "never" if "T" is of type "any" or "unknown". Otherwise, return "T" itself.  */
    export type AnyAndUnknownToNever<T> = unsafe.Any extends T ? never : T;

    /** Return "IF" if "T" is "any" or "unknown". Otherwise, return "ELSE". */
    export type IfIsAnyOrUnknown<T, IF, ELSE> = IfNever<AnyAndUnknownToNever<T>, IF, ELSE>;

    /** Return "IF" if "T" is neither "any" nor "unknown". Otherwise, return "ELSE". */
    export type IfIsNotAnyOrUnknown<T, IF, ELSE> = IfIsAnyOrUnknown<T, ELSE, IF>;

    /** Return "T" if "T" is "any" or "unknown". Otherwise, return "never". */
    export type AssertIsAnyOrUnknown<T> = AnyAndUnknownToNever<T>;

    /** Return "never" if "T" is "any" or "unknown". Otherwise, return "T" itself. */
    export type AssertNotAnyOrUnknown<T> = IfIsNotAnyOrUnknown<T, T, never>;

    //------------------------------------------------------------------------------------------------------------------
    // Arrays
    //------------------------------------------------------------------------------------------------------------------

    /** Return "never" if "T" contains arrays (or is "any" or "unknown"). Otherwise, return "T" itself. */
    export type ArrayToNever<T> = IfNever<tft$filter.ExtractArrays<T>, AssertNotAnyOrUnknown<T>, never>;

    /** Return "IF" if "T" contains arrays (or "any" or "unknown"). Otherwise, return "ELSE". */
    export type IfHasArrays<T, IF, ELSE> = IfNever<ArrayToNever<T>, IF, ELSE>;

    /** Return "IF" if "T" does not contain any arrays (and isn't "any" or "unknown"). Otherwise, return "ELSE" */
    export type IfHasNoArrays<T, IF, ELSE> = IfHasArrays<T, ELSE, IF>;

    /** Return "T" if it contains arrays (or is "any" or "unknown"). Otherwise, return "never". */
    export type AssertHasArrays<T> = IfHasArrays<T, T, never>;

    /** Return "T" if it does not contain any arrays (and isn't "any" or "unknown"). Otherwise, return "never". */
    export type AssertHasNoArrays<T> = IfHasNoArrays<T, T, never>;

    //------------------------------------------------------------------------------------------------------------------
    // Functions
    //------------------------------------------------------------------------------------------------------------------

    /** Return "never" if "T" contains functions (or is "any" or "unknown"). Otherwise, return "T" itself. */
    export type FunctionToNever<T> = IfNever<tft$filter.ExtractFunctions<T>, AssertNotAnyOrUnknown<T>, never>;

    /** Return "IF" if "T" contains functions (or "any" or "unknown"). Otherwise, return "ELSE". */
    export type IfHasFunctions<T, IF, ELSE> = IfNever<FunctionToNever<T>, IF, ELSE>;

    /** Return "IF" if "T" does not contain any functions (and isn't "any" or "unknown"). Otherwise, return "ELSE" */
    export type IfHasNoFunctions<T, IF, ELSE> = IfHasFunctions<T, ELSE, IF>;

    /** Return "T" if it contains functions (or is "any" or "unknown"). Otherwise, return "never". */
    export type AssertHasFunctions<T> = IfHasFunctions<T, T, never>;

    /** Return "T" if it does not contain any functions (and isn't "any" or "unknown"). Otherwise, return "never". */
    export type AssertHasNoFunctions<T> = IfHasNoFunctions<T, T, never>;

    //------------------------------------------------------------------------------------------------------------------
    // Promises
    //------------------------------------------------------------------------------------------------------------------

    /** Return "never" if "T" contains promises (or is "any" or "unknown"). Otherwise, return "T" itself. */
    export type PromiseToNever<T> = IfNever<tft$filter.ExtractPromises<T>, AssertNotAnyOrUnknown<T>, never>;

    /** Return "IF" if "T" contains promises (or "any" or "unknown"). Otherwise, return "ELSE". */
    export type IfHasPromises<T, IF, ELSE> = IfNever<PromiseToNever<T>, IF, ELSE>;

    /** Return "IF" if "T" does not promises any promises (and isn't "any" or "unknown"). Otherwise, return "ELSE" */
    export type IfHasNoPromises<T, IF, ELSE> = IfHasPromises<T, ELSE, IF>;

    /** Return "T" if it contains promises (or is "any" or "unknown"). Otherwise, return "never". */
    export type AssertHasPromises<T> = IfHasPromises<T, T, never>;

    /** Return "T" if it does not contain any promises (and isn't "any" or "unknown"). Otherwise, return "never". */
    export type AssertHasNoPromises<T> = IfHasNoPromises<T, T, never>;
}
