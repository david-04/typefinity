import { privateCoreFunction, privateTestFunction, publicCoreFunction, publicTestFunction } from "./api/import-web.js";
import { privateWebFunction, publicWebFunction } from "./lib/web-function.js";

publicTestFunction();
privateTestFunction();

publicCoreFunction();
privateCoreFunction();

publicWebFunction();
privateWebFunction();

document satisfies Document;
