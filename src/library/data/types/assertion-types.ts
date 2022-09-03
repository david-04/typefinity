import { unsafe } from "../../misc/utils/unsafe";

export namespace tft {

    /** Return IF_NEVER if T is of type "never". Otherwise, return ELSE. */
    export type IfNever<T, IF_NEVER, ELSE> = [T] extends [never] ? IF_NEVER : ELSE;

    /** Return "never" if T is of type "any" or "unknown". Otherwise, return T.  */
    export type AnyAndUnknownToNever<T> = unsafe.Any extends T ? never : T;

    /** Return "never" if T is an array (or "any" or "unknown"). Otherwise, return T. */
    export type ArrayToNever<T> = IfNever<unsafe.AnyArray extends T ? never : T, never, AnyAndUnknownToNever<T>>;

    /** Return "never" if T is a function (or "any" or "unknown"). Otherwise, return T. */
    export type FunctionToNever<T> = IfNever<unsafe.AnyFunction extends T ? never : T, never, AnyAndUnknownToNever<T>>;
}
