import { FriendlyError } from "../../../core/misc/error/friendly-error";

const OPTION_PREFIX = "--";

//----------------------------------------------------------------------------------------------------------------------
// Parse command line options and normalize option names
//----------------------------------------------------------------------------------------------------------------------

export function parseOptions(parameters: Iterable<string>) {
    const result = new Map<string, string>();
    for (const parameter of parameters) {
        const { name, value } = splitParameterNameAndValue(parameter.trim());
        result.set(name, value);
    }
    return result;
}

//----------------------------------------------------------------------------------------------------------------------
// Split a parameter into a normalized/camel-cased key and trimmed value
//----------------------------------------------------------------------------------------------------------------------

function splitParameterNameAndValue(trimmed: string) {
    const index = trimmed.indexOf("=");
    if (0 <= index) {
        const name = normalizeParameterName(trimmed.substring(0, index));
        if (name) {
            return { name, value: trimmed.substring(index + 1).trim() };
        }
    }
    throw new FriendlyError(`Invalid command line option: "${trimmed}"`);
}

//----------------------------------------------------------------------------------------------------------------------
// Extract the camel-case parameter name, e.g. --show-help => showHelp
//----------------------------------------------------------------------------------------------------------------------

function normalizeParameterName(name: string) {
    if (name.startsWith(OPTION_PREFIX)) {
        const [firstWord, ...remainingWords] = name.substring(OPTION_PREFIX.length).trim().split(/-+/);
        return [firstWord, ...remainingWords.map(capitalizeFirstLetter)].join("");
    } else {
        return undefined;
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Make the first letter uppercase, e.g. help => Help
//----------------------------------------------------------------------------------------------------------------------

function capitalizeFirstLetter(word: string) {
    return 0 < word.length ? word.substring(0, 1).toUpperCase() + word.substring(1) : word;
}
