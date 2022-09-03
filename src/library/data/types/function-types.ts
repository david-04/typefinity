/** A function with "unknown" parameters returning the given type */
export type UnknownFunctionReturning<T> = (...params: unknown[]) => T;

/** A function with "unknown" parameters and an "unknown" return value */
export type UnknownFunction = UnknownFunctionReturning<unknown>;

/** A supplier that returns the given type */
export type Supplier<T> = () => T;
