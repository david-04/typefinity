//----------------------------------------------------------------------------------------------------------------------
// Export public modules
//----------------------------------------------------------------------------------------------------------------------

export * as tfAdd from "./example/add";
export * as tfSubtract from "./example/subtract";
export * as tfIsEmpty from "./example/util-is-empty";
export * as tfLog from "./example/util-log";
export * as tfClass from "./example/util-class";

//----------------------------------------------------------------------------------------------------------------------
// Flatten exports
//----------------------------------------------------------------------------------------------------------------------

const namespaces: { [index: string]: { [index: string]: unknown; }; } = {
    tft: {},
    tfu: {},
};

const otherExports: { [index: string]: unknown; } = {};

for (const moduleName of Object.keys(module.exports)) {
    const moduleDefinition = module.exports[moduleName];
    for (const exportedItemName of Object.keys(moduleDefinition)) {
        const exportedItemDefinition = moduleDefinition[exportedItemName];
        if (Object.prototype.hasOwnProperty.call(namespaces, exportedItemName)) {
            namespaces[exportedItemName] = {
                ...namespaces[exportedItemName],
                ...exportedItemDefinition
            };
        } else {
            otherExports[exportedItemName] = exportedItemDefinition;
        }
    }
}

module.exports = { ...otherExports, ...namespaces };
