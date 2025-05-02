import { equal } from "node:assert";
import { after, describe, it } from "node:test";
import * as typefinity from "../it.js";

describe("it", () => {
    let invocations = 0;
    for (let index = 0; index < 2; index++) {
        typefinity.it("executes the callback when running the test", () => {
            equal(invocations, index);
            invocations++;
        });
    }
    it("this test case is only here to suppress linter warnings", () => {});
    after(() => equal(invocations, 2));
});
