import * as node from "node:test";

/**---------------------------------------------------------------------------------------------------------------------
 * Perform the given action at the beginning of the test suite (before running any tests)
 *
 * @param action The action to perform
 *--------------------------------------------------------------------------------------------------------------------*/

export function beforeAll(action: () => unknown): void {
    node.before(action);
}
/**---------------------------------------------------------------------------------------------------------------------
 * Perform the given action before each test case
 *
 * @param action The action to perform
 *--------------------------------------------------------------------------------------------------------------------*/

export function beforeEach(action: () => unknown): void {
    node.beforeEach(action);
}
