import { unify } from "../data/utils/unify";
import { unsafe } from "../misc/utils/unsafe";

export namespace tfi {

    /**-----------------------------------------------------------------------------------------------------------------
     * Run multiple functions in an orchestrated manner
     *----------------------------------------------------------------------------------------------------------------*/

    export namespace Batch {

        /**-------------------------------------------------------------------------------------------------------------
         * Run all functions sequentially and wait for asynchronous results before proceeding with the next function
         *
         * @param   actions The functions to run
         * @return  An array with the return value of each function
         *------------------------------------------------------------------------------------------------------------*/

        export async function runAndAwaitSequentially<T extends () => unknown>(actions: ReadonlyArray<T>) {
            const array = new Array<T extends () => Promise<infer R> ? R : (T extends () => infer R ? R : unknown)>();
            for (const action of actions) {
                array.push(await unsafe.asAny(unify.toPromise(action())));
            }
            return array;
        }
    }
}


/** Run multiple functions in an orchestrated manner */
export const batch = tfi.Batch;
