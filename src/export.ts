//----------------------------------------------------------------------------------------------------------------------
// Export public modules
//----------------------------------------------------------------------------------------------------------------------

export * as tfConditionalTypes /*   */ from "./core/data/types/conditional-types";
export * as tfExtractionTypes /*    */ from "./core/data/types/filter-types";
export * as tfFunctionTypes /*      */ from "./core/data/types/function-types";
export * as tfUnionTypes /*         */ from "./core/data/types/union-types";
export * as tfUnify /*              */ from "./core/data/utils/unify";
export * as tfInterceptors /*       */ from "./core/functions/interceptors";
export * as tfBatch /*              */ from "./core/functions/batch";
export * as tfUnsafe /*             */ from "./core/misc/utils/unsafe";
export * as tfTestDefinitionApi /*  */ from "./core/misc/test-framework/definition/test-definition-api";

export * as x /*  */ from "./node/test";
export * as y /*  */ from "./web/test";
export * as z /*  */ from "./scripts/test";

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
