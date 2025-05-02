import { equal } from "node:assert";
import { after, before, describe, it } from "node:test";
import * as typefinity from "../before-hooks.js";

describe("beforeAll", () => {
    let invocations = 0;
    typefinity.beforeAll(() => invocations++);
    before(() => equal(invocations, 1));
    for (let index = 0; index < 2; index++) {
        it("executes the callback once before all tests", () => equal(invocations, 1));
    }
    after(() => equal(invocations, 1));
});

describe("beforeEach", () => {
    const invocations = { beforeEach: 0, it: 0 };
    typefinity.beforeEach(() => invocations.beforeEach++);
    before(() => equal(invocations.beforeEach, 0));
    for (let index = 0; index < 2; index++) {
        it("executes the callback before each tests", () => equal(invocations.beforeEach, ++invocations.it));
    }
    after(() => equal(invocations.beforeEach, invocations.it));
});
