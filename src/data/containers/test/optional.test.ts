import * as assert from "node:assert";
import { describe, it } from "node:test";
import { typeOf } from "../../type-checks/type-checks.js";
import { optional, Optional } from "../optional.js";

function assertIsEmpty<T>(optional: Optional<T>) {
    assert.throws(() => optional.orThrow("it's empty"), /it's empty/);
}

function assertIsPresent<T>(optional: Optional<T>, value: T) {
    assert.strictEqual(optional.orThrow(), value);
}

describe("Optional", () => {
    describe("empty", () => {
        it("returns an empty Optional", () => {
            assertIsEmpty(Optional.empty());
        });

        it("infers the type from the type annotation", () => {
            typeOf(Optional.empty()).is<Optional<unknown>>();
            typeOf(Optional.empty<null>()).is<Optional<never>>();
            typeOf(Optional.empty<undefined>()).is<Optional<never>>();
            typeOf(Optional.empty<null | undefined>()).is<Optional<never>>();
            typeOf(Optional.empty<number | string | null | undefined>()).is<Optional<number | string>>();
        });
    });

    describe("filter", () => {
        describe("when the Optional is empty", () => {
            it("does not call the filter function", () => {
                Optional.empty().filter(() => assert.fail("The filter function was called"));
            });

            it("returns an empty Optional", () => {
                assertIsEmpty(Optional.empty().filter(() => 1));
            });

            it("preserves the Optional's type", () => {
                typeOf(Optional.empty<number | string>().filter(() => true)).is<Optional<number | string>>();
                typeOf(Optional.empty<number | string>().filter(() => false)).is<Optional<number | string>>();
                typeOf(Optional.empty<never>().filter(() => true)).is<Optional<never>>();
                typeOf(Optional.empty<unknown>().filter(() => true)).is<Optional<unknown>>();
            });
        });

        describe("when the Optional is present", () => {
            it("returns the Optional itself when the filter function returns a truthy value", () => {
                const filtered = Optional.of("value").filter(() => true);
                assertIsPresent(filtered, "value");
            });

            it("returns an empty Optional when the filter function returns a falsy value", () => {
                assertIsEmpty(Optional.of(1).filter(() => false));
            });

            it("preserves the Optional's type", () => {
                typeOf(Optional.of(1 as number | string).filter(() => true)).is<Optional<number | string>>();
                typeOf(Optional.of(1 as number | string).filter(() => false)).is<Optional<number | string>>();
                typeOf(Optional.of(1 as never).filter(() => true)).is<Optional<never>>();
                typeOf(Optional.of(1 as unknown).filter(() => true)).is<Optional<unknown>>();
            });
        });
    });

    describe("of", () => {
        it("returns an EmptyOptional instance when passing null", () => {
            assertIsEmpty(Optional.of(null));
        });

        it("returns an EmptyOptional instance when passing undefined", () => {
            assertIsEmpty(Optional.of(undefined));
        });

        it("returns a NonEmptyOptional instance when passing a value other than undefined and null", () => {
            assertIsPresent(Optional.of(false), false);
        });

        it("infers the type from the value", () => {
            typeOf(Optional.of(null)).is<Optional<never>>();
            typeOf(Optional.of(undefined)).is<Optional<never>>();
            typeOf(Optional.of(null as null | undefined)).is<Optional<never>>();
            typeOf(Optional.of(0 as number | string | null | undefined)).is<Optional<number | string>>();
        });
    });
});

describe("optional", () => {
    it("is an alias for Optional.of", () => {
        assert.strictEqual(optional, Optional.of);
    });
});
