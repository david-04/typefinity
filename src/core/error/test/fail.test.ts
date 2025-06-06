import { describe, expect, it } from "../../api/core-import.js";
import { DescriptiveError } from "../descriptive-error.js";
import { fail } from "../fail.js";

describe("fail", () => {
    const message = "Something went wrong";
    const cause = new Error("Nested error");

    it("throws a DescriptiveError", () => {
        expect(() => fail(message)).toThrow(new DescriptiveError(message));
    });

    it("includes the nested error", () => {
        expect(() => fail(message, cause)).toThrow(new DescriptiveError(message, cause));
    });
});
