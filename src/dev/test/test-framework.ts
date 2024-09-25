/**---------------------------------------------------------------------------------------------------------------------
 * Load the test framework
 *--------------------------------------------------------------------------------------------------------------------*/

const loadTestFramework = async () => {
    try {
        const { after, afterEach, before, beforeEach, describe, it } = await import("node:test");
        return { afterAll: after, afterEach, beforeAll: before, beforeEach, describe, it };
    } catch (error) {
        const fail = () => {
            throw error;
        };
        return {
            afterAll: fail,
            afterEach: fail,
            beforeAll: fail,
            beforeEach: fail,
            describe: fail,
            it: fail,
        };
    }
};

const testFramework = await loadTestFramework();

/**---------------------------------------------------------------------------------------------------------------------
 * Perform the given action at the end of the test suite (after running all tests)
 *
 * @param action The action to perform
 *--------------------------------------------------------------------------------------------------------------------*/

export function afterAll(action: () => unknown): void {
    testFramework.afterAll(action);
}

/**---------------------------------------------------------------------------------------------------------------------
 * Perform the given action after each test case
 *
 * @param action The action to perform
 *--------------------------------------------------------------------------------------------------------------------*/

export function afterEach(action: () => unknown): void {
    testFramework.afterEach(action);
}

/**---------------------------------------------------------------------------------------------------------------------
 * Perform the given action at the beginning of the test suite (before running any tests)
 *
 * @param action The action to perform
 *--------------------------------------------------------------------------------------------------------------------*/

export function beforeAll(action: () => unknown): void {
    testFramework.beforeAll(action);
}

/**---------------------------------------------------------------------------------------------------------------------
 * Perform the given action before each test case
 *
 * @param action The action to perform
 *--------------------------------------------------------------------------------------------------------------------*/

export function beforeEach(action: () => unknown): void {
    testFramework.beforeEach(action);
}

/**---------------------------------------------------------------------------------------------------------------------
 * Define a test suite
 *
 * @param description The test suite's description
 * @param implementation Implementation of the test suite
 *--------------------------------------------------------------------------------------------------------------------*/

export function describe(description: string, implementation: () => unknown): Promise<void> {
    return testFramework.describe(description, filterReturnValue(implementation));
}

export namespace describe {
    /**-----------------------------------------------------------------------------------------------------------------
     * Define a test suite but exclude it from test runs
     *
     * @param description The test suite's description
     * @param implementation Implementation of the test suite
     *----------------------------------------------------------------------------------------------------------------*/

    export function skip(name: string, implementation: () => unknown): Promise<void> {
        return testFramework.describe(name, { skip: true }, filterReturnValue(implementation));
    }
}

/**---------------------------------------------------------------------------------------------------------------------
 * Define a test case
 *
 * @param description The test case's description
 * @param implementation Implementation of the test case
 *--------------------------------------------------------------------------------------------------------------------*/

export function it(name: string, implementation: () => unknown): Promise<void> {
    return testFramework.it(name, filterReturnValue(implementation));
}

export namespace it {
    /**-----------------------------------------------------------------------------------------------------------------
     * Define a test case but exclude it from test runs
     *
     * @param description The test case's description
     * @param implementation Implementation of the test case
     *----------------------------------------------------------------------------------------------------------------*/
    export function skip(name: string, implementation: () => unknown): Promise<void> {
        return testFramework.it(name, { skip: true }, filterReturnValue(implementation));
    }
}

function filterReturnValue(callback: () => unknown): () => undefined | Promise<void> {
    return () => {
        const result = callback();
        return result instanceof Promise ? result : undefined;
    };
}
