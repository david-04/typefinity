import { unify } from "../../../data/utils/unify";
import { addon } from "../../../functions/addon";
import { createTestSuite } from "./test-suite-builder";

/**---------------------------------------------------------------------------------------------------------------------
 * Base class for all variations of test cases and test suites (containing only the name)
 *--------------------------------------------------------------------------------------------------------------------*/

export class NamedTestComponent {

    /** The parent test suite's qualified name */
    public readonly parentName;

    /** The component's name (excluding the parent test suite's names) */
    public readonly name;

    /** The fully qualified name including parent test suite names */
    private readonly qualifiedNameSupplier;

    /**-----------------------------------------------------------------------------------------------------------------
     * Initialization
     *----------------------------------------------------------------------------------------------------------------*/

    public constructor(parentName: ReadonlyArray<string>, name: ReadonlyArray<string>) {
        this.name = NamedTestComponent.normalizeName(name);
        this.parentName = NamedTestComponent.normalizeName(parentName);
        this.qualifiedNameSupplier = addon.cacheResult(() => [...this.parentName, ...this.name] as const);
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Normalize a name by trimming all of its components and removing empty strings
     *----------------------------------------------------------------------------------------------------------------*/

    private static normalizeName(name: ReadonlyArray<string>) {
        return name.map(word => word.trim()).filter(word => word) as ReadonlyArray<string>;
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * The fully qualified name including parent test suite names
     *----------------------------------------------------------------------------------------------------------------*/

    public get qualifiedName() {
        return this.qualifiedNameSupplier();
    }
}

/**---------------------------------------------------------------------------------------------------------------------
 * Shared base class for test cases and test suites that haven't been initialized/populated yet
 *--------------------------------------------------------------------------------------------------------------------*/

export class UnloadedTestComponent extends NamedTestComponent {

    /**-----------------------------------------------------------------------------------------------------------------
     * Initialization
     *----------------------------------------------------------------------------------------------------------------*/

    public constructor(
        parentName: ReadonlyArray<string>,
        name: ReadonlyArray<string>,
        protected readonly implementation: () => unknown
    ) {
        super(parentName, name);
    }
}


/**---------------------------------------------------------------------------------------------------------------------
 * A single test case
 *--------------------------------------------------------------------------------------------------------------------*/

export class TestCase extends UnloadedTestComponent {

    /**-----------------------------------------------------------------------------------------------------------------
     * Run the test implementation
     *----------------------------------------------------------------------------------------------------------------*/

    async run() {
        await unify.toPromise(this.implementation());
    }
}

/**---------------------------------------------------------------------------------------------------------------------
 * A test suite that hasn't been initialized/populated yet
 *--------------------------------------------------------------------------------------------------------------------*/

export class UninitializedTestSuite extends UnloadedTestComponent {

    /**-----------------------------------------------------------------------------------------------------------------
     * Invoke the implementation/callback to create an initialized test suite
     *----------------------------------------------------------------------------------------------------------------*/

    public load = addon.cacheResult(() => createTestSuite(this.parentName, this.name, this.implementation));
}

/**---------------------------------------------------------------------------------------------------------------------
 * Base class for mutable and immutable test suites containing test cases, hooks, and child test suites
 *--------------------------------------------------------------------------------------------------------------------*/

export abstract class TestSuiteBase<HOOK, CHILDREN> extends NamedTestComponent {

    public constructor(
        /** The parent test suite's qualified name */
        parentName: ReadonlyArray<string>,
        /** The component's name (excluding the parent test suite's names) */
        name: ReadonlyArray<string>,
        /** Code to run once before running all the test cases in the suite */
        public readonly beforeAll: HOOK,
        /** Code to run once after running all the test cases in the suite */
        public readonly afterAll: HOOK,
        /** Code to run before each and every test case in the suite */
        public readonly beforeEach: HOOK,
        /** Code to run after each and every test case in the suite */
        public readonly afterEach: HOOK,
        /** Test cases and nested test suites */
        public readonly children: CHILDREN
    ) {
        super(parentName, name);
    }
}

/**---------------------------------------------------------------------------------------------------------------------
 * A fully initialized test suite containing test cases, hooks, and (potentially uninitialized) child test suites
 *--------------------------------------------------------------------------------------------------------------------*/

export class TestSuite extends TestSuiteBase<
    ReadonlyArray<() => unknown>,
    ReadonlyArray<UninitializedTestSuite | TestCase>
> { }
