import * as assert from "node:assert";
import { after, before, describe, it } from "node:test";
import * as testRunner from "../test-runner.js";

describe("afterAll", { plan: 1 }, () => {
    const invocations = { afterAll: 0 };
    testRunner.afterAll(() => invocations.afterAll++);
    before(() => assert.equal(invocations.afterAll, 0));
    for (let index = 0; index < 2; index++) {
        it("does not execute the callback before all tests have run", () => {
            assert.equal(invocations.afterAll, 0);
        });
    }
    after(() => assert.equal(invocations.afterAll, 1));
});

describe("afterEach", () => {
    const invocations = { afterEach: 0, it: 0 };
    testRunner.afterEach(() => invocations.afterEach++);
    before(() => assert.equal(invocations.afterEach, 0));
    for (let index = 0; index < 2; index++) {
        it("executes the callback before each test", () => {
            assert.equal(invocations.afterEach, invocations.it++);
        });
    }
    after(() => assert.equal(invocations.afterEach, invocations.it));
});

describe("beforeAll", () => {
    const invocations = { beforeAll: 0 };
    testRunner.beforeAll(() => invocations.beforeAll++);
    before(() => assert.equal(invocations.beforeAll, 1));
    for (let index = 0; index < 2; index++) {
        it("executes the callback once before all tests", () => {
            assert.equal(invocations.beforeAll, 1);
        });
    }
    after(() => assert.equal(invocations.beforeAll, 1));
});

describe("beforeEach", () => {
    const invocations = { beforeEach: 0, it: 0 };
    testRunner.beforeEach(() => invocations.beforeEach++);
    before(() => assert.equal(invocations.beforeEach, 0));
    for (let index = 0; index < 2; index++) {
        it("executes the callback before each tests", () => {
            assert.equal(invocations.beforeEach, ++invocations.it);
        });
    }
    after(() => assert.equal(invocations.beforeEach, invocations.it));
});

describe("describe", () => {
    const invocations = { describe: 0 };
    assert.equal(invocations.describe, 0);
    for (let index = 0; index < 2; index++) {
        testRunner.describe("defines a test suite", () => invocations.describe++);
    }
    assert.equal(invocations.describe, 2);
});

describe("it", () => {
    const invocations = { it: 0 };
    for (let index = 0; index < 2; index++) {
        testRunner.it("executes the callback when running the test", () => {
            assert.equal(invocations.it, index);
            invocations.it++;
        });
    }
    after(() => assert.equal(invocations.it, 2));
});
