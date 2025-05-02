import * as assert from "node:assert";
import { describe, it } from "node:test";
import { discardNonPromiseReturnValue } from "../test-runner-utils.js";

describe("discardNonPromiseReturnValue", () => {
    it("returns the function's return value when it is a promise", () => {
        assert.ok(discardNonPromiseReturnValue(() => Promise.resolve(1))() instanceof Promise);
    });

    it("returns undefined when the function returns a boolean", () => {
        assert.equal(discardNonPromiseReturnValue(() => true)(), undefined);
    });

    it("returns undefined when the function returns a number", () => {
        assert.equal(discardNonPromiseReturnValue(() => 1)(), undefined);
    });

    it("returns undefined when the function returns a string", () => {
        assert.equal(discardNonPromiseReturnValue(() => "abc")(), undefined);
    });

    it("returns undefined when the function returns an object", () => {
        assert.equal(discardNonPromiseReturnValue(() => ({ key: "value" }))(), undefined);
    });
});
