import * as assert from "node:assert";
import { classifyTestData } from "../stringify/classify-test-data.js";
import { stringifyTestData } from "../stringify/stringify-test-data.js";
import { assertError, assertNoPromiseAndNoFunction } from "./expect-utils.js";

/**---------------------------------------------------------------------------------------------------------------------
 * Perform assertions on a function (inspecting the value it returns or the error that it throws)
 *
 * @type    T Type of the function
 * @param   fn The function to inspect
 * @return  Assertions applicable to the return value or errors raised by the function
 *--------------------------------------------------------------------------------------------------------------------*/

export function expect<T>(fn: () => T): expect.CallbackAssertions<() => T>;

/**---------------------------------------------------------------------------------------------------------------------
 * Perform assertions on a promise
 *
 * @type    T The type of the promise
 * @param   promise The promise to inspect
 * @returns Assertions applicable to promises
 *--------------------------------------------------------------------------------------------------------------------*/

export function expect<T>(promise: Promise<T>): expect.PromiseAssertions<Promise<Awaited<T>>>;

/**---------------------------------------------------------------------------------------------------------------------
 * Perform assertions on any value or object
 *
 * @type    T The type of the value or object
 * @param   value The value or object to inspect
 * @return  Assertions applicable to the given value (type)
 *--------------------------------------------------------------------------------------------------------------------*/

export function expect<T>(value: T): expect.GeneralAssertions<T>;

/**---------------------------------------------------------------------------------------------------------------------
 * Perform assertions on any value, object, function or promise
 *--------------------------------------------------------------------------------------------------------------------*/

export function expect<T>(actual: T): unknown {
    return new expect.Assertions(actual, new expect.NotAssertions(actual));
}

/**---------------------------------------------------------------------------------------------------------------------
 * @mergeModuleWith expect
 *--------------------------------------------------------------------------------------------------------------------*/

export namespace expect {
    //
    //------------------------------------------------------------------------------------------------------------------
    //
    //       ###     ######   ######  ######## ########  ########
    //      ## ##   ##    ## ##    ## ##       ##     ##    ##
    //     ##   ##  ##       ##       ##       ##     ##    ##
    //    ##     ##  ######   ######  ######   ########     ##
    //    #########       ##       ## ##       ##   ##      ##
    //    ##     ## ##    ## ##    ## ##       ##    ##     ##
    //    ##     ##  ######   ######  ######## ##     ##    ##
    //
    //------------------------------------------------------------------------------------------------------------------

    /**-----------------------------------------------------------------------------------------------------------------
     * Assertions
     *
     * @type T The type of the actual value to be inspected
     * @type N The type of the negated (".not") assertions
     *----------------------------------------------------------------------------------------------------------------*/

    export class Assertions<T, N> {
        //
        /**-------------------------------------------------------------------------------------------------------------
         * Initialization
         *
         * @param actual The actual value to be inspected
         * @param not The negate the meaning of the assertion
         *------------------------------------------------------------------------------------------------------------*/

        public constructor(
            private readonly actual: T,
            public readonly not: N
        ) {}

        /**-------------------------------------------------------------------------------------------------------------
         * Assert that the actual and expected values are identical (i.e. the same instance, not just equal)
         *
         * @param  expected The expected value
         * @throws If the actual and expected values are not identical (even if they are equal)
         *------------------------------------------------------------------------------------------------------------*/

        public toBe(expected: T): void {
            assert.strictEqual(this.actual, expected);
        }

        /**-------------------------------------------------------------------------------------------------------------
         * Assert that the actual value is falsy
         *
         * @throws If the actual value is truthy
         *------------------------------------------------------------------------------------------------------------*/

        public toBeFalsy(): void {
            if (this.actual) {
                assert.fail(`Expected a falsy value but received ${stringifyTestData(this.actual)}`);
            }
        }

        /**-------------------------------------------------------------------------------------------------------------
         * Assert that the actual value is an instance of the specified class
         *
         * @type   U A potential parent type of the actual value's class
         * @param  expected The expected class
         * @throws If the actual value is not an instance of the expected class
         *------------------------------------------------------------------------------------------------------------*/

        public toBeInstanceOf<U>(expected: new (...args: any[]) => T extends U ? U : T) {
            if (!this.actual || !(this.actual instanceof expected)) {
                const expectedClass = expected.constructor.name;
                const actual = classifyTestData(this.actual);
                assert.fail(`Expected an instance of ${expectedClass} but received ${actual}`);
            }
        }

        /**-------------------------------------------------------------------------------------------------------------
         * Assert that the actual value is of the specified type. This is a compile-time check:
         *
         * ```ts
         * expect(1 as number | string).toBeOfType<number|string>() // ok
         * expect(1 as number | string).toBeOfType<number>() // does not compile
         * ```
         *
         * @type  U The expected type
         * @param params Accepts no parameters when both types match
         *------------------------------------------------------------------------------------------------------------*/

