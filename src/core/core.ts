import { privateTestFunction, publicTestFunction } from "./api/import-core.js";
import { privateCoreFunction, publicCoreFunction } from "./lib/core-function.js";

publicTestFunction();
privateTestFunction();

publicCoreFunction();
privateCoreFunction();

// @ts-expect-error
document satisfies Document;
