/** Any function that returns "T" */
export type UnknownFunction<T = unknown> = (...params: unknown[]) => T;

/** Any (potentially asynchronous) function that returns "T" either directly or wrapped into a promise */
export type UnknownAsyncFunction<T = unknown> = (...params: unknown[]) => T | Promise<T>;

/** A parameterless function that returns "T" */
export type Supplier<T = unknown> = () => T;

/** A (potentially asynchronous) parameterless function that returns "T" or a a promise of "T" */
export type AsyncSupplier<T> = () => T | Promise<T>;

/** A parameterless function that might optionally return "T" */
export type Action<T = unknown> = () => T;

/** A (potentially asynchronous) parameterless function that might optionally return "T" or a promise of "T" */
export type AsyncAction<T = unknown> = () => T | Promise<T>;
