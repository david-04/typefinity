import { Action } from "../../../data/types/function-types";
import { unify } from "../../../data/utils/unify";
import { NamedTestComponent, TestCase, TestSuite, TestSuiteBase, UninitializedTestSuite } from "./test-suite";

/**---------------------------------------------------------------------------------------------------------------------
 * A stack of mutable test suites
 *--------------------------------------------------------------------------------------------------------------------*/

export namespace testSuiteBuilderStack {

    const stack = new Array<TestSuiteBase<Array<Action>, Array<UninitializedTestSuite | TestCase>>>();

    /**-----------------------------------------------------------------------------------------------------------------
     * Create a new empty test suite on top of the stack
     *----------------------------------------------------------------------------------------------------------------*/

    export function push(...args: ConstructorParameters<typeof NamedTestComponent>) {
        stack.push(new TestSuiteBase(...args, [], [], [], [], []));
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Retrieve and remove the top-most test suite from the stack
     *----------------------------------------------------------------------------------------------------------------*/

    export function pop() {
        const testSuite = assertPresent(stack.pop());
        return testSuite as TestSuite;
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Obtain (but don't remove) the top-most test suite from the stack
     *----------------------------------------------------------------------------------------------------------------*/

    export function peek() {
        return assertPresent(0 < stack.length ? stack[stack.length - 1] : undefined);
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Assert that the test suite exists
     *----------------------------------------------------------------------------------------------------------------*/

    function assertPresent<T>(testSuite?: T) {
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
