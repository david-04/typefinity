import * as assert from "node:assert";
import { describe, it } from "node:test";
import { expect } from "../expect.js";

/**---------------------------------------------------------------------------------------------------------------------
 * Test utilities
 *--------------------------------------------------------------------------------------------------------------------*/

class MyError extends Error {
    public constructor(message: string, cause?: unknown) {
        super(message, { cause });
    }
}

const errorFn =
    (error: Error = new Error()) =>
    () => {
        throw error;
    };

const passes = assert.doesNotThrow;
const fails = assert.throws;
const rejects = assert.rejects;
const resolves = assert.doesNotReject;

const resolved = <T>(value: T) => Promise.resolve(value);
const rejected = <T>(error: Error = new Error()) => Promise.reject<T>(error);

//----------------------------------------------------------------------------------------------------------------------
//
// ######## ##     ## ########  ########  ######  ########
// ##        ##   ##  ##     ## ##       ##    ##    ##
// ##         ## ##   ##     ## ##       ##          ##
// ######      ###    ########  ######   ##          ##
// ##         ## ##   ##        ##       ##          ##
// ##        ##   ##  ##        ##       ##    ##    ##
// ######## ##     ## ##        ########  ######     ##
//
//----------------------------------------------------------------------------------------------------------------------

describe("expect", () => {
    describe("toBe", () => {
        it("handles undefined", () => {
            passes(() => expect(undefined).toBe(undefined));
            fails(() => expect(undefined as undefined | null).toBe(null));
        });

        it("handles null", () => {
            passes(() => expect(null).toBe(null));
            fails(() => expect(null as undefined | null).toBe(undefined));
        });

        it("handles booleans", () => {
            passes(() => expect(true).toBe(true));
            fails(() => expect(false).toBe(true));
        });

        it("handles numbers", () => {
            passes(() => expect(1).toBe(1));
            fails(() => expect(1).toBe(2));
        });

        it("handles strings", () => {
            passes(() => expect("abc").toBe("abc"));
            fails(() => expect("abc").toBe("123"));
        });

        it("handles regular expressions", () => {
            const regularExpression = /a.b/i;
            passes(() => expect(regularExpression).toBe(regularExpression));
            fails(() => expect(/a.b/i).toBe(/a.b/i));
        });

        it("handles objects", () => {
            const object = { a: [1, 2] };
            passes(() => expect(object).toBe(object));
            fails(() => expect({ a: 1 }).toBe({ a: 1 }));
        });

        it("handles promises", () => {
            const promise = Promise.resolve(1);
            passes(() => expect(promise).toBe(promise));
            fails(() => expect(Promise.resolve(1)).toBe(Promise.resolve(1)));
        });

        it("handles parameterless functions", () => {
            const fn = () => 1;
            passes(() => expect(fn).toBe(fn));
            fails(() => expect(() => 1).toBe(() => 1));
        });

        it("handles functions with parameters", () => {
            const fn = (a: number) => a + 1;
            passes(() => expect(fn).toBe(fn));
            fails(() => expect((a: number) => a + 1).toBe((a: number) => a + 1));
        });

        it("is typed correctly", () => {
            expect(1 as number | string).toBe(1 as number | string);
            // @ts-expect-error: The expected value must match the type of the actual value
            expect(1 as number | string).toBe(1 as number | string | boolean);
            // @ts-expect-error: The expected value must match the nested types of the actual value
            fails(() => expect(Promise, resolve(1)).toBe(Promise.resolve("a")));
            // @ts-expect-error: The expected value must match the nested types of the actual value
            fails(() => expect({ a: 1 }).toBe({ a: "2" }));
        });
    });

    describe("toBeFalsy", () => {
        it("handles undefined", () => {
            passes(() => expect(undefined).toBeFalsy());
        });

        it("handles null", () => {
            passes(() => expect(null).toBeFalsy());
        });

        it("handles booleans", () => {
            fails(() => expect(true).toBeFalsy());
            passes(() => expect(false).toBeFalsy());
        });

        it("handles numbers", () => {
            passes(() => expect(0).toBeFalsy());
            fails(() => expect(1).toBeFalsy());
        });

        it("handles strings", () => {
            passes(() => expect("").toBeFalsy());
            fails(() => expect("abc").toBeFalsy());
        });

        it("handles regular expressions", () => {
            fails(() => expect(/a.*b/i).toBeFalsy());
        });

        it("handles objects", () => {
            fails(() => expect({ a: 1 }).toBeFalsy());
        });

        it("handles promises", () => {
            fails(() => expect(Promise.resolve(true) as Promise<boolean> | boolean).toBeFalsy());
        });

        it("handles parameterless functions", () => {
            fails(() => expect((() => 1) as (() => void) | boolean).toBeFalsy());
        });

        it("handles functions with parameters", () => {
            fails(() => expect((a: number) => a + 1).toBeFalsy());
        });

        it("is typed correctly", () => {
            expect(0 as number | string).toBeFalsy();
            expect(0 as number | Promise<number>).toBeFalsy();
            // @ts-expect-error: toBeFalsy is hidden for promises (they are never falsy)
            fails(() => expect(Promise.resolve(1)).toBeFalsy());
            // @ts-expect-error: toBeFalsy is hidden for parameterless functions (they are never falsy)
            fails(() => expect(() => {}).toBeFalsy());
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

        it("handles nested types", () => {
            expect(resolved(1 as string | number)).toBeOfType<Promise<string | number>>();
            // @ts-expect-error: The expected type is too narrow
            expect(resolved(1 as string | number)).toBeOfType<Promise<string>>();
            // @ts-expect-error: The expected type is too wide
            expect(resolved(1 as string | number)).toBeOfType<Promise<boolean | string | number>>();
        });

        it("handles function types", () => {
            expect(() => {}).toBeOfType<() => void>();
            expect((a: number) => a + 1).toBeOfType<(a: number) => number>();
            // @ts-expect-error: The parameters don't match
            expect(() => {}).toBeOfType<(a?: number) => void>();
            // @ts-expect-error: The return value does not match
            expect(() => 1).toBeOfType<() => string>();
        });
    });

    describe("toBeTruthy", () => {
        it("handles undefined", () => {
            fails(() => expect(undefined).toBeTruthy());
        });

        it("handles null", () => {
            fails(() => expect(null).toBeTruthy());
        });

        it("handles booleans", () => {
            passes(() => expect(true).toBeTruthy());
            fails(() => expect(false).toBeTruthy());
        });

        it("handles numbers", () => {
            fails(() => expect(0).toBeTruthy());
            passes(() => expect(1).toBeTruthy());
        });

        it("handles strings", () => {
            fails(() => expect("").toBeTruthy());
            passes(() => expect("abc").toBeTruthy());
        });

        it("handles regular expressions", () => {
            passes(() => expect(/a.*b/i).toBeTruthy());
        });

        it("handles objects", () => {
            passes(() => expect({ a: 1 }).toBeTruthy());
        });

        it("handles promises", () => {
            passes(() => expect(Promise.resolve(true) as Promise<boolean> | boolean).toBeTruthy());
        });

        it("handles parameterless functions", () => {
            passes(() => expect((() => 1) as (() => void) | boolean).toBeTruthy());
        });

        it("handles functions with parameters", () => {
            passes(() => expect((a: number) => a + 1).toBeTruthy());
        });

        it("is typed correctly", () => {
            expect(1 as number | string).toBeTruthy();
            expect(1 as number | Promise<number>).toBeTruthy();
            // @ts-expect-error: not.toBeTruthy is hidden for promises (they are always truthy)
            expect(Promise.resolve(0)).toBeTruthy();
            // @ts-expect-error: not.toBeTruthy is hidden for parameterless functions (they are always truthy)
            expect(() => false).toBeTruthy();
        });
    });

    describe("toEqual", () => {
        it("handles undefined", () => {
            passes(() => expect(undefined).toEqual(undefined));
            fails(() => expect(undefined as undefined | null).toEqual(null));
        });

        it("handles null", () => {
            passes(() => expect(null).toEqual(null));
            fails(() => expect(null as undefined | null).toEqual(undefined));
        });

        it("handles booleans", () => {
            passes(() => expect(true).toEqual(true));
            fails(() => expect(false).toEqual(true));
        });

        it("handles numbers", () => {
            passes(() => expect(1).toEqual(1));
            fails(() => expect(1).toEqual(2));
        });

        it("handles strings", () => {
            passes(() => expect("abc").toEqual("abc"));
            fails(() => expect("abc").toEqual("123"));
        });

        it("handles regular expressions", () => {
            passes(() => expect(/a.b/i).toEqual(/a.b/i));
            fails(() => expect(/a.b/i).toEqual(/1.2/i));
        });

        it("handles objects", () => {
            passes(() => expect({ a: [1, 2] }).toEqual({ a: [1, 2] }));
            fails(() => expect({ a: [1, 2] }).toEqual({ a: [1, 3] }));
        });

        it("handles promises", () => {
            const promise: unknown = Promise.resolve(1);
            fails(() => expect(promise).toEqual(promise)); // node:assert can't compare promises
            fails(() => expect(promise).toEqual(1));
            fails(() => expect(1 as unknown).toEqual(promise));
        });

        it("handles parameterless functions", () => {
            const fn: unknown = () => 1;
            fails(() => expect(fn).toEqual(fn)); // node:assert can't compare functions
            fails(() => expect(fn).toEqual(() => 2));
            fails(() => expect(fn).toEqual(1));
            fails(() => expect(1 as unknown).toEqual(fn));
        });

        it("handles functions with parameters", () => {
            const fn: unknown = (a: number) => a + 1;
            fails(() => expect(fn).toEqual(fn)); // node:assert can't compare functions
            fails(() => expect(fn).toEqual(() => "abc"));
            fails(() => expect(fn).toEqual(1));
            fails(() => expect(1 as unknown).toEqual(fn));
        });

        it("is typed correctly", () => {
            expect(1 as number | string).toEqual(1 as number | string);
            // @ts-expect-error: The expected value's type must match the type actual value
            fails(() => expect(1).toEqual("2"));
            // @ts-expect-error: The expected value's type must match the nested types of the actual value
            fails(() => expect({ a: 1 }).toEqual({ a: "1" }));
            // @ts-expect-error: The expected value's type can't be bigger than the actual value's type
            expect(1 as number | string).toEqual(1 as number | string | boolean);
            expect(1 as number | Promise<number>).toEqual(1);
            // @ts-expect-error: The expected value can't be a promise
            fails(() => expect(Promise.resolve(1) as number | Promise<number>).toEqual(Promise.resolve(1)));
            // @ts-expect-error: The expected value can't be a function
            fails(() => expect((() => {}) as number | (() => void)).toEqual(() => {}));
        });
    });

    describe("toMatch", () => {
        it("fails when passing undefined", () => {
            fails(() => expect(undefined).toMatch(/.*/));
        });

        it("fails when passing null", () => {
            fails(() => expect(null).toMatch(/.*/));
        });

        it("fails when passing a boolean", () => {
            fails(() => expect(true).toMatch(/.*/));
        });

        it("fails when passing a number", () => {
            fails(() => expect(1).toMatch(/.*/));
        });

        it("fails when passing a bigint", () => {
            fails(() => expect(1n).toMatch(/.*/));
        });

        it("fails when passing a symbol", () => {
            fails(() => expect(Symbol("...")).toMatch(/.*/));
        });

        it("fails when passing an object", () => {
            fails(() => expect({ key: "value" }).toMatch(/.*/));
        });

        it("fails when passing a function", () => {
            // @ts-ignore-error
            fails(() => expect(() => 1).toMatch(/.*/));
        });

        it("fails when passing a string that doesn't match", () => {
            fails(() => expect("this text").toMatch(/does not match/));
        });

        it("passes when passing a string that matches", () => {
            passes(() => expect("some random text content").toMatch(/random.*content$/));
        });
    });

    describe("toReject", () => {
        it("handles rejections", async () => {
            await resolves(expect(rejected()).toReject());
            await rejects(expect(resolved(0)).toReject());
        });

        it("handles rejections based on an error message", async () => {
            await resolves(expect(rejected(new Error("message"))).toReject("message"));
            await rejects(expect(rejected(new Error("actual message"))).toReject("expected message"));
            await rejects(expect(resolved(0)).toReject("message"));
        });

        it("handles rejections based on an a regular expression", async () => {
            await resolves(expect(rejected(new Error("message"))).toReject(/es+a/));
            await rejects(expect(rejected(new Error("message"))).toReject(/\d+/));
            await rejects(expect(resolved(0)).toReject(/.*/));
        });

        it("handles rejections based on an error", async () => {
            const error = new Error("main", { cause: new MyError("cause") });
            await resolves(expect(rejected(error)).toReject(new Error("main", { cause: new MyError("cause") })));
            await rejects(
                expect(rejected(error)).toReject(new Error("main", { cause: new MyError("expected cause") }))
            );
            await rejects(expect(rejected(error)).toReject(new Error("main", { cause: new Error("cause") })));
            await rejects(() => expect(resolved(0)).toReject(error));
        });

        it("is typed correctly", async () => {
            // @ts-expect-error: toReject is hidden and throws an exception (undefined can't reject)
            await rejects(expect(undefined).toReject());
            // @ts-expect-error: toReject is hidden and throws an exception (null can't reject)
            await rejects(expect(null).toReject());
            // @ts-expect-error: toReject is hidden and throws an exception (boolean values can't reject)
            await rejects(expect(false).toReject());
            // @ts-expect-error: toReject is hidden and throws an exception (numbers can't reject)
            await rejects(expect(0).toReject());
            // @ts-expect-error: toReject is hidden and throws an exception (strings can't reject)
            await rejects(expect("").toReject());
            // @ts-expect-error: toReject is hidden and throws an exception (regular expressions can't reject)
            await rejects(expect(/a.b/i).toReject());
            // @ts-expect-error: toReject is hidden and throws an exception (objects can't reject)
            await rejects(expect({ a: 1 }).toReject());
            // @ts-expect-error: toReject is hidden and throws an exception (functions can't reject)
            await rejects(expect(() => {}).toReject());
            // @ts-expect-error: toReject is hidden and throws an exception (functions can't reject)
            await rejects(expect((a: number) => a + 1).toReject());
            // @ts-expect-error: toReject is hidden (the actual value might not be a promise)
            await rejects(expect(resolved("") as Promise<void> | number).toReject());
        });
    });

    describe("toResolve", () => {
        it("handles undefined", async () => {
            await resolves(expect(resolved(undefined)).toResolve());
            await resolves(expect(resolved(undefined)).toResolve(undefined));
            await rejects(expect(resolved(undefined as undefined | null)).toResolve(null));
            await rejects(expect(rejected<undefined>()).toResolve(undefined));
        });

        it("handles null", async () => {
            await resolves(expect(resolved(null)).toResolve());
            await resolves(expect(resolved(null)).toResolve(null));
            await rejects(expect(resolved(null as undefined | null)).toResolve(undefined));
            await rejects(expect(rejected<null>()).toResolve(null));
        });

        it("handles booleans", async () => {
            await resolves(expect(resolved(false)).toResolve());
            await resolves(expect(resolved(false)).toResolve(false));
            await rejects(expect(resolved(false)).toResolve(true));
            await rejects(expect(rejected<boolean>()).toResolve(false));
        });

        it("handles numbers", async () => {
            await resolves(expect(resolved(0)).toResolve());
            await resolves(expect(resolved(0)).toResolve(0));
            await rejects(expect(resolved(0)).toResolve(1));
            await rejects(expect(rejected<number>()).toResolve(0));
        });

        it("handles strings", async () => {
            await resolves(expect(resolved("abc")).toResolve());
            await resolves(expect(resolved("abc")).toResolve("abc"));
            await rejects(expect(resolved("abc")).toResolve("123"));
            await rejects(expect(rejected<string>()).toResolve(""));
        });

        it("handles regular expressions", async () => {
            await resolves(expect(resolved(/a.b/)).toResolve());
            await resolves(expect(resolved(/a.b/)).toResolve(/a.b/));
            await rejects(expect(resolved(/a.b/)).toResolve(/1.2/));
            await rejects(expect(rejected<RegExp>()).toResolve(/.*/));
        });

        it("handles objects", async () => {
            await resolves(expect(resolved({ a: [1, 2] })).toResolve());
            await resolves(expect(resolved({ a: [1, 2] })).toResolve({ a: [1, 2] }));
            await rejects(expect(resolved({ a: [1, 2] })).toResolve({ a: [1, 3] }));
            await rejects(expect(rejected<{ a: [1, 2] }>()).toResolve({ a: [1, 2] }));
        });

        it("handles nested promises", async () => {
            await resolves(expect(resolved(resolved(1))).toResolve());
            await resolves(expect(resolved(resolved(1))).toResolve(1));
            await rejects(expect(resolved(rejected())).toResolve());
        });

        it("handles parameterless functions", async () => {
            const fn = () => 1;
            await resolves(expect(resolved(fn)).toResolve());
            // @ts-expect-error node:assert can't compare functions
            await rejects(expect(resolved(fn)).toResolve(fn));
            // @ts-expect-error node:assert can't compare functions
            await rejects(expect(rejected<typeof fn>()).toResolve(fn));
        });

        it("handles functions with parameters", async () => {
            const fn = (a: number) => a + 1;
            await resolves(expect(resolved(fn)).toResolve());
            // @ts-expect-error node:assert can't compare functions
            await rejects(expect(resolved(fn)).toResolve(fn));
            // @ts-expect-error node:assert can't compare functions
            await rejects(expect(rejected<typeof fn>()).toResolve(fn));
        });

        it("is typed correctly", async () => {
            await expect(resolved(1 as number | string)).toResolve(1 as number | string);
            // @ts-expect-error: The expected value's type must match the type actual value
            await rejects(expect(resolved(1)).toResolve("2"));
            // @ts-expect-error: The expected value's type must match the nested types of the actual value
            await rejects(expect(resolved({ a: 1 })).toResolve({ a: "1" }));
            // @ts-expect-error: The expected value's type can't be bigger than the actual value's type
            await expect(resolved(1 as number | string)).toResolve(1 as number | string | boolean);
            // @ts-expect-error: The expected value can't be a function
            await rejects(expect(resolved(() => 1)).toResolve(() => {}));
        });
    });

    describe("toThrow", () => {
        it("handles errors", () => {
            passes(() => expect(errorFn()).toThrow());
            fails(() => expect(() => {}).toThrow());
        });

        it("handles errors based on an error message", () => {
            passes(() => expect(errorFn(new Error("message"))).toThrow("message"));
            fails(() => expect(errorFn(new Error("actual message"))).toThrow("expected message"));
            fails(() => expect(() => {}).toThrow(""));
        });

        it("handles errors based on an a regular expression", () => {
            passes(() => expect(errorFn(new Error("message"))).toThrow(/es+a/));
            fails(() => expect(errorFn(new Error("message"))).toThrow(/1.2/));
            fails(() => expect(() => {}).toThrow(/.*/));
        });

        it("handles rejections based on an error", async () => {
            const error = new Error("main", { cause: new MyError("cause") });
            passes(() => expect(errorFn(error)).toThrow(new Error("main", { cause: new MyError("cause") })));
            fails(() => expect(errorFn(error)).toThrow(new Error("main", { cause: new MyError("nested cause") })));
            fails(() => expect(errorFn(error)).toThrow(new Error("main", { cause: new Error("cause") })));
            fails(() => expect(() => {}).toThrow(new Error()));
        });

        it("is typed correctly", () => {
            // @ts-expect-error: toThrow is hidden and throws an exception (undefined can't throw errors)
            fails(() => expect(undefined).toThrow());
            // @ts-expect-error: toThrow is hidden and throws an exception (null can't throw errors)
            fails(() => expect(null).toThrow());
            // @ts-expect-error: toThrow is hidden and throws an exception (booleans can't throw errors)
            fails(() => expect(false).toThrow());
            // @ts-expect-error: toThrow is hidden and throws an exception (numbers can't throw errors)
            fails(() => expect(0).toThrow());
            // @ts-expect-error: toThrow is hidden and throws an exception (strings can't throw errors)
            fails(() => expect("").toThrow());
            // @ts-expect-error: toThrow is hidden and throws an exception (regular expressions can't throw errors)
            fails(() => expect(/.*/).toThrow());
            // @ts-expect-error: toThrow is hidden and throws an exception (objects can't throw errors)
            fails(() => expect({ a: 1 }).toThrow());
            // @ts-expect-error: toThrow is hidden and throws an exception (promises can't throw errors)
            fails(() => expect(resolved(1)).toThrow());
            // @ts-expect-error: toThrow is hidden (functions with parameters can't be executed)
            fails(() => expect((a: number) => a + 1).toThrow());
        });
    });
});

//----------------------------------------------------------------------------------------------------------------------
//
//   ######## ##     ## ########  ########  ######  ########        ##    ##  #######  ########
//   ##        ##   ##  ##     ## ##       ##    ##    ##           ###   ## ##     ##    ##
//   ##         ## ##   ##     ## ##       ##          ##           ####  ## ##     ##    ##
//   ######      ###    ########  ######   ##          ##           ## ## ## ##     ##    ##
//   ##         ## ##   ##        ##       ##          ##           ##  #### ##     ##    ##
//   ##        ##   ##  ##        ##       ##    ##    ##     ###   ##   ### ##     ##    ##
//   ######## ##     ## ##        ########  ######     ##     ###   ##    ##  #######     ##
//
//----------------------------------------------------------------------------------------------------------------------

describe("expect.not", () => {
    describe("toBe", () => {
        it("handles undefined", () => {
            fails(() => expect(undefined).not.toBe(undefined));
            passes(() => expect(undefined as undefined | null).not.toBe(null));
        });

        it("handles null", () => {
            fails(() => expect(null).not.toBe(null));
            passes(() => expect(null as undefined | null).not.toBe(undefined));
        });

        it("handles booleans", () => {
            fails(() => expect(true).not.toBe(true));
            passes(() => expect(false).not.toBe(true));
        });

        it("handles numbers", () => {
            fails(() => expect(1).not.toBe(1));
            passes(() => expect(1).not.toBe(2));
        });

        it("handles strings", () => {
            fails(() => expect("abc").not.toBe("abc"));
            passes(() => expect("abc").not.toBe("123"));
        });

        it("handles regular expressions", () => {
            const regularExpression = /a.b/i;
            fails(() => expect(regularExpression).not.toBe(regularExpression));
            passes(() => expect(/a.b/i).not.toBe(/a.b/i));
        });

        it("handles objects", () => {
            const object = { a: [1, 2] };
            fails(() => expect(object).not.toBe(object));
            passes(() => expect({ a: 1 }).not.toBe({ a: 1 }));
        });

        it("handles promises", () => {
            const promise = Promise.resolve(1);
            fails(() => expect(promise).not.toBe(promise));
            passes(() => expect(Promise.resolve(1)).not.toBe(Promise.resolve(1)));
        });

        it("handles parameterless functions", () => {
            const fn = () => 1;
            fails(() => expect(fn).not.toBe(fn));
            passes(() => expect(() => 1).not.toBe(() => 1));
        });

        it("handles functions with parameters", () => {
            const fn = (a: number) => a + 1;
            fails(() => expect(fn).not.toBe(fn));
            passes(() => expect((a: number) => a + 1).not.toBe((a: number) => a + 1));
        });

        it("is typed correctly", () => {
            expect(1 as number | string).not.toBe(2 as number | string);
            // @ts-expect-error: The expected value must match the type of the actual value
            expect(1 as number | string).not.toBe(2 as number | string | boolean);
            // @ts-expect-error: The expected value must match the nested types of the actual value
            expect(Promise.resolve(1)).not.toBe(Promise.resolve("a"));
            // @ts-expect-error: The expected value must match the nested types of the actual value
            expect({ a: 1 }).not.toBe({ a: "2" });
        });
    });

    describe("toBeFalsy", () => {
        it("handles undefined", () => {
            fails(() => expect(undefined).not.toBeFalsy());
        });

        it("handles null", () => {
            fails(() => expect(null).not.toBeFalsy());
        });

        it("handles booleans", () => {
            passes(() => expect(true).not.toBeFalsy());
            fails(() => expect(false).not.toBeFalsy());
        });

        it("handles numbers", () => {
            fails(() => expect(0).not.toBeFalsy());
            passes(() => expect(1).not.toBeFalsy());
        });

        it("handles strings", () => {
            fails(() => expect("").not.toBeFalsy());
            passes(() => expect("abc").not.toBeFalsy());
        });

        it("handles regular expressions", () => {
            passes(() => expect(/a.*b/i).not.toBeFalsy());
        });

        it("handles objects", () => {
            passes(() => expect({ a: 1 }).not.toBeFalsy());
        });

        it("handles promises", () => {
            passes(() => expect(Promise.resolve(true) as Promise<boolean> | boolean).not.toBeFalsy());
        });

        it("handles parameterless functions", () => {
            passes(() => expect((() => 1) as (() => void) | boolean).not.toBeFalsy());
        });

        it("handles functions with parameters", () => {
            passes(() => expect((a: number) => a + 1).not.toBeFalsy());
        });

        it("is typed correctly", () => {
            expect(1 as number | string).not.toBeFalsy();
            expect(1 as number | Promise<number>).not.toBeFalsy();
            // @ts-expect-error: toBeFalsy is hidden for promises (they are never falsy)
            expect(Promise.resolve(1)).not.toBeFalsy();
            // @ts-expect-error: toBeFalsy is hidden for parameterless functions (they are never falsy)
            expect(() => {}).not.toBeFalsy();
        });
    });

    describe("toBeOfType", () => {
        it("handles union types", () => {
            expect(1 as string | number).not.toBeOfType<string>();
            expect(1 as string | number).not.toBeOfType<string | number | boolean>();
            // @ts-expect-error: The types are the same
            expect(1 as string | number).not.toBeOfType<string | number>();
        });

        it("handles nested types", () => {
            expect(resolved(1 as string | number)).not.toBeOfType<Promise<string>>();
            expect(resolved(1 as string | number)).not.toBeOfType<Promise<boolean | string | number>>();
            // @ts-expect-error: The types are the same
            expect(resolved(1 as string | number)).not.toBeOfType<Promise<string | number>>();
        });

        it("handles function types", () => {
            expect(() => {}).not.toBeOfType<(a?: number) => void>();
            expect(() => 1).not.toBeOfType<() => string>();
            // @ts-expect-error: The types are the same
            expect(() => {}).not.toBeOfType<() => void>();
            // @ts-expect-error: The types are the same
            expect((a: number) => a + 1).not.toBeOfType<(a: number) => number>();
        });
    });

    describe("toBeTruthy", () => {
        it("handles undefined", () => {
            passes(() => expect(undefined).not.toBeTruthy());
        });

        it("handles null", () => {
            passes(() => expect(null).not.toBeTruthy());
        });

        it("handles booleans", () => {
            fails(() => expect(true).not.toBeTruthy());
            passes(() => expect(false).not.toBeTruthy());
        });

        it("handles numbers", () => {
            passes(() => expect(0).not.toBeTruthy());
            fails(() => expect(1).not.toBeTruthy());
        });

        it("handles strings", () => {
            passes(() => expect("").not.toBeTruthy());
            fails(() => expect("abc").not.toBeTruthy());
        });

        it("handles regular expressions", () => {
            fails(() => expect(/a.*b/i).not.toBeTruthy());
        });

        it("handles objects", () => {
            fails(() => expect({ a: 1 }).not.toBeTruthy());
        });

        it("handles promises", () => {
            fails(() => expect(Promise.resolve(true) as Promise<boolean> | boolean).not.toBeTruthy());
        });

        it("handles parameterless functions", () => {
            fails(() => expect((() => 1) as (() => void) | boolean).not.toBeTruthy());
        });

        it("handles functions with parameters", () => {
            fails(() => expect((a: number) => a + 1).not.toBeTruthy());
        });

        it("is typed correctly", () => {
            expect(0 as number | string).not.toBeTruthy();
            expect(0 as number | Promise<number>).not.toBeTruthy();
            // @ts-expect-error: toBeTruthy is hidden for promises (they are always truthy)
            fails(() => expect(Promise.resolve(1)).not.toBeTruthy());
            // @ts-expect-error: toBeTruthy is hidden for parameterless functions (they are always truthy)
            fails(() => expect(() => {}).not.toBeTruthy());
        });
    });

    describe("toEqual", () => {
        it("handles undefined", () => {
            fails(() => expect(undefined).not.toEqual(undefined));
            passes(() => expect(undefined as undefined | null).not.toEqual(null));
        });

        it("handles null", () => {
            fails(() => expect(null).not.toEqual(null));
            passes(() => expect(null as undefined | null).not.toEqual(undefined));
        });

        it("handles booleans", () => {
            fails(() => expect(true).not.toEqual(true));
            passes(() => expect(false).not.toEqual(true));
        });

        it("handles numbers", () => {
            fails(() => expect(1).not.toEqual(1));
            passes(() => expect(1).not.toEqual(2));
        });

        it("handles strings", () => {
            fails(() => expect("abc").not.toEqual("abc"));
            passes(() => expect("abc").not.toEqual("123"));
        });

        it("handles regular expressions", () => {
            fails(() => expect(/a.b/i).not.toEqual(/a.b/i));
            passes(() => expect(/a.b/i).not.toEqual(/1.2/i));
        });

        it("handles objects", () => {
            fails(() => expect({ a: [1, 2] }).not.toEqual({ a: [1, 2] }));
            passes(() => expect({ a: [1, 2] }).not.toEqual({ a: [1, 3] }));
        });

        it("handles promises", () => {
            const promise: unknown = Promise.resolve(1);
            fails(() => expect(promise).not.toEqual(promise)); // node:assert can't compare promises
            fails(() => expect(promise).not.toEqual(1));
            fails(() => expect(1 as unknown).not.toEqual(promise));
        });

        it("handles parameterless functions", () => {
            const fn: unknown = () => 1;
            fails(() => expect(fn).not.toEqual(fn)); // node:assert can't compare functions
            fails(() => expect(fn).not.toEqual(() => 2));
            fails(() => expect(fn).not.toEqual(1));
            fails(() => expect(1 as unknown).not.toEqual(fn));
        });

        it("handles functions with parameters", () => {
            const fn: unknown = (a: number) => a + 1;
            fails(() => expect(fn).not.toEqual(fn)); // node:assert can't compare functions
            fails(() => expect(fn).not.toEqual(() => "abc"));
            fails(() => expect(fn).not.toEqual(1));
            fails(() => expect(1 as unknown).not.toEqual(fn));
        });

        it("is typed correctly", () => {
            expect(1 as number | string).not.toEqual(2 as number | string);
            // @ts-expect-error: The expected value's type must match the type actual value
            expect(1).not.toEqual("2");
            // @ts-expect-error: The expected value's type must match the nested types of the actual value
            expect({ a: 1 }).not.toEqual({ a: "1" });
            // @ts-expect-error: The expected value's type can't be bigger than the actual value's type
            expect(1 as number | string).not.toEqual(2 as number | string | boolean);
            expect(1 as number | Promise<number>).not.toEqual(2);
            // @ts-expect-error: The expected value can't be a promise
            fails(() => expect(1 as number | Promise<number>).not.toEqual(Promise.resolve(1)));
            // @ts-expect-error: The expected value can't be a function
            fails(() => expect(1 as number | (() => void)).not.toEqual(() => {}));
        });
    });

    describe("toMatch", () => {
        it("fails when passing undefined", () => {
            fails(() => expect(undefined).not.toMatch(/.*/));
        });

        it("fails when passing null", () => {
            fails(() => expect(null).not.toMatch(/.*/));
        });

        it("fails when passing a boolean", () => {
            fails(() => expect(true).not.toMatch(/.*/));
        });

        it("fails when passing a number", () => {
            fails(() => expect(1).not.toMatch(/.*/));
        });

        it("fails when passing a bigint", () => {
            fails(() => expect(1n).not.toMatch(/.*/));
        });

        it("fails when passing a symbol", () => {
            fails(() => expect(Symbol("...")).not.toMatch(/.*/));
        });

        it("fails when passing an object", () => {
            fails(() => expect({ key: "value" }).not.toMatch(/.*/));
        });

        it("fails when passing a function", () => {
            // @ts-ignore-error
            fails(() => expect(() => 1).not.toMatch(/.*/));
        });

        it("passes when passing a string that doesn't match", () => {
            passes(() => expect("this text").not.toMatch(/does not match/));
        });

        it("fails when passing a string that matches", () => {
            fails(() => expect("some random text content").not.toMatch(/random.*content$/));
        });
    });

    describe("toReject", () => {
        it("handles promises", async () => {
            await rejects(() => expect(rejected()).not.toReject());
            await resolves(() => expect(resolved(0)).not.toReject());
        });

        it("is typed correctly", async () => {
            // @ts-expect-error: toReject is hidden and throws an exception (undefined can't reject)
            await rejects(expect(undefined).not.toReject());
            // @ts-expect-error: toReject is hidden and throws an exception (null can't reject)
            await rejects(expect(null).not.toReject());
            // @ts-expect-error: toReject is hidden and throws an exception (boolean values can't reject)
            await rejects(expect(false).not.toReject());
            // @ts-expect-error: toReject is hidden and throws an exception (numbers can't reject)
            await rejects(expect(0).not.toReject());
            // @ts-expect-error: toReject is hidden and throws an exception (strings can't reject)
            await rejects(expect("").not.toReject());
            // @ts-expect-error: toReject is hidden and throws an exception (regular expressions can't reject)
            await rejects(expect(/a.b/i).not.toReject());
            // @ts-expect-error: toReject is hidden and throws an exception (objects can't reject)
            await rejects(expect({ a: 1 }).not.toReject());
            // @ts-expect-error: toReject is hidden and throws an exception (functions can't reject)
            await rejects(expect(() => {}).not.toReject());
            // @ts-expect-error: toReject is hidden and throws an exception (functions can't reject)
            await rejects(expect((a: number) => a + 1).not.toReject());
            // @ts-expect-error: toReject is hidden (the actual value might not be a promise)
            await resolves(expect(resolved("") as Promise<void> | number).not.toReject());
        });
    });

    describe("toThrow", () => {
        it("handles functions", () => {
            passes(() => expect(() => {}).not.toThrow());
            fails(() => expect(errorFn()).not.toThrow());
        });

        it("is typed correctly", () => {
            // @ts-expect-error: toThrow is hidden and throws an exception (undefined can't throw)
            fails(() => expect(undefined).not.toThrow());
            // @ts-expect-error: toThrow is hidden and throws an exception (null can't throw)
            fails(() => expect(null).not.toThrow());
            // @ts-expect-error: toThrow is hidden and throws an exception (boolean values can't throw)
            fails(() => expect(false).not.toThrow());
            // @ts-expect-error: toThrow is hidden and throws an exception (numbers can't throw)
            fails(() => expect(0).not.toThrow());
            // @ts-expect-error: toThrow is hidden and throws an exception (strings can't throw)
            fails(() => expect("").not.toThrow());
            // @ts-expect-error: toThrow is hidden and throws an exception (regular expressions can't throw)
            fails(() => expect(/a.b/i).not.toThrow());
            // @ts-expect-error: toThrow is hidden and throws an exception (objects can't throw)
            fails(() => expect({ a: 1 }).not.toThrow());
            // @ts-expect-error: toThrow is hidden and throws an exception (promises can't throw)
            fails(() => expect(Promise.resolve(1)).not.toThrow());
            // @ts-expect-error: toThrow is hidden (functions with parameters can't be executed)
            passes(() => expect((a: number) => a + 1).not.toThrow());
            // @ts-expect-error: toThrow is hidden (the actual value might not be a function)
            passes(() => expect((() => {}) as (() => void) | number).not.toThrow());
        });
    });
});
