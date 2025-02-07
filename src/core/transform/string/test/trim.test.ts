import { expect } from "../../../../test/lib/expect.js";
import { describe, it } from "../../../../test/lib/test-runner.js";
import { trim } from "../trim.js";

const text = ` \t\r\n text \t\r\n message \t\r\n`;

describe("trim", () => {
    it("behaves like string.trim()", () => {
        expect(trim(text)).toEqual(text.trim());
    });

    describe("start", () => {
        it("behaves like string.trimStart()", () => {
            expect(trim.start(text)).toEqual(text.trimStart());
        });
    });

    describe("end", () => {
        it("behaves like string.trimEnd()", () => {
            expect(trim.end(text)).toEqual(text.trimEnd());
        });
    });
});
