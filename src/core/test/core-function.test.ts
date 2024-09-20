import * as assert from "node:assert";
import { describe, it } from "node:test";
import { divide, DivisionByZeroError } from "../core-function.js";

describe("calculateSum", () => {
    it("sums up two values", () => {
        assert.strictEqual(divide({ a: 5, b: 2 }), 2.5);
    });

    it("handles negative values", () => {
        assert.strictEqual(divide({ a: 1, b: -1 }), -1);
    });

    it("includes a descriptive error message", () => {
        assert.throws(() => divide({ a: 5, b: 0 }), new DivisionByZeroError(5));
    });
});
