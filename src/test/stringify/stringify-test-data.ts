const SPACER = " ";
const COMMA_SPACER = `,${SPACER}`;
const EXCLUDED_PROPERTIES = new Set<string>(["__proto__"]);
const EXCLUDED_ERROR_PROPERTIES = new Set<string>([
    ...Array.from(EXCLUDED_PROPERTIES.values()),
    "cause",
    "message",
    "name",
    "stack",
]);

/**---------------------------------------------------------------------------------------------------------------------
 * Stringify the given value into a compact and readable representation
 *--------------------------------------------------------------------------------------------------------------------*/

export function stringifyTestData(value: unknown): string {
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
            return value.prototype && value.name ? `${value.name}` : value.toString();
        case "object":
            return null === value ? "null" : stringifyObject(value);
        default:
            throw new Error(`Stringification for values of type ${typeof value} is not implemented`);
    }
}

//----------------------------------------------------------------------------------------------------------------------
//
//   ##    ## ##     ## ##     ## ########  ######## ########
//   ###   ## ##     ## ###   ### ##     ## ##       ##     ##
//   ####  ## ##     ## #### #### ##     ## ##       ##     ##
//   ## ## ## ##     ## ## ### ## ########  ######   ########
//   ##  #### ##     ## ##     ## ##     ## ##       ##   ##
//   ##   ### ##     ## ##     ## ##     ## ##       ##    ##
//   ##    ##  #######  ##     ## ########  ######## ##     ##
//
//----------------------------------------------------------------------------------------------------------------------

function stringifyNumber(value: number) {
    if (isNaN(value)) {
        return "NaN";
    } else if (value === Infinity) {
        return "Infinity";
    } else if (value === -Infinity) {
        return "-Infinity";
    } else {
        return `${value}`;
    }
}

//----------------------------------------------------------------------------------------------------------------------
//
//    ######  ######## ########  #### ##    ##  ######
//   ##    ##    ##    ##     ##  ##  ###   ## ##    ##
//   ##          ##    ##     ##  ##  ####  ## ##
//    ######     ##    ########   ##  ## ## ## ##   ####
//         ##    ##    ##   ##    ##  ##  #### ##    ##
//   ##    ##    ##    ##    ##   ##  ##   ### ##    ##
//    ######     ##    ##     ## #### ##    ##  ######
//
//----------------------------------------------------------------------------------------------------------------------

function stringifyString(value: string) {
    const values = [
        ['"', value.replaceAll("\\", "\\\\").replaceAll('"', '\\"'), '"'].join(""),
        ["'", value.replaceAll("\\", "\\\\").replaceAll("'", "\\'"), "'"].join(""),
        ["`", value.replaceAll("\\", "\\\\").replaceAll("`", "\\`").replaceAll("${", "\\${"), "`"].join(""),
    ];
    const length = values.reduce((length, current) => Math.min(length, current.length), Number.MAX_VALUE);
    return values.find(current => current.length === length) ?? JSON.stringify(value);
}

//----------------------------------------------------------------------------------------------------------------------
//
//    #######  ########        ## ########  ######  ########
//   ##     ## ##     ##       ## ##       ##    ##    ##
//   ##     ## ##     ##       ## ##       ##          ##
//   ##     ## ########        ## ######   ##          ##
//   ##     ## ##     ## ##    ## ##       ##          ##
//   ##     ## ##     ## ##    ## ##       ##    ##    ##
//    #######  ########   ######  ########  ######     ##
//
//----------------------------------------------------------------------------------------------------------------------

function stringifyObject(value: object): string {
    if (null === value) {
        return "null";
    } else if (Array.isArray(value)) {
        return `[${value.map(stringifyTestData).join(COMMA_SPACER)}]`;
    } else if (value instanceof Map) {
        return stringifyMap(value);
    } else if (value instanceof Set) {
        return `Set(${Array.from(value.values()).map(stringifyTestData).sort().join(COMMA_SPACER)})`;
    } else if (value instanceof Error) {
        return stringifyError(value);
    } else if (value instanceof RegExp) {
        return `${value}`;
    } else {
        return stringifyClassInstance(value);
    }
}

