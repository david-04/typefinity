import { describe, expect, it } from "../../api/core-import.js";
import { DescriptiveError } from "../descriptive-error.js";

describe("DescriptiveError", () => {
    const message = "Something went wrong";
    const cause = new Error("Nested error");

    describe("constructor", () => {
        it("creates an error without a cause", () => {
            const descriptiveError = new DescriptiveError(message);
            expect(descriptiveError.message).toBe(message);
            expect(descriptiveError.cause).toBe(undefined);
        });

        it("creates an error without a cause", () => {
            const descriptiveError = new DescriptiveError(message, cause);
            expect(descriptiveError.message).toBe(message);
            expect(descriptiveError.cause).toBe(cause);
        });
    });
});
