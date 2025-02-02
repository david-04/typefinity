/**---------------------------------------------------------------------------------------------------------------------
 * ANSI escape codes tob e used in console.log() and the likes
 *--------------------------------------------------------------------------------------------------------------------*/

export const ANSI_ESC_CODES = {
    //------------------------------------------------------------------------------------------------------------------
    // Foreground colors
    //------------------------------------------------------------------------------------------------------------------

    fgBlack: escapeCode("\x1b[30m"),
    fgRed: escapeCode("\x1b[31m"),
    fgGreen: escapeCode("\x1b[32m"),
    fgYellow: escapeCode("\x1b[33m"),
    fgBlue: escapeCode("\x1b[34m"),
    fgMagenta: escapeCode("\x1b[35m"),
    fgCyan: escapeCode("\x1b[36m"),
    fgWhite: escapeCode("\x1b[37m"),
    fgGray: escapeCode("\x1b[90m"),

    //------------------------------------------------------------------------------------------------------------------
    // Background colors
    //------------------------------------------------------------------------------------------------------------------

    bgBlack: escapeCode("\x1b[40m"),
    bgRed: escapeCode("\x1b[41m"),
    vgGreen: escapeCode("\x1b[42m"),
    bgYellow: escapeCode("\x1b[43m"),
    bgBlue: escapeCode("\x1b[44m"),
    bgMagenta: escapeCode("\x1b[45m"),
    bgCyan: escapeCode("\x1b[46m"),
    bgWhite: escapeCode("\x1b[47m"),
    bgGray: escapeCode("\x1b[100m"),

    //------------------------------------------------------------------------------------------------------------------
    // Utilities
    //------------------------------------------------------------------------------------------------------------------

    reset: escapeCode("\x1b[0m"),
    bright: escapeCode("\x1b[1m"),
    dim: escapeCode("\x1b[2m"),
    underscore: escapeCode("\x1b[4m"),
    blink: escapeCode("\x1b[5m"),
    reverse: escapeCode("\x1b[7m"),
    hidden: escapeCode("\x1b[8m"),
} as const;

/**---------------------------------------------------------------------------------------------------------------------
 * Map an ANSI escape code to an empty string if running within VSCode
 *--------------------------------------------------------------------------------------------------------------------*/

function escapeCode(code: string) {
    try {
        if (process.env["VSCODE_CWD"]) {
            return "";
        }
    } catch (_) {}
    return code;
}
