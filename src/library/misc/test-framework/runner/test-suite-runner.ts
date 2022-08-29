import { unify } from "../../../data/utils/unify";
import { TestCase, TestSuite, UninitializedTestSuite } from "../definition/test-suite";

/**-----------------------------------------------------------------------------------------------------------------
 * Customization options for running a test suite
 *----------------------------------------------------------------------------------------------------------------*/

export interface TestSuiteRunOptions {

    /** A filter that selects all children that should run before the other ones */
    readonly firstPassFilter: (child: TestCase | UninitializedTestSuite) => boolean;

    /** A flag indicating if test cases and nested test suites should run in random order */
    readonly randomize: boolean;

    /** Callback that's invoked after a test case has passed */
    readonly onTestCasePassed: (name: ReadonlyArray<string>) => void;

    /** Callback that's invoked after a test case (or test suite or before/after/each/all hook) has failed */
    readonly onTestCaseFailed: (name: ReadonlyArray<string>, error: string) => void;
}

/**---------------------------------------------------------------------------------------------------------------------
 * The test result (might also be an error related to a before/after/each/all hook)
 *--------------------------------------------------------------------------------------------------------------------*/

export interface TestResult {

    /** Fully qualified name of the test case, test suite, or before/after/each/all hook */
    name: ReadonlyArray<string>;

    /** Error message if the test case, test suite, or before/after/each/all hook has failed */
    error?: string;
}

/**---------------------------------------------------------------------------------------------------------------------
 * Run all tests in the given test suite
 *
 * @param testSuite The test suite to run
 * @return An array of the test results
 *--------------------------------------------------------------------------------------------------------------------*/

export async function runTestSuite(
    testSuite: TestSuite,
    options: TestSuiteRunOptions,
    parentBeforeEach: ReadonlyArray<() => unknown>,
    parentAfterEach: ReadonlyArray<() => unknown>
) {
    const results = new Array<TestResult>();
    try {
        await runHooks("beforeAll", testSuite.beforeAll);
        results.push(...await runChildren(
            testSuite,
            options,
            [...parentBeforeEach, ...testSuite.beforeEach],
            [...parentAfterEach, ...testSuite.afterEach]
        ));
        await runHooks("afterAll", testSuite.beforeAll);
    } catch (error) {
        results.push({ name: testSuite.qualifiedName, error: formatError(error) });
    }
    return results;
}

/**---------------------------------------------------------------------------------------------------------------------
 * Run the given hooks sequentially (with awaits in between)
 *--------------------------------------------------------------------------------------------------------------------*/

async function runHooks(hookName: string, hooks: ReadonlyArray<() => unknown>) {
    try {
        for (const hook of hooks) {
            await unify.toPromise(hook());
        }
        return Promise.resolve();
    } catch (error) {
        return Promise.reject(formatError(error, `Encountered an error while running the ${hookName} hook(s)"}`));
    }
}

/**---------------------------------------------------------------------------------------------------------------------
 * Run the children within a test suite
 *--------------------------------------------------------------------------------------------------------------------*/

async function runChildren(
    testSuite: TestSuite,
    options: TestSuiteRunOptions,
    beforeEach: ReadonlyArray<() => unknown>,
    afterEach: ReadonlyArray<() => unknown>
) {
    const results = new Array<TestResult>();
    for (const child of getSortedChildren(testSuite, options)) {
        if (child instanceof UninitializedTestSuite) {
            results.push(...await initializeAndRunTestSuite(child, options, beforeEach, afterEach));
        } else {
            results.push(await runTestCase(child, options, beforeEach, afterEach));
        }
    }
    return results;
}

/**---------------------------------------------------------------------------------------------------------------------
 * Initialize/populate a test suite
 *--------------------------------------------------------------------------------------------------------------------*/

async function initializeAndRunTestSuite(
    testSuite: UninitializedTestSuite,
    options: TestSuiteRunOptions,
    beforeEach: ReadonlyArray<() => unknown>,
    afterEach: ReadonlyArray<() => unknown>
) {
    try {
        return await runTestSuite(await testSuite.load(), options, beforeEach, afterEach);
    } catch (error) {
        return [{
            name: testSuite.qualifiedName,
            error: formatError(error, "Encountered an error while initializing the test suite")
        }];
    }
}


/**---------------------------------------------------------------------------------------------------------------------
 * Get a test suite's children in the order in which they are to be run
 *--------------------------------------------------------------------------------------------------------------------*/

function getSortedChildren(testSuite: TestSuite, options: TestSuiteRunOptions) {
    const children = [...testSuite.children];
    if (options.randomize) {
        children.sort(() => Math.round(Math.random()));
    }
    return [
        ...children.filter(child => options.firstPassFilter(child)),
        ...children.filter(child => !options.firstPassFilter(child))
    ];
}

/**---------------------------------------------------------------------------------------------------------------------
 * Run a single test case with before/after hooks
 *--------------------------------------------------------------------------------------------------------------------*/

async function runTestCase(
    testCase: TestCase,
    options: TestSuiteRunOptions,
    beforeEach: ReadonlyArray<() => unknown>,
    afterEach: ReadonlyArray<() => unknown>
): Promise<TestResult> {
    try {
        await runHooks("beforeEach", beforeEach);
        await testCase.run();
        await runHooks("afterEach", afterEach);
        options.onTestCasePassed(testCase.qualifiedName);
        return { name: testCase.qualifiedName };
    } catch (error) {
        const errorMessage = formatError(error);
        options.onTestCaseFailed(testCase.qualifiedName, errorMessage);
        return { name: testCase.qualifiedName, error: errorMessage };
    }
}

/**---------------------------------------------------------------------------------------------------------------------
 * Format an error (preferably as a stack trace)
 *--------------------------------------------------------------------------------------------------------------------*/

function formatError(error: unknown, message?: string): string {
    const title = message?.trim() || "";
    const details = error instanceof Error ? error.stack?.trim() || error.message.trim() : `${error ?? ""}`;
    if (title) {
        return details ? `${title}\n\n${details}` : title;
    } else {
        return details ?? "Unknown error";
    }
}
