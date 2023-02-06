import { existsSync, mkdirSync, writeFileSync } from "fs";
import { basename, dirname } from "path";
import { FILE_TEMPLATES } from "../../../core/resources/file-templates";
import { parseOptions } from "../utils/argument-parser";
import { interactivePrompt } from "../utils/interactive-prompt";

const MAIN_MODULE_NAME = "${MAIN_MODULE_NAME}";
const MAIN_MODULE_NAME_REGEXP = /\$\{MAIN_MODULE_NAME\}/g;

//----------------------------------------------------------------------------------------------------------------------
// Initialize a new project
//----------------------------------------------------------------------------------------------------------------------

export async function init(args: Iterable<string>) {
    const parameters = parseOptions(args);
    const projectName = await getProjectName(parameters.get("projectName"));
    // project name
    // type of project: core, node, web
    // use webpack?
    // install tsc
    // install typefinity? or remove version lock to always use the latest version?
    // install webpack?
    // install Node typings? bundled with typefinity, install none, install specific version
    // use npm or yarn
    // use makefile

    // overwrite gitignore, vscode

    const files = getFiles(projectName);
    console.log("");
    if (files.existing.length) {
        console.log(1 === files.existing.length
            ? "The following file already exists and won't be updated:"
            : "The following files already exist and won't be updated:"
        );
        files.existing.forEach(file => console.log(`- ${file.name}`));
        console.log("");
    }
    if (files.missing.length) {
        console.log("Creating files:");
        files.missing.forEach(file => saveFile(file.name, file.content));
        console.log("");
        console.log("The project has been initialized successfully.");
    } else {
        console.log("Nothing to be done - the project is already initialized.");
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Prompt for the
//----------------------------------------------------------------------------------------------------------------------

async function getProjectName(defaultValue?: string) {
    const directoryName = basename(process.cwd());
    if (undefined !== defaultValue) {
        return defaultValue.trim() || directoryName;
    } else {
        return interactivePrompt({
            question: [
                "Please enter the name of the project/main module.",
                `Press ENTER to use the default: ${directoryName}.`,
            ],
            map: input => input || directoryName
        });
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Get the files that need to be crated
//----------------------------------------------------------------------------------------------------------------------

function getFiles(projectName: string) {
    const toJson = (name: string, filename: string) => ({
        name: name,
        exists: existsSync(name),
        content: filename.replace(MAIN_MODULE_NAME_REGEXP, projectName)
    });
    const files = [
        toJson(".vscode/launch.json", FILE_TEMPLATES[".vscode/launch.json"]),
        toJson(".vscode/tasks.json", FILE_TEMPLATES[".vscode/tasks.json"]),
        toJson(`src/${projectName}.ts`, createMainModule()),
        toJson("src/debug.ts", createDebugModule()),
        toJson(".gitignore", FILE_TEMPLATES[".gitignore"]),
        toJson("Makefile", FILE_TEMPLATES["Makefile.template"].replace("${PROJECT_TYPE}", "node")),
        toJson("tsconfig.json", FILE_TEMPLATES[".typefinity/tsconfig.json"]),
    ];
    return {
        existing: files.filter(file => file.exists),
        missing: files.filter(file => !file.exists),
    };
}

//----------------------------------------------------------------------------------------------------------------------
// Save a file
//----------------------------------------------------------------------------------------------------------------------

function saveFile(name: string, content: string) {
    console.log(`- ${name}`);
    mkdirSync(dirname(name), { recursive: true });
    writeFileSync(name, `${content.trim()}\n`);
}

//----------------------------------------------------------------------------------------------------------------------
// Create <project>.ts
//----------------------------------------------------------------------------------------------------------------------

function createMainModule() {
    return [
        'import "@david-04/typefinity/global";',
        "",
        "console.log(add(1, 2));",
    ].join("\n");
}

//----------------------------------------------------------------------------------------------------------------------
// Create debug.ts
//----------------------------------------------------------------------------------------------------------------------

function createDebugModule() {
    return [
        `import "./${MAIN_MODULE_NAME}";`,
    ].join("\n");
}
