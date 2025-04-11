import { expect } from "../../../test/lib/expect.js";
import { describe, it } from "../../../test/lib/test-runner.js";
import { isBoolean, isFalsy, isNotBoolean, isNotNumber, isNumber, isTruthy } from "../type-guards.js";

type AllTypes = undefined | null | boolean | number | bigint | string | symbol | object | Function;
type NotBoolean = Exclude<AllTypes, boolean>;
type NotNumber = Exclude<AllTypes, number>;

describe("isBoolean", () => {
    itReturnsTrue(isBoolean, [true, false]);

    itReturnsFalse(isBoolean, [
        undefined,
        null,
        0,
        1,
        BigInt("1"),
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

describe("isFalsy", () => {
    itReturnsTrue(isFalsy, [undefined, null, false, 0, BigInt("0"), ""]);

    itReturnsFalse(isFalsy, [true, 1, " ", Symbol(""), /regexp/, BigInt("1")]);

    it("is typed correctly", () => {
        const value1 = 0 as undefined | null | boolean | 0 | 1 | bigint | "" | " " | symbol | object | Function;
        isFalsy(value1)
            ? expect(value1).toBeOfType<undefined | null | false | 0 | bigint | "">()
            : expect(value1).toBeOfType<true | 1 | " " | symbol | object | Function>();

        const value2 = undefined as undefined | null | number | bigint | string | symbol | object | Function;
        isFalsy(value2)
            ? expect(value2).toBeOfType<undefined | null | 0 | bigint | "">()
            : expect(value2).toBeOfType<number | string | symbol | object | Function>();

        const value3 = 1 as number | boolean | object;
        isFalsy(value3) ? expect(value3).toBeOfType<0 | false>() : expect(value3).toBeOfType<number | true | object>();

        const value4 = undefined as unknown;
        isFalsy(value4)
            ? expect(value4).toBeOfType<undefined | null | false | 0 | bigint | "">()
            : expect(value4).toBeOfType<{}>();

        const value5 = JSON.parse("0");
        isFalsy(value5)
            ? expect(value5).toBeOfType<undefined | null | false | 0 | bigint | "">()
            : expect(value5).toBeOfType<any>();
    });
});

describe("isNotBoolean", () => {
    itReturnsTrue(isNotBoolean, [
        undefined,
        null,
        0,
        1,
        BigInt("0"),
        BigInt("1"),
        "",
        "abc",
        Symbol(""),
        /regexp/,
        { key: "value" },
        () => {},
    ]);

    itReturnsFalse(isNotBoolean, [true, false]);

    it("is typed correctly", () => {
        const value1 = 0 as AllTypes;
        isNotBoolean(value1) ? expect(value1).toBeOfType<NotBoolean>() : expect(value1).toBeOfType<boolean>();

        const value2 = 0 as NotBoolean;
        isNotBoolean(value2) ? expect(value2).toBeOfType<NotBoolean>() : (value2 satisfies never);

        const value3 = true as true | NotBoolean;
        isNotBoolean(value3) ? expect(value3).toBeOfType<NotBoolean>() : expect(value3).toBeOfType<true>();

        const value4 = (_param: number) => 1;
        isNotBoolean(value4) ? expect(value4).toBeOfType<(a: number) => number>() : (value4 satisfies never);

        const value5 = true as true;
        isNotBoolean(value5) ? (value5 satisfies never) : expect(value5).toBeOfType<true>();

        const value6 = true as false;
        isNotBoolean(value6) ? (value6 satisfies never) : expect(value6).toBeOfType<false>();

        const value7 = true as boolean;
        isNotBoolean(value7) ? (value7 satisfies never) : expect(value7).toBeOfType<boolean>();

        // TypeScript limitation: As the "if" branch resolves to "unknown", the else branch will wrongly evaluate to
        // Exclude<unknown, unknown> = never
        const value8 = 0 as unknown;
        isNotBoolean(value8) ? expect(value8).toBeOfType<unknown>() : (value8 satisfies never);

        // same limitation as above
        const value9 = JSON.parse("0");
        isNotBoolean(value9) ? expect(value9).toBeOfType<any>() : (value9 satisfies never);
    });
});

describe("isNotNumber", () => {
    itReturnsTrue(isNotNumber, [
        undefined,
        null,
        true,
        false,
        BigInt("1"),
        "",
        "abc",
        Symbol(""),
        /regexp/,
        { key: "value" },
        () => {},
    ]);

    itReturnsFalse(isNotNumber, [1, -2.5, NaN, Infinity, -Infinity]);

    it("is typed correctly", () => {
        const value1 = 0 as AllTypes;
        isNotNumber(value1) ? expect(value1).toBeOfType<NotNumber>() : expect(value1).toBeOfType<number>();

        const value2 = "0" as NotNumber;
        isNotNumber(value2) ? expect(value2).toBeOfType<NotNumber>() : (value2 satisfies never);

        const value3 = 1 as 1 | NotNumber;
        isNotNumber(value3) ? expect(value3).toBeOfType<NotNumber>() : expect(value3).toBeOfType<1>();

        const value4 = (_param: number) => 1;
        isNotNumber(value4) ? expect(value4).toBeOfType<(a: number) => number>() : (value4 satisfies never);

        const value5 = 0 as 0;
        isNotNumber(value5) ? (value5 satisfies never) : expect(value5).toBeOfType<0>();

        const value6 = 1 as number;
        isNotNumber(value6) ? (value6 satisfies never) : expect(value6).toBeOfType<number>();

        // TypeScript limitation: As the "if" branch resolves to "unknown", the else branch will wrongly evaluate to
        // Exclude<unknown, unknown> = never
        const value7 = 0 as unknown;
        isNotNumber(value7) ? expect(value7).toBeOfType<unknown>() : (value7 satisfies never);

        // same limitation as above
        const value8 = JSON.parse("0");
        isNotNumber(value8) ? expect(value8).toBeOfType<any>() : (value8 satisfies never);
    });
});

describe("isNumber", () => {
    itReturnsTrue(isNumber, [1, -2.5, NaN, Infinity, -Infinity]);

    itReturnsFalse(isNumber, [
        undefined,
        null,
        true,
        false,
        BigInt("1"),
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

        const value2 = 1 as number | NotNumber;
        isNumber(value2) ? expect(value2).toBeOfType<number>() : expect(value2).toBeOfType<NotNumber>();

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

describe("isTruthy", () => {
    itReturnsTrue(isTruthy, [true, 1, " ", Symbol(""), /regexp/, { key: "value" }, () => {}]);

    itReturnsFalse(isTruthy, [undefined, null, false, 0, ""]);

    it("is typed correctly", () => {
        const value1 = 0 as undefined | null | true | false | 0 | 1 | "" | " " | symbol | object | Function;
        isTruthy(value1)
            ? expect(value1).toBeOfType<true | 1 | " " | symbol | object | Function>()
            : expect(value1).toBeOfType<undefined | null | false | 0 | "">();

        const value2 = true as boolean | string | bigint;
        isTruthy(value2) ? expect(value2).toBeOfType<true | string | bigint>() : expect(value2).toBeOfType<false>();

        const value3 = undefined as undefined | null | boolean | number | string | symbol | object | Function;
        isTruthy(value3)
            ? expect(value3).toBeOfType<true | number | string | symbol | object | Function>()
            : expect(value3).toBeOfType<undefined | null | false>();

        // TypeScript limitation: As the "if" branch resolves to "unknown", the else branch will wrongly evaluate to
        // Exclude<unknown, unknown> = never
        const value4 = 1 as unknown;
        isTruthy(value4) ? expect(value4).toBeOfType<unknown>() : (value4 satisfies never);

        // same limitation as above
        const value5 = JSON.parse("1");
        isTruthy(value5) ? expect(value5).toBeOfType<any>() : (value5 satisfies never);
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
