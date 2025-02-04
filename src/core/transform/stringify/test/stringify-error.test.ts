import { expect } from "../../../../test/lib/expect.js";
import { describe, it } from "../../../../test/lib/test-runner.js";
import { DescriptiveError } from "../../../error/descriptive-error.js";
import { stringifyErrorMessage } from "../stringify-error-message.js";
import { stringifyError } from "../stringify-error.js";

describe("stringifyError", () => {
    it("stringifies DescriptiveError as error message only ", () => {
        const error = new DescriptiveError("message");
        expect(stringifyError(error)).toEqual(stringifyErrorMessage(error));
    });

    it("stringifies non-descriptive errors with stack trace", () => {
        const error1 = new Error("error 1");
        const error2 = new DescriptiveError("error 2", error1);
        const error3 = new Error("error 3", { cause: error2 });
        const error4 = new Error("error 4", { cause: error3 });
        const expected = [
            stringifyErrorMessage(error4.stack ?? `${error4}`),
            `caused by: ${stringifyErrorMessage(error3.stack ?? `${error3}`)}`,
            `caused by: ${stringifyErrorMessage(error2)}`,
        ].join("\n");
        expect(stringifyError(error4)).toEqual(expected);
    });

    it("stringifies non-error objects through interpolation", () => {
        const error = 123;
        expect(stringifyError(error)).toEqual(`${error}`);
    });
});
