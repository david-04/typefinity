import { equal } from "node:assert";
import { describe, it } from "node:test";
import * as typefinity from "../describe.js";

describe("describe", () => {
    let invocations = 0;
    for (let index = 0; index < 2; index++) {
        typefinity.describe("defines a test suite", () => invocations++);
    }
    it("executes the callback", () => {
        equal(invocations, 2);
    });
});
