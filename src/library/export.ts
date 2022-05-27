//----------------------------------------------------------------------------------------------------------------------
// example/add
//----------------------------------------------------------------------------------------------------------------------

export * from "./example/add";
import * as add from "./example/add";
export namespace tft {
    export type AddResult = add.tft.AddResult;
}

//----------------------------------------------------------------------------------------------------------------------
// example/subtract
//----------------------------------------------------------------------------------------------------------------------

export * from "./example/subtract";
import * as subtract from "./example/subtract";
export namespace tft {
    export type SubtractResult = subtract.tft.SubtractResult;
}

//----------------------------------------------------------------------------------------------------------------------
// example/util-is-empty
//----------------------------------------------------------------------------------------------------------------------

import * as uilIsEmpty from "./example/util-is-empty";
export namespace tfu {
    export const isEmpty = uilIsEmpty.tfu.isEmpty;
}

//----------------------------------------------------------------------------------------------------------------------
// example/util-log
//----------------------------------------------------------------------------------------------------------------------

import * as utilLog from "./example/util-log";
export namespace tfu {
    export const log = utilLog.tfu.log;
}


//----------------------------------------------------------------------------------------------------------------------
// example/util-class
//----------------------------------------------------------------------------------------------------------------------

import * as utilClass from "./example/util-class";
export namespace tfu {
    export const MyClass = utilClass.tfu.MyClass;
    export type MyClass = typeof utilClass.tfu.MyClass;
}
