import { expect } from "../../expect/expect.js";
import { describe } from "../../test-runner/describe.js";
import { it } from "../../test-runner/it.js";
import { formatTestMessage } from "../format-test-message.js";

describe("formatTestMessage", () => {
    it("replaces all placeholders", () => {
        const result = formatTestMessage("param1=%1, param3=%3, percent=%%, rest=%*", "1", 2, [3], Symbol(4), {
            index: 5,
        });
        expect(result).toBe(`param1="1", param3=[3], percent=%, rest=2, Symbol(4), { index: 5 }`);
    });
});
