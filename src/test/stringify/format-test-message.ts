import { stringifyTestData } from "./stringify-test-data.js";

const PLACEHOLDERS = /%(%|\*|\d+)/;
const REMAINING_VALUES = Symbol("remaining values");

/**---------------------------------------------------------------------------------------------------------------------
 * Format a test message replacing placeholders with the given parameters:
 *
 * - %% ... literal percent sign ("%")
 * - %1 ... the first parameter
 * - %2 ... the second parameter
 * -    ...
 * - %* ... all remaining parameters (that aren't used as explicit placeholders like %1, %2, etc.)
 *--------------------------------------------------------------------------------------------------------------------*/

export function formatTestMessage(format: string, ...params: ReadonlyArray<unknown>) {
    const stringifiedParameters = params.map(stringifyTestData);
    const tokens = splitFormatString(format);
    const usedIndexes = new Set(tokens.filter((token): token is number => "number" === typeof token));
    return tokens
        .map(token => {
            if ("string" === typeof token) {
                return token;
            } else if ("number" === typeof token) {
                return stringifiedParameters[token];
            } else {
                return stringifiedParameters.filter((_, index) => !usedIndexes.has(index)).join(", ");
            }
        })
        .join("");
}

function splitFormatString(format: string) {
    const tokens = new Array<string | number | typeof REMAINING_VALUES>();
    for (let match = PLACEHOLDERS.exec(format); match; match = PLACEHOLDERS.exec(format)) {
        tokens.push(format.substring(0, match.index));
        format = format.substring(match.index + match[0].length);
        const placeholder = match[0].replace(/^%/, "");
        if ("%" === placeholder) {
            tokens.push("%");
        } else if ("*" === placeholder) {
            tokens.push(REMAINING_VALUES);
        } else if (/^\d{1,5}$/.test(placeholder)) {
            tokens.push(parseInt(placeholder) - 1);
        } else {
            tokens.push(match[0]);
        }
    }
    return tokens;
}
