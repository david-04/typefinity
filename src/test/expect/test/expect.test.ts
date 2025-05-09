import * as assert from "node:assert";
import { describe } from "../../test-runner/describe.js";
import { it } from "../../test-runner/it.js";
import { expect } from "../expect.js";

/**---------------------------------------------------------------------------------------------------------------------
 * Test utilities
 *--------------------------------------------------------------------------------------------------------------------*/

class MyError extends Error {
    public constructor(message: string, cause?: unknown) {
        super(message, { cause });
    }
}

function throwing(error: unknown = new Error()) {
    return () => {
        throw error;
    };
}

function passes(fn: () => void): void;
function passes<T>(promise: Promise<unknown>): Promise<void>;
function passes(fnOrPromise: (() => void) | Promise<unknown>): void | Promise<void> {
    if (fnOrPromise instanceof Promise) {
        return assert.doesNotReject(fnOrPromise);
    } else {
        return assert.doesNotThrow(fnOrPromise);
    }
}

function fails(fn: () => void): void;
function fails<T>(promise: Promise<unknown>): Promise<void>;
function fails(fnOrPromise: (() => void) | Promise<unknown>): void | Promise<void> {
    if (fnOrPromise instanceof Promise) {
        return assert.rejects(fnOrPromise);
    } else {
        return assert.throws(fnOrPromise);
    }
}

const resolved = <T>(value: T) => Promise.resolve(value);
const rejected = <T>(error: Error = new Error()) => Promise.reject<T>(error);
const symbol = Symbol(1);
const object = { key: "value" };
const fn = () => true;
const promise = Promise.resolve(0);

//----------------------------------------------------------------------------------------------------------------------
//
//    ######## ##     ## ########  ########  ######  ########
//    ##        ##   ##  ##     ## ##       ##    ##    ##
//    ##         ## ##   ##     ## ##       ##          ##
//    ######      ###    ########  ######   ##          ##
//    ##         ## ##   ##        ##       ##          ##
//    ##        ##   ##  ##        ##       ##    ##    ##
//    ######## ##     ## ##        ########  ######     ##
//
//----------------------------------------------------------------------------------------------------------------------

