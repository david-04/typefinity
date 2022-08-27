/**---------------------------------------------------------------------------------------------------------------------
 * A single test case
 *--------------------------------------------------------------------------------------------------------------------*/

export class TestCase {

    /** The qualified test case name (including parent test suite names) */
    public readonly name: ReadonlyArray<string>;

    /**-----------------------------------------------------------------------------------------------------------------
     * Initialization
     *
     * @param   name The test case name
     * @param   run Test case implementation
     *----------------------------------------------------------------------------------------------------------------*/

    public constructor(name: ReadonlyArray<string>, public readonly run: () => unknown) {
        this.name = name.map(word => word.trim()).filter(word => word);
    }
}

//----------------------------------------------------------------------------------------------------------------------
// A test suite with test cases, nested test suites, and setup/teardown activities
//----------------------------------------------------------------------------------------------------------------------

export class TestSuite {

    /** The qualified test suite name */
    public readonly name: ReadonlyArray<string>;

    /**-----------------------------------------------------------------------------------------------------------------
     * Initialization
     *
     * @param name Qualified test suite name
     *----------------------------------------------------------------------------------------------------------------*/

    public constructor(name: ReadonlyArray<string>) {
        this.name = name.map(word => word.trim()).filter(word => word);
    }

    /** Code to run once before running all the test cases in the suite */
    public readonly beforeAll = new Array<() => unknown>();
    /** Code to run once after running all the test cases in the suite */
    public readonly afterAll = new Array<() => unknown>();

    /** Code to run before each and every test case in the suite */
    public readonly beforeEach = new Array<() => unknown>();
    /** Code to run after each and every test case in the suite */
    public readonly afterEach = new Array<() => unknown>();

    /** Nested test suites */
    public readonly testSuites = new Array<TestSuite>();
    /** Test cases */
    public readonly testCases = new Array<TestCase>();
}
