//----------------------------------------------------------------------------------------------------------------------
// Create a preprocessed mirror of the sources with normalized JavaDoc comments
//----------------------------------------------------------------------------------------------------------------------

import fs from "fs";
import process from "process";
import path from "path";

const [_node, _script, moduleParameter, source, ...unusedParameters] = process.argv;
const subModule = "root" === moduleParameter ? "" : `/${moduleParameter?.trim() || "UNDEFINED"}`;
const MAIN_MODULE_DECLARATION = `declare module '@david-04/typefinity${subModule}'`;
const MAIN_MODULE_DECLARATION_REGEXP = new RegExp(MAIN_MODULE_DECLARATION, "g");

main();

//----------------------------------------------------------------------------------------------------------------------
// Main program
//----------------------------------------------------------------------------------------------------------------------

function main() {
    if (source && 0 === unusedParameters.length) {
        reformat(source, source.replace(/\.d\.ts$/, "-module.d.ts"), formatModule);
        reformat(source, source.replace(/\.d\.ts$/, "-global.d.ts"), formatGlobal);
    } else {
        throw new Error("Usage: node modify-declaration.js <dts-file>");
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Sync a directory
//----------------------------------------------------------------------------------------------------------------------

function reformat(source: string, destination: string, formatter: (fileContent: string) => string) {
    const fileContent = fs.readFileSync(source).toString();
    const reformattedFileContent = formatter(fileContent);
    fs.mkdirSync(path.join(destination, ".."), { recursive: true });
    fs.writeFileSync(destination, reformattedFileContent);
}

//----------------------------------------------------------------------------------------------------------------------
// Reformat the declaration for the "module" scope
//----------------------------------------------------------------------------------------------------------------------

function formatModule(fileContent: string) {
    return removeMainModule(fileContent)
        .replace(/declare module '@david-04\/typefinity\/[^']*'/g, MAIN_MODULE_DECLARATION)
        .replace(/\n\}\s*declare module '@david-04\/typefinity'\s*\{/g, "\n")
        .replace(/import\s+\{[^}]*\}\s+from\s+"@david-04\/typefinity[^"]*";/g, "")
        .replace(/(tft|tfi|tfu)\$[0-9a-z_]+\./gi, "$1.");
}

//----------------------------------------------------------------------------------------------------------------------
// Reformat the declaration for the "global" scope
//----------------------------------------------------------------------------------------------------------------------

function formatGlobal(fileContent: string) {
    const withoutMain = formatModule(fileContent);
    const module = withoutMain.replace(MAIN_MODULE_DECLARATION_REGEXP, "declare module '@david-04/typefinity/global'");
    const global = withoutMain
        .replace(MAIN_MODULE_DECLARATION_REGEXP, "declare global")
        .replace(/\n[ \t]*export[ \t]/g, "\n");
    return `export {} ${module}${global}`;
}

//----------------------------------------------------------------------------------------------------------------------
// Remove the "declare module '@david-04/typefinity'" block
//----------------------------------------------------------------------------------------------------------------------

function removeMainModule(fileContent: string) {
    const start = fileContent.indexOf(MAIN_MODULE_DECLARATION);
    const endToken = "\n}";
    if (0 <= start) {
        const end = fileContent.indexOf(endToken, start);
        if (0 <= end) {
            return fileContent.substring(0, start) + fileContent.substring(end + endToken.length);
        }
    }
    throw new Error("Failed to find declaration for module @david-04/typefinity");
}
