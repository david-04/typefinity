import { expect } from "../../../test/lib/expect.js";
import { describe, it } from "../../../test/lib/test-runner.js";
import { isFalsy, isTruthy } from "../type-guards.js";

describe("isFalsy", () => {
    it("returns true when passing a falsy value", () => {
        expect(isFalsy(undefined)).toBe(true);
        expect(isFalsy(null)).toBe(true);
        expect(isFalsy(false)).toBe(true);
        expect(isFalsy(0)).toBe(true);
        expect(isFalsy("")).toBe(true);
    });

    it("returns false when passing a truthy value", () => {
        expect(isFalsy(true)).toBe(false);
        expect(isFalsy(1)).toBe(false);
        expect(isFalsy(" ")).toBe(false);
        expect(isFalsy(Symbol(""))).toBe(false);
        expect(isFalsy(/regexp/)).toBe(false);
    });

    it("is typed correctly", () => {
        const value1 = 0 as undefined | null | 0 | 1 | "" | " " | true | false | RegExp | Function;
        if (isFalsy(value1)) {
            expect(value1).toBeOfType<undefined | null | 0 | false | "">();
        }
        const value2 = undefined as undefined | null | string | RegExp | Function;
        if (isFalsy(value2)) {
            expect(value2).toBeOfType<undefined | null | "">();
        }
    });
});

describe("isTruthy", () => {
    it("returns true when passing a truthy value", () => {
        expect(isTruthy(true)).toBe(true);
        expect(isTruthy(1)).toBe(true);
        expect(isTruthy(" ")).toBe(true);
        expect(isTruthy(Symbol(""))).toBe(true);
        expect(isTruthy(/regexp/)).toBe(true);
    });

    it("returns false when passing a false value", () => {
        expect(isTruthy(undefined)).toBe(false);
        expect(isTruthy(null)).toBe(false);
        expect(isTruthy(false)).toBe(false);
        expect(isTruthy(0)).toBe(false);
        expect(isTruthy("")).toBe(false);
    });

    it("is typed correctly", () => {
        const value1 = 0 as undefined | null | 0 | 1 | "" | " " | true | false | RegExp | Function;
        if (isTruthy(value1)) {
            expect(value1).toBeOfType<1 | " " | true | RegExp | Function>();
        }
        const value2 = undefined as undefined | null | boolean | string | RegExp | Function;
        if (isTruthy(value2)) {
            expect(value2).toBeOfType<true | string | RegExp | Function>();
        }
    });
});
