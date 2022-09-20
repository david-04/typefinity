//----------------------------------------------------------------------------------------------------------------------
// Normalize JsDoc comments in *.js and *.d.ts files
//----------------------------------------------------------------------------------------------------------------------

import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

//----------------------------------------------------------------------------------------------------------------------
// Main program
//----------------------------------------------------------------------------------------------------------------------

const [_node, _script, root, ...unusedParameters] = process.argv;

if (root && 0 === unusedParameters.length) {
    processDirectory(root);
} else {
    throw new Error("Usage: node preprocess-sources.js <directory>");
}

//----------------------------------------------------------------------------------------------------------------------
// Recursively process a directory
//----------------------------------------------------------------------------------------------------------------------

function processDirectory(path: string) {
    readdirSync(path, { withFileTypes: true }).forEach(child => {
        const operation = child.isDirectory() ? processDirectory : processFile;
        operation(join(path, child.name));
    });
}

//----------------------------------------------------------------------------------------------------------------------
// Sync a file
//----------------------------------------------------------------------------------------------------------------------

function processFile(path: string) {
    const fileContent = readFileSync(path).toString();
    const normalizedFileContent = normalizeJsDocComments(path, fileContent);
    if (fileContent !== normalizedFileContent) {
        writeFileSync(path, normalizedFileContent);
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Preprocess the file content
//----------------------------------------------------------------------------------------------------------------------

function normalizeJsDocComments(name: string, content: string) {
    return name.endsWith(".ts")
        ? content.replace(/\/\*\*\s*-{20,}/g, "/**").replace(/\**\s*-{20,}\s*\*+\//g, "*/")
        : content;
}
