import { unify } from "../../../data/utils/unify";
import { NamedTestComponent, TestCase, TestSuite, TestSuiteBase, UninitializedTestSuite } from "./test-suite";

/** A test suite in the making */
export class MutableTestSuite extends TestSuiteBase<Array<() => unknown>, Array<UninitializedTestSuite | TestCase>> { }

/**---------------------------------------------------------------------------------------------------------------------
 * A stack of mutable test suites
 *--------------------------------------------------------------------------------------------------------------------*/

export namespace testSuiteBuilderStack {

    const stack = new Array<MutableTestSuite>();

    /**-----------------------------------------------------------------------------------------------------------------
     * Create a new empty test suite on top of the stack
     *----------------------------------------------------------------------------------------------------------------*/

    export function push(...args: ConstructorParameters<typeof NamedTestComponent>) {
        stack.push(new MutableTestSuite(...args, [], [], [], [], []));
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Retrieve and remove the top-most test suite from the stack
     *----------------------------------------------------------------------------------------------------------------*/

    export function pop() {
        const testSuite = assertPresent(stack.pop());
        return new TestSuite(
            testSuite.parentName,
            testSuite.name,
            testSuite.beforeAll,
            testSuite.afterAll,
            testSuite.beforeEach,
            testSuite.afterEach,
            testSuite.children
        );
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Obtain (but don't remove) the top-most test suite from the stack
     *----------------------------------------------------------------------------------------------------------------*/

    export function peek() {
        return assertPresent(0 < stack.length ? stack[stack.length - 1] : undefined);
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Assert that the
     *----------------------------------------------------------------------------------------------------------------*/

    function assertPresent(testSuite?: MutableTestSuite) {
        if (testSuite) {
            return testSuite;
        } else {
            throw new Error("Test modules must not be imported/required directly - use the [TODO: TestLoader] instead");
        }
    }
}

/**---------------------------------------------------------------------------------------------------------------------
 * Create and populate a test suite
 *--------------------------------------------------------------------------------------------------------------------*/

export async function createTestSuite(
    parentName: ReadonlyArray<string>,
    name: ReadonlyArray<string>,
    populate: () => unknown
): Promise<TestSuite> {
    testSuiteBuilderStack.push(parentName, name);
    await unify.toPromise(populate());
    return testSuiteBuilderStack.pop();
}