//----------------------------------------------------------------------------------------------------------------------
//
//   ##     ##    ###    ########
//   ###   ###   ## ##   ##     ##
//   #### ####  ##   ##  ##     ##
//   ## ### ## ##     ## ########
//   ##     ## ######### ##
//   ##     ## ##     ## ##
//   ##     ## ##     ## ##
//
//----------------------------------------------------------------------------------------------------------------------

function stringifyMap(map: ReadonlyMap<unknown, unknown>) {
    const values = Array.from(map.entries())
        .map(([key, value]) => ({ key: stringifyTestData(key), value: stringifyTestData(value) }) as const)
        .map(({ key, value }) => `${key}: ${value}`)
        .sort();
    return `Map(${values.join(COMMA_SPACER)})`;
}

//----------------------------------------------------------------------------------------------------------------------
//
//   ######## ########  ########   #######  ########
//   ##       ##     ## ##     ## ##     ## ##     ##
//   ##       ##     ## ##     ## ##     ## ##     ##
//   ######   ########  ########  ##     ## ########
//   ##       ##   ##   ##   ##   ##     ## ##   ##
//   ##       ##    ##  ##    ##  ##     ## ##    ##
//   ######## ##     ## ##     ##  #######  ##     ##
//
//----------------------------------------------------------------------------------------------------------------------

function stringifyError(error: Error) {
    const type = error.constructor.name || error.name || "Error";
    const message = error.message ? [stringifyString(error.message)] : [];
    const properties = stringifyProperties(error, {
        excludeFunctions: true,
        excludeProperties: EXCLUDED_ERROR_PROPERTIES,
        keyValueSeparator: "=",
    });
    const cause = error.cause ? [`cause=${stringifyTestData(error.cause)}`] : [];
    return `${type}(${[...message, ...(properties ? [properties] : []), ...cause].join(COMMA_SPACER)})`;
}

//----------------------------------------------------------------------------------------------------------------------
//
//    ######  ##          ###     ######   ######
//   ##    ## ##         ## ##   ##    ## ##    ##
//   ##       ##        ##   ##  ##       ##
//   ##       ##       ##     ##  ######   ######
//   ##       ##       #########       ##       ##
//   ##    ## ##       ##     ## ##    ## ##    ##
//    ######  ######## ##     ##  ######   ######
//
//----------------------------------------------------------------------------------------------------------------------

function stringifyClassInstance(instance: object) {
    const isObjectLiteral = Object.getPrototypeOf(instance) === Object.prototype;
    const properties = stringifyProperties(instance, {
        excludeFunctions: true,
        excludeProperties: EXCLUDED_PROPERTIES,
        keyValueSeparator: isObjectLiteral ? ": " : "=",
    });
    if (isObjectLiteral) {
        return properties ? `{${SPACER}${properties}${SPACER}}` : "{ }";
    } else {
        return `${instance.constructor.name || "<anonymous>"}(${properties})`;
    }
}

function stringifyProperties(...params: Parameters<typeof getProperties>) {
    return getProperties(...params)
        .map(({ key, value }) => ({ key: stringifyPropertyName(key), value: stringifyTestData(value) }))
        .map(({ key, value }) => `${key}${params[1].keyValueSeparator}${value}`)
        .join(COMMA_SPACER);
}

function getProperties(
    instance: object,
    options: {
        readonly excludeFunctions: boolean;
        readonly excludeProperties: Set<string>;
        readonly keyValueSeparator: string;
    }
) {
    const keys = new Set<string>();
    for (let prototype = instance; prototype; prototype = Object.getPrototypeOf(prototype)) {
        Object.getOwnPropertyNames(prototype).forEach(key => keys.add(key));
    }
    return Array.from(keys.values())
        .map(key => ({ key, value: instance[key as keyof typeof instance] }) as const)
        .filter(({ key }) => !options.excludeProperties.has(key))
        .filter(({ value }) => !options.excludeFunctions || "function" !== typeof value)
        .sort((a, b) => a.key.localeCompare(b.key));
}

function stringifyPropertyName(name: string) {
    return /^\w+$/.test(name) ? name : stringifyString(name);
}
