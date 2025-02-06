import * as assert from "node:assert";

/**---------------------------------------------------------------------------------------------------------------------
 * Inspect a parameterless function (wrapper for node:assert - requires NodeJS)
 *
 * @type T The type of the parameterless function
 * @param fn The parameterless function
 * @return Assertions applicable to parameterless functions
 *--------------------------------------------------------------------------------------------------------------------*/

export function expect<T>(fn: () => T): expect.CallbackAssertions<() => T>;

/**---------------------------------------------------------------------------------------------------------------------
 * Inspect a promise (wrapper for node:assert - requires NodeJS)
 *
 * @type T The type of the promise
 * @param promise The promise to inspect
 * @return Assertions applicable to promises
 *--------------------------------------------------------------------------------------------------------------------*/

export function expect<T extends Promise<unknown>>(promise: T): expect.PromiseAssertions<T>;

/**---------------------------------------------------------------------------------------------------------------------
 * Inspect any values/object/function other than promises and parameterless functions (wrapper for node:assert -
 * requires NodeJS)
 *
 * @type T The type of the value
 * @param actual The actual value/object/function to inspect
 * @return Assertions applicable to the actual value
 *--------------------------------------------------------------------------------------------------------------------*/

export function expect<T>(actual: T): expect.GeneralAssertions<T>;

/**---------------------------------------------------------------------------------------------------------------------
 * Inspect a value/object/function (wrapper for node:assert - requires NodeJS)
 *
 * @type T The type of the actual value
 * @param actual The actual value/object/function to inspect
 * @return Assertions applicable to the actual value/object/function
 *--------------------------------------------------------------------------------------------------------------------*/

export function expect<T>(actual: T): unknown {
    return new Assertions(actual);
}

/** @mergeModuleWith expect */
export namespace expect {
    /**-----------------------------------------------------------------------------------------------------------------
     * Assertions
     *
     * @type T The type of the actual value to be inspected
     * @type N The type of the negated (".not") assertions
     *----------------------------------------------------------------------------------------------------------------*/

    export interface Assertions<T, N> {
        /**-------------------------------------------------------------------------------------------------------------
         * Negate the meaning of the assertion
         *------------------------------------------------------------------------------------------------------------*/

        not: N;

        /**-------------------------------------------------------------------------------------------------------------
         * Assert that the actual and expected values are not only equal but identical (i.e. the same instance)
         *
         * @param expected The expected value
         * @throws If the actual and expected values are not identical (even if they are equal)
         *------------------------------------------------------------------------------------------------------------*/

        toBe(expected: T): void;

        /**-------------------------------------------------------------------------------------------------------------
         * Assert that the actual value is falsy
         *
         * @throws If the actual value is truthy
         *------------------------------------------------------------------------------------------------------------*/

        toBeFalsy(): void;

        /**-------------------------------------------------------------------------------------------------------------
         * Assert that the actual value is of the specified type
         *
         * @type U The actual value's expected type
         *------------------------------------------------------------------------------------------------------------*/

        toBeOfType<U>(
            ...params: (<V>() => V extends T ? 1 : 2) extends <V>() => V extends U ? 1 : 2
                ? []
                : ["ERROR: The types are not the same"]
        ): void;

        /**-------------------------------------------------------------------------------------------------------------
         * Assert that the actual value is truthy
         *
         * @throws If the actual value is falsy
         *------------------------------------------------------------------------------------------------------------*/

        toBeTruthy(): void;

        /**-------------------------------------------------------------------------------------------------------------
         * Assert that the actual and expected values are equal (even if they are different instances)
         *
         * @param expected The expected value
         * @throws If the actual and expected values are not equal
         *------------------------------------------------------------------------------------------------------------*/

        toEqual(expected: Exclude<T, Promise<unknown> | Function>): void;

        /**-------------------------------------------------------------------------------------------------------------
         * Assert that the promise rejects (with the expected error, if given)
         *
         * @param expectedError The expected error or error message
         * @throws If the promise resolves or if it rejects with an error other than the expected one (if given)
         *------------------------------------------------------------------------------------------------------------*/

        toReject(expectedError?: Error | string | RegExp): Promise<void>;

        /**-------------------------------------------------------------------------------------------------------------
         * Assert that the promise resolves (to the expected value, if given)
         *
         * @param expected The expected resolved value
         * @throws If the promise rejects or if it resolves to a value other than the expected one (if given)
         *------------------------------------------------------------------------------------------------------------*/

