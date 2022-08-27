import { unify } from "../../data/utils/unify";
import { batch } from "../../functions/batch";
import { TestCase, TestSuite } from "./test-suite";

/**---------------------------------------------------------------------------------------------------------------------
 * The result of running a test case
 *--------------------------------------------------------------------------------------------------------------------*/

export interface TestResult {
    /** Name of the test case (including the test suite name) */
    name: string[];
    /** The error if the test has failed (undefined if the test has passed) */
    error?: string;
}

/**---------------------------------------------------------------------------------------------------------------------
 * Run all tests in the given test suite
 *
 * @param testSuite The test suite to run
 * @return An array of the test results
 *--------------------------------------------------------------------------------------------------------------------*/

export async function runTestSuite(testSuite: TestSuite) {
    return runTestSuiteRecursively(testSuite, [], []);
}

/**---------------------------------------------------------------------------------------------------------------------
 * Recursively run all tests in the given test suite
 *--------------------------------------------------------------------------------------------------------------------*/

async function runTestSuiteRecursively(
    testSuite: TestSuite,
    parentBeforeEach: ReadonlyArray<() => unknown>,
    parentAfterEach: ReadonlyArray<() => unknown>
): Promise<TestResult[]> {
    await batch.runAndAwaitSequentially(testSuite.beforeAll);
    const beforeEach = [...parentBeforeEach, ...testSuite.beforeEach];
    const afterEach = [...parentAfterEach, ...testSuite.afterEach];
    const result = new Array<TestResult>();
    for (const testCase of testSuite.testCases) {
        result.push(await runTestWithBeforeAndAfterActions(testCase, beforeEach, afterEach));
    }
    for (const childSuite of testSuite.testSuites) {
        result.push(...await runTestSuiteRecursively(childSuite, beforeEach, afterEach));
    }
    await batch.runAndAwaitSequentially(testSuite.afterAll);
    return result;
}

/**---------------------------------------------------------------------------------------------------------------------
 * Run a single test case (including beforeEach and afterEach actions)
 *--------------------------------------------------------------------------------------------------------------------*/

async function runTestWithBeforeAndAfterActions(
    testCase: TestCase,
    beforeEach: ReadonlyArray<() => unknown>,
    afterEach: ReadonlyArray<() => unknown>
) {
    await batch.runAndAwaitSequentially(beforeEach);
    const result = await runTest(testCase);
    await batch.runAndAwaitSequentially(afterEach);
    return result;
}

/**---------------------------------------------------------------------------------------------------------------------
 * Run a single test case and return the result
 *--------------------------------------------------------------------------------------------------------------------*/

async function runTest(testCase: TestCase) {
    const name = testCase.name.map(word => word.trim()).filter(word => word);
    try {
        await unify.toPromise(testCase.run());
        process.stdout.write(".");
        return { name };
    } catch (error) {
        process.stdout.write("F");
        if (error instanceof Error) {
            return { name, error: error.stack?.trim() || error.message.trim() || "Unknown error" };
        } else {
            return { name, error: `${error}`.trim() || "Unknown error" };
        }
    }
}
