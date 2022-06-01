import { existsSync, mkdirSync, writeFileSync } from "fs";
import { basename, dirname } from "path";
import { createInterface } from "readline";
import { gitignore, launch_json, Makefile_template, tasks_json, tsconfig_json } from "./resources";

const MAIN_MODULE_NAME = "${MAIN_MODULE_NAME}";

//----------------------------------------------------------------------------------------------------------------------
// Initialize a new project
//----------------------------------------------------------------------------------------------------------------------

export async function init(args: string[]) {
    const projectName = args[0] ?? await promptForProjectName();
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

async function promptForProjectName() {
    const defaultName = basename(process.cwd());
    console.log("Please enter the name of the project/main module.");
    console.log(`Press ENTER to use the default: ${defaultName}.`);
    return (await readLine()).trim() || defaultName;
}

//----------------------------------------------------------------------------------------------------------------------
// Read a line of user input
//----------------------------------------------------------------------------------------------------------------------

async function readLine(): Promise<string> {
    const readlineInterface = createInterface({ input: process.stdin, output: process.stdout });
    return new Promise(resolve => readlineInterface.question("> ", answer => {
        readlineInterface.close();
        resolve(answer);
    }));
}

//----------------------------------------------------------------------------------------------------------------------
// Get the files that need to be crated
//----------------------------------------------------------------------------------------------------------------------

function getFiles(projectName: string) {
    const toJson = (name: string, content: string) => ({
        name: name, exists: existsSync(name), content: content.replaceAll(MAIN_MODULE_NAME, projectName)
    });
    const files = [
        toJson(".vscode/launch.json", launch_json),
        toJson(".vscode/tasks.json", tasks_json),
        toJson(`src/${projectName}.ts`, createMainModule()),
        toJson("src/debug.ts", createDebugModule()),
        toJson(".gitignore", gitignore),
        toJson("Makefile", Makefile_template),
        toJson("tsconfig.json", tsconfig_json),
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
        'console.log("Hello world!");',
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
