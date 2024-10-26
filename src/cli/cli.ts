import { privateCoreFunction, publicCoreFunction } from "./api/import-cli.js";
import { privateCliFunction, publicCliFunction } from "./lib/cli-function.js";

publicCoreFunction();
privateCoreFunction();

publicCliFunction();
privateCliFunction();

// @ts-expect-error
document satisfies Document;
