import * as assert from "node:assert";
import { afterEach, describe, it, mock } from "node:test";
import { randomBoolean } from "../random.js";

const MIN = 0;
const MAX = 1 - Number.EPSILON;

const mockMathRandom = (value: number) => {
    mock.method(Math, "random", () => value);
};

afterEach(() => mock.restoreAll());

describe("randomBoolean", () => {
    const testRandomBoolean = (randomNumber: number, expectedResult: boolean) => {
        it(`returns ${expectedResult} when Math.random() returns ${randomNumber}`, () => {
            mockMathRandom(randomNumber);
            assert.strictEqual(randomBoolean(), expectedResult);
        });
    };

    testRandomBoolean(MIN, false);
    testRandomBoolean(0.49, false);
    testRandomBoolean(0.5, true);
    testRandomBoolean(MAX, true);
});
