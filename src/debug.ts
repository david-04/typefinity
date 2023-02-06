// import { parseOptions } from "./scripts/typefinity-cli/utils/argument-parser";

import { unify } from "./core/data/utils/unify";

// interactivePrompt.yesNo({
//     question: "Start?",
//     presetAnswer: "true2",
// }).then(result => console.log(`\nResult: <${result}>`));


console.log(unify.toArray(1));


// const result = parseOptions([
//     "--name=david",
//     "--last-name=hofmann",
//     "--middle----name=none",
//     "--x=",
// ]);

// result.forEach((value, key) => console.log(`${key} => ${value}`));
