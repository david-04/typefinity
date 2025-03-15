import { expect } from "../../../test/lib/expect.js";
import { describe, it } from "../../../test/lib/test-runner.js";
import { DescriptiveError } from "../../error/descriptive-error.js";
import { fail } from "../../error/fail.js";
import { optional, Optional } from "../optional.js";
import { randomFalsyValue, randomItem, randomTruthyValue } from "../random.js";

function assertIsEmpty<T>(optional: Optional<T>) {
    expect(() => optional.orCrash("The Optional is empty")).toThrow(/The Optional is empty/);
}

function assertHasValue<T>(optional: Optional<T>, expectedValue: T) {
    expect(optional.orCrash("The Optional is empty") as unknown).toEqual(expectedValue);
}

describe("Optional", () => {
    describe("empty", () => {
        it("creates an instance of Optional", () => {
            expect(Optional.empty() instanceof Optional).toBeTruthy();
        });

        it("creates an empty instance", () => {
            assertIsEmpty(Optional.empty());
        });

        it("is typed correctly", () => {
            expect(Optional.empty()).toBeOfType<Optional<unknown>>();
            expect(Optional.empty<null>()).toBeOfType<Optional<never>>();
            expect(Optional.empty<undefined>()).toBeOfType<Optional<never>>();
            expect(Optional.empty<null | undefined>()).toBeOfType<Optional<never>>();
            expect(Optional.empty<number | string | null | undefined>()).toBeOfType<Optional<number | string>>();
        });
    });

    describe("filter", () => {
        describe("when the Optional is empty", () => {
            it("does not call the filter function", () => {
                Optional.empty().filter(() => fail("The filter function was called"));
            });

            it("returns an empty Optional", () => {
                assertIsEmpty(Optional.empty().filter(() => true));
            });
        });

        describe("when the Optional is present", () => {
            it("calls the filter function", () => {
                let actualStatus = "the filter function was NOT called";
                Optional.of("value").filter(() => {
                    actualStatus = "the filter function was called";
                });
                expect(actualStatus).toEqual("the filter function was called");
            });

            it("passes the Optional's value to the filter function", () => {
                const expectedValue = randomItem([0, true, "string"]);
                Optional.of(expectedValue).filter(actualValue => expect(actualValue).toBe(expectedValue));
            });

            it("returns the original Optional when the filter function returns a truthy value", () => {
                const optional = Optional.of("value");
                expect(optional.filter(randomTruthyValue)).toBe(optional);
            });

            it("returns an empty Optional when the filter function returns a falsy value", () => {
                assertIsEmpty(Optional.of("value").filter(randomFalsyValue));
            });
        });

        it("is typed correctly", () => {
            expect(Optional.empty<string | number>().filter(() => true)).toBeOfType<Optional<string | number>>();
            expect(Optional.empty<never>().filter(() => true)).toBeOfType<Optional<never>>();
            expect(Optional.empty<unknown>().filter(() => true)).toBeOfType<Optional<unknown>>();
            Optional.empty<string | number>().filter(value => expect(value).toBeOfType<string | number>());
        });
    });

    describe("flatMap", () => {
        describe("when the Optional is empty", () => {
            it("does not call the map function", () => {
                Optional.empty().flatMap(() => fail("The map function was called"));
            });

            it("returns an empty Optional", () => {
                assertIsEmpty(Optional.empty().flatMap(() => Optional.of("value")));
            });
        });

        describe("when the Optional is present", () => {
            it("calls the map function", () => {
                let actualStatus = "the map function was NOT called";
                Optional.of("value").flatMap(() => {
                    actualStatus = "the map function was called";
                    return Optional.of("value");
                });
                expect(actualStatus).toEqual("the map function was called");
            });

            it("passes the Optional's value to the map function", () => {
                const expectedValue = randomItem([1, true, "string"]);
                Optional.of(expectedValue).flatMap(actualValue => {
                    expect(actualValue).toBe(expectedValue);
                    return Optional.empty();
                });
            });

            it("returns the mapped Optional", () => {
                const mappedOptional = randomItem([Optional.empty(), Optional.of("mapped")]);
                expect(Optional.of("value").flatMap(() => mappedOptional)).toBe(mappedOptional);
            });
        });

        it("is typed correctly", () => {
            expect(Optional.empty<string | number>().flatMap(() => Optional.empty<boolean | RegExp>())).toBeOfType<
                Optional<boolean | RegExp>
            >();
            // @ts-expect-error: The flatMap function must return an Optional
            Optional.empty<number>().flatMap(() => "abc");
            Optional.empty<string | number>().flatMap(value => {
                expect(value).toBeOfType<string | number>();
                return Optional.empty();
            });
        });
    });

    describe("get", () => {
        it("returns the value when the Optional is not empty", () => {
            const optional = Optional.of("value");
            if (optional.isPresent()) {
                expect(optional.get()).toBe("value");
            } else {
                fail("The Optional is empty");
            }
        });

        describe("throws when the Optional is empty", () => {
            // @ts-expect-error
            expect(() => Optional.empty().get()).toThrow(new Error("The Optional is empty"));
        });

        it("is typed correctly", () => {
            const optional = Optional.of(1 as number | string);
            if (optional.isPresent()) {
                expect(optional.get()).toBeOfType<number | string>();
            } else {
                // @ts-expect-error: "get" is only visible after
                optional.get;
            }
        });
    });

    describe("ifEmpty", () => {
        describe("when the optional is empty", () => {
            it("calls the function", () => {
                let actualStatus = "the function was NOT called";
                Optional.empty().ifEmpty(() => {
                    actualStatus = "the function was called";
                });
                expect(actualStatus).toEqual("the function was called");
            });

            it("returns itself", () => {
                const optional = Optional.empty();
                expect(optional.ifEmpty(() => true)).toBe(optional);
            });
        });

        describe("when the optional is not empty", () => {
            it("does not call the function", () => {
                Optional.of("value").ifEmpty(() => fail("The function was called"));
            });

            it("returns itself", () => {
                const optional = Optional.of("value");
                expect(optional.ifEmpty(() => true)).toBe(optional);
            });
        });

        describe("is typed correctly", () => {
            expect(Optional.empty<string | number>().ifEmpty(() => true)).toBeOfType<Optional<string | number>>();
        });
    });

    describe("ifPresent", () => {
        describe("when the optional is empty", () => {
            it("does not call the function", () => {
                Optional.empty().ifPresent(() => fail("The function was called"));
            });

            it("returns itself", () => {
                const optional = Optional.empty();
                expect(optional.ifPresent(() => true)).toBe(optional);
            });
        });

        describe("when the optional is not empty", () => {
            it("calls the function", () => {
                let actualStatus = "the function was NOT called";
                Optional.of("value").ifPresent(() => {
                    actualStatus = "the function was called";
                });
                expect(actualStatus).toEqual("the function was called");
            });

            it("passes the Optional's value to the function", () => {
                const expectedValue = randomItem([0, true, "string"]);
                Optional.of(expectedValue).ifPresent(actualValue => expect(actualValue).toBe(expectedValue));
            });

            it("returns itself", () => {
                const optional = Optional.of("value");
                expect(optional.ifPresent(() => true)).toBe(optional);
            });
        });

        describe("is typed correctly", () => {
            expect(Optional.empty<string | number>().ifPresent(() => true)).toBeOfType<Optional<string | number>>();
            Optional.empty<string | number>().ifPresent(value => expect(value).toBeOfType<string | number>());
        });
    });

    describe("isEmpty", () => {
        it("returns true when the Optional is empty", () => {
            expect(Optional.empty().isEmpty()).toBe(true);
        });

        it("returns false when the Optional is not empty", () => {
            expect(Optional.of("value").isEmpty()).toBe(false);
        });
    });

    describe("isPresent", () => {
        it("returns false when the Optional is empty", () => {
            expect(Optional.empty().isPresent()).toBe(false);
        });

        it("returns true when the Optional is not empty", () => {
            expect(Optional.of("value").isPresent()).toBe(true);
        });
    });

    describe("map", () => {
        describe("when the Optional is empty", () => {
            it("does not call the map function", () => {
                Optional.empty().map(() => fail("The map function was called"));
            });

            it("returns an empty Optional", () => {
                assertIsEmpty(Optional.empty().map(() => Optional.of("value")));
            });
        });

        describe("when the Optional is present", () => {
            it("calls the map function", () => {
                let actualStatus = "the map function was NOT called";
                Optional.of("value").map(() => {
                    actualStatus = "the map function was called";
                });
                expect(actualStatus).toEqual("the map function was called");
            });

            it("passes the Optional's value to the map function", () => {
                const actualValue = randomItem([0, true, "string"]);
                Optional.of(actualValue).map(actualValue => expect(actualValue).toBe(actualValue));
            });

            it("returns an empty Optional when the map function returns null or undefined", () => {
                assertIsEmpty(Optional.of("value").map(() => randomItem([null, undefined])));
            });

            it("returns the mapped value when the map function returns a value", () => {
                const mappedValue = randomItem([0, 1, true, false, "string"]);
                assertHasValue(
                    Optional.of("value").map(() => mappedValue),
                    mappedValue
                );
            });
        });

        it("is typed correctly", () => {
            expect(Optional.empty<string | number>().map(() => true as boolean | RegExp)).toBeOfType<
                Optional<boolean | RegExp>
            >();
            Optional.empty<string | number>().map(value => expect(value).toBeOfType<string | number>());
        });
    });

    describe("of", () => {
        it("creates an Optional with the given value", () => {
            const value = randomItem([0, false, "", Symbol("1")]);
            assertHasValue(Optional.of(value), value);
        });

        it("creates an empty Optional when passing null", () => {
            assertIsEmpty(Optional.of(null));
        });

        it("creates an empty Optional when passing undefined", () => {
            assertIsEmpty(Optional.of(undefined));
        });

        it("is typed correctly", () => {
            expect(Optional.of(1 as number | string)).toBeOfType<Optional<number | string>>();
            expect(Optional.of(1 as unknown)).toBeOfType<Optional<unknown>>();
            expect(Optional.of(null)).toBeOfType<Optional<never>>();
            expect(Optional.of(undefined)).toBeOfType<Optional<never>>();
            expect(Optional.of(null as null | undefined)).toBeOfType<Optional<never>>();
            expect(Optional.of(1 as number | string | null | undefined)).toBeOfType<Optional<number | string>>();
        });
    });

    describe("orCrash", () => {
        it("throws an error when the Optional is empty", () => {
            expect(() => Optional.empty().orCrash("error message")).toThrow(new Error("error message"));
        });

        it("returns its value when the Optional is not empty", () => {
            const value = randomItem(["abc", 123]);
            expect(Optional.of(value).orCrash("error message")).toBe(value);
        });
    });

    describe("orElse", () => {
        it("returns the fallback value when the Optional is empty", () => {
            const fallbackValue = randomItem(["abc", 123]);
            expect(Optional.empty().orElse(fallbackValue)).toBe(fallbackValue);
        });

        it("returns its value when the  Optional is not empty", () => {
            const value = randomItem(["abc", 123]);
            expect(Optional.of(value).orElse(randomItem(["xyz", 789]))).toBe(value);
        });

        it("is typed correctly", () => {
            expect(Optional.empty<number | string>().orElse(true as boolean | RegExp)).toBeOfType<
                number | string | boolean | RegExp
            >();
            expect(Optional.empty<number | string>().orElse(true as boolean | null | undefined)).toBeOfType<
                number | string | boolean | null | undefined
            >();
        });
    });

    describe("orFail", () => {
        it("throws a DescriptiveError when the Optional is empty", () => {
            expect(() => Optional.empty().orFail("error message")).toThrow(new DescriptiveError("error message"));
        });

        it("returns its value when the Optional is not empty", () => {
            const value = randomItem(["abc", 123]);
            expect(Optional.of(value).orFail("error message")).toBe(value);
        });
    });

    describe("orGet", () => {
        describe("when the Optional is empty", () => {
            it("calls the get function", () => {
                let actualStatus = "the get function was NOT called";
                Optional.empty().orGet(() => (actualStatus = "the get function was called"));
                expect(actualStatus).toEqual("the get function was called");
            });

            it("returns the value returned by the get function", () => {
                const value = randomItem(["abc", 123]);
                expect(Optional.empty().orGet(() => value)).toBe(value);
            });
        });

        describe("when the Optional is not empty", () => {
            it("does not call the get function", () => {
                Optional.of(1).orGet(() => fail("the get function was called"));
            });

            it("returns the Optional's value", () => {
                const value = randomItem(["abc", 123]);
                expect(Optional.of(value).orGet(() => fail("the get function was called"))).toBe(value);
            });
        });

        it("is typed correctly", () => {
            expect(Optional.empty<string | number>().orGet(() => true as boolean | RegExp)).toBeOfType<
                string | number | boolean | RegExp
            >();
            expect(Optional.empty<string | number>().orGet(() => true as boolean | null | undefined)).toBeOfType<
                string | number | boolean | null | undefined
            >();
        });
    });
});

describe("optional", () => {
    it("creates an Optional with the given value", () => {
        const value = randomItem([0, false, "", Symbol("1")]);
        assertHasValue(optional(value), value);
    });

    it("creates an empty Optional when passing null", () => {
        assertIsEmpty(optional(null));
    });

    it("creates an empty Optional when passing undefined", () => {
        assertIsEmpty(optional(undefined));
    });

    it("is typed correctly", () => {
        expect(optional(1 as number | string)).toBeOfType<Optional<number | string>>();
        expect(optional(1 as unknown)).toBeOfType<Optional<unknown>>();
        expect(optional(null)).toBeOfType<Optional<never>>();
        expect(optional(undefined)).toBeOfType<Optional<never>>();
        expect(optional(null as null | undefined)).toBeOfType<Optional<never>>();
        expect(optional(1 as number | string | null | undefined)).toBeOfType<Optional<number | string>>();
    });
});
