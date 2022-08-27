import { TestCase, TestSuite } from "./test-suite";

/**---------------------------------------------------------------------------------------------------------------------
 * A singleton class to assemble test suites
 *--------------------------------------------------------------------------------------------------------------------*/

export class TestSuiteBuilder {

    /** Singleton instance */
    public static readonly INSTANCE = new TestSuiteBuilder();

    /** The most nested test suite */
    private currentTestSuite = new TestSuite([]);

    /** Disallow multiple instances */
    private constructor() { }

    /**-----------------------------------------------------------------------------------------------------------------
     * Reset the builder and start creating a new test suite
     *
     * @param   name Test suite name
     *----------------------------------------------------------------------------------------------------------------*/

    public startNewTestSuite(name: string[]) {
        this.currentTestSuite = new TestSuite(name);
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Add a nested test suite
     *
     * @param   name Name of the test suite
     * @param   populate Callback to populate the test suite
     *----------------------------------------------------------------------------------------------------------------*/

    public addTestSuite(name: string[], populate: () => unknown) {
        const previousTestSuite = this.currentTestSuite;
        this.currentTestSuite = new TestSuite([...this.currentTestSuite.name, ...name]);
        const result = populate();
        if (result instanceof Promise) {
            throw new Error("A test suite can't be defined as an async method - use before/after hooks instead");
        }
        this.currentTestSuite = previousTestSuite;
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Add a "beforeAll" action
     *
     * @param   action The code to execute once before running all test cases in the suite
     *----------------------------------------------------------------------------------------------------------------*/

    public addBeforeAll(action: () => unknown) {
        this.currentTestSuite.beforeAll.push(action);
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Add an "afterAll" action
     *
     * @param   action The code to execute once after running all test cases in the suite
     *----------------------------------------------------------------------------------------------------------------*/

    public addAfterAll(action: () => unknown) {
        this.currentTestSuite.afterAll.push(action);
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Add a "beforeEach" action
     *
     * @param   action The code to execute repeatedly before each and every test case in the suite
     *----------------------------------------------------------------------------------------------------------------*/

    public addBeforeEach(action: () => unknown) {
        this.currentTestSuite.beforeEach.push(action);
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Add an "afterEach" action
     *
     * @param   action The code to execute repeatedly after each and every test case in the suite
     *----------------------------------------------------------------------------------------------------------------*/

    public addAfterEach(action: () => unknown) {
        this.currentTestSuite.afterEach.push(action);
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Add a test case
     *
     * @param   description Test case name
     * @param   implementation Test case implementation
     *----------------------------------------------------------------------------------------------------------------*/

    public addTestCase(description: string[], implementation: () => unknown) {
        this.currentTestSuite.testCases.push(
            new TestCase([...this.currentTestSuite.name, ...description], implementation)
        );
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Get the assembled test suite and empty the builder
     *
     * @return  The assembled test suite
     *----------------------------------------------------------------------------------------------------------------*/

    public buildAndReset() {
        const testSuite = this.currentTestSuite;
        this.currentTestSuite = new TestSuite([]);
        return testSuite;
    }
}

/** A builder for assembling test suites */
export const testSuiteBuilder = TestSuiteBuilder.INSTANCE;
