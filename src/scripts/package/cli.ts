import { COMMANDS, showHelp, showVersionInfo, showError } from "./cli-help";
import { init } from "./cli-init";
import { uplift } from "./cli-uplift";

const SKIP_PARAMETERS = 2;
const args = process.argv.slice(SKIP_PARAMETERS);

if (args.filter(arg => arg.match(/^(-h|-help|--help)/)).length) {
    showHelp();
} else if (args.filter(arg => arg.match(/^(-v|-version|--version)$/)).length) {
    showVersionInfo();
} else if (matchesCommand(COMMANDS.INIT, args[0])) {
    init(args.slice(1));
} else if (matchesCommand(COMMANDS.UPLIFT, args[0])) {
    uplift();
} else {
    showError(args.length ? `Invalid operation "${args[0]}"` : "Missing parameter");
}


function matchesCommand(command: string, argument?: string) {
    return 0 < ["", "-", "--"].filter(prefix => `${prefix}${command}` === argument).length;
}
