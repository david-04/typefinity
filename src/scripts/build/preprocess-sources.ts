//----------------------------------------------------------------------------------------------------------------------
// Create a preprocessed mirror of the sources with normalized JavaDoc comments
//----------------------------------------------------------------------------------------------------------------------

import fs from "fs";
import process from "process";
import path from "path";

//----------------------------------------------------------------------------------------------------------------------
// Main program
//----------------------------------------------------------------------------------------------------------------------

const [_node, _script, sourceDirectory, destinationDirectory, ...unusedParameters] = process.argv;
if (sourceDirectory && destinationDirectory && 0 === unusedParameters.length) {
    syncDirectory(sourceDirectory, destinationDirectory, true);
} else {
    throw new Error("Usage: node preprocess-sources.js <src-directory> <destination-directory>");
}

//----------------------------------------------------------------------------------------------------------------------
// Sync a directory
//----------------------------------------------------------------------------------------------------------------------

function syncDirectory(source: string, destination: string, isRoot: boolean) {
    fs.rmSync(destination, { recursive: true, force: true });
    fs.mkdirSync(destination, { recursive: true });
    fs.readdirSync(source, { withFileTypes: true }).forEach(child => {
        const operation = child.isDirectory() ? syncDirectory : syncFile;
        operation(path.join(source, child.name), path.join(destination, child.name), !child.isDirectory() && isRoot);
    });
}

//----------------------------------------------------------------------------------------------------------------------
// Sync a file
//----------------------------------------------------------------------------------------------------------------------

function syncFile(source: string, destination: string, isRoot: boolean) {
    const fileContent = fs.readFileSync(source).toString();
    fs.writeFileSync(destination, preprocessFileContent(source, fileContent, isRoot));
}

//----------------------------------------------------------------------------------------------------------------------
// Preprocess the file content
//----------------------------------------------------------------------------------------------------------------------

function preprocessFileContent(name: string, content: string, isRoot: boolean) {
    if (name.endsWith(".ts")) {
        return content.replace(/\/\*\*\s*-{20,}/g, "/**").replace(/\**\s*-{20,}\s*\*+\//g, "*/");
    } else if (isRoot && name.endsWith("tsconfig.json")) {
        return content.replace(/"\.\.\//g, '"../../');
    } else {
        return content;
    }
}
