import { writeFileSync } from "fs";
import { join, relative } from "path";
import { unsafe } from "../../core/misc/utils/unsafe";

type Mode = "module" | "global";

const INDENT = 4;

//----------------------------------------------------------------------------------------------------------------------
// Main
//----------------------------------------------------------------------------------------------------------------------

const [_node, _script, library, mode, wrapper, ...unusedParameters] = process.argv;

if (library && wrapper && mode?.match(/^(module|global)$/) && 0 === unusedParameters.length) {
    createWrapper(join(process.cwd(), library), join(process.cwd(), wrapper), mode as Mode);
} else {
    throw new Error(
        "Usage: node create-import-export-wrapper.js <input-library.js> [module|global] <output-wrapper.js> "
    );
}

//----------------------------------------------------------------------------------------------------------------------
// Require/load the source file and create a re-exporting wrapper
//----------------------------------------------------------------------------------------------------------------------

function createWrapper(library: string, wrapper: string, mode: Mode) {
    const relativePath = relative(join(wrapper, ".."), library);
    const alias = "library";
    const exports = require(library);
    writeFileSync(wrapper, createWrapperContent(relativePath, alias, exports, mode));
}

//----------------------------------------------------------------------------------------------------------------------
// Render the wrapper's file content
//----------------------------------------------------------------------------------------------------------------------

function createWrapperContent(requirePath: string, importAlias: string, imports: unsafe.Any, mode: Mode) {
    const importStatement = `const ${importAlias} = require("${requirePath.replace(/\\/g, "/")}")`;
    const exports = collectExports(importAlias, imports);
    const importAndModuleExport = `${importStatement}\n\n${stringifyModuleExports(exports)}`;
    return "module" === mode ? importAndModuleExport : `${importAndModuleExport}\n\n${stringifyGlobalExports(exports)}`;
}

//----------------------------------------------------------------------------------------------------------------------
// Combine all exports into one object
//----------------------------------------------------------------------------------------------------------------------

function collectExports(importAlias: string, imports: unsafe.Any) {
    const cache = new Map<string, string>();
    const exports = {} as unsafe.Any;
    processBundle(importAlias, imports, exports, cache);
    return exports;
}

//----------------------------------------------------------------------------------------------------------------------
// Process a bundle with exports like "export_core" or "export_node"
//----------------------------------------------------------------------------------------------------------------------

function processBundle(importAlias: string, imports: unsafe.Any, exports: unsafe.Any, cache: Map<string, string>) {
    for (const name of Object.keys(imports)) {
        if (name.match(/^export_(core|node|web)$/)) {
            processReExports(importAlias, [name], imports[name], exports, cache);
        } else {
            throw new Error(`Unknown export ${name} (expected something like "export_core" or "export_web")`);
        }
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Process re-exports like "tfBatch" or "tfUnify"
//----------------------------------------------------------------------------------------------------------------------

function processReExports(
    importAlias: string, source: readonly string[], imports: unsafe.Any, exports: unsafe.Any, cache: Map<string, string>
) {
    for (const name of Object.keys(imports)) {
        if (name.match(/^tf[A-Z]/)) {
            processModule(importAlias, [...source, name], imports[name], exports, cache);
        } else {
            throw new Error(`Unknown export ${name} (expected something like "tfUnify" or "tfInterceptor")`);
        }
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Process a module with direct/final exports and namespaces
//----------------------------------------------------------------------------------------------------------------------

function processModule(
    importAlias: string, source: readonly string[], imports: unsafe.Any, exports: unsafe.Any, cache: Map<string, string>
) {
    for (const name of Object.keys(imports)) {
        if (isDistributedNamespace(name)) {
            exports[name] ??= {};
            for (const nestedName of Object.keys(imports[name])) {
                processItem(importAlias, [...source, name], [name], nestedName, exports[name], cache);
            }
        } else {
            processItem(importAlias, source, [], name, exports, cache);
        }
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Process a bottom-level item
//----------------------------------------------------------------------------------------------------------------------

function processItem(
    importAlias: string,
    sourceParent: readonly string[],
    destinationParent: readonly string[],
    name: string,
    exports: unsafe.Any,
    cache: Map<string, string>
) {
    const source = [...sourceParent, name].join(" => ");
    const destination = [...destinationParent, name].join(" => ");
    const previousSource = cache.get(destination);
    if (previousSource) {
        throw new Error(`Conflicting exports for ${destination} in ${source} and ${previousSource}`);
    } else {
        exports[name] = [importAlias, ...sourceParent, name].join(".");
        cache.set(destination, source);
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Determine if the given identifier is a distributed namespace
//----------------------------------------------------------------------------------------------------------------------

function isDistributedNamespace(identifier: unknown) {
    return ["tfi", "tft", "tfu"].some(namespace => namespace === identifier);
}

//----------------------------------------------------------------------------------------------------------------------
// Render the collected imports as module level exports
//----------------------------------------------------------------------------------------------------------------------

function stringifyModuleExports(exports: unsafe.Any) {
    const stringified = JSON.stringify(exports, undefined, INDENT).replace(/"/g, "");
    return `module.exports = ${stringified};`;
}

//----------------------------------------------------------------------------------------------------------------------
// Render the collected imports as global exports
//----------------------------------------------------------------------------------------------------------------------

function stringifyGlobalExports(exports: unsafe.Any) {
    return Object.keys(exports).map(
        name => `globalThis.${name} = ${JSON.stringify(exports[name], undefined, INDENT).replace(/"/g, "")};`
    ).join("\n");
}
