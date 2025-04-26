import { expect } from "../../../test/expect.js";
import { describe, it } from "../../../test/test-runner.js";
import { crash } from "../crash.js";

describe("crash", () => {
    const message = "Something went wrong";
    const cause = new Error("Nested error");

    it("throws an Error", () => {
        expect(() => crash(message)).toThrow(new Error(message));
    });

    it("includes the nested error", () => {
        expect(() => crash(message, cause)).toThrow(new Error(message, { cause }));
    });
});
