/** A function with "unknown" parameters that returns the given type "T" */
export type UnknownFunctionReturning<T> = (...params: unknown[]) => T;

/** A function with "unknown" parameters and an "unknown" return type */
export type UnknownFunction = UnknownFunctionReturning<unknown>;

/** A supplier that returns a value of the given type "T" */
export type Supplier<T> = () => T;
