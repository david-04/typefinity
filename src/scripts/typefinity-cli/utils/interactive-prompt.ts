import { createInterface } from "readline";
import { unify } from "../../../core/data/utils/unify";

const INVALID_INPUT = "Invalid input";

//----------------------------------------------------------------------------------------------------------------------
// Prompt the user for input
//----------------------------------------------------------------------------------------------------------------------

export async function interactivePrompt(options: interactivePrompt.Options) {
    if (undefined !== options.presetAnswer) {
        const validationResult = processAndValidateInput(options.presetAnswer, options);
        if (options.displayValidPresetAnswer || validationResult.error) {
            const error = validationResult.error ? ["", validationResult.error] : [];
            [...unify.toArray(options.question), `> ${options.presetAnswer}`, ...error, ""]
                .forEach(line => console.log(line));
        }
        if (validationResult.valid) {
            return validationResult.input;
        }
    }
    return promptUserUntilValidInput(options);
}

//----------------------------------------------------------------------------------------------------------------------
// Prompt for input
//----------------------------------------------------------------------------------------------------------------------

export namespace interactivePrompt {

    //------------------------------------------------------------------------------------------------------------------
    // Options to configure the prompt
    //------------------------------------------------------------------------------------------------------------------

    export interface Options {
        question: string | Iterable<string>;
        presetAnswer?: string;
        validate?: RegExp | ((input: string) => unknown);
        map?: (input: string) => string | Error | never;
        displayValidPresetAnswer?: boolean;
        preserveWhitespace?: boolean;
    }

    export async function yesNo(options: Omit<Options, "validate" | "map">) {
        const result = await interactivePrompt({
            ...options,
            validate: /^(y(es)?|no?|true|false)$/i,
        });
        return !!result.match(/^[yt]/i);
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Repeatedly prompt the user until valid input is provided
//----------------------------------------------------------------------------------------------------------------------

async function promptUserUntilValidInput(options: interactivePrompt.Options) {
    let input: string | undefined;
    do {
        console.log(options.question);
        let validationResult = processAndValidateInput(await readLine(), options);
        while (!validationResult.valid && !validationResult.error) {
            validationResult = processAndValidateInput(await readLine(), options);
        }
        if (validationResult.valid) {
            input = validationResult.input;
        } else {
            console.log("");
            console.log(validationResult.error);
            console.log("");
        }
    } while (undefined === input);
    return input;
}

//----------------------------------------------------------------------------------------------------------------------
// Trim, map and validate the given input
//----------------------------------------------------------------------------------------------------------------------

export function processAndValidateInput(input: string, options: interactivePrompt.Options) {
    try {
        return trimAndMapAndValidateInput(input, options);
    } catch (error) {
        const errorMessage = (error instanceof Error ? error.message : `${error}`) ?? INVALID_INPUT;
        return { input: input, valid: false, error: errorMessage || INVALID_INPUT };
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Trim the input and pass it through the mapper (if provided)
//----------------------------------------------------------------------------------------------------------------------

function trimAndMapAndValidateInput(input: string, options: interactivePrompt.Options) {
    const trimmed = options.preserveWhitespace ? input : input.trim();
    const mapped = options.map ? options.map(trimmed) : trimmed;
    const validationResult = "string" === typeof mapped
        ? validateInput(mapped, options)
        : { valid: false, error: mapped.message.trim() || INVALID_INPUT };
    return { input: "string" === typeof mapped ? mapped : trimmed, ...validationResult };
}

//----------------------------------------------------------------------------------------------------------------------
// Validate the input
//----------------------------------------------------------------------------------------------------------------------

function validateInput(input: string, options: interactivePrompt.Options) {
    if (options.validate instanceof RegExp) {
        return checkValidationResult(input, options.validate.test(input));
    } else if (options.validate) {
        return checkValidationResult(input, options.validate(input));
    } else {
        return { valid: !!input || !!options.map };
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Throw an error if the validation returns an error or a falsy value
//----------------------------------------------------------------------------------------------------------------------

function checkValidationResult(input: string, result: unknown) {
    if (result instanceof Error) {
        return { valid: false, error: result.message.trim() || INVALID_INPUT };
    } else if (!result) {
        return { valid: false, error: input ? INVALID_INPUT : undefined };
    } else {
        return { valid: true };
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Read a line of user input
//----------------------------------------------------------------------------------------------------------------------

async function readLine(): Promise<string> {
    const readlineInterface = createInterface({ input: process.stdin, output: process.stdout });
    return new Promise(resolve => readlineInterface.question("> ", answer => {
        readlineInterface.close();
        resolve(answer);
    }));
}
