/**---------------------------------------------------------------------------------------------------------------------
 * ANSI escape codes tob e used in console.log() and the likes
 *--------------------------------------------------------------------------------------------------------------------*/

export const ANSI_ESC_CODES = {
    //------------------------------------------------------------------------------------------------------------------
    // Foreground colors
    //------------------------------------------------------------------------------------------------------------------

    fgBlack: "\x1b[30m",
    fgRed: "\x1b[31m",
    fgGreen: "\x1b[32m",
    fgYellow: "\x1b[33m",
    fgBlue: "\x1b[34m",
    fgMagenta: "\x1b[35m",
    fgCyan: "\x1b[36m",
    fgWhite: "\x1b[37m",
    fgGray: "\x1b[90m",
    fgDefault: "\x1b[39m",

    //------------------------------------------------------------------------------------------------------------------
    // Background colors
    //------------------------------------------------------------------------------------------------------------------

    bgBlack: "\x1b[40m",
    bgRed: "\x1b[41m",
    bgGreen: "\x1b[42m",
    bgYellow: "\x1b[43m",
    bgBlue: "\x1b[44m",
    bgMagenta: "\x1b[45m",
    bgCyan: "\x1b[46m",
    bgWhite: "\x1b[47m",
    bgGray: "\x1b[100m",
    bgDefault: "\x1b[49m",

    //------------------------------------------------------------------------------------------------------------------
    // Brighten/darken
    //------------------------------------------------------------------------------------------------------------------

    bright: "\x1b[1m",
    normal: "\x1b[22m",
    dim: "\x1b[2m",

    //------------------------------------------------------------------------------------------------------------------
    // Lines
    //------------------------------------------------------------------------------------------------------------------

    underline: "\x1b[4m",
    noUnderline: "\x1b[24m",

    overline: "\x1b[53m",
    noOverline: "\x1b[55m",

    doubleLine: "\x1b[4m\x1b[53m",
    noLine: "\x1b[24m\x1b[55m",

    //------------------------------------------------------------------------------------------------------------------
    // reset
    //----------------------------------------------------------------------------------------------------------------*/

    reset: "\x1b[0m",
} as const;

/**---------------------------------------------------------------------------------------------------------------------
 * Map an ANSI escape code to an empty string if running within VSCode
 *--------------------------------------------------------------------------------------------------------------------*/

let USE_ANSI_ESCAPE_CODES: boolean | undefined = undefined;

export function enableAnsiEscapeCodes(value: boolean | undefined = undefined) {
    USE_ANSI_ESCAPE_CODES = value;
}

function ifEnabled(code: string) {
    try {
        if (
            false === USE_ANSI_ESCAPE_CODES ||
            (undefined === USE_ANSI_ESCAPE_CODES && undefined !== process.env["VSCODE_CWD"])
        ) {
            return "";
        }
    } catch (_) {}
    return code;
}

/**---------------------------------------------------------------------------------------------------------------------
 * Wrap text into ANSI escape codes
 *--------------------------------------------------------------------------------------------------------------------*/

export namespace ansi {
    /**-----------------------------------------------------------------------------------------------------------------
     * Wrap the given text into "foreground black" ANSI escape codes
     *
     * @param text The text to wrap
     * @return Returns the given text wrapped into "foreground black" ANSI escape codes
     *----------------------------------------------------------------------------------------------------------------*/

