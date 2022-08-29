import { ValueOrReadonlyArray } from "../../../data/utils/types";
import { unify } from "../../../data/utils/unify";
import { TestCase, UninitializedTestSuite } from "./test-suite";
import { testSuiteBuilderStack } from "./test-suite-builder";

/**---------------------------------------------------------------------------------------------------------------------
 * Define a test suite
 *
 * @param   name Test suite name/description
 * @param   implementation A callback to populate the test suite with children and hooks (can be async)
 *--------------------------------------------------------------------------------------------------------------------*/

export function testSuite(name: ValueOrReadonlyArray<string>, implementation: () => unknown) {
    const parent = testSuiteBuilderStack.peek();
    parent.children.push(new UninitializedTestSuite(parent.qualifiedName, unify.toReadonlyArray(name), implementation));
}

/**---------------------------------------------------------------------------------------------------------------------
 * Define a test case
 *
 * @param   name Test case name/description
 * @param   implementation A function that runs the test steps (can be async)
 *--------------------------------------------------------------------------------------------------------------------*/

export function testCase(name: ValueOrReadonlyArray<string>, implementation: () => unknown) {
    const parent = testSuiteBuilderStack.peek();
    parent.children.push(new TestCase(parent.qualifiedName, unify.toReadonlyArray(name), implementation));
}

/**---------------------------------------------------------------------------------------------------------------------
 * Add a "before-all" action to run once before running all the test cases in the suite
 *
 * @param   action The code to run (can be async)
 *--------------------------------------------------------------------------------------------------------------------*/

export function beforeAll(action: () => unknown) {
    testSuiteBuilderStack.peek().beforeAll.push(action);
}

/**---------------------------------------------------------------------------------------------------------------------
 * Add an "after-all" action to run once after running all the test cases in the suite
 *
 * @param   action The code to run (can be async)
 *--------------------------------------------------------------------------------------------------------------------*/

export function afterAll(action: () => unknown) {
    testSuiteBuilderStack.peek().afterAll.push(action);
}

/**---------------------------------------------------------------------------------------------------------------------
 * Add a "before-each" action  to run before each and every test case in the suite
 *
 * @param   action The code to run (can be async)
 *--------------------------------------------------------------------------------------------------------------------*/

export function beforeEach(action: () => unknown) {
    testSuiteBuilderStack.peek().beforeEach.push(action);
}

/**---------------------------------------------------------------------------------------------------------------------
 * Add an "after-each" action Code to run after each and every test case in the suite
 *
 * @param   action The code to run (can be async)
 *--------------------------------------------------------------------------------------------------------------------*/

export function afterEach(action: () => unknown) {
    testSuiteBuilderStack.peek().afterEach.push(action);
}
