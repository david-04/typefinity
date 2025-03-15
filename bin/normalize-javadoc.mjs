import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";

const [, , fileOrDirectory, ...rest] = process.argv;

if (rest.length) {
    console.log("ERROR: Too many arguments in normalize-javadoc.js");
    process.exit(1);
} else if (!fileOrDirectory) {
    console.log("ERROR: Missing argument in normalize-javadoc.js");
    process.exit(1);
} else if (statSync(fileOrDirectory).isDirectory()) {
    for (const file of readdirSync(fileOrDirectory, { recursive: true }).filter(file => file.endsWith(".d.ts"))) {
        updateFile(`${fileOrDirectory}/${file.replaceAll("\\", "/")}`);
    }
} else {
    updateFile(fileOrDirectory);
}

function updateFile(file) {
    const lines = readFileSync(file, { encoding: "utf-8" })
        .split(/\r?\n/)
        .map(line => line.replace(/^(\s*)\/\*{2}-{10,}\s*$/gm, "$1/**"))
        .map(line => line.replace(/^(\s*)\*+-{10,}\*+\/\s*$/gm, "$1*/"));
    writeFileSync(file, lines.join("\n"));
}
