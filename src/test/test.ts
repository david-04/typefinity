import { privateTestFunction, publicTestFunction } from "./lib/test-function.js";

publicTestFunction();
privateTestFunction();

// @ts-expect-error
document satisfies Document;