        toResolve(expected?: Awaited<T>): Promise<void>;

        /**-------------------------------------------------------------------------------------------------------------
         * Assert that the code block throws an error matching the expected one (if given)
         *
         * @param expectedError The expected error or error message
         * @throws If the code block does not raise an error or if it raises an error other than the expected one (if
         * given)
         *------------------------------------------------------------------------------------------------------------*/

        toThrow(expectedError?: Error | string | RegExp): void;
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Negated assertions
     *
     * @type T The type of the actual value to be inspected
     *----------------------------------------------------------------------------------------------------------------*/

    export interface NotAssertions<T> {
        /**-------------------------------------------------------------------------------------------------------------
         * Assert that the actual and unexpected values are not identical (i.e. not the same instance)
         *
         * @param unexpected The unexpected value
         * @throws If the actual and expected values are identical
         *------------------------------------------------------------------------------------------------------------*/

        toBe(unexpected: T): void;

        /**-------------------------------------------------------------------------------------------------------------
         * Assert that the actual value is not falsy
         * @throws If the actual value is falsy
         *------------------------------------------------------------------------------------------------------------*/

        toBeFalsy(): void;

        /**-------------------------------------------------------------------------------------------------------------
         * Assert that the actual value is not of the specified type
         *
         * @type U The actual value's unexpected type
         *------------------------------------------------------------------------------------------------------------*/

        toBeOfType<U>(
            ...params: (<V>() => V extends T ? 1 : 2) extends <V>() => V extends U ? 1 : 2
                ? ["ERROR: The types are the same"]
                : []
        ): void;

        /**-------------------------------------------------------------------------------------------------------------
         * Assert that the actual value is not truthy
         *
         * @throws If the actual value is truthy
         *------------------------------------------------------------------------------------------------------------*/

        toBeTruthy(): void;

        /**-------------------------------------------------------------------------------------------------------------
         * Assert that the actual and unexpected values are not equal (i.e. don't have the same content)
         *
         * @param unexpected The unexpected value
         * @throws If the actual and expected values are equal (have the same content)
         *------------------------------------------------------------------------------------------------------------*/

        toEqual(unexpected: Exclude<T, Promise<unknown> | Function>): void;

        /**-------------------------------------------------------------------------------------------------------------
         * Assert that the promise does not reject
         *
         * @throws If the promise rejects
         *------------------------------------------------------------------------------------------------------------*/

        toReject(): Promise<void>;

        /**-------------------------------------------------------------------------------------------------------------
         * Assert that the actual function completes without throwing an error
         *
         * @throws If the code block throws an error
         *------------------------------------------------------------------------------------------------------------*/

        toThrow(): void;
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Assertions for callbacks/actions (type () => void)
     *
     * @type T The type of the actual value to be inspected
     *----------------------------------------------------------------------------------------------------------------*/

    export type CallbackAssertions<T extends () => void> = Pick<
        Assertions<T, Pick<NotAssertions<T>, "toBe" | "toBeOfType" | "toThrow">>,
        "not" | "toBe" | "toBeOfType" | "toThrow"
    >;

    /**-----------------------------------------------------------------------------------------------------------------
     * Assertions for promises
     *
     * @type T The type of the actual value to be inspected
     *----------------------------------------------------------------------------------------------------------------*/

    export type PromiseAssertions<T extends Promise<unknown>> = Pick<
        Assertions<T, Pick<NotAssertions<T>, "toBe" | "toBeOfType" | "toReject">>,
        "not" | "toBe" | "toBeOfType" | "toReject" | "toResolve"
    >;

    /**-----------------------------------------------------------------------------------------------------------------
     * Assertions for all types other than promises and callbacks/actions (type: () => void)
     *----------------------------------------------------------------------------------------------------------------*/

    export type GeneralAssertions<T> = Omit<
        Assertions<
            T,
            Omit<
                NotAssertions<T>,
                "toReject" | "toThrow" | (Exclude<T, Promise<unknown> | Function> extends never ? "toEqual" : "")
            >
        >,
        "toReject" | "toResolve" | "toThrow" | (Exclude<T, Promise<unknown> | Function> extends never ? "toEqual" : "")
    >;
}

/**---------------------------------------------------------------------------------------------------------------------
 * Assertions
 *--------------------------------------------------------------------------------------------------------------------*/

class Assertions<T> implements expect.Assertions<T, expect.NotAssertions<T>> {
    private _not?: expect.NotAssertions<T>;

