import * as node from "node:test";
import { discardNonPromiseReturnValue } from "./test-runner-utils.js";

/**---------------------------------------------------------------------------------------------------------------------
 * Define a test case
 *
 * @param description The test case's description
 * @param implementation Implementation of the test case
 *--------------------------------------------------------------------------------------------------------------------*/

export function it(description: string, implementation: () => unknown): void {
    node.it(description, discardNonPromiseReturnValue(implementation));
}

/**---------------------------------------------------------------------------------------------------------------------
 * @mergeModuleWith it
 *--------------------------------------------------------------------------------------------------------------------*/

export namespace it {
    //
    /**-----------------------------------------------------------------------------------------------------------------
     * Define a test case but exclude it from test runs
     *
     * @param description The test case's description
     * @param testDefinition Implementation of the test case
     *----------------------------------------------------------------------------------------------------------------*/

    export function skip(description: string, testDefinition: () => unknown): void {
        node.it(description, { skip: true }, discardNonPromiseReturnValue(testDefinition));
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Define a test case placeholder to be implemented later
     *
     * @param description The test case's description
     * @param testDefinition Optional (draft) implementation of the test case
     *----------------------------------------------------------------------------------------------------------------*/

    export function todo(description: string, testDefinition?: () => unknown): void {
        node.it(description, { todo: true }, discardNonPromiseReturnValue(testDefinition ?? (() => undefined)));
    }
}
