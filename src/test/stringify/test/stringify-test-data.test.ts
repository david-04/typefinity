import { describe, it } from "node:test";
import { expect } from "../../expect.js";
import { stringifyTestData } from "../stringify-test-data.js";

describe("stringifyTestData", () => {
    const stringifyable = (input: unknown, expected: string) => [JSON.stringify(input), input, expected] as const;
    const namedArrowFunction = (a: number, b: number) => {
        const sum = a + b;
        return sum;
    };
    function namedFunction(a: number, b: number) {
        const sum = a + b;
        return sum;
    }
    class MyError extends Error {
        public constructor(
            message: string,
            public readonly prop: number,
            cause?: unknown
        ) {
            super(message, { cause });
        }
    }
    class MyParentClass {
        public constructor(private readonly prop1: string) {}
        public parentMethod() {
            console.log(this.prop1);
        }
    }
    class MyChildClass extends MyParentClass {
        public constructor(
            prop1: string,
            public readonly prop2: number,
            public readonly prop3: Function
        ) {
            super(prop1);
        }
    }

    const testCases: ReadonlyArray<readonly [what: string, input: unknown, expectedOutput: string]> = [
        ["undefined", undefined, "undefined"],
        stringifyable(null, "null"),
        //
        // boolean
        //
        stringifyable(true, "true"),
        stringifyable(false, "false"),
        //
        // number
        //
        stringifyable(0, "0"),
        stringifyable(-3.5, "-3.5"),
        ["NaN", NaN, "NaN"],
        ["Infinity", Infinity, "Infinity"],
        ["-Infinity", -Infinity, "-Infinity"],
        //
        // bigint
        //
        ["0n", 0n, "0n"],
        ["-3n", -3n, "-3n"],
        //
        // string
        //
        stringifyable(``, `""`),
        stringifyable(` `, `" "`),
        stringifyable(` a b `, `" a b "`),
        stringifyable(` a\\b\\c \t\n `, `" a\\\\b\\\\c \t\n "`),
        stringifyable(`it's`, `"it's"`),
        stringifyable(`say "hi"`, `'say "hi"'`),
        stringifyable(`it's "its"`, `\`it's "its"\``),
        stringifyable(` ''' """ \${`, `\` ''' """ \\\${\``),
        //
        // symbol
        //
        [`Symbol()`, Symbol(), `Symbol()`],
        [`Symbol("my symbol")`, Symbol("my symbol"), `Symbol(my symbol)`],
        //
        // function
        //
        [
            "named arrow function",
            namedArrowFunction,
            `(a, b) => {\n        const sum = a + b;\n        return sum;\n    }`,
        ],
        ["anonymous arrow function", (a: number, b: number) => a + b, `(a, b) => a + b`],
        ["named function", namedFunction, "namedFunction"],
        //
        // regular expression
        //
        [`/reg.*exp/gi`, /reg.*exp/gi, `/reg.*exp/gi`],
        //
        // array
        //
        [`[]`, [], `[]`],
        [`["a", 1, true, null, { key: 1 }]`, ["a", 1, true, null, { key: 1 }], `["a", 1, true, null, { key: 1 }]`],
        //
        // map
        //
        [`empty map`, new Map<unknown, unknown>(), `Map()`],
        [
            `map`,
            new Map<unknown, unknown>([
                ["key", "value"],
                [true, 1],
            ]),
            `Map("key": "value", true: 1)`,
        ],
        //
        // set
        //
        [`empty set`, new Set<unknown>(), `Set()`],
        [
            `set`,
            new Set<unknown>([null, undefined, 1, true, "string", { key: Symbol() }]),
            `Set("string", 1, null, true, undefined, { key: Symbol() })`,
        ],
        //
        // error
        //
        ["standard error", new Error("standard error"), `Error("standard error")`],
        [
            "custom error with properties and cause",
            new MyError("my error", 123, new Error("caused by")),
            `MyError("my error", prop=123, cause=Error("caused by"))`,
        ],
        //
        // object literal
        //
        stringifyable({}, `{ }`),
        stringifyable(
            { object: { set: new Set(["1", 2]) }, array: [1, "string"] },
            `{ array: [1, "string"], object: { set: Set("1", 2) } }`
        ),
        //
        // class instance
        //
        ["child class", new MyChildClass("value", 123, () => true), `MyChildClass(prop1="value", prop2=123)`],
        [
            "anonymous class",
            new (class extends MyParentClass {
                public constructor(
                    prop1: string,
                    public readonly prop2: number,
                    public readonly prop3: Function
                ) {
                    super(prop1);
                }
            })("value", 123, () => true),
            `<anonymous>(prop1="value", prop2=123)`,
        ],
    ];

    testCases.forEach(([what, input, expectedOutput]) => {
        it(`stringifies ${what}`, () => {
            expect(stringifyTestData(input)).toEqual(expectedOutput);
        });
    });
});
