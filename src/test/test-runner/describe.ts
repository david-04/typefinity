import * as node from "node:test";
import { it } from "./it.js";
import { discardNonPromiseReturnValue } from "./test-runner-utils.js";

/**---------------------------------------------------------------------------------------------------------------------
 * Define a test suite
 *
 * @param description The test suite's description
 * @param implementation Implementation of the test suite
 *--------------------------------------------------------------------------------------------------------------------*/

export function describe(description: string, implementation: () => unknown): void {
    node.describe(description, discardNonPromiseReturnValue(implementation));
}

/**---------------------------------------------------------------------------------------------------------------------
 * @mergeModuleWith describe
 *--------------------------------------------------------------------------------------------------------------------*/

export namespace describe {
    //
    /**-----------------------------------------------------------------------------------------------------------------
     * Define a test suite but exclude it from test runs
     *
     * @param description The test suite's description
     * @param implementation Implementation of the test suite
     *----------------------------------------------------------------------------------------------------------------*/

    export function skip(description: string, implementation: () => unknown): void {
        node.describe(description, { skip: true }, discardNonPromiseReturnValue(implementation));
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Define a test suite placeholder to be implemented later
     *
     * @param description The test suite's description
     * @param implementation Optional (draft) implementation of the test suite
     *----------------------------------------------------------------------------------------------------------------*/

    export function todo(description: string, implementation?: () => unknown): void {
        return describe(description, () => {
            it.todo("TODO", () => {});
            if (implementation) {
                implementation();
            }
        });
    }
}
