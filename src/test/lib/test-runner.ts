import * as nodeTest from "node:test";

/**---------------------------------------------------------------------------------------------------------------------
 * Perform the given action at the end of the test suite (after running all tests)
 *
 * @param action The action to perform
 *--------------------------------------------------------------------------------------------------------------------*/

export function afterAll(action: () => unknown): void {
    nodeTest.after(action);
}

/**---------------------------------------------------------------------------------------------------------------------
 * Perform the given action after each test case
 *
 * @param action The action to perform
 *--------------------------------------------------------------------------------------------------------------------*/

export function afterEach(action: () => unknown): void {
    nodeTest.afterEach(action);
}

/**---------------------------------------------------------------------------------------------------------------------
 * Perform the given action at the beginning of the test suite (before running any tests)
 *
 * @param action The action to perform
 *--------------------------------------------------------------------------------------------------------------------*/

export function beforeAll(action: () => unknown): void {
    nodeTest.before(action);
}

/**---------------------------------------------------------------------------------------------------------------------
 * Perform the given action before each test case
 *
 * @param action The action to perform
 *--------------------------------------------------------------------------------------------------------------------*/

export function beforeEach(action: () => unknown): void {
    nodeTest.beforeEach(action);
}

/**---------------------------------------------------------------------------------------------------------------------
 * Define a test suite
 *
 * @param description The test suite's description
 * @param implementation Implementation of the test suite
 *--------------------------------------------------------------------------------------------------------------------*/

export function describe(description: string, implementation: () => unknown): void {
    nodeTest.describe(description, filterReturnValue(implementation));
}

/** @mergeModuleWith describe */
export namespace describe {
    /**-----------------------------------------------------------------------------------------------------------------
     * Define a test suite but exclude it from test runs
     *
     * @param description The test suite's description
     * @param implementation Implementation of the test suite
     *----------------------------------------------------------------------------------------------------------------*/

    export function skip(description: string, implementation: () => unknown): void {
        nodeTest.describe(description, { skip: true }, filterReturnValue(implementation));
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Define a test placeholder suite to be implemented later
     *
     * @param description The test suite's description
     * @param implementation Implementation of the test suite
     *----------------------------------------------------------------------------------------------------------------*/

    export function todo(description: string, implementation?: () => unknown): void {
        return describe(description, () => {
            it.todo("TODO", () => {});
            if (implementation) {
                implementation();
            }
        });
    }
}

/**---------------------------------------------------------------------------------------------------------------------
 * Define a test case
 *
 * @param description The test case's description
 * @param implementation Implementation of the test case
 *--------------------------------------------------------------------------------------------------------------------*/

export function it(description: string, implementation: () => unknown): void {
    nodeTest.it(description, filterReturnValue(implementation));
}

/** @mergeModuleWith it */
export namespace it {
    /**-----------------------------------------------------------------------------------------------------------------
     * Define a test case but exclude it from test runs
     *
     * @param description The test case's description
     * @param implementation Implementation of the test case
     *----------------------------------------------------------------------------------------------------------------*/

    export function skip(description: string, implementation: () => unknown): void {
        nodeTest.it(description, { skip: true }, filterReturnValue(implementation));
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Define a test case placeholder to be implemented later
     *
     * @param description The test case's description
     * @param implementation Implementation of the test case
     *----------------------------------------------------------------------------------------------------------------*/

    export function todo(description: string, implementation: () => unknown): void {
        nodeTest.it(description, { todo: true }, filterReturnValue(implementation));
    }
}

function filterReturnValue(callback: () => unknown): () => undefined | Promise<void> {
    return () => {
        const result = callback();
        return result instanceof Promise ? result : undefined;
    };
}
