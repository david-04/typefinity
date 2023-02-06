//----------------------------------------------------------------------------------------------------------------------
// Create simplified module-scoped and global versions of a module's declaration file
//----------------------------------------------------------------------------------------------------------------------

import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

//----------------------------------------------------------------------------------------------------------------------
// Main
//----------------------------------------------------------------------------------------------------------------------

const [_node, _script, source, ...unusedParameters] = process.argv;

if (source && 0 === unusedParameters.length) {
    createDeclaration(source, simplifyAsModule, source.replace(/\.d\.ts$/, "-module.d.ts"));
    createDeclaration(source, simplifyAsGlobal, source.replace(/\.d\.ts$/, "-global.d.ts"));
} else {
    throw new Error("Usage: node simplify-module-declarations.js <dts-file>");
}

//----------------------------------------------------------------------------------------------------------------------
// Create a simplified Simply a declaration file using the given transformer
//----------------------------------------------------------------------------------------------------------------------

function createDeclaration(source: string, transform: (content: string) => string, destination: string) {
    const originalFileContent = readFileSync(source).toString();
    const simplifiedFileContent = transform(originalFileContent);
    mkdirSync(join(destination, ".."), { recursive: true });
    writeFileSync(destination, simplifiedFileContent);
}

//----------------------------------------------------------------------------------------------------------------------
// Transform declarations into a simplified module scope
//----------------------------------------------------------------------------------------------------------------------

function simplifyAsModule(content: string) {
    return transform(content, [
        removeCarriageReturn,
        mergeAllModulesIntoOne,
        removeReExports,
        removeImports,
        replaceNamespaceAliases,
        removeDtsBundleHeader,
    ]);
}

//----------------------------------------------------------------------------------------------------------------------
// Transform declarations into a simplified global scope
//----------------------------------------------------------------------------------------------------------------------

function simplifyAsGlobal(content: string) {
    const globalModule = transform(content, [simplifyAsModule, appendGlobalToModuleName]);
    const globalNamespace = transform(content, [simplifyAsModule, moveDeclarationsToGlobalNamespace]);
    return `${globalModule}\n${globalNamespace}`;
}

//----------------------------------------------------------------------------------------------------------------------
// Pipe the given file content through the provided transformers
//----------------------------------------------------------------------------------------------------------------------

function transform(content: string, transformers: Array<(content: string) => string>) {
    return transformers.reduce((currentContent, transform) => transform(currentContent), content);
}

//----------------------------------------------------------------------------------------------------------------------
// Remove "\r"
//----------------------------------------------------------------------------------------------------------------------

function removeCarriageReturn(content: string) {
    return content.replace(/\r?/g, "");
}

//----------------------------------------------------------------------------------------------------------------------
// } declare module 'typefinity/core/core/misc/utils/unsafe' {
//----------------------------------------------------------------------------------------------------------------------

function mergeAllModulesIntoOne(content: string) {
    return content.replace(/\}\s*declare module\s*['"`][^'"`]*['"`]\s*\{/g, "");
}

//----------------------------------------------------------------------------------------------------------------------
// export * as tfBatch from "typefinity/core/core/functions/batch";
//----------------------------------------------------------------------------------------------------------------------

function removeReExports(content: string) {
    return content.replace(/^\s*export[^'"`\n{]*from\s*['"`][^'"`]*['"`]\s*;?\n?/gsm, "");
}

//----------------------------------------------------------------------------------------------------------------------
// import { unsafe } from "typefinity/core/core/misc/utils/unsafe";
//----------------------------------------------------------------------------------------------------------------------

function removeImports(content: string) {
    return content.replace(/^\s*import[^'"`]*from\s*['"`][^'"`]*['"`]\s*;?\n?/gsm, "");
}

//----------------------------------------------------------------------------------------------------------------------
// tft$condition
//----------------------------------------------------------------------------------------------------------------------

function replaceNamespaceAliases(content: string) {
    return content.replace(/(tft|tfi|tfu)\$[0-9a-z_]+(\.)/gi, "$1$2");
}

//----------------------------------------------------------------------------------------------------------------------
// // Generated by dts-bundle v0.7.3
//----------------------------------------------------------------------------------------------------------------------

function removeDtsBundleHeader(content: string) {
    return content.replace(/^\s*\/\/.*dts-bundle.*\n*/gmi, "");
}

//----------------------------------------------------------------------------------------------------------------------
// declare module 'typefinity/core' => declare module 'typefinity/core/global'
//----------------------------------------------------------------------------------------------------------------------

function appendGlobalToModuleName(content: string) {
    return content.replace(/^(\s*declare module\s*['"`][^'"`]*)(['"`])/gm, "$1/global$2");
}

//----------------------------------------------------------------------------------------------------------------------
// declare module 'typefinity/core' => declare global
//----------------------------------------------------------------------------------------------------------------------

function moveDeclarationsToGlobalNamespace(content: string) {
    return content.replace(/^(\s*)declare module\s*['"`][^'"`]*['"`]/gm, "declare global") + "\nexport {}";
}
