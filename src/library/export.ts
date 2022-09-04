//----------------------------------------------------------------------------------------------------------------------
// Export public modules
//----------------------------------------------------------------------------------------------------------------------

export * as tfConditionalTypes /*   */ from "./data/types/conditional-types";
export * as tfExtractionTypes /*    */ from "./data/types/filter-types";
export * as tfFunctionTypes /*      */ from "./data/types/function-types";
export * as tfUnionTypes /*         */ from "./data/types/union-types";
export * as tfUnify /*              */ from "./data/utils/unify";
export * as tfInterceptors /*       */ from "./functions/interceptors";
export * as tfBatch /*              */ from "./functions/batch";
export * as tfUnsafe /*             */ from "./misc/utils/unsafe";
export * as tfTestDefinitionApi /*  */ from "./misc/test-framework/definition/test-definition-api";

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
