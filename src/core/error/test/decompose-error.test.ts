import { expect } from "../../../test/expect.js";
import { describe, it } from "../../../test/test-runner.js";
import { decomposeError } from "../decompose-error.js";
import { DescriptiveError } from "../descriptive-error.js";

describe("decomposeError", () => {
    describe("cause", () => {
        describe("when passing a non-Error value", () => {
            it("is undefined when passing a undefined", () => {
                expect(decomposeError(undefined).cause).toBe(undefined);
            });

            it("is undefined when passing a null", () => {
                expect(decomposeError(null).cause).toBe(undefined);
            });

            it("is undefined when passing a string", () => {
                expect(decomposeError("failure").cause).toBe(undefined);
            });
        });

        describe("when passing an Error instance", () => {
            const inner = new DescriptiveError("Innermost error");
            const middle = new Error("Middle error", { cause: inner });
            const outer = new Error("Outer error", { cause: middle });

            it("is undefined when passing the error has no cause", () => {
                expect(decomposeError(new Error("failure")).cause).toBe(undefined);
            });

            it("contains all nested causes", () => {
                expect(decomposeError(outer).cause).toMatch(/Caused by: DescriptiveError: Innermost error/);
                expect(decomposeError(outer).cause).toMatch(/Caused by: Error: Middle error/);
            });

            it("does not contain the error itself", () => {
                expect(decomposeError(outer).cause).not.toMatch(/Outer error/);
            });
        });
    });

    describe("message", () => {
        describe("when passing a non-Error value", () => {
            it("is undefined when passing undefined", () => {
                expect(decomposeError(undefined).message).toBe(undefined);
            });

            it("is undefined when passing null", () => {
                expect(decomposeError(null).message).toBe(undefined);
            });

            it("is undefined when passing a blank string", () => {
                expect(decomposeError(" ").message).toBe(undefined);
            });

            it("is the trimmed string when passing a non-blank string", () => {
                expect(decomposeError(" my message ").message).toBe("my message");
            });

            it("is the stringified object when passing a non-error value", () => {
                expect(decomposeError(123).message).toBe("123");
            });
        });

        describe("when passing an Error instance", () => {
            it("is undefined when the error has no message", () => {
                expect(decomposeError(new Error()).message).toBe(undefined);
            });

            it("is undefined when the error message is empty", () => {
                expect(decomposeError(new Error("")).message).toBe(undefined);
            });

            it("is undefined when the error message is blank", () => {
                expect(decomposeError(new Error(" ")).message).toBe(undefined);
            });

            it("is the error's trimmed message when it is not blank", () => {
                expect(decomposeError(new Error(" my message ")).message).toBe("my message");
            });
        });
    });

    describe("source", () => {
        describe("when passing a non-Error value", () => {
            describe("is undefined when passing undefined", () => {
                expect(decomposeError(undefined).source).toBe(undefined);
            });

            describe("is undefined when passing null", () => {
                expect(decomposeError(null).source).toBe(undefined);
            });

            describe("is undefined when passing a string", () => {
                expect(decomposeError("failure").source).toBe(undefined);
            });

            describe("is undefined when passing a non-Error object", () => {
                expect(decomposeError(/regexp/).source).toBe(undefined);
            });
        });

        describe("when passing an Error instance", () => {
            it("contains the file name and an optional line/column reference", () => {
                expect(decomposeError(new Error("failure")).source).toMatch(/decompose-error\.test\.ts(:\d+){0,2}$/);
            });

            it("does not contain any line breaks", () => {
                expect(decomposeError(new Error("failure")).source).not.toMatch(/\n/);
            });

            it("does not contain brackets", () => {
                expect(decomposeError(new Error("failure")).source).not.toMatch(/[()]/);
            });

            it("is undefined when the error has no stack trace", () => {
                const error = new Error("failure");
                delete error.stack;
                expect(decomposeError(error).source).toBe(undefined);
            });

            it("is undefined when the stack trace is blank", () => {
                const error = new Error("failure");
                error.stack = " ";
                expect(decomposeError(error).source).toBe(undefined);
            });

            it("is undefined when the stack trace only contains node and node_modules lines", () => {
                const error = new Error("failure");
                error.stack = "at ... (node:something:1:2)\nat ... (node_modules/package/file.js:1:2)";
                expect(decomposeError(error).source).toBe(undefined);
            });
        });
    });

    describe("stack", () => {
        describe("when passing a non-Error value", () => {
            it("is undefined when passing a undefined", () => {
                expect(decomposeError(undefined).stack).toBe(undefined);
            });

            it("is undefined when passing a null", () => {
                expect(decomposeError(null).stack).toBe(undefined);
            });

            it("is undefined when passing an empty string", () => {
                expect(decomposeError("").stack).toBe(undefined);
            });

            it("is undefined when passing a blank string", () => {
                expect(decomposeError(" ").stack).toBe(undefined);
            });

            it("is undefined when passing a non-blank string", () => {
                expect(decomposeError("failure").stack).toBe(undefined);
            });

            it("is undefined when passing a non-Error object", () => {
                expect(decomposeError(/regexp/).stack).toBe(undefined);
            });
        });

        describe("when passing an Error instance", () => {
            it("is undefined when the error has no stack", () => {
                const error = new Error("failure");
                delete error.stack;
                expect(decomposeError(error).stack).toBe(undefined);
            });

            it("is undefined when the stack is blank", () => {
                const error = new Error("failure");
                error.stack = " ";
                expect(decomposeError(error).stack).toBe(undefined);
            });

            it("contains the stack frames", () => {
                expect(decomposeError(new Error("failure")).stack).toMatch(
                    /at.*decompose-error\.test\.[jt]s(:\d+){0,2}/
                );
            });

            it("does not contain the error type/class name", () => {
                expect(decomposeError(new DescriptiveError("failure")).stack).not.toMatch(/DescriptiveError/);
            });

            it("does not contain the error message", () => {
                expect(decomposeError(new Error("Something went wrong")).stack).not.toMatch(/Something went wrong/);
            });
        });
    });

    describe("type", () => {
        describe("when passing a non-Error value", () => {
            it("is undefined when passing undefined", () => {
                expect(decomposeError(undefined).type).toBe(undefined);
            });

            it("is undefined when passing null", () => {
                expect(decomposeError(null).type).toBe(undefined);
            });

            it("is undefined when passing a string", () => {
                expect(decomposeError("failure").type).toBe(undefined);
            });

            it("is undefined when passing a number", () => {
                expect(decomposeError(123).type).toBe(undefined);
            });

            it("is undefined when passing a non-Error object", () => {
                expect(decomposeError(/regexp/).type).toBe(undefined);
            });

            it("is undefined when passing a function", () => {
                expect(decomposeError(() => 1).type).toBe(undefined);
            });
        });

        describe("when passing an Error instance", () => {
            it("is the error's class name", () => {
                expect(decomposeError(new DescriptiveError("failure")).type).toBe("DescriptiveError");
            });

            it("is 'Error' when passing an anonymous class", () => {
                const error = new (class extends DescriptiveError {
                    public constructor() {
                        super("failure");
                    }
                })();
                expect(decomposeError(error).type).toBe("Error");
            });
        });
    });

    describe("typeAndMessage", () => {
        describe("when passing a non-Error value", () => {
            it("is undefined when passing undefined", () => {
                expect(decomposeError(undefined).typeAndMessage).toBe(undefined);
            });

            it("is undefined when passing null", () => {
                expect(decomposeError(null).typeAndMessage).toBe(undefined);
            });

            it("is the stringified value when passing a number", () => {
                expect(decomposeError(123).typeAndMessage).toBe("123");
            });

            it("is the trimmed value when passing a non-blank string", () => {
                expect(decomposeError(" message ").typeAndMessage).toBe("message");
            });

            it("is undefined when passing a blank string", () => {
                expect(decomposeError(" ").typeAndMessage).toBe(undefined);
            });
        });

        describe("when passing an Error instance", () => {
            it("contains the error type and message when the error message is not blank", () => {
                expect(decomposeError(new DescriptiveError("failure")).typeAndMessage).toBe(
                    "DescriptiveError: failure"
                );
            });

            it("contains the error type and when the message is blank", () => {
                expect(decomposeError(new DescriptiveError(" ")).typeAndMessage).toBe("DescriptiveError");
            });
        });
    });
});
