import { tft } from "./assertion-types";
import { Supplier } from "./function-types";

/** A scalar value or an array */
export type ValueOrArray<T> = tft.IfNever<tft.ArrayToNever<T>, never, T | T[]>;

/** A scalar value or a readonly array */
export type ValueOrReadonlyArray<T> = tft.IfNever<tft.ArrayToNever<T>, never, T | ReadonlyArray<T>>;

/** A scalar value or a supplier thereof */
export type ValueOrSupplier<T> = tft.IfNever<tft.FunctionToNever<T>, never, T | Supplier<T>>;

/** A scalar value, an array or a supplier */
export type ValueArrayOrSupplier<T> = tft.IfNever<
    tft.ArrayToNever<tft.FunctionToNever<T>>,
    never,
    T | Array<T | Supplier<T>> | Supplier<T | Array<T | Supplier<T>>>
>;

/** A scalar value, a readonly array or a supplier */
export type ValueReadonlyArrayOrSupplier<T> = tft.IfNever<
    tft.ArrayToNever<tft.FunctionToNever<T>>,
    never,
    T | ReadonlyArray<T | Supplier<T>> | Supplier<T | ReadonlyArray<T | Supplier<T>>>
>;
