import { describe, expect, it } from "../../../api/core-import.js";
import { DescriptiveError } from "../../../error/descriptive-error.js";
import { stringifyErrorMessage } from "../stringify-error-message.js";

describe("errorMessage", () => {
    const testData = [
        [new Error("message"), "message"],
        [new Error("ERROR: message"), "message"],
        [new Error("Error: message"), "message"],
        [new Error("Error message"), "Error message"],
        [new DescriptiveError("message"), "message"],
        [new DescriptiveError("ERROR: message"), "message"],
        [new DescriptiveError("ERROR message"), "ERROR message"],
        ["message", "message"],
        ["ERROR: message", "message"],
    ] as const;

    testData.forEach(([input, expectedOutput]) => {
        it(`stringifies ${input} as "${expectedOutput}"`, () => {
            expect(stringifyErrorMessage(input)).toBe(expectedOutput);
        });
    });
});
