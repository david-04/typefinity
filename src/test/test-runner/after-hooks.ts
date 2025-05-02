import * as node from "node:test";

/**---------------------------------------------------------------------------------------------------------------------
 * Perform the given action at the end of the test suite (after running all tests)
 *
 * @param action The action to perform
 *--------------------------------------------------------------------------------------------------------------------*/

export function afterAll(action: () => unknown): void {
    node.after(action);
}

/**---------------------------------------------------------------------------------------------------------------------
 * Perform the given action after each test case
 *
 * @param action The action to perform
 *--------------------------------------------------------------------------------------------------------------------*/

export function afterEach(action: () => unknown): void {
    node.afterEach(action);
}