describe("expect", () => {
    describe("toBe", () => {
        it("handles undefined", () => {
            passes(() => expect(undefined).toBe(undefined));
            fails(() => expect(null as null | undefined).toBe(undefined));
            fails(() => expect(false as boolean | undefined).toBe(undefined));
            fails(() => expect(0 as number | undefined).toBe(undefined));
            fails(() => expect(0n as bigint | undefined).toBe(undefined));
            fails(() => expect("" as string | undefined).toBe(undefined));
            fails(() => expect(symbol as symbol | undefined).toBe(undefined));
            fails(() => expect(fn as Function | undefined).toBe(undefined));
            fails(() => expect(object as object | undefined).toBe(undefined));
        });

        it("handles null", () => {
            fails(() => expect(undefined as undefined | null).toBe(null));
            passes(() => expect(null).toBe(null));
            fails(() => expect(false as boolean | null).toBe(null));
            fails(() => expect(0 as number | null).toBe(null));
            fails(() => expect(0n as bigint | null).toBe(null));
            fails(() => expect("" as string | null).toBe(null));
            fails(() => expect(symbol as symbol | null).toBe(null));
            fails(() => expect(fn as Function | null).toBe(null));
            fails(() => expect(object as object | null).toBe(null));
        });

        it("handles booleans", () => {
            fails(() => expect(undefined as undefined | boolean).toBe(true));
            fails(() => expect(null as null | boolean).toBe(true));
            passes(() => expect(true as boolean).toBe(true));
            fails(() => expect(false as boolean).toBe(true));
            fails(() => expect(0 as number | boolean).toBe(true));
            fails(() => expect(0n as bigint | boolean).toBe(true));
            fails(() => expect("" as string | boolean).toBe(true));
            fails(() => expect(symbol as symbol | boolean).toBe(true));
            fails(() => expect(fn as Function | boolean).toBe(true));
            fails(() => expect(object as object | boolean).toBe(true));
        });

        it("handles numbers", () => {
            fails(() => expect(undefined as undefined | number).toBe(0));
            fails(() => expect(null as null | number).toBe(0));
            fails(() => expect(false as boolean | number).toBe(0));
            passes(() => expect(0 as number).toBe(0));
            fails(() => expect(1 as number).toBe(0));
            fails(() => expect(0n as bigint | number).toBe(0));
            fails(() => expect("" as string | number).toBe(0));
            fails(() => expect(symbol as symbol | number).toBe(0));
            fails(() => expect(fn as Function | number).toBe(0));
            fails(() => expect(object as object | number).toBe(0));
        });

        it("handles strings", () => {
            fails(() => expect(undefined as undefined | string).toBe(""));
            fails(() => expect(null as null | string).toBe(""));
            fails(() => expect(false as boolean | string).toBe(""));
            fails(() => expect(0 as number | string).toBe("0"));
            fails(() => expect(0n as bigint | string).toBe("0"));
            fails(() => expect("" as string).toBe("0"));
            passes(() => expect("0" as string).toBe("0"));
            fails(() => expect(symbol as symbol | string).toBe("Symbol(1)"));
            fails(() => expect(fn as Function | string).toBe("() => {}"));
            fails(() => expect(object as object | string).toBe(`{ key: "value" }`));
        });

        it("handles symbols", () => {
            fails(() => expect(undefined as undefined | symbol).toBe(symbol));
            fails(() => expect(null as null | symbol).toBe(symbol));
            fails(() => expect(true as boolean | symbol).toBe(symbol));
            fails(() => expect(1 as number | symbol).toBe(symbol));
            fails(() => expect(1n as bigint | symbol).toBe(symbol));
            fails(() => expect("1" as string | symbol).toBe(symbol));
            passes(() => expect(symbol as symbol | symbol).toBe(symbol));
            fails(() => expect(Symbol(1) as symbol | symbol).toBe(Symbol(1)));
            fails(() => expect(fn as Function | symbol).toBe(symbol));
            fails(() => expect(object as object | symbol).toBe(symbol));
        });

        it("handles functions", () => {
            fails(() => expect(undefined as undefined | Function).toBe(fn));
            fails(() => expect(null as null | Function).toBe(fn));
            fails(() => expect(false as boolean | Function).toBe(fn));
            fails(() => expect(0 as number | Function).toBe(fn));
            fails(() => expect(0n as bigint | Function).toBe(fn));
            fails(() => expect("" as string | Function).toBe(fn));
            fails(() => expect(symbol as symbol | Function).toBe(fn));
            passes(() => expect(fn as Function | Function).toBe(fn));
            fails(() => expect((() => true) as Function | Function).toBe(() => true));
            fails(() => expect(object as object | Function).toBe(fn));
        });

        it("handles objects", () => {
            fails(() => expect(undefined as undefined | object).toBe(object));
            fails(() => expect(null as null | object).toBe(object));
            fails(() => expect(false as boolean | object).toBe(object));
            fails(() => expect(0 as number | object).toBe(object));
            fails(() => expect(0n as bigint | object).toBe(object));
            fails(() => expect("" as string | object).toBe(object));
            fails(() => expect(symbol as symbol | object).toBe(object));
            fails(() => expect(fn as Function | object).toBe(object));
            passes(() => expect(object as object | object).toBe(object));
            fails(() => expect({ key: "value" } as object | object).toBe({ key: "value" }));
        });

        it("is typed correctly", () => {
            // preserves the actual value's type, including unknown and any
            expect(expect(1 as number | string).toBe).toBeOfType<(expected: number | string) => void>();
            expect(expect(1 as unknown).toBe).toBeOfType<(expected: unknown) => void>();
            expect(expect(1 as any).toBe).toBeOfType<(expected: any) => void>();
            // preserves generic type parameters
            expect(expect(Promise.resolve(1 as number | string)).toBe).toBeOfType<
                (expected: Promise<number | string>) => void
            >();
            // preserves interface definitions of the original value
            expect(expect({ a: 1 } as const).toBe).toBeOfType<(expected: { readonly a: 1 }) => void>();
        });
    });

    describe("toBeFalsy", () => {
        it("handles all data types", () => {
            passes(() => expect(undefined).toBeFalsy());
            passes(() => expect(null).toBeFalsy());
            fails(() => expect(true).toBeFalsy());
            passes(() => expect(false).toBeFalsy());
            passes(() => expect(0).toBeFalsy());
            fails(() => expect(1).toBeFalsy());
            passes(() => expect(0n).toBeFalsy());
            fails(() => expect(1n).toBeFalsy());
            passes(() => expect("").toBeFalsy());
            fails(() => expect(" ").toBeFalsy());
            fails(() => expect("abc").toBeFalsy());
            fails(() => expect(Symbol()).toBeFalsy());
            fails(() => expect((() => 1) as (() => void) | boolean).toBeFalsy());
            fails(() => expect((a: number) => a + 1).toBeFalsy());
            fails(() => expect({}).toBeFalsy());
        });

        it("is typed correctly", () => {
            expect(expect(1 as unknown).toBeFalsy).toBeOfType<() => void>();
            expect(expect(1 as any).toBeFalsy).toBeOfType<() => void>();
            expect(expect(1 as number | Promise<void> | (() => {})).toBeFalsy).toBeOfType<() => void>();
            // @ts-expect-error: "toBeFalsy" is hidden for parameterless functions
            expect(() => {}).toBeFalsy;
            // @ts-expect-error: "toBeFalsy" is hidden for promises
            expect(promise).toBeFalsy;
        });
    });

    describe("toBeInstanceOf", () => {
        const asObject = (value: unknown) => value as object;

        it("handles non-object values", () => {
            fails(() => expect(asObject(undefined)).toBeInstanceOf(Object));
            fails(() => expect(asObject(null)).toBeInstanceOf(Object));
            fails(() => expect(asObject(true)).toBeInstanceOf(Object));
            fails(() => expect(asObject(false)).toBeInstanceOf(Object));
            fails(() => expect(asObject(0)).toBeInstanceOf(Object));
            fails(() => expect(asObject(0n)).toBeInstanceOf(Object));
            fails(() => expect(asObject("")).toBeInstanceOf(Object));
            fails(() => expect(asObject(symbol)).toBeInstanceOf(Object));
        });

        it("handles objects", () => {
            // class hierarchy
            passes(() => expect(new Error()).toBeInstanceOf(Error));
            passes(() => expect(new MyError("")).toBeInstanceOf(Error));
            fails(() => expect(new Error()).toBeInstanceOf(MyError));
            // generics
            passes(() => expect(new Set(["string"])).toBeInstanceOf(Set));
            // object literals
            passes(() => expect({}).toBeInstanceOf(Object));
            // arrays
            passes(() => expect([]).toBeInstanceOf(Array));
            // functions
            passes(() => expect(asObject(fn)).toBeInstanceOf(Function));
        });

        it("is typed correctly", () => {
            fails(() =>
                expect(new Error()).toBeInstanceOf(
                    // @ts-expect-error: Array is not a base class of Error
                    Array
                )
            );
            // "toBeInstanceOf" is not hidden for value types
            expect(0 as undefined | null | boolean | number | bigint | string).toBeInstanceOf;
            // @ts-expect-error: "toBeInstanceOf" is hidden for promises
            expect(promise).toBeInstanceOf;
            // @ts-expect-error: "toBeInstanceOf" is hidden for parameterless functions
            expect(() => {}).toBeInstanceOf;
            // "toBeInstanceOf" is not hidden for functions with parameters
            expect((a: number) => a + 1).toBeInstanceOf;
        });
    });

    describe("toBeOfType", () => {
        it("handles union types", () => {
            expect(1 as string | number).toBeOfType<string | number>();
            // @ts-expect-error: The expected type is too narrow
            expect(1 as string | number).toBeOfType<string>();
            // @ts-expect-error: The expected type is too wide
            expect(1 as string | number).toBeOfType<string | number | boolean>();
        });

        it("handles generic types", () => {
            expect(resolved(1 as string | number)).toBeOfType<Promise<string | number>>();
            // @ts-expect-error: The expected type is too narrow
            expect(resolved(1 as string | number)).toBeOfType<Promise<string>>();
            // @ts-expect-error: The expected type is too wide
            expect(resolved(1 as string | number)).toBeOfType<Promise<boolean | string | number>>();
        });

        it("handles functions", () => {
            expect(() => {}).toBeOfType<() => void>();
            expect((a: number) => a + 1).toBeOfType<(a: number) => number>();
            // @ts-expect-error: Too many parameters expected
            expect(() => {}).toBeOfType<(a: number) => void>();
            // @ts-expect-error: Too few parameters expected
            expect((a: number) => a + 1).toBeOfType<() => number>();
            // @ts-expect-error: The parameter type doesn't match
            expect((a: boolean) => !a).toBeOfType<(a: number) => boolean>();
            // @ts-expect-error: The parameter type is too narrow
            expect((a: boolean | number) => `${a}`).toBeOfType<(a: number) => string>();
            // @ts-expect-error: The parameter type is too wide
            expect((a: boolean | number) => `${a}`).toBeOfType<(a: boolean | number | string) => string>();
            // @ts-expect-error: The return value does not match
            expect(() => 1).toBeOfType<() => string>();
            // @ts-expect-error: The return value is too narrow
            expect(() => 1 as number | string).toBeOfType<() => number>();
            // @ts-expect-error: The return value is too wide
            expect(() => 1 as number | string).toBeOfType<() => boolean | number | string>();
        });
    });

    describe("toBeTruthy", () => {
        it("handles all data types", () => {
            fails(() => expect(undefined).toBeTruthy());
            fails(() => expect(null).toBeTruthy());
            passes(() => expect(true).toBeTruthy());
            fails(() => expect(false).toBeTruthy());
            fails(() => expect(0).toBeTruthy());
            passes(() => expect(1).toBeTruthy());
            fails(() => expect(0n).toBeTruthy());
            passes(() => expect(1n).toBeTruthy());
            fails(() => expect("").toBeTruthy());
            passes(() => expect(" ").toBeTruthy());
            passes(() => expect("abc").toBeTruthy());
            passes(() => expect(symbol).toBeTruthy());
            passes(() => expect((() => 1) as (() => void) | boolean).toBeTruthy());
            passes(() => expect((a: number) => a + 1).toBeTruthy());
            passes(() => expect({}).toBeTruthy());
        });

        it("is typed correctly", () => {
            expect(expect(1 as unknown).toBeTruthy).toBeOfType<() => void>();
            expect(expect(1 as any).toBeTruthy).toBeOfType<() => void>();
            expect(expect(1 as number | Promise<void> | (() => {})).toBeTruthy).toBeOfType<() => void>();
            // @ts-expect-error: "toBeFalsy" is hidden for parameterless functions
            expect(() => {}).toBeTruthy;
            // @ts-expect-error: "toBeFalsy" is hidden for promises
            expect(promise).toBeTruthy;
        });
    });

    describe("toEqual", () => {
        it("handles undefined", () => {
            passes(() => expect(undefined).toEqual(undefined));
            fails(() => expect(null as null | undefined).toEqual(undefined));
            fails(() => expect(false as boolean | undefined).toEqual(undefined));
            fails(() => expect(0 as number | undefined).toEqual(undefined));
            fails(() => expect(0n as bigint | undefined).toEqual(undefined));
            fails(() => expect("" as string | undefined).toEqual(undefined));
            fails(() => expect(symbol as symbol | undefined).toEqual(undefined));
            // functions can't be compared
            fails(() => expect(fn as Function | undefined).toEqual(undefined));
            fails(() => expect(object as object | undefined).toEqual(undefined));
        });

        it("handles null", () => {
            fails(() => expect(undefined as undefined | null).toEqual(null));
            passes(() => expect(null).toEqual(null));
            fails(() => expect(false as boolean | null).toEqual(null));
            fails(() => expect(0 as number | null).toEqual(null));
            fails(() => expect(0n as bigint | null).toEqual(null));
            fails(() => expect("" as string | null).toEqual(null));
            fails(() => expect(symbol as symbol | null).toEqual(null));
            // functions can't be compared
            fails(() => expect(fn as Function | null).toEqual(null));
            fails(() => expect(object as object | null).toEqual(null));
        });

        it("handles booleans", () => {
            fails(() => expect(undefined as undefined | boolean).toEqual(true));
            fails(() => expect(null as null | boolean).toEqual(true));
            passes(() => expect(true as boolean).toEqual(true));
            fails(() => expect(false as boolean).toEqual(true));
            fails(() => expect(0 as number | boolean).toEqual(true));
            fails(() => expect(0n as bigint | boolean).toEqual(true));
            fails(() => expect("" as string | boolean).toEqual(true));
            fails(() => expect(symbol as symbol | boolean).toEqual(true));
            // functions can't be compared
            fails(() => expect(fn as Function | boolean).toEqual(true));
            fails(() => expect(object as object | boolean).toEqual(true));
        });

        it("handles numbers", () => {
            fails(() => expect(undefined as undefined | number).toEqual(0));
            fails(() => expect(null as null | number).toEqual(0));
            fails(() => expect(false as boolean | number).toEqual(0));
            passes(() => expect(0 as number).toEqual(0));
            fails(() => expect(1 as number).toEqual(0));
            fails(() => expect(0n as bigint | number).toEqual(0));
            fails(() => expect("" as string | number).toEqual(0));
            fails(() => expect(symbol as symbol | number).toEqual(0));
            // functions can't be compared
            fails(() => expect(fn as Function | number).toEqual(0));
            fails(() => expect(object as object | number).toEqual(0));
        });

        it("handles strings", () => {
            fails(() => expect(undefined as undefined | string).toEqual(""));
            fails(() => expect(null as null | string).toEqual(""));
            fails(() => expect(false as boolean | string).toEqual(""));
            fails(() => expect(0 as number | string).toEqual("0"));
            fails(() => expect(0n as bigint | string).toEqual("0"));
            fails(() => expect("" as string).toEqual("0"));
            passes(() => expect("0" as string).toEqual("0"));
            fails(() => expect(symbol as symbol | string).toEqual("Symbol(1)"));
            // functions can't be compared
            fails(() => expect(fn as Function | string).toEqual("() => {}"));
            fails(() => expect(object as object | string).toEqual(`{ key: "value" }`));
        });

        it("handles symbols", () => {
            fails(() => expect(undefined as undefined | symbol).toEqual(symbol));
            fails(() => expect(null as null | symbol).toEqual(symbol));
            fails(() => expect(true as boolean | symbol).toEqual(symbol));
            fails(() => expect(1 as number | symbol).toEqual(symbol));
            fails(() => expect(1n as bigint | symbol).toEqual(symbol));
            fails(() => expect("1" as string | symbol).toEqual(symbol));
            passes(() => expect(symbol as symbol | symbol).toEqual(symbol));
            fails(() => expect(Symbol(1) as symbol | symbol).toEqual(Symbol(1)));
            // functions can't be compared
            fails(() => expect(fn as Function | symbol).toEqual(symbol));
            fails(() => expect(object as object | symbol).toEqual(symbol));
        });

        it("handles functions", () => {
            // functions can't be compared
            fails(() => expect(undefined as unknown).toEqual(fn));
            fails(() => expect(null as unknown).toEqual(fn));
            fails(() => expect(false as unknown).toEqual(fn));
            fails(() => expect(0 as unknown).toEqual(fn));
            fails(() => expect(0n as unknown).toEqual(fn));
            fails(() => expect("" as unknown).toEqual(fn));
            fails(() => expect(symbol as unknown).toEqual(fn));
            // functions can't be compared
            fails(() => expect(fn as unknown).toEqual(fn));
            fails(() => expect((() => true) as unknown).toEqual(() => true));
            fails(() => expect(object as unknown).toEqual(fn));
        });

        it("handles objects", () => {
            fails(() => expect(undefined as undefined | object).toEqual(object));
            fails(() => expect(null as null | object).toEqual(object));
            fails(() => expect(false as boolean | object).toEqual(object));
            fails(() => expect(0 as number | object).toEqual(object));
            fails(() => expect(0n as bigint | object).toEqual(object));
            fails(() => expect("" as string | object).toEqual(object));
            fails(() => expect(symbol as symbol | object).toEqual(object));
            // functions can't be compared
            fails(() => expect(fn as Function | object).toEqual(object));
            passes(() => expect(object as object | object).toEqual(object));
            passes(() => expect({ key: "value" } as object | object).toEqual({ key: "value" }));
        });

        it("is typed correctly", () => {
            // mirrors the type of the actual value
            expect(expect(1 as number | string).toEqual).toBeOfType<(expected: number | string) => void>();
            // mirrors generic parameters of the actual value
            expect(expect(new Set<string | number>()).toEqual).toBeOfType<(expected: Set<string | number>) => void>();
            // preserves interface definitions of the original value
            expect(expect({ a: 1 } as const).toEqual).toBeOfType<(expected: { readonly a: 1 }) => void>();
            // @ts-expect-error: is not applicable to promises
            expect(promise).toEqual;
            // @ts-expect-error: is not applicable to functions without parameters
            expect(() => {}).toEqual;
            // @ts-expect-error: is not applicable to functions with parameters
            expect((a: number) => a + 1).toEqual;
            // removes promises and functions from the actual value's type
            expect(
                expect(0 as boolean | number | Promise<string> | (() => {}) | ((a: number) => boolean)).toEqual
            ).toBeOfType<(expected: boolean | number) => void>();
        });
    });

    describe("toMatch", () => {
        it("handles all data types", () => {
            fails(() => expect(undefined).toMatch(/.*/));
            fails(() => expect(null).toMatch(/.*/));
            fails(() => expect(true).toMatch(/.*/));
            fails(() => expect(false).toMatch(/.*/));
            fails(() => expect(1).toMatch(/.*/));
            fails(() => expect(1n).toMatch(/.*/));
            fails(() => expect("this text").toMatch(/does not match/));
            passes(() => expect("some random text content").toMatch(/random.*content$/));
            fails(() => expect(symbol).toMatch(/.*/));
            fails(() => expect(fn as unknown).toMatch(/.*/));
            fails(() => expect(object).toMatch(/.*/));
        });

        it("is typed correctly", () => {
            // @ts-expect-error: "toMatch" is hidden for promises
            expect(promise).toMatch;
            // @ts-expect-error: "toMatch" is hidden for functions without parameters
            expect(() => {}).toMatch;
            // "toMatch" is not hidden for functions with parameters
            expect((a: number) => a + 1).toMatch;
        });
    });

    describe("toReject", () => {
        const asPromise = (value: unknown) => value as Promise<unknown>;

        describe("when invoked without parameters", () => {
            it("fails when the promise resolves", async () => {
                await fails(expect(resolved(0)).toReject());
            });

            it("passes when the promise rejects", async () => {
                await passes(expect(rejected()).toReject());
            });

            it("fails when passing a non-promise", async () => {
                await fails(expect(asPromise(undefined)).toReject());
                await fails(expect(asPromise(null)).toReject());
                await fails(expect(asPromise(true)).toReject());
                await fails(expect(asPromise(false)).toReject());
                await fails(expect(asPromise(0)).toReject());
                await fails(expect(asPromise(0n)).toReject());
                await fails(expect(asPromise("")).toReject());
                await fails(expect(asPromise(symbol)).toReject());
                await fails(expect(asPromise(fn)).toReject());
                await fails(expect(asPromise(object)).toReject());
            });
        });

        describe("when passing a string message", () => {
            it("fails when the promise resolves", async () => {
                await fails(expect(resolved(0)).toReject("oh no"));
            });

            it("passes when the error message matches", async () => {
                await passes(expect(rejected(new Error("oh no"))).toReject("oh no"));
            });

            it("fails when the error message does not match", async () => {
                await fails(expect(rejected(new Error("actual"))).toReject("expected"));
            });

            it("fails when passing a non-promise", async () => {
                await fails(expect(asPromise(undefined)).toReject(""));
                await fails(expect(asPromise(null)).toReject(""));
                await fails(expect(asPromise(true)).toReject(""));
                await fails(expect(asPromise(false)).toReject(""));
                await fails(expect(asPromise(0)).toReject(""));
                await fails(expect(asPromise(0n)).toReject(""));
                await fails(expect(asPromise("")).toReject(""));
                await fails(expect(asPromise(symbol)).toReject(""));
                await fails(expect(asPromise(fn)).toReject(""));
                await fails(expect(asPromise(object)).toReject(""));
            });
        });

        describe("when passing a regular expression", () => {
            it("fails when the promise resolves", async () => {
                await fails(expect(resolved(0)).toReject(/.*/));
            });

            it("passes when the error message matches", async () => {
                await passes(expect(rejected(new Error("oh no"))).toReject(/o/));
            });

            it("fails when the error message does not match", async () => {
                await fails(expect(rejected(new Error("oh no"))).toReject(/x/));
            });

            it("fails when passing a non-promise", async () => {
                await fails(expect(asPromise(undefined)).toReject(/.*/));
                await fails(expect(asPromise(null)).toReject(/.*/));
                await fails(expect(asPromise(true)).toReject(/.*/));
                await fails(expect(asPromise(false)).toReject(/.*/));
                await fails(expect(asPromise(0)).toReject(/.*/));
                await fails(expect(asPromise(0n)).toReject(/.*/));
                await fails(expect(asPromise("")).toReject(/.*/));
                await fails(expect(asPromise(symbol)).toReject(/.*/));
                await fails(expect(asPromise(fn)).toReject(/.*/));
                await fails(expect(asPromise(object)).toReject(/.*/));
            });
        });

        describe("when passing an error instance", () => {
            it("fails when the promise resolves", async () => {
                await fails(expect(resolved(0)).toReject(new Error()));
            });

            it("passes when error type and message match", async () => {
                await passes(expect(rejected(new MyError("oh no"))).toReject(new MyError("oh no")));
            });

            it("fails when the error type does not match", async () => {
                await fails(expect(rejected(new MyError("oh no"))).toReject(new Error("oh no")));
            });

            it("fails when the error message does not match", async () => {
                await fails(expect(rejected(new MyError("actual"))).toReject(new MyError("expected")));
            });

            it("fails when the cause's error message does not match", async () => {
                await fails(
                    expect(rejected(new MyError("outer", new Error("inner")))).toReject(
                        new MyError("outer", new Error("DIFFERENT"))
                    )
                );
            });

            it("fails when the cause's error type does not match", async () => {
                await fails(
                    expect(rejected(new MyError("outer", new Error("inner")))).toReject(
                        new MyError("outer", new MyError("inner"))
                    )
                );
            });

            it("fails when passing a non-promise", async () => {
                await fails(expect(asPromise(undefined)).toReject(new Error("failure")));
                await fails(expect(asPromise(null)).toReject(new Error("failure")));
                await fails(expect(asPromise(true)).toReject(new Error("failure")));
                await fails(expect(asPromise(false)).toReject(new Error("failure")));
                await fails(expect(asPromise(0)).toReject(new Error("failure")));
                await fails(expect(asPromise(0n)).toReject(new Error("failure")));
                await fails(expect(asPromise("")).toReject(new Error("failure")));
                await fails(expect(asPromise(symbol)).toReject(new Error("failure")));
                await fails(expect(asPromise(fn)).toReject(new Error("failure")));
                await fails(expect(asPromise(object)).toReject(new Error("failure")));
            });
        });

        it("is typed correctly", async () => {
            expect(expect(resolved(1 as number | Promise<boolean>)).toReject).toBeOfType<() => Promise<void>>();
            // @ts-expect-error: "toReject" is hidden for undefined
            expect(undefined).toReject;
            // @ts-expect-error: "toReject" is hidden for null
            expect(null).toReject;
            // @ts-expect-error: "toReject" is hidden for booleans
            expect(true).toReject;
            // @ts-expect-error: "toReject" is hidden for numbers
            expect(0).toReject;
            // @ts-expect-error: "toReject" is hidden for bigints
            expect(0n).toReject;
            // @ts-expect-error: "toReject" is hidden for strings
            expect("").toReject;
            // @ts-expect-error: "toReject" is hidden for symbols
            expect(symbol).toReject;
            // @ts-expect-error: "toReject" is hidden for parameterless functions
            expect(() => true).toReject;
            // @ts-expect-error: "toReject" is hidden for functions with parameters
            expect((a: number) => a + 1).toReject;
            // @ts-expect-error: "toReject" is hidden for objects
            expect(object).toReject;
        });
    });

    describe("toResolve", () => {
        const asPromise = (value: unknown) => value as Promise<unknown>;

        it("handles non-promise values", async () => {
            await fails(expect(asPromise(undefined)).toResolve());
            await fails(expect(asPromise(null)).toResolve());
            await fails(expect(asPromise(true)).toResolve());
            await fails(expect(asPromise(false)).toResolve());
            await fails(expect(asPromise(0)).toResolve());
            await fails(expect(asPromise(0n)).toResolve());
            await fails(expect(asPromise("")).toResolve());
            await fails(expect(asPromise(symbol)).toResolve());
            await fails(expect(asPromise(fn)).toResolve());
            await fails(expect(asPromise(object)).toResolve());
        });

        it("handles resolved promises", async () => {
            await passes(expect(resolved(undefined)).toResolve());
            await passes(expect(resolved(null)).toResolve());
            await passes(expect(resolved(true)).toResolve());
            await passes(expect(resolved(false)).toResolve());
            await passes(expect(resolved(0)).toResolve());
            await passes(expect(resolved(0n)).toResolve());
            await passes(expect(resolved("")).toResolve());
            await passes(expect(resolved(symbol)).toResolve());
            await passes(expect(resolved(fn)).toResolve());
            await passes(expect(resolved(object)).toResolve());
        });

        it("handles rejected promises", async () => {
            await fails(expect(rejected()).toResolve());
            await fails(expect(rejected(new Error("failure"))).toResolve());
        });

        it("is typed correctly", () => {
            expect(expect(resolved(1 as number | Promise<boolean>)).toResolve).toBeOfType<() => Promise<void>>();
            // @ts-expect-error: "toResolve" is hidden for undefined
            expect(undefined).toResolve;
            // @ts-expect-error: "toResolve" is hidden for null
            expect(null).toResolve;
            // @ts-expect-error: "toResolve" is hidden for booleans
            expect(true).toResolve;
            // @ts-expect-error: "toResolve" is hidden for numbers
            expect(0).toResolve;
            // @ts-expect-error: "toResolve" is hidden for bigints
            expect(0n).toResolve;
            // @ts-expect-error: "toResolve" is hidden for strings
            expect("").toResolve;
            // @ts-expect-error: "toResolve" is hidden for symbols
            expect(symbol).toResolve;
            // @ts-expect-error: "toResolve" is hidden for parameterless functions
            expect(() => true).toResolve;
            // @ts-expect-error: "toResolve" is hidden for functions with parameters
            expect((a: number) => a + 1).toResolve;
            // @ts-expect-error: "toResolve" is hidden for objects
            expect(object).toResolve;
        });
    });

    describe("toThrow", () => {
        const asFunction = (value: unknown) => value as () => void;

        describe("when not passing any parameters", () => {
            it("passes when the function throws an error", () => {
                passes(() => expect(throwing()).toThrow());
            });

            it("fails when the function returns without throwing an error", () => {
                fails(() => expect(() => {}).toThrow());
            });

            it("fails when the actual value is not a function", () => {
                fails(() => expect(asFunction(undefined)).toThrow());
                fails(() => expect(asFunction(null)).toThrow());
                fails(() => expect(asFunction(true)).toThrow());
                fails(() => expect(asFunction(false)).toThrow());
                fails(() => expect(asFunction(0)).toThrow());
                fails(() => expect(asFunction(0n)).toThrow());
                fails(() => expect(asFunction("")).toThrow());
                fails(() => expect(asFunction(symbol)).toThrow());
                fails(() => expect(asFunction(object)).toThrow());
            });
        });

        describe("when passing a string", () => {
            it("passes when the function throws an error with the expected message", () => {
                passes(() => expect(throwing(new Error("message"))).toThrow("message"));
                passes(() => expect(throwing("message")).toThrow("message"));
            });

            it("fails when the function throws an error with a non-matching message", () => {
                fails(() => expect(throwing(new Error("actual message"))).toThrow("expected message"));
                fails(() => expect(throwing("actual message")).toThrow("expected message"));
            });

            it("fails when the function returns without throwing an error", () => {
                fails(() => expect(() => {}).toThrow(""));
            });

            it("fails when the actual value is not a function", () => {
                fails(() => expect(asFunction(undefined)).toThrow(""));
                fails(() => expect(asFunction(null)).toThrow(""));
                fails(() => expect(asFunction(true)).toThrow(""));
                fails(() => expect(asFunction(false)).toThrow(""));
                fails(() => expect(asFunction(0)).toThrow(""));
                fails(() => expect(asFunction(0n)).toThrow(""));
                fails(() => expect(asFunction("")).toThrow(""));
                fails(() => expect(asFunction(symbol)).toThrow(""));
                fails(() => expect(asFunction(object)).toThrow(""));
            });
        });

        describe("when passing a regular expression", () => {
            it("passes when the function throws an error with the expected message", () => {
                passes(() => expect(throwing(new Error("message"))).toThrow(/sage/));
                passes(() => expect(throwing("message")).toThrow(/sage/));
            });

            it("fails when the function throws an error with a non-matching message", () => {
                fails(() => expect(throwing(new Error("actual message"))).toThrow(/expected/));
                fails(() => expect(throwing("actual message")).toThrow(/expected/));
            });

            it("fails when the function returns without throwing an error", () => {
                fails(() => expect(() => {}).toThrow(/.*/));
            });

            it("fails when the actual value is not a function", () => {
                fails(() => expect(asFunction(undefined)).toThrow(/.*/));
                fails(() => expect(asFunction(null)).toThrow(/.*/));
                fails(() => expect(asFunction(true)).toThrow(/.*/));
                fails(() => expect(asFunction(false)).toThrow(/.*/));
                fails(() => expect(asFunction(0)).toThrow(/.*/));
                fails(() => expect(asFunction(0n)).toThrow(/.*/));
                fails(() => expect(asFunction("")).toThrow(/.*/));
                fails(() => expect(asFunction(symbol)).toThrow(/.*/));
                fails(() => expect(asFunction(object)).toThrow(/.*/));
            });
        });

        describe("when passing an error instance", () => {
            it("passes when the function throws an error with the same type and message", () => {
                passes(() =>
                    expect(throwing(new MyError("outer", new Error("inner")))).toThrow(
                        new MyError("outer", new Error("inner"))
                    )
                );
            });

            it("fails when the error type does not match", () => {
                fails(() =>
                    expect(throwing(new MyError("outer", new Error("inner")))).toThrow(
                        new Error("outer", { cause: new Error("inner") })
                    )
                );
            });

            it("fails when the error message does not match", () => {
                fails(() =>
                    expect(throwing(new MyError("actual", new Error("inner")))).toThrow(
                        new MyError("expected", new Error("inner"))
                    )
                );
            });

            it("fails when the cause's type does not match", () => {
                fails(() =>
                    expect(throwing(new MyError("outer", new Error("inner")))).toThrow(
                        new MyError("outer", new MyError("inner"))
                    )
                );
            });

            it("fails when the cause's message does not match", () => {
                fails(() =>
                    expect(throwing(new MyError("outer", new Error("actual")))).toThrow(
                        new MyError("outer", new Error("expected"))
                    )
                );
            });
            it("fails when the function returns without throwing an error", () => {
                fails(() => expect(() => {}).toThrow(new Error("")));
            });

            it("fails when the actual value is not a function", () => {
                fails(() => expect(asFunction(undefined)).toThrow(new Error("")));
                fails(() => expect(asFunction(null)).toThrow(new Error("")));
                fails(() => expect(asFunction(true)).toThrow(new Error("")));
                fails(() => expect(asFunction(false)).toThrow(new Error("")));
                fails(() => expect(asFunction(0)).toThrow(new Error("")));
                fails(() => expect(asFunction(0n)).toThrow(new Error("")));
                fails(() => expect(asFunction("")).toThrow(new Error("")));
                fails(() => expect(asFunction(symbol)).toThrow(new Error("")));
            });
        });

        it("is typed correctly", () => {
            // @ts-expect-error: "toThrow" is hidden for undefined
            expect(undefined).toThrow;
            // @ts-expect-error: "toThrow" is hidden for null
            expect(null).toThrow;
            // @ts-expect-error: "toThrow" is hidden for booleans
            expect(false as boolean).toThrow;
            // @ts-expect-error: "toThrow" is hidden for numbers
            expect(0 as number).toThrow;
            // @ts-expect-error: "toThrow" is hidden for bigints
            expect(0n as bigint).toThrow;
            // @ts-expect-error: "toThrow" is hidden for strings
            expect("" as string).toThrow;
            // @ts-expect-error: "toThrow" is hidden for symbols
            expect(symbol as symbol).toThrow;
            // @ts-expect-error: "toThrow" is hidden for functions with parameters
            expect((a: number) => a + 1).toThrow;
            // @ts-expect-error: "toThrow" is hidden for objects
            expect(object as object).toThrow;
        });
    });
});

