import { testSuiteBuilder } from "./test-suite-builder";

/**---------------------------------------------------------------------------------------------------------------------
 * Import a unit test module
 *
 * @param   file The name of the module to load
 * @param   testSuiteName The name of test suite
 *--------------------------------------------------------------------------------------------------------------------*/

export function loadTestModule(file: string, testSuiteName: string[]) {
    testSuiteBuilder.startNewTestSuite(testSuiteName);
    require(file);
    return testSuiteBuilder.buildAndReset();
}
