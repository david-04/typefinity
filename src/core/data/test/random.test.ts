import { mock } from "node:test";
import { expect } from "../../../test/lib/expect.js";
import * as testRunner from "../../../test/lib/test-runner.js";
import { afterEach, it } from "../../../test/lib/test-runner.js";
import {
    randomBoolean,
    randomFalsyValue,
    randomItem,
    randomNumber,
    randomNumberWithPrefix,
    randomTruthyValue,
} from "../random.js";

/**---------------------------------------------------------------------------------------------------------------------
 * Utilities
 *--------------------------------------------------------------------------------------------------------------------*/

function createTestFunction(functionName: string) {
    return <P extends ReadonlyArray<unknown>, R>(
        fn: (...params: P) => R,
        ...testData: ReadonlyArray<{ readonly input: P; readonly expected: ReadonlyArray<R> }>
    ) => {
        testData.forEach(({ input, expected: expectedReturnValues }) => {
            expectedReturnValues.forEach((expected, index) => {
                const params = input.map(parameter => JSON.stringify(parameter)).join(", ");
                const randomNumber = ((1 - Number.EPSILON) * index) / Math.max(1, expectedReturnValues.length - 1);
                it(`${functionName}(${params}) returns ${expected} when Math.random() is ${randomNumber}`, () => {
                    mockMathRandom(randomNumber);
                    expect(fn(...input) as unknown).toEqual(expected);
                });
            });
        });
    };
}

const describe = (functionName: string, callback: (test: ReturnType<typeof createTestFunction>) => void) => {
    testRunner.describe(functionName, () => callback(createTestFunction(functionName)));
};

const mockMathRandom = (value: number) => mock.method(Math, "random", () => value);
afterEach(() => mock.restoreAll());

/**---------------------------------------------------------------------------------------------------------------------
 * Test cases
 *--------------------------------------------------------------------------------------------------------------------*/

describe("randomBoolean", test => {
    test(randomBoolean, { input: [], expected: [false, false, true, true] });
});

describe("randomItem", test => {
    const input = [1, 2, 3, 4, 5] as const;
    const expected = [1, 2, 3, 4, 5] as const;

    test((...items: ReadonlyArray<number>) => randomItem(items[0], items[1], ...items.slice(2)), {
        input: input,
        expected,
    });
    test((items: ReadonlyArray<number>) => randomItem(items), { input: [input], expected });
});

describe("randomFalsyValue", test => {
    test(randomFalsyValue, { input: [], expected: [undefined, null, false, 0, ""] });
});

describe("randomNumber", test => {
    test(() => randomNumber(), { input: [], expected: [10, 39, 69, 99] });
    test((min: number, max: number) => randomNumber(min, max), { input: [-10, 50], expected: [-10, 10, 30, 50] });
    test((options: randomNumber.Options) => randomNumber(options), {
        input: [{ min: -10, max: 50, decimalPlaces: 3 }],
        expected: [-10, 10.333, 30.667, 50],
    });
});

describe("randomNumberWithPrefix", test => {
    const prefix = randomItem("prefix-", "prefix.");
    const prefixed = (...numbers: ReadonlyArray<number>) => numbers.map(number => `${prefix}${number}`);

    test((prefix: string) => randomNumberWithPrefix(prefix), {
        input: [prefix],
        expected: prefixed(10, 39, 69, 99),
    });
    test((prefix: string, min: number, max: number) => randomNumberWithPrefix(prefix, min, max), {
        input: [prefix, -10, 50],
        expected: prefixed(-10, 10, 30, 50),
    });
    test((options: randomNumberWithPrefix.Options) => randomNumberWithPrefix(options), {
        input: [{ prefix, min: -10, max: 50, decimalPlaces: 3 }],
        expected: prefixed(-10, 10.333, 30.667, 50),
    });
});

describe("randomTruthyValue", test => {
    test(randomTruthyValue, {
        input: [],
        expected: [true, 0.1, 10, "abc", " ", /regexp/, { key: "value" }, ["array"]],
    });
});
