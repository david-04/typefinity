import { afterEach, describe, it, mock } from "node:test";
import { expect } from "../../../test/lib/expect.js";
import * as random from "../random.js";

const MIN = 0;
const MAX = 1 - Number.EPSILON;

const mockMathRandom = (value: number) => mock.method(Math, "random", () => value);
afterEach(() => mock.restoreAll());

function test<FN extends keyof typeof random>(
    fn: FN,
    testData: ReadonlyArray<[Parameters<(typeof random)[FN]>, number, ReturnType<(typeof random)[FN]>]>
) {
    describe(`${fn}`, () => {
        for (const [parameters, mathRandom, expectedReturnValue] of testData) {
            const params = parameters.length ? `(${JSON.stringify(parameters)})` : "";
            it(`${fn}${params} returns ${expectedReturnValue} when Math.random() returns ${mathRandom}`, () => {
                mockMathRandom(mathRandom);
                expect((random[fn] as Function)(...parameters) as unknown).toEqual(expectedReturnValue);
            });
        }
    });
}

test("randomBoolean", [
    [[], MIN, false],
    [[], 0.4, false],
    [[], 0.5, true],
    [[], MAX, true],
]);

test("randomNumber", [
    [[], MIN, 0],
    [[], 0.49, 490],
    [[], 0.5, 500],
    [[], MAX, 999],
    [[300], MIN, 300],
    [[300], 0.49, 643],
    [[300], 0.5, 650],
    [[300], MAX, 999],
    [[10, 20], MIN, 10],
    [[10, 20], 0.45, 14],
    [[10, 20], 0.55, 16],
    [[10, 20], MAX, 20],
]);

test("randomNumberWithPrefix", [
    [["prefix-"], MIN, "prefix-0"],
    [["prefix-"], 0.49, "prefix-490"],
    [["prefix-"], 0.5, "prefix-500"],
    [["prefix-"], MAX, "prefix-999"],
    [["prefix-", 300], MIN, "prefix-300"],
    [["prefix-", 300], 0.49, "prefix-643"],
    [["prefix-", 300], 0.5, "prefix-650"],
    [["prefix-", 300], MAX, "prefix-999"],
    [["prefix-", 10, 20], MIN, "prefix-10"],
    [["prefix-", 10, 20], 0.45, "prefix-14"],
    [["prefix-", 10, 20], 0.55, "prefix-16"],
    [["prefix-", 10, 20], MAX, "prefix-20"],
]);

test("randomItem", [
    [[[1, 2, 3, 4, 5]], MIN, 1],
    [[[1, 2, 3, 4, 5]], 0.49, 3],
    [[[1, 2, 3, 4, 5]], 0.6, 4],
    [[[1, 2, 3, 4, 5]], MAX, 5],
]);
