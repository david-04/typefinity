import { expect } from "../../../test/lib/expect.js";
import { describe, it } from "../../../test/lib/test-runner.js";
import { isBoolean, isNumber, isString } from "../type-guards.js";

type AllTypes = undefined | null | boolean | number | bigint | string | symbol | object | Function;
type NotBoolean = Exclude<AllTypes, boolean>;
type NotNumber = Exclude<AllTypes, number>;
type NotString = Exclude<AllTypes, string>;

describe("isBoolean", () => {
    itReturnsTrue(isBoolean, [true, false]);

    itReturnsFalse(isBoolean, [
        undefined,
        null,
        0,
        1,
        NaN,
        0n,
        1n,
        "",
        "abc",
        Symbol(""),
        /regexp/,
        { key: "value" },
        () => {},
    ]);

    it("is typed correctly", () => {
        const value1 = 0 as AllTypes;
        isBoolean(value1) ? expect(value1).toBeOfType<boolean>() : expect(value1).toBeOfType<NotBoolean>();

        const value2 = 0 as true | NotBoolean;
        isBoolean(value2) ? expect(value2).toBeOfType<true>() : expect(value2).toBeOfType<NotBoolean>();

        const value3 = 0 as false | NotBoolean;
        isBoolean(value3) ? expect(value3).toBeOfType<false>() : expect(value3).toBeOfType<NotBoolean>();

        const value4 = 1 as NotBoolean;
        isBoolean(value4) ? (value4 satisfies never) : expect(value4).toBeOfType<NotBoolean>();

        const value5 = JSON.parse("0");
        isBoolean(value5) ? expect(value5).toBeOfType<boolean>() : expect(value5).toBeOfType<any>();

        const value6 = 0 as unknown;
        isBoolean(value6) ? expect(value6).toBeOfType<boolean>() : expect(value6).toBeOfType<unknown>();
    });
});

describe("isNumber", () => {
    itReturnsTrue(isNumber, [1, -2.5, NaN, Infinity, -Infinity]);

    itReturnsFalse(isNumber, [
        undefined,
        null,
        true,
        false,
        0n,
        1n,
        "",
        "abc",
        Symbol(""),
        /regexp/,
        { key: "value" },
        () => {},
    ]);

    it("is typed correctly", () => {
        const value1 = 0 as AllTypes;
        isNumber(value1) ? expect(value1).toBeOfType<number>() : expect(value1).toBeOfType<NotNumber>();

        const value2 = 0 as 0 | NotNumber;
        isNumber(value2) ? expect(value2).toBeOfType<0>() : expect(value2).toBeOfType<NotNumber>();

        const value3 = 0 as 0 | 1 | NotNumber;
        isNumber(value3) ? expect(value3).toBeOfType<0 | 1>() : expect(value3).toBeOfType<NotNumber>();

        const value4 = "" as NotNumber;
        isNumber(value4) ? (value4 satisfies never) : expect(value4).toBeOfType<NotNumber>();

        const value5 = JSON.parse("0");
        isNumber(value5) ? expect(value5).toBeOfType<number>() : expect(value5).toBeOfType<any>();

        const value6 = 0 as unknown;
        isNumber(value6) ? expect(value6).toBeOfType<number>() : expect(value6).toBeOfType<unknown>();
    });
});

describe("isString", () => {
    itReturnsTrue(isString, ["", " ", String("")]);

    itReturnsFalse(isString, [
        undefined,
        null,
        true,
        false,
        0,
        1,
        NaN,
        0n,
        1n,
        Symbol(""),
        /regexp/,
        { key: "value" },
        () => {},
    ]);

    it("is typed correctly", () => {
        const value1 = 0 as AllTypes;
        isString(value1) ? expect(value1).toBeOfType<string>() : expect(value1).toBeOfType<NotString>();

        const value2 = "" as string | NotString;
        isString(value2) ? expect(value2).toBeOfType<string>() : expect(value2).toBeOfType<NotString>();

        const value3 = "a" as "a" | "b" | NotString;
        isString(value3) ? expect(value3).toBeOfType<"a" | "b">() : expect(value3).toBeOfType<NotString>();

        const value4 = 0 as NotString;
        isString(value4) ? (value4 satisfies never) : expect(value4).toBeOfType<NotString>();

        const value5 = JSON.parse("0");
        isString(value5) ? expect(value5).toBeOfType<string>() : expect(value5).toBeOfType<any>();

        const value6 = 0 as unknown;
        isString(value6) ? expect(value6).toBeOfType<string>() : expect(value6).toBeOfType<unknown>();
    });
});

function itReturnsTrue(fn: (value: unknown) => boolean, values: ReadonlyArray<unknown>) {
    values.forEach(value => it(`returns true when passing ${format(value)}`, () => expect(fn(value)).toBe(true)));
}

function itReturnsFalse(fn: (value: unknown) => boolean, values: ReadonlyArray<unknown>) {
    values.forEach(value => it(`returns false when passing ${format(value)}`, () => expect(fn(value)).toBe(false)));
}

function format(value: unknown) {
    switch (typeof value) {
        case "bigint":
            return `BigInt(${value.toString()})`;
        case "symbol":
            return `symbol`;
        case "function":
            return "function";
        default:
            return `${value}` || JSON.stringify(value);
    }
}
