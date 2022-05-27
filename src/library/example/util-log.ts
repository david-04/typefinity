import { tfu as isEmpty } from "./util-is-empty";
import { internalFunction } from "./internal";

export namespace tfu {
    /**
     * Log a message
     * @param message The message to log
     */
    export function log(message: string) {
        if (!isEmpty.isEmpty(message) && internalFunction()) {
            console.log("test");
        }
    }
}
