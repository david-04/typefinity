import { describe, it } from "../../../test/lib/test-runner.js";
import { randomItem } from "../../data/random.js";
import { Json, ReadonlyJson } from "../json-pojo.js";

const PRIMITIVE = randomItem([undefined, null, true, false, 22, ""]);
const PRIMITIVE_WITHOUT_UNDEFINED = randomItem([null, true, false, 22, ""]);
const isJson = (...json: ReadonlyArray<Json>) => void json;

describe("Json", () => {
    it("is typed correctly", () => {
        isJson(
            PRIMITIVE,
            {},
            { key1: PRIMITIVE, key2: { key3: PRIMITIVE } },
            { key: [{ key: [{ key: PRIMITIVE }, PRIMITIVE_WITHOUT_UNDEFINED] }] },
            [],
            [PRIMITIVE_WITHOUT_UNDEFINED, [PRIMITIVE_WITHOUT_UNDEFINED, PRIMITIVE_WITHOUT_UNDEFINED]]
        );
        // @ts-expect-error: Regular expression is not valid JSON
        isJson(/regexp/);
        // @ts-expect-error: Class instances are not valid JSON
        isJson(new Error());
        // @ts-expect-error: Arrays can't contain "undefined"
        isJson([undefined]);
    });
});

describe("ReadonlyJson", () => {
    it("is typed correctly", () => {
        // A mutable Json can be assigned to a ReadonlyJson
        undefined as Json satisfies ReadonlyJson;
        // @ts-expect-error: ReadonlyJson can't be assigned to a mutable Json
        undefined as ReadonlyJson satisfies Json;
    });
});