        public toBeOfType<U>(
            ...params: (<V>() => V extends T ? 1 : 2) extends <V>() => V extends U ? 1 : 2
                ? []
                : ["ERROR: The types are not the same"]
        ) {
            void params;
        }

        /**-------------------------------------------------------------------------------------------------------------
         * Assert that the actual value is truthy
         *
         * @throws If the actual value is falsy
         *------------------------------------------------------------------------------------------------------------*/

        public toBeTruthy() {
            assert.ok(this.actual);
        }

        /**-------------------------------------------------------------------------------------------------------------
         * Assert that the actual and expected values are equal (even if they are different instances)
         *
         * @param  expected The expected value
         * @throws If the actual and expected values are not equal
         *------------------------------------------------------------------------------------------------------------*/

        public toEqual(expected: Exclude<T, Promise<unknown> | Function>) {
            assertNoPromiseAndNoFunction("toEqual", this.actual, expected);
            assert.deepStrictEqual(this.actual, expected);
        }

        /**-------------------------------------------------------------------------------------------------------------
         * Assert that actual string matches a regular expression
         *
         * @param  expected The expected regular expression
         * @throws If the actual string does not match the regular expression (or if the actual value is not a string)
         *------------------------------------------------------------------------------------------------------------*/

        public toMatch(expected: RegExp) {
            "string" === typeof this.actual
                ? assert.match(this.actual, expected)
                : assert.fail(`Expected a string but received ${classifyTestData(this.actual)}`);
        }

        /**-------------------------------------------------------------------------------------------------------------
         * Assert that the promise rejects (with the expected error, if given)
         *
         * @param  expected The expected error (or error message)
         * @throws If the promise resolves or if it rejects with an error other than the expected one (if given)
         *------------------------------------------------------------------------------------------------------------*/

        public async toReject(expected?: Error | string | RegExp) {
            await assert.rejects(this.actual as Promise<unknown>);
            if (undefined !== expected) {
                try {
                    await this.actual;
                } catch (error) {
                    assertError(error, "equals", expected);
                }
            }
        }

        /**-------------------------------------------------------------------------------------------------------------
         * Assert that the promise resolves (to the expected value, if given). Values are compared as `toEqual` (not
         * `toBe`). To verify if a specific instance is returned, pass the awaited promise to `expect` instead:
         *
         * ```ts
         * await expect(await myFn()).toBe(expectedInstance);
         * ```
         *
         * @param  expected The expected value to resolve to
         * @throws If the promise rejects or if it resolves to a value other than the expected one (if given)
         *------------------------------------------------------------------------------------------------------------*/

        public async toResolve() {
            if (this.actual instanceof Promise) {
                await assert.doesNotReject(this.actual);
            } else {
                assert.fail(`toResolve() can only be called for promises (received ${classifyTestData(this.actual)})`);
            }
        }

        /**-------------------------------------------------------------------------------------------------------------
         * Assert that the function throws an error matching the expected one (if given)
         *
         * @param  expected The expected error or error message
         * @throws If the function does not raise an error or if it raises an error other than the expected one (if
         * given)
         *------------------------------------------------------------------------------------------------------------*/

        public toThrow(expected?: string | RegExp | Error) {
            if ("function" !== typeof this.actual) {
                assert.fail(`toThrow() only works with promises (received: ${classifyTestData(this.actual)})`);
            }
            let caughtError = false;
            try {
                this.actual();
            } catch (error) {
                caughtError = true;
                if (undefined !== expected) {
                    assertError(error, "equals", expected);
                }
            }
            if (!caughtError) {
                assert.fail("No error was thrown");
            }
        }
    }

    //------------------------------------------------------------------------------------------------------------------
    //
    //    ##    ##  #######  ########
    //    ###   ## ##     ##    ##
    //    ####  ## ##     ##    ##
    //    ## ## ## ##     ##    ##
    //    ##  #### ##     ##    ##
    //    ##   ### ##     ##    ##
    //    ##    ##  #######     ##
    //
    //------------------------------------------------------------------------------------------------------------------

    /**-----------------------------------------------------------------------------------------------------------------
     * Negated assertions (i.e. assert that something is not true)
     *
     * @type T The type of the actual value to be inspected
     *----------------------------------------------------------------------------------------------------------------*/

    export class NotAssertions<T> {
        //
        /**-------------------------------------------------------------------------------------------------------------
         * Initialization
         *------------------------------------------------------------------------------------------------------------*/

        public constructor(private readonly actual: T) {}

        /**-------------------------------------------------------------------------------------------------------------
         * Assert that the actual and (un)expected values are not identical (i.e. not the same instance). They might
         * still be equal.
         *
         * @param  unexpected The unexpected value
         * @throws If the actual and unexpected values are identical
         *------------------------------------------------------------------------------------------------------------*/

        /* not */ toBe(unexpected: T): void {
            assert.notStrictEqual(this.actual, unexpected);
        }

