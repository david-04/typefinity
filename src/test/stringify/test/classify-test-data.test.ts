import { expect } from "../../expect/expect.js";
import { describe } from "../../test-runner/describe.js";
import { it } from "../../test-runner/it.js";
import { classifyTestData } from "../classify-test-data.js";

function myFunction() {}

class MyError extends Error {
    public constructor() {
        super("");
    }
}

describe("classifyTestData", () => {
    it("handles null", () => {
        expect(classifyTestData(null)).toBe("null");
    });

    it("handles booleans", () => {
        expect(classifyTestData(true)).toBe("true");
        expect(classifyTestData(false)).toBe("false");
    });

    it("handles numbers", () => {
        expect(classifyTestData(0)).toBe("0");
        expect(classifyTestData(-3.5)).toBe("-3.5");
        expect(classifyTestData(NaN)).toBe("NaN");
        expect(classifyTestData(Infinity)).toBe("Infinity");
        expect(classifyTestData(-Infinity)).toBe("-Infinity");
    });

    it("handles bigints", () => {
        expect(classifyTestData(-3n)).toBe("-3n");
    });

    it("handles strings", () => {
        expect(classifyTestData(`it's`)).toBe(`"it's"`);
        expect(classifyTestData(`it is "its"`)).toBe(`'it is "its"'`);
    });

    it("handles symbols", () => {
        expect(classifyTestData(Symbol())).toBe("Symbol()");
        expect(classifyTestData(Symbol("test"))).toBe("Symbol(test)");
    });

    it("handles functions", () => {
        expect(classifyTestData(myFunction)).toBe("function myFunction");
        expect(classifyTestData(() => true)).toBe("a function");
    });

    it("handles objects", () => {
        expect(classifyTestData({ key: "value" })).toBe("an object literal");
        expect(classifyTestData([])).toBe("an array");
        expect(classifyTestData(new Map())).toBe("a map");
        expect(classifyTestData(new Set())).toBe("a set");
        expect(classifyTestData(/reg.exp/i)).toBe("/reg.exp/i");
        expect(classifyTestData(new Error())).toBe("an instance of Error");
        expect(classifyTestData(new MyError())).toBe("an instance of MyError");
        expect(classifyTestData(new (class {})())).toBe("an instance of an anonymous class");
    });
});
