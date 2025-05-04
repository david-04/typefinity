import * as assert from "assert";

/**---------------------------------------------------------------------------------------------------------------------
 * Execute a code block and catch errors for later inspection
 *--------------------------------------------------------------------------------------------------------------------*/

export function executeCodeBlock(action: unknown) {
    if ("function" !== typeof action) {
        assert.fail("The actual value is not a function");
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

export function assertNoPromiseAndNoFunction(method: string, ...values: ReadonlyArray<unknown>) {
    if (values.some(value => "function" === typeof value)) {
        assert.fail(`${method}() can't be used with functions`);
    } else if (values.some(value => value instanceof Promise)) {
        assert.fail(`${method}() can't be used with promises`);
    }
}

/**---------------------------------------------------------------------------------------------------------------------
 * Assert that the given error matches the expected one in regards to the class and message (the stack trace and any
 * other [custom] properties are excluded from the comparison)
 *--------------------------------------------------------------------------------------------------------------------*/

export function assertError(
    actual: unknown,
    mode: "equals" | "does-not-equal",
    expected: string | RegExp | Error
): void {
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

export function normalizeError(error: Error) {
    const result = [{ type: error.constructor, message: error.message }];
    for (let current: unknown = error; current; current = current instanceof Error ? current.cause : undefined) {
        if (current instanceof Error) {
            result.push({ type: current.constructor, message: current.message });
        }
    }
    return result;
}
