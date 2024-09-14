import { privateCoreFunction, privateTestFunction, publicCoreFunction, publicTestFunction } from "./api/import-cli.js";
import { privateCliFunction, publicCliFunction } from "./lib/cli-function.js";

publicTestFunction();
privateTestFunction();

publicCoreFunction();
privateCoreFunction();

publicCliFunction();
privateCliFunction();

// @ts-expect-error
document satisfies Document;
