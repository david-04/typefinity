//----------------------------------------------------------------------------------------------------------------------
// Export public modules
//----------------------------------------------------------------------------------------------------------------------

export * as tfDataUtilsTypes /*     */ from "./data/utils/types";
export * as tfDataUtilsUnify /*     */ from "./data/utils/unify";
export * as tfFunctionsAddon /*     */ from "./functions/addon";
export * as tfFunctionsBatch /*     */ from "./functions/batch";
export * as tfMiscUtilsUnsafe /*    */ from "./misc/utils/unsafe";

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
