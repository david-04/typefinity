import { afterEach, describe, it, mock } from "node:test";
import { expect } from "../../../test/lib/expect.js";
import * as random from "../random.js";

const mockMathRandom = (value: number) => mock.method(Math, "random", () => value);
afterEach(() => mock.restoreAll());

function test<FN extends keyof typeof random>(
    functionName: FN,
    ...testData: ReadonlyArray<{
        readonly input: Parameters<(typeof random)[FN]>;
        readonly expected: ReadonlyArray<ReturnType<(typeof random)[FN]>>;
    }>
) {
    describe(functionName, () => {
        testData.forEach(({ input: parameters, expected: expectedReturnValues }) => {
            expectedReturnValues.forEach((expected, index) => {
                const params = parameters.length
                    ? `(${parameters.map(parameter => JSON.stringify(parameter)).join(", ")})`
                    : "";
                const randomNumber = ((1 - Number.EPSILON) * index) / Math.max(1, expectedReturnValues.length - 1);
                it(`${functionName}${params} returns ${expected} when Math.random() returns ${randomNumber}`, () => {
                    mockMathRandom(randomNumber);
                    expect((random[functionName] as Function)(...parameters) as unknown).toEqual(expected);
                });
            });
        });
    });
}

test("randomBoolean", { input: [], expected: [false, false, true, true] });

test("randomItem", { input: [[1, 2, 3, 4, 5]], expected: [1, 2, 3, 4, 5] });

test("randomFalsyValue", { input: [], expected: [undefined, null, false, 0, ""] });

test(
    "randomNumber",
    { input: [], expected: [0, 333, 666, 999] },
    { input: [300], expected: [300, 533, 766, 999] },
    { input: [500, 600], expected: [500, 533, 567, 600] }
);

test(
    "randomNumberWithPrefix",
    { input: ["prefix-"], expected: [0, 333, 666, 999].map(number => `prefix-${number}`) },
    { input: ["prefix-", 300], expected: [300, 533, 766, 999].map(number => `prefix-${number}`) },
    { input: ["prefix-", 500, 600], expected: [500, 533, 567, 600].map(number => `prefix-${number}`) }
);

test("randomTruthyValue", { input: [], expected: [true, 10, "abc", /regexp/, { key: "value" }] });
