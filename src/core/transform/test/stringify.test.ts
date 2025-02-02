import { describe, expect, it } from "../../api/import-core.js";
import { DescriptiveError } from "../../error/descriptive-error.js";
import { normalizeErrorMessage, stringify } from "../stringify.js";

describe("stringify", () => {
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
                expect(stringify.errorMessage(input)).toBe(expectedOutput);
            });
        });
    });

    describe("error", () => {
        it("stringifies DescriptiveError as error message only ", () => {
            const error = new DescriptiveError("message");
            expect(stringify.error(error)).toEqual(stringify.errorMessage(error));
        });

        it("stringifies non-descriptive errors with stack trace", () => {
            const error1 = new Error("error 1");
            const error2 = new DescriptiveError("error 2", error1);
            const error3 = new Error("error 3", { cause: error2 });
            const error4 = new Error("error 4", { cause: error3 });
            const expected = [
                normalizeErrorMessage(error4.stack ?? `${error4}`),
                `caused by: ${normalizeErrorMessage(error3.stack ?? `${error3}`)}`,
                `caused by: ${stringify.errorMessage(error2)}`,
            ].join("\n");
            expect(stringify.error(error4)).toEqual(expected);
        });

        it("stringifies non-error objects through interpolation", () => {
            const error = 123;
            expect(stringify.error(error)).toEqual(`${error}`);
        });
    });
});
