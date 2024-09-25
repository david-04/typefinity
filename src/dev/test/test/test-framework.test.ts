import * as assert from "node:assert";
import { describe, it } from "node:test";
import * as testFramework from "../test-framework.js";

/**---------------------------------------------------------------------------------------------------------------------
 * Test data
 *--------------------------------------------------------------------------------------------------------------------*/

const log = {
    hooks: new Array<string>(),
    skip: new Array<string>(),
    only: new Array<string>(),
};

const AFTER_ALL_1 = "afterAll-1";
const AFTER_ALL_2 = "afterAll-2";
const AFTER_EACH_1 = "afterEach-1";
const AFTER_EACH_2 = "afterEach-2";
const BEFORE_ALL_1 = "beforeAll-1";
const BEFORE_ALL_2 = "beforeAll-2";
const BEFORE_EACH_1 = "beforeEach-1";
const BEFORE_EACH_2 = "beforeEach-2";
const IT_1 = "it-1";
const IT_2 = "it-2";
const IT_3 = "it-3";

/**---------------------------------------------------------------------------------------------------------------------
 * Before and after hooks
 *--------------------------------------------------------------------------------------------------------------------*/

testFramework.describe("hooks [setup]", () => {
    testFramework.beforeEach(() => log.hooks.push(BEFORE_EACH_1));
    testFramework.beforeAll(() => log.hooks.push(BEFORE_ALL_1));
    testFramework.afterAll(() => log.hooks.push(AFTER_ALL_1));
    testFramework.afterEach(() => log.hooks.push(AFTER_EACH_1));

    testFramework.it("1", () => log.hooks.push(IT_1));
    testFramework.it("2", () => log.hooks.push(IT_2));

    testFramework.afterEach(() => log.hooks.push(AFTER_EACH_2));
    testFramework.afterAll(() => log.hooks.push(AFTER_ALL_2));
    testFramework.beforeAll(() => log.hooks.push(BEFORE_ALL_2));
    testFramework.beforeEach(() => log.hooks.push(BEFORE_EACH_2));
});

describe("hooks [verification]", () => {
    it("runs all test cases and hooks", () => {
        assert.deepStrictEqual(log.hooks, [
            // setup
            BEFORE_ALL_1,
            BEFORE_ALL_2,
            // test 1
            BEFORE_EACH_1,
            BEFORE_EACH_2,
            IT_1,
            AFTER_EACH_1,
            AFTER_EACH_2,
            // test 2
            BEFORE_EACH_1,
            BEFORE_EACH_2,
            IT_2,
            AFTER_EACH_1,
            AFTER_EACH_2,
            // teardown
            AFTER_ALL_1,
            AFTER_ALL_2,
        ]);
    });
});

/**---------------------------------------------------------------------------------------------------------------------
 * describe.skip and it.skip
 *--------------------------------------------------------------------------------------------------------------------*/

testFramework.describe("skip [setup]", () => {
    testFramework.describe.skip("skipped", () => {
        testFramework.it("not skipped", () => log.skip.push(IT_1));
    });
    testFramework.describe("not skipped", () => {
        testFramework.it.skip("skipped", () => log.skip.push(IT_2));
        testFramework.it("not skipped", () => log.skip.push(IT_3));
    });
});

describe("skip [verification]", () => {
    it("ignores describe and it blocks that are marked as skip", () => {
        assert.deepStrictEqual(log.skip, [IT_3]);
    });
});