//----------------------------------------------------------------------------------------------------------------------
//
//    ##    ##  #######  ########
//    ###   ## ##     ##    ##
//    ####  ## ##     ##    ##
//    ## ## ## ##     ##    ##
//    ##  #### ##     ##    ##
//    ##   ### ##     ##    ##
//    ##    ##  #######     ##
//
//----------------------------------------------------------------------------------------------------------------------

describe("expect.not", () => {
    describe("toBe", () => {
        it("handles undefined", () => {
            fails(() => expect(undefined).not.toBe(undefined));
            passes(() => expect(null as null | undefined).not.toBe(undefined));
            passes(() => expect(false as boolean | undefined).not.toBe(undefined));
            passes(() => expect(0 as number | undefined).not.toBe(undefined));
            passes(() => expect(0n as bigint | undefined).not.toBe(undefined));
            passes(() => expect("" as string | undefined).not.toBe(undefined));
            passes(() => expect(symbol as symbol | undefined).not.toBe(undefined));
            passes(() => expect(fn as Function | undefined).not.toBe(undefined));
            passes(() => expect(object as object | undefined).not.toBe(undefined));
        });

        it("handles null", () => {
            passes(() => expect(undefined as undefined | null).not.toBe(null));
            fails(() => expect(null).not.toBe(null));
            passes(() => expect(false as boolean | null).not.toBe(null));
            passes(() => expect(0 as number | null).not.toBe(null));
            passes(() => expect(0n as bigint | null).not.toBe(null));
            passes(() => expect("" as string | null).not.toBe(null));
            passes(() => expect(symbol as symbol | null).not.toBe(null));
            passes(() => expect(fn as Function | null).not.toBe(null));
            passes(() => expect(object as object | null).not.toBe(null));
        });

        it("handles booleans", () => {
            passes(() => expect(undefined as undefined | boolean).not.toBe(true));
            passes(() => expect(null as null | boolean).not.toBe(true));
            fails(() => expect(true as boolean).not.toBe(true));
            passes(() => expect(false as boolean).not.toBe(true));
            passes(() => expect(0 as number | boolean).not.toBe(true));
            passes(() => expect(0n as bigint | boolean).not.toBe(true));
            passes(() => expect("" as string | boolean).not.toBe(true));
            passes(() => expect(symbol as symbol | boolean).not.toBe(true));
            passes(() => expect(fn as Function | boolean).not.toBe(true));
            passes(() => expect(object as object | boolean).not.toBe(true));
        });

        it("handles numbers", () => {
            passes(() => expect(undefined as undefined | number).not.toBe(0));
            passes(() => expect(null as null | number).not.toBe(0));
            passes(() => expect(false as boolean | number).not.toBe(0));
            fails(() => expect(0 as number).not.toBe(0));
            passes(() => expect(1 as number).not.toBe(0));
            passes(() => expect(0n as bigint | number).not.toBe(0));
            passes(() => expect("" as string | number).not.toBe(0));
            passes(() => expect(symbol as symbol | number).not.toBe(0));
            passes(() => expect(fn as Function | number).not.toBe(0));
            passes(() => expect(object as object | number).not.toBe(0));
        });

        it("handles strings", () => {
            passes(() => expect(undefined as undefined | string).not.toBe(""));
            passes(() => expect(null as null | string).not.toBe(""));
            passes(() => expect(false as boolean | string).not.toBe(""));
            passes(() => expect(0 as number | string).not.toBe("0"));
            passes(() => expect(0n as bigint | string).not.toBe("0"));
            passes(() => expect("" as string).not.toBe("0"));
            fails(() => expect("0" as string).not.toBe("0"));
            passes(() => expect(symbol as symbol | string).not.toBe("Symbol(1)"));
            passes(() => expect(fn as Function | string).not.toBe("() => {}"));
            passes(() => expect(object as object | string).not.toBe(`{ key: "value" }`));
        });

        it("handles symbols", () => {
            passes(() => expect(undefined as undefined | symbol).not.toBe(symbol));
            passes(() => expect(null as null | symbol).not.toBe(symbol));
            passes(() => expect(true as boolean | symbol).not.toBe(symbol));
            passes(() => expect(1 as number | symbol).not.toBe(symbol));
            passes(() => expect(1n as bigint | symbol).not.toBe(symbol));
            passes(() => expect("1" as string | symbol).not.toBe(symbol));
            fails(() => expect(symbol as symbol | symbol).not.toBe(symbol));
            passes(() => expect(Symbol(1) as symbol | symbol).not.toBe(Symbol(1)));
            passes(() => expect(fn as Function | symbol).not.toBe(symbol));
            passes(() => expect(object as object | symbol).not.toBe(symbol));
        });

        it("handles functions", () => {
            passes(() => expect(undefined as undefined | Function).not.toBe(fn));
            passes(() => expect(null as null | Function).not.toBe(fn));
            passes(() => expect(false as boolean | Function).not.toBe(fn));
            passes(() => expect(0 as number | Function).not.toBe(fn));
            passes(() => expect(0n as bigint | Function).not.toBe(fn));
            passes(() => expect("" as string | Function).not.toBe(fn));
            passes(() => expect(symbol as symbol | Function).not.toBe(fn));
            fails(() => expect(fn as Function | Function).not.toBe(fn));
            passes(() => expect((() => true) as Function | Function).not.toBe(() => true));
            passes(() => expect(object as object | Function).not.toBe(fn));
        });

        it("handles objects", () => {
            passes(() => expect(undefined as undefined | object).not.toBe(object));
            passes(() => expect(null as null | object).not.toBe(object));
            passes(() => expect(false as boolean | object).not.toBe(object));
            passes(() => expect(0 as number | object).not.toBe(object));
            passes(() => expect(0n as bigint | object).not.toBe(object));
            passes(() => expect("" as string | object).not.toBe(object));
            passes(() => expect(symbol as symbol | object).not.toBe(object));
            passes(() => expect(fn as Function | object).not.toBe(object));
            fails(() => expect(object as object | object).not.toBe(object));
            passes(() => expect({ key: "value" } as object | object).not.toBe({ key: "value" }));
        });

        it("is typed correctly", () => {
            // preserves the actual value's type, including unknown and any
            expect(expect(1 as number | string).not.toBe).toBeOfType<(expected: number | string) => void>();
            expect(expect(1 as unknown).not.toBe).toBeOfType<(expected: unknown) => void>();
            expect(expect(1 as any).not.toBe).toBeOfType<(expected: any) => void>();
            // preserves generic type parameters
            expect(expect(Promise.resolve(1 as number | string)).not.toBe).toBeOfType<
                (expected: Promise<number | string>) => void
            >();
            // preserves interface definitions of the original value
            expect(expect({ a: 1 } as const).not.toBe).toBeOfType<(expected: { readonly a: 1 }) => void>();
        });
    });

    describe("toBeInstanceOf", () => {
        const asObject = (value: unknown) => value as object;

        it("handles non-object values", () => {
            fails(() => expect(asObject(undefined)).not.toBeInstanceOf(Object));
            fails(() => expect(asObject(null)).not.toBeInstanceOf(Object));
            fails(() => expect(asObject(true)).not.toBeInstanceOf(Object));
            fails(() => expect(asObject(false)).not.toBeInstanceOf(Object));
            fails(() => expect(asObject(0)).not.toBeInstanceOf(Object));
            fails(() => expect(asObject(0n)).not.toBeInstanceOf(Object));
            fails(() => expect(asObject("")).not.toBeInstanceOf(Object));
            fails(() => expect(asObject(symbol)).not.toBeInstanceOf(Object));
            fails(() => expect(asObject(fn)).not.toBeInstanceOf(Object));
        });

        it("handles objects", () => {
            // class hierarchy
            fails(() => expect(new Error()).not.toBeInstanceOf(Error));
            fails(() => expect(new MyError("")).not.toBeInstanceOf(Error));
            passes(() => expect(new Error()).not.toBeInstanceOf(MyError));
            // generics
            fails(() => expect(new Set(["string"])).not.toBeInstanceOf(Set));
            // object literals
            fails(() => expect({}).not.toBeInstanceOf(Object));
            // arrays
            fails(() => expect([]).not.toBeInstanceOf(Array));
        });

        it("is typed correctly", () => {
            passes(() =>
                expect(new Error()).not.toBeInstanceOf(
                    // @ts-expect-error: Array is not a base class of Error
                    Array
                )
            );
            // "toBeInstanceOf" is not hidden for value types
            expect(0 as undefined | null | boolean | number | bigint | string).not.toBeInstanceOf;
            // @ts-expect-error: "toBeInstanceOf" is hidden for promises
            expect(promise).not.toBeInstanceOf;
            // @ts-expect-error: "toBeInstanceOf" is hidden for parameterless functions
            expect(() => {}).not.toBeInstanceOf;
            // "toBeInstanceOf" is not hidden for functions with parameters
            expect((a: number) => a + 1).not.toBeInstanceOf;
        });
    });

    describe("toBeOfType", () => {
        it("handles union types", () => {
            // @ts-expect-error: The expected type matches the actual type
            expect(1 as string | number).not.toBeOfType<string | number>();
            // The expected type is too narrow
            expect(1 as string | number).not.toBeOfType<string>();
            // The expected type is too wide
            expect(1 as string | number).not.toBeOfType<string | number | boolean>();
        });

        it("handles generic types", () => {
            // @ts-expect-error: The expected type matches the actual type
            expect(resolved(1 as string | number)).not.toBeOfType<Promise<string | number>>();
            // The expected type is too narrow
            expect(resolved(1 as string | number)).not.toBeOfType<Promise<string>>();
            // The expected type is too wide
            expect(resolved(1 as string | number)).not.toBeOfType<Promise<boolean | string | number>>();
        });

        it("handles functions", () => {
            // @ts-expect-error: The expected type matches the actual type
            expect(() => {}).not.toBeOfType<() => void>();
            // @ts-expect-error: The expected type matches the actual type
            expect((a: number) => a + 1).not.toBeOfType<(a: number) => number>();
            // Too many parameters expected
            expect(() => {}).not.toBeOfType<(a: number) => void>();
            // Too few parameters expected
            expect((a: number) => a + 1).not.toBeOfType<() => number>();
            // The parameter type doesn't match
            expect((a: boolean) => !a).not.toBeOfType<(a: number) => boolean>();
            // The parameter type is too narrow
            expect((a: boolean | number) => `${a}`).not.toBeOfType<(a: number) => string>();
            // The parameter type is too wide
            expect((a: boolean | number) => `${a}`).not.toBeOfType<(a: boolean | number | string) => string>();
            // The return value does not match
            expect(() => 1).not.toBeOfType<() => string>();
            // The return value is too narrow
            expect(() => 1 as number | string).not.toBeOfType<() => number>();
            // The return value is too wide
            expect(() => 1 as number | string).not.toBeOfType<() => boolean | number | string>();
        });
    });

    describe("toEqual", () => {
        it("handles undefined", () => {
            fails(() => expect(undefined).not.toEqual(undefined));
            passes(() => expect(null as null | undefined).not.toEqual(undefined));
            passes(() => expect(false as boolean | undefined).not.toEqual(undefined));
            passes(() => expect(0 as number | undefined).not.toEqual(undefined));
            passes(() => expect(0n as bigint | undefined).not.toEqual(undefined));
            passes(() => expect("" as string | undefined).not.toEqual(undefined));
            passes(() => expect(symbol as symbol | undefined).not.toEqual(undefined));
            // functions can't be compared
            fails(() => expect(fn as Function | undefined).not.toEqual(undefined));
            passes(() => expect(object as object | undefined).not.toEqual(undefined));
        });

        it("handles null", () => {
            passes(() => expect(undefined as undefined | null).not.toEqual(null));
            fails(() => expect(null).not.toEqual(null));
            passes(() => expect(false as boolean | null).not.toEqual(null));
            passes(() => expect(0 as number | null).not.toEqual(null));
            passes(() => expect(0n as bigint | null).not.toEqual(null));
            passes(() => expect("" as string | null).not.toEqual(null));
            passes(() => expect(symbol as symbol | null).not.toEqual(null));
            // functions can't be compared
            fails(() => expect(fn as Function | null).not.toEqual(null));
            passes(() => expect(object as object | null).not.toEqual(null));
        });

        it("handles booleans", () => {
            passes(() => expect(undefined as undefined | boolean).not.toEqual(true));
            passes(() => expect(null as null | boolean).not.toEqual(true));
            fails(() => expect(true as boolean).not.toEqual(true));
            passes(() => expect(false as boolean).not.toEqual(true));
            passes(() => expect(0 as number | boolean).not.toEqual(true));
            passes(() => expect(0n as bigint | boolean).not.toEqual(true));
            passes(() => expect("" as string | boolean).not.toEqual(true));
            passes(() => expect(symbol as symbol | boolean).not.toEqual(true));
            // functions can't be compared
            fails(() => expect(fn as Function | boolean).not.toEqual(true));
            passes(() => expect(object as object | boolean).not.toEqual(true));
        });

        it("handles numbers", () => {
            passes(() => expect(undefined as undefined | number).not.toEqual(0));
            passes(() => expect(null as null | number).not.toEqual(0));
            passes(() => expect(false as boolean | number).not.toEqual(0));
            fails(() => expect(0 as number).not.toEqual(0));
            passes(() => expect(1 as number).not.toEqual(0));
            passes(() => expect(0n as bigint | number).not.toEqual(0));
            passes(() => expect("" as string | number).not.toEqual(0));
            passes(() => expect(symbol as symbol | number).not.toEqual(0));
            // functions can't be compared
            fails(() => expect(fn as Function | number).not.toEqual(0));
            passes(() => expect(object as object | number).not.toEqual(0));
        });

        it("handles strings", () => {
            passes(() => expect(undefined as undefined | string).not.toEqual(""));
            passes(() => expect(null as null | string).not.toEqual(""));
            passes(() => expect(false as boolean | string).not.toEqual(""));
            passes(() => expect(0 as number | string).not.toEqual("0"));
            passes(() => expect(0n as bigint | string).not.toEqual("0"));
            passes(() => expect("" as string).not.toEqual("0"));
            fails(() => expect("0" as string).not.toEqual("0"));
            passes(() => expect(symbol as symbol | string).not.toEqual("Symbol(1)"));
            // functions can't be compared
            fails(() => expect(fn as Function | string).not.toEqual("() => {}"));
            passes(() => expect(object as object | string).not.toEqual(`{ key: "value" }`));
        });

        it("handles symbols", () => {
            passes(() => expect(undefined as undefined | symbol).not.toEqual(symbol));
            passes(() => expect(null as null | symbol).not.toEqual(symbol));
            passes(() => expect(true as boolean | symbol).not.toEqual(symbol));
            passes(() => expect(1 as number | symbol).not.toEqual(symbol));
            passes(() => expect(1n as bigint | symbol).not.toEqual(symbol));
            passes(() => expect("1" as string | symbol).not.toEqual(symbol));
            fails(() => expect(symbol as symbol | symbol).not.toEqual(symbol));
            passes(() => expect(Symbol(1) as symbol | symbol).not.toEqual(Symbol(1)));
            // functions can't be compared
            fails(() => expect(fn as Function | symbol).not.toEqual(symbol));
            passes(() => expect(object as object | symbol).not.toEqual(symbol));
        });

        it("handles functions", () => {
            // functions can't be compared
            fails(() => expect(undefined as unknown).not.toEqual(fn));
            fails(() => expect(null as unknown).not.toEqual(fn));
            fails(() => expect(false as unknown).not.toEqual(fn));
            fails(() => expect(0 as unknown).not.toEqual(fn));
            fails(() => expect(0n as unknown).not.toEqual(fn));
            fails(() => expect("" as unknown).not.toEqual(fn));
            fails(() => expect(symbol as unknown).not.toEqual(fn));
            fails(() => expect(fn as unknown).not.toEqual(fn));
            fails(() => expect((() => true) as unknown).not.toEqual(() => true));
            fails(() => expect(object as unknown).not.toEqual(fn));
        });

        it("handles objects", () => {
            passes(() => expect(undefined as undefined | object).not.toEqual(object));
            passes(() => expect(null as null | object).not.toEqual(object));
            passes(() => expect(false as boolean | object).not.toEqual(object));
            passes(() => expect(0 as number | object).not.toEqual(object));
            passes(() => expect(0n as bigint | object).not.toEqual(object));
            passes(() => expect("" as string | object).not.toEqual(object));
            passes(() => expect(symbol as symbol | object).not.toEqual(object));
            // functions can't be compared
            fails(() => expect(fn as Function | object).not.toEqual(object));
            fails(() => expect(object as object | object).not.toEqual(object));
            fails(() => expect({ key: "value" } as object | object).not.toEqual({ key: "value" }));
            passes(() => expect({ key: "value 1" } as object | object).not.toEqual({ key: "value 2" }));
        });

        it("is typed correctly", () => {
            // mirrors the type of the actual value
            expect(expect(1 as number | string).not.toEqual).toBeOfType<(expected: number | string) => void>();
            // mirrors generic parameters of the actual value
            expect(expect(new Set<string | number>()).not.toEqual).toBeOfType<
                (expected: Set<string | number>) => void
            >();
            // preserves interface definitions of the original value
            expect(expect({ a: 1 } as const).not.toEqual).toBeOfType<(expected: { readonly a: 1 }) => void>();
            // @ts-expect-error: is not applicable to promises
            expect(promise).not.toEqual;
            // @ts-expect-error: is not applicable to functions without parameters
            expect(() => {}).not.toEqual;
            // @ts-expect-error: is not applicable to functions with parameters
            expect((a: number) => a + 1).not.toEqual;
            // removes promises and functions from the actual value's type
            expect(
                expect(0 as boolean | number | Promise<string> | (() => {}) | ((a: number) => boolean)).not.toEqual
            ).toBeOfType<(expected: boolean | number) => void>();
        });
    });

    describe("toMatch", () => {
        it("handles non-string values", () => {
            fails(() => expect(undefined).not.toMatch(/.*/));
            fails(() => expect(null).not.toMatch(/.*/));
            fails(() => expect(true).not.toMatch(/.*/));
            fails(() => expect(false).not.toMatch(/.*/));
            fails(() => expect(1).not.toMatch(/.*/));
            fails(() => expect(1n).not.toMatch(/.*/));
            fails(() => expect(symbol).not.toMatch(/.*/));
            fails(() => expect(fn as unknown).not.toMatch(/.*/));
            fails(() => expect(object).not.toMatch(/.*/));
        });

        it("handles strings", () => {
            passes(() => expect("this text").not.toMatch(/does not match/));
            fails(() => expect("some random text content").not.toMatch(/random.*content$/));
        });

        it("is typed correctly", () => {
            // "toMatch" is not hidden for most data types
            expect(
                expect(0 as undefined | null | boolean | number | bigint | string | symbol | object).toMatch
            ).toBeOfType<(expected: RegExp) => void>();
            // "toMatch" is not hidden for functions with parameters
            expect(expect((a: number) => a + 1).not.toMatch).toBeOfType<(expected: RegExp) => void>();
            // @ts-expect-error: "toMatch" is hidden for promises
            expect(promise).not.toMatch;
            // @ts-expect-error: "toMatch" is hidden for functions without parameters
            expect(() => {}).not.toMatch;
        });
    });

    describe("toThrow", () => {
        const asFunction = (value: unknown) => value as () => void;

        it("handles functions", () => {
            passes(() => expect(() => {}).not.toThrow());
            fails(() => expect(throwing()).not.toThrow());
        });

        it("handles non-function values", () => {
            fails(() => expect(asFunction(undefined)).not.toThrow());
            fails(() => expect(asFunction(null)).not.toThrow());
            fails(() => expect(asFunction(true)).not.toThrow());
            fails(() => expect(asFunction(false)).not.toThrow());
            fails(() => expect(asFunction(0)).not.toThrow());
            fails(() => expect(asFunction(0n)).not.toThrow());
            fails(() => expect(asFunction("")).not.toThrow());
            fails(() => expect(asFunction(symbol)).not.toThrow());
            fails(() => expect(asFunction(object)).not.toThrow());
        });

        it("is typed correctly", () => {
            // @ts-expect-error: "toThrow" is hidden for undefined
            expect(undefined).not.toThrow;
            // @ts-expect-error: "toThrow" is hidden for null
            expect(null).not.toThrow;
            // @ts-expect-error: "toThrow" is hidden for booleans
            expect(false as boolean).not.toThrow;
            // @ts-expect-error: "toThrow" is hidden for numbers
            expect(0 as number).not.toThrow;
            // @ts-expect-error: "toThrow" is hidden for strings
            expect("" as string).not.toThrow;
            // @ts-expect-error: "toThrow" is hidden for symbols
            expect(symbol as symbol).not.toThrow;
            // @ts-expect-error: "toThrow" is hidden for objects
            expect(object).not.toThrow;
            // @ts-expect-error: "toThrow" is hidden for functions with parameters
            expect((a: number) => a + 1).not.toThrow;
            // @ts-expect-error: "toThrow" is hidden for union types
            expect((() => {}) as (() => void) | number).not.toThrow;
        });
    });
});