    /**-----------------------------------------------------------------------------------------------------------------
     * Initialization
     *----------------------------------------------------------------------------------------------------------------*/

    public constructor(private readonly actual: T) {}

    /**-----------------------------------------------------------------------------------------------------------------
     * Get negated assertions
     *----------------------------------------------------------------------------------------------------------------*/

    get not() {
        return (this._not ??= new NotAssertions(this.actual));
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Assert that the actual and expected values are identical
     *----------------------------------------------------------------------------------------------------------------*/

    toBe(expected: T): void {
        assert.strictEqual(this.actual, expected);
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Assert that the actual value is falsy
     *----------------------------------------------------------------------------------------------------------------*/

    toBeFalsy(): void {
        if (this.actual) {
            throw new Error(`Expected a falsy value but received ${String(this.actual)}`);
        }
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Assert that the actual is of a specific type
     *----------------------------------------------------------------------------------------------------------------*/

    toBeOfType<U>(
        ..._params: (<V>() => V extends T ? 1 : 2) extends <V>() => V extends U ? 1 : 2
            ? []
            : ["ERROR: The types are not the same"]
    ) {}

    /**-----------------------------------------------------------------------------------------------------------------
     * Assert that the actual value is truthy
     *----------------------------------------------------------------------------------------------------------------*/

    toBeTruthy(): void {
        assert.ok(this.actual);
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Assert that the actual and expected values have the same content
     *----------------------------------------------------------------------------------------------------------------*/

    toEqual(expected: T): void {
        assertNoPromiseAndNoFunction("toEqual", this.actual, expected);
        assert.deepStrictEqual(this.actual, expected);
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Assert that the actual promise rejects
     *----------------------------------------------------------------------------------------------------------------*/

    async toReject(expectedErrorOrMessage?: Error | string | RegExp): Promise<void> {
        await assert.rejects(this.actual as Promise<T>);
        if (undefined !== expectedErrorOrMessage) {
            try {
                await this.actual;
            } catch (error) {
                assertError(error, "equals", expectedErrorOrMessage);
            }
        }
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Assert that the actual promise resolves
     *----------------------------------------------------------------------------------------------------------------*/

    async toResolve(expected?: Exclude<Awaited<T>, Function>): Promise<void> {
        await assert.doesNotReject(this.actual as Promise<T>);
        if (0 < arguments.length) {
            assertNoPromiseAndNoFunction("toResolve", await this.actual, expected);
            assert.deepStrictEqual(await this.actual, expected);
        }
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Assert that the actual function throws an error
     *----------------------------------------------------------------------------------------------------------------*/

    toThrow(expectedErrorOrMessage?: Error | string | RegExp): void {
        const result = executeCodeBlock(this.actual);
        if (result.success) {
            throw new Error("No error was thrown");
        }
        if (undefined !== expectedErrorOrMessage) {
            assertError(result.error, "equals", expectedErrorOrMessage);
        }
    }
}

/**---------------------------------------------------------------------------------------------------------------------
 * Negated assertions
 *--------------------------------------------------------------------------------------------------------------------*/

class NotAssertions<T> implements expect.NotAssertions<T> {
    /**-----------------------------------------------------------------------------------------------------------------
     * Initialization
     *----------------------------------------------------------------------------------------------------------------*/

    public constructor(private readonly actual: T) {}

    /**-----------------------------------------------------------------------------------------------------------------
     * Assert that the actual and unexpected values are not identical
     *----------------------------------------------------------------------------------------------------------------*/

    /* not */ toBe(unexpected: T): void {
        assert.notStrictEqual(this.actual, unexpected);
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Assert that the actual value is not falsy
     *----------------------------------------------------------------------------------------------------------------*/

    /* not */ toBeFalsy(): void {
        assert.ok(this.actual);
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Assert that the actual value is not of a specific type
     *----------------------------------------------------------------------------------------------------------------*/

    /* not */ toBeOfType<U>(
        ..._params: (<V>() => V extends T ? 1 : 2) extends <V>() => V extends U ? 1 : 2
            ? ["ERROR: The types are the same"]
            : []
    ) {}

    /**-----------------------------------------------------------------------------------------------------------------
     * Assert that the actual value is not truthy
     *----------------------------------------------------------------------------------------------------------------*/

    /* not */ toBeTruthy(): void {
        if (this.actual) {
            throw new Error(`Expected a non-truthy value but received ${String(this.actual)}`);
        }
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Assert that the actual and unexpected values don't have the same content
     *----------------------------------------------------------------------------------------------------------------*/

    /* not */ toEqual(unexpected: T): void {
        assertNoPromiseAndNoFunction("toEqual", this.actual, unexpected);
        assert.notDeepStrictEqual(this.actual, unexpected);
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Assert that the actual promise doesn't reject
     *----------------------------------------------------------------------------------------------------------------*/

    async /* not */ toReject(): Promise<void> {
        await assert.doesNotReject(this.actual as Promise<T>);
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Assert that the actual function does not throw an error
     *----------------------------------------------------------------------------------------------------------------*/

    /* not */ toThrow(): void {
        const actual = this.actual;
        if (!(actual instanceof Function)) {
            throw new Error(`The actual value is of type ${typeof actual} (expected a function)`);
        }
        assert.doesNotThrow(() => actual());
    }
}

/**---------------------------------------------------------------------------------------------------------------------
 * Execute a code block and catch errors for later inspection
 *--------------------------------------------------------------------------------------------------------------------*/

function executeCodeBlock(action: unknown) {
    if ("function" !== typeof action) {
        throw new Error("The actual value is not a function");
    }
    try {
        const result = action();
        return { success: true, result, replay: () => result } as const;
    } catch (error) {
        const replay = () => {
            throw error;
        };
        return { success: false, error, replay } as const;
    }
}

/**---------------------------------------------------------------------------------------------------------------------
 * Assert that the given values are neither promises nor functions
 *--------------------------------------------------------------------------------------------------------------------*/

function assertNoPromiseAndNoFunction(method: string, ...values: ReadonlyArray<unknown>) {
    if (containsFunction(...values)) {
        throw new Error(`${method}() can't be used with functions`);
    } else if (containsPromise(...values)) {
        throw new Error(`${method}() can't be used with promises`);
    }
}

/**---------------------------------------------------------------------------------------------------------------------
 * Check if the given values contain a function
 *--------------------------------------------------------------------------------------------------------------------*/

function containsFunction(...values: ReadonlyArray<unknown>) {
    for (const value of values) {
        if ("function" === typeof value) {
            return true;
        }
    }
    return false;
}

/**---------------------------------------------------------------------------------------------------------------------
 * Check if the given values contain a promise
 *--------------------------------------------------------------------------------------------------------------------*/

function containsPromise(...values: ReadonlyArray<unknown>) {
    for (const value of values) {
        if (value && "object" === typeof value && "then" in value && "function" === typeof value.then) {
            return true;
        }
    }
    return false;
}

/**---------------------------------------------------------------------------------------------------------------------
 * Assert that the given error matches the expected one in regards to the class and message (the stack trace and any
 * other [custom] properties are excluded from the comparison)
 *--------------------------------------------------------------------------------------------------------------------*/

function assertError(actual: unknown, mode: "equals" | "does-not-equal", expected: Error | string | RegExp): void {
    const message = actual instanceof Error ? actual.message : String(actual);
    if ("string" === typeof expected) {
        assert["equals" === mode ? "deepStrictEqual" : "notDeepStrictEqual"](message, expected);
    } else if (expected instanceof RegExp) {
        assert["equals" === mode ? "match" : "doesNotMatch"](message, expected);
    } else {
        expected satisfies Error;
        if (actual instanceof Error) {
            assert["equals" === mode ? "deepStrictEqual" : "notDeepStrictEqual"](
                normalizeError(actual),
                normalizeError(expected)
            );
        } else {
            assert["equals" === mode ? "deepStrictEqual" : "notDeepStrictEqual"](message, expected);
        }
    }
}

/**---------------------------------------------------------------------------------------------------------------------
 * Normalize an error by extracting only the class name and the message
 *--------------------------------------------------------------------------------------------------------------------*/

function normalizeError(error: Error) {
    const result = [{ type: error.constructor, message: error.message }];
    for (let current: unknown = error; current; current = current instanceof Error ? current.cause : undefined) {
        if (current instanceof Error) {
            result.push({ type: current.constructor, message: current.message });
        }
    }
    return result;
}
