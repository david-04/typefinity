import { stringifyNumber, stringifyString } from "./stringify-test-data.js";

/**---------------------------------------------------------------------------------------------------------------------
 * Stringify the value into a short description. Classes are only referenced by their class names
 *--------------------------------------------------------------------------------------------------------------------*/

export function classifyTestData(value: unknown): string {
    switch (typeof value) {
        case "undefined":
            return "undefined";
        case "boolean":
            return `${value}`;
        case "number":
            return stringifyNumber(value);
        case "bigint":
            return `${value}n`;
        case "string":
            return stringifyString(value);
        case "symbol":
            return value.toString().replace(/^['"]/, "").replace(/['"]$/, "");
        case "function":
            return value.prototype && value.name ? `function ${value.name}` : "a function";
        case "object":
            return value ? classifyObject(value) : "null";
        default:
            throw new Error(`Stringification for values of type ${typeof value} is not implemented`);
    }
}

/**---------------------------------------------------------------------------------------------------------------------
 * Classify an object
 *--------------------------------------------------------------------------------------------------------------------*/

function classifyObject(object: object) {
    if (object instanceof Map) {
        return "a map";
    } else if (object instanceof Set) {
        return "a set";
    } else if (object instanceof Array) {
        return "an array";
    } else if (object instanceof RegExp) {
        return `${object}`;
    }
    if (Object.getPrototypeOf(object) === Object.prototype) {
        return "an object literal";
    }
    const className = object.constructor.name;
    return className ? `an instance of ${className}` : `an instance of an anonymous class`;
}
