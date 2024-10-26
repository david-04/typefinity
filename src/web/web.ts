import { privateCoreFunction, publicCoreFunction } from "./api/import-web.js";
import { privateWebFunction, publicWebFunction } from "./lib/web-function.js";

publicCoreFunction();
privateCoreFunction();

publicWebFunction();
privateWebFunction();

document satisfies Document;
