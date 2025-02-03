import { describe, expect, it } from "../../api/import-cli.js";
import { ansi, ANSI_ESC_CODES, enableAnsiEscapeCodes } from "../ansi-escape-codes.js";

describe("ansi", () => {
    const testData: ReadonlyArray<[keyof typeof ansi, string, string]> = [
        ["fgBlack", ANSI_ESC_CODES.fgBlack, ANSI_ESC_CODES.fgDefault],
        ["fgRed", ANSI_ESC_CODES.fgRed, ANSI_ESC_CODES.fgDefault],
        ["fgGreen", ANSI_ESC_CODES.fgGreen, ANSI_ESC_CODES.fgDefault],
        ["fgYellow", ANSI_ESC_CODES.fgYellow, ANSI_ESC_CODES.fgDefault],
        ["fgBlue", ANSI_ESC_CODES.fgBlue, ANSI_ESC_CODES.fgDefault],
        ["fgMagenta", ANSI_ESC_CODES.fgMagenta, ANSI_ESC_CODES.fgDefault],
        ["fgCyan", ANSI_ESC_CODES.fgCyan, ANSI_ESC_CODES.fgDefault],
        ["fgWhite", ANSI_ESC_CODES.fgWhite, ANSI_ESC_CODES.fgDefault],
        ["fgGray", ANSI_ESC_CODES.fgGray, ANSI_ESC_CODES.fgDefault],
        ["bgBlack", ANSI_ESC_CODES.bgBlack, ANSI_ESC_CODES.bgDefault],
        ["bgRed", ANSI_ESC_CODES.bgRed, ANSI_ESC_CODES.bgDefault],
        ["bgGreen", ANSI_ESC_CODES.bgGreen, ANSI_ESC_CODES.bgDefault],
        ["bgYellow", ANSI_ESC_CODES.bgYellow, ANSI_ESC_CODES.bgDefault],
        ["bgBlue", ANSI_ESC_CODES.bgBlue, ANSI_ESC_CODES.bgDefault],
        ["bgMagenta", ANSI_ESC_CODES.bgMagenta, ANSI_ESC_CODES.bgDefault],
        ["bgCyan", ANSI_ESC_CODES.bgCyan, ANSI_ESC_CODES.bgDefault],
        ["bgWhite", ANSI_ESC_CODES.bgWhite, ANSI_ESC_CODES.bgDefault],
        ["bgGray", ANSI_ESC_CODES.bgGray, ANSI_ESC_CODES.bgDefault],
        ["bright", ANSI_ESC_CODES.bright, ANSI_ESC_CODES.normal],
        ["dim", ANSI_ESC_CODES.dim, ANSI_ESC_CODES.normal],
        ["underline", ANSI_ESC_CODES.underline, ANSI_ESC_CODES.noUnderline],
        ["overline", ANSI_ESC_CODES.overline, ANSI_ESC_CODES.noOverline],
        ["doubleLine", ANSI_ESC_CODES.doubleLine, ANSI_ESC_CODES.noLine],
    ] as const;

    describe("when ANSI escape codes are enabled", () => {
        testData.forEach(([fn, expectedPrefix, expectedSuffix]) => {
            it(`${fn} wraps the text into the correct escape codes`, () => {
                enableAnsiEscapeCodes(true);
                expect(ansi[fn]("text")).toEqual(`${expectedPrefix}text${expectedSuffix}`);
            });
        });
    });

    describe("when ANSI escape codes are disabled", () => {
        testData.forEach(([fn]) => {
            it(`${fn} wraps the text into the correct escape codes`, () => {
                enableAnsiEscapeCodes(false);
                expect(ansi[fn]("text")).toEqual("text");
            });
        });
    });
});