        /**-------------------------------------------------------------------------------------------------------------
         * Assert that the actual value is not an instance of of the specified class
         *
         * @param  unexpected The class which the current value should not be an instance of
         * @throws If the actual value is an instance of the unexpected class
         *------------------------------------------------------------------------------------------------------------*/

        /* not */ toBeInstanceOf<U>(unexpected: new (...args: any[]) => T extends U ? U : T) {
            if ("object" !== typeof this.actual || !this.actual || this.actual instanceof unexpected) {
                const actual = classifyTestData(this.actual);
                const expected = unexpected.constructor.name;
                assert.fail(`Expected an instance of ${expected} but received ${actual}`);
            }
        }

        /**-------------------------------------------------------------------------------------------------------------
         * Assert that the actual value is not of the specified type. This is a compile-time check:
         *
         * ```
         * expect(1 as number | string).not.toBeOfType<number>() // ok
         * expect(1 as number | string).not.toBeOfType<number|string>() // does not compile
         * ```
         *
         * @type  U The actual value's unexpected type
         * @param params Accepts no parameters when both types are different
         *------------------------------------------------------------------------------------------------------------*/

        /* not */ toBeOfType<U>(
            ...params: (<V>() => V extends T ? 1 : 2) extends <V>() => V extends U ? 1 : 2
                ? ["ERROR: The types are the same"]
                : []
        ) {
            void params;
        }

        /**-------------------------------------------------------------------------------------------------------------
         * Assert that the actual and unexpected values are not equal (i.e. don't have the same content)
         *
         * @param  unexpected The unexpected value
         * @throws If the actual and expected values are equal (have the same content)
         *------------------------------------------------------------------------------------------------------------*/

        /* not */ toEqual(unexpected: Exclude<T, Promise<unknown> | Function>): void {
            assertNoPromiseAndNoFunction("toEqual", this.actual, unexpected);
            assert.notDeepStrictEqual(this.actual, unexpected);
        }

        /**-------------------------------------------------------------------------------------------------------------
         * Assert that the actual string does not match the given regular expression
         *
         * @param  unexpected The regular expression that should not match
         * @throws If the actual value matches the regular expression or if the actual value is not a string
         *------------------------------------------------------------------------------------------------------------*/

        /* not */ toMatch(unexpected: RegExp): void {
            "string" === typeof this.actual
                ? assert.doesNotMatch(this.actual, unexpected)
                : assert.fail(`Expected a string but received ${classifyTestData(this.actual)}`);
        }

        /**-------------------------------------------------------------------------------------------------------------
         * Assert that the function completes without throwing an error
         *
         * @throws If the function throws an error
         *------------------------------------------------------------------------------------------------------------*/

        /* not */ toThrow(): void {
            const { actual } = this;
            "function" === typeof actual
                ? assert.doesNotThrow(() => actual())
                : assert.fail(`toThrow() can only be called on functions (received: ${classifyTestData(actual)})`);
        }
    }

    //------------------------------------------------------------------------------------------------------------------
    //
    //    ######## ##    ## ########  ######## ########
    //       ##     ##  ##  ##     ## ##       ##     ##
    //       ##      ####   ##     ## ##       ##     ##
    //       ##       ##    ########  ######   ##     ##
    //       ##       ##    ##        ##       ##     ##
    //       ##       ##    ##        ##       ##     ##
    //       ##       ##    ##        ######## ########
    //
    //------------------------------------------------------------------------------------------------------------------

    /**-----------------------------------------------------------------------------------------------------------------
     * Assertions for parameterless functions
     *
     * @type T The type of the function to be inspected
     *----------------------------------------------------------------------------------------------------------------*/

    export type CallbackAssertions<T extends () => void> = Pick<
        Assertions<T, Pick<NotAssertions<T>, "toBe" | "toBeOfType" | "toThrow">>,
        "not" | "toBe" | "toBeOfType" | "toThrow"
    >;

    /**-----------------------------------------------------------------------------------------------------------------
     * Assertions for promises
     *
     * @type T The type of the promise to be inspected
     *----------------------------------------------------------------------------------------------------------------*/

    export type PromiseAssertions<T extends Promise<unknown>> = Pick<
        Assertions<T, Pick<NotAssertions<T>, "toBe" | "toBeOfType">>,
        "not" | "toBe" | "toBeOfType" | "toReject" | "toResolve"
    >;

    /**-----------------------------------------------------------------------------------------------------------------
     * Assertions for all types other than promises and callbacks/actions (type: () => void)
     *
     * @type T The type of the value to be inspected
     *----------------------------------------------------------------------------------------------------------------*/

    export type GeneralAssertions<T> = Omit<
        Assertions<
            T,
            Omit<NotAssertions<T>, "toThrow" | (Exclude<T, Promise<unknown> | Function> extends never ? "toEqual" : "")>
        >,
        "toResolve" | "toReject" | "toThrow" | (Exclude<T, Promise<unknown> | Function> extends never ? "toEqual" : "")
    >;
}