    export function fgBlack(text: string) {
        return `${ifEnabled(ANSI_ESC_CODES.fgBlack)}${text}${ifEnabled(ANSI_ESC_CODES.fgDefault)}`;
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Wrap the given text into "foreground red" ANSI escape codes
     *
     * @param text The text to wrap
     * @return Returns the given text wrapped into "foreground red" ANSI escape codes
     *----------------------------------------------------------------------------------------------------------------*/

    export function fgRed(text: string) {
        return `${ifEnabled(ANSI_ESC_CODES.fgRed)}${text}${ifEnabled(ANSI_ESC_CODES.fgDefault)}`;
    }
    /**-----------------------------------------------------------------------------------------------------------------
     * Wrap the given text into "foreground green" ANSI escape codes
     *
     * @param text The text to wrap
     * @return Returns the given text wrapped into "foreground green" ANSI escape codes
     *----------------------------------------------------------------------------------------------------------------*/

    export function fgGreen(text: string) {
        return `${ifEnabled(ANSI_ESC_CODES.fgGreen)}${text}${ifEnabled(ANSI_ESC_CODES.fgDefault)}`;
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Wrap the given text into "foreground yellow" ANSI escape codes
     *
     * @param text The text to wrap
     * @return Returns the given text wrapped into "foreground yellow" ANSI escape codes
     *----------------------------------------------------------------------------------------------------------------*/

    export function fgYellow(text: string) {
        return `${ifEnabled(ANSI_ESC_CODES.fgYellow)}${text}${ifEnabled(ANSI_ESC_CODES.fgDefault)}`;
    }
    /**-----------------------------------------------------------------------------------------------------------------
     * Wrap the given text into "foreground blue" ANSI escape codes
     *
     * @param text The text to wrap
     * @return Returns the given text wrapped into "foreground blu" ANSI escape codes
     *----------------------------------------------------------------------------------------------------------------*/

    export function fgBlue(text: string) {
        return `${ifEnabled(ANSI_ESC_CODES.fgBlue)}${text}${ifEnabled(ANSI_ESC_CODES.fgDefault)}`;
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Wrap the given text into "foreground magenta" ANSI escape codes
     *
     * @param text The text to wrap
     * @return Returns the given text wrapped into "foreground magenta" ANSI escape codes
     *----------------------------------------------------------------------------------------------------------------*/

    export function fgMagenta(text: string) {
        return `${ifEnabled(ANSI_ESC_CODES.fgMagenta)}${text}${ifEnabled(ANSI_ESC_CODES.fgDefault)}`;
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Wrap the given text into "foreground cyan" ANSI escape codes
     *
     * @param text The text to wrap
     * @return Returns the given text wrapped cyan "foreground red" ANSI escape codes
     *----------------------------------------------------------------------------------------------------------------*/

    export function fgCyan(text: string) {
        return `${ifEnabled(ANSI_ESC_CODES.fgCyan)}${text}${ifEnabled(ANSI_ESC_CODES.fgDefault)}`;
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Wrap the given text into "foreground white" ANSI escape codes
     *
     * @param text The text to wrap
     * @return Returns the given text wrapped into "foreground white" ANSI escape codes
     *----------------------------------------------------------------------------------------------------------------*/

    export function fgWhite(text: string) {
        return `${ifEnabled(ANSI_ESC_CODES.fgWhite)}${text}${ifEnabled(ANSI_ESC_CODES.fgDefault)}`;
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Wrap the given text into "foreground gray" ANSI escape codes
     *
     * @param text The text to wrap
     * @return Returns the given text wrapped into "foreground gray" ANSI escape codes
     *----------------------------------------------------------------------------------------------------------------*/

    export function fgGray(text: string) {
        return `${ifEnabled(ANSI_ESC_CODES.fgGray)}${text}${ifEnabled(ANSI_ESC_CODES.fgDefault)}`;
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Wrap the given text into "background black" ANSI escape codes
     *
     * @param text The text to wrap
     * @return Returns the given text wrapped into "background black" ANSI escape codes
     *----------------------------------------------------------------------------------------------------------------*/

    export function bgBlack(text: string) {
        return `${ifEnabled(ANSI_ESC_CODES.bgBlack)}${text}${ifEnabled(ANSI_ESC_CODES.bgDefault)}`;
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Wrap the given text into "background red" ANSI escape codes
     *
     * @param text The text to wrap
     * @return Returns the given text wrapped into "background red" ANSI escape codes
     *----------------------------------------------------------------------------------------------------------------*/

    export function bgRed(text: string) {
        return `${ifEnabled(ANSI_ESC_CODES.bgRed)}${text}${ifEnabled(ANSI_ESC_CODES.bgDefault)}`;
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Wrap the given text into "background green" ANSI escape codes
     *
     * @param text The text to wrap
     * @return Returns the given text wrapped into "background green" ANSI escape codes
     *----------------------------------------------------------------------------------------------------------------*/

    export function bgGreen(text: string) {
        return `${ifEnabled(ANSI_ESC_CODES.bgGreen)}${text}${ifEnabled(ANSI_ESC_CODES.bgDefault)}`;
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Wrap the given text into "background yellow" ANSI escape codes
     *
     * @param text The text to wrap
     * @return Returns the given text wrapped into "background yellow" ANSI escape codes
     *----------------------------------------------------------------------------------------------------------------*/

    export function bgYellow(text: string) {
        return `${ifEnabled(ANSI_ESC_CODES.bgYellow)}${text}${ifEnabled(ANSI_ESC_CODES.bgDefault)}`;
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Wrap the given text into "background blue" ANSI escape codes
     *
     * @param text The text to wrap
     * @return Returns the given text wrapped into "background blue" ANSI escape codes
     *----------------------------------------------------------------------------------------------------------------*/

    export function bgBlue(text: string) {
        return `${ifEnabled(ANSI_ESC_CODES.bgBlue)}${text}${ifEnabled(ANSI_ESC_CODES.bgDefault)}`;
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Wrap the given text into "background magenta" ANSI escape codes
     *
     * @param text The text to wrap
     * @return Returns the given text wrapped into "background magenta" ANSI escape codes
     *----------------------------------------------------------------------------------------------------------------*/

    export function bgMagenta(text: string) {
        return `${ifEnabled(ANSI_ESC_CODES.bgMagenta)}${text}${ifEnabled(ANSI_ESC_CODES.bgDefault)}`;
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Wrap the given text into "background cyan" ANSI escape codes
     *
     * @param text The text to wrap
     * @return Returns the given text wrapped into "background cyan" ANSI escape codes
     *----------------------------------------------------------------------------------------------------------------*/

    export function bgCyan(text: string) {
        return `${ifEnabled(ANSI_ESC_CODES.bgCyan)}${text}${ifEnabled(ANSI_ESC_CODES.bgDefault)}`;
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Wrap the given text into "background white" ANSI escape codes
     *
     * @param text The text to wrap
     * @return Returns the given text wrapped into "background white" ANSI escape codes
     *----------------------------------------------------------------------------------------------------------------*/

    export function bgWhite(text: string) {
        return `${ifEnabled(ANSI_ESC_CODES.bgWhite)}${text}${ifEnabled(ANSI_ESC_CODES.bgDefault)}`;
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Wrap the given text into "background gray" ANSI escape codes
     *
     * @param text The text to wrap
     * @return Returns the given text wrapped into "background gray" ANSI escape codes
     *----------------------------------------------------------------------------------------------------------------*/

    export function bgGray(text: string) {
        return `${ifEnabled(ANSI_ESC_CODES.bgGray)}${text}${ifEnabled(ANSI_ESC_CODES.bgDefault)}`;
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Wrap the given text into "bright" ANSI escape codes
     *
     * @param text The text to wrap
     * @return Returns the given text wrapped into "bright" ANSI escape codes
     *----------------------------------------------------------------------------------------------------------------*/

    export function bright(text: string) {
        return `${ifEnabled(ANSI_ESC_CODES.bright)}${text}${ifEnabled(ANSI_ESC_CODES.normal)}`;
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Wrap the given text into "dim(med)" ANSI escape codes
     *
     * @param text The text to wrap
     * @return Returns the given text wrapped into "dim(med)" ANSI escape codes
     *----------------------------------------------------------------------------------------------------------------*/

    export function dim(text: string) {
        return `${ifEnabled(ANSI_ESC_CODES.dim)}${text}${ifEnabled(ANSI_ESC_CODES.normal)}`;
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Wrap the given text into "underline" ANSI escape codes
     *
     * @param text The text to wrap
     * @return Returns the given text wrapped into "underline" ANSI escape codes
     *----------------------------------------------------------------------------------------------------------------*/

    export function underline(text: string) {
        return `${ifEnabled(ANSI_ESC_CODES.underline)}${text}${ifEnabled(ANSI_ESC_CODES.noUnderline)}`;
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Wrap the given text into "overline" ANSI escape codes
     *
     * @param text The text to wrap
     * @return Returns the given text wrapped into "overline" ANSI escape codes
     *----------------------------------------------------------------------------------------------------------------*/

    export function overline(text: string) {
        return `${ifEnabled(ANSI_ESC_CODES.overline)}${text}${ifEnabled(ANSI_ESC_CODES.noOverline)}`;
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Wrap the given text into "under- and overline" ANSI escape codes
     *
     * @param text The text to wrap
     * @return Returns the given text wrapped into "under- and overline" ANSI escape codes
     *----------------------------------------------------------------------------------------------------------------*/

    export function doubleLine(text: string) {
        return `${ifEnabled(ANSI_ESC_CODES.doubleLine)}${text}${ifEnabled(ANSI_ESC_CODES.noLine)}`;
    }
}
