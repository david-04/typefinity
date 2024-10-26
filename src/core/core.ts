import { privateCoreFunction, publicCoreFunction } from "./lib/core-function.js";

publicCoreFunction();
privateCoreFunction();

// @ts-expect-error
document satisfies Document;
