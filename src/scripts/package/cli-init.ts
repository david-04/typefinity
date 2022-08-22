import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { basename, dirname, join } from "path";
import { createInterface } from "readline";

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
    const toJson = (name: string, filename: string) => ({
        name: name,
        exists: existsSync(name),
        content: filename.replaceAll(MAIN_MODULE_NAME, projectName)
    });
    const files = [
        toJson(".vscode/launch.json", loadTemplate("launch.json")),
        toJson(".vscode/tasks.json", loadTemplate("tasks.json")),
        toJson(`src/${projectName}.ts`, createMainModule()),
        toJson("src/debug.ts", createDebugModule()),
        toJson(".gitignore", loadTemplate(".gitignore")),
        toJson("Makefile", loadTemplate("Makefile.template")),
        toJson("tsconfig.json", loadTemplate("tsconfig.json")),
    ];
    return {
        existing: files.filter(file => file.exists),
        missing: files.filter(file => !file.exists),
    };
}


//----------------------------------------------------------------------------------------------------------------------
// Load a file from resources/templates
//----------------------------------------------------------------------------------------------------------------------

function loadTemplate(file: string) {
    return readFileSync(join(__dirname, "..", "resources", "templates", file)).toString();
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
