import { equal } from "node:assert";
import { after, before, describe, it } from "node:test";
import * as typefinity from "../after-hooks.js";

describe("afterAll", { plan: 1 }, () => {
    let invocations = 0;
    typefinity.afterAll(() => invocations++);
    before(() => equal(invocations, 0));
    for (let index = 0; index < 2; index++) {
        it("does not execute the callback before all tests have run", () => {
            equal(invocations, 0);
        });
    }
    after(() => equal(invocations, 1));
});

describe("afterEach", () => {
    const invocations = { afterEach: 0, it: 0 };
    typefinity.afterEach(() => invocations.afterEach++);
    before(() => equal(invocations.afterEach, 0));
    for (let index = 0; index < 2; index++) {
        it("executes the callback before each test", () => {
            equal(invocations.afterEach, invocations.it++);
        });
    }
    after(() => equal(invocations.afterEach, invocations.it));
});
