/**---------------------------------------------------------------------------------------------------------------------
 * Wrap the given function into a filter that removes all non-promise return values
 *--------------------------------------------------------------------------------------------------------------------*/

export function discardNonPromiseReturnValue(callback: () => unknown): () => undefined | Promise<void> {
    return () => {
        const result = callback();
        return result instanceof Promise ? result : undefined;
    };
}
