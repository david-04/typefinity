import { NOT_SET, NotSet } from "../data/not-set.js";
import { trim } from "../transform/string/trim.js";

/**---------------------------------------------------------------------------------------------------------------------
 * Data types
 *--------------------------------------------------------------------------------------------------------------------*/

type OptionalStringProperty = NotSet | undefined | string;

/**---------------------------------------------------------------------------------------------------------------------
 * Decompose an error into properties that are useful for rendering/formatting
 *--------------------------------------------------------------------------------------------------------------------*/

export function decomposeError(error: unknown) {
    return new decomposeError.Result(error);
}

export namespace decomposeError {
    /**-----------------------------------------------------------------------------------------------------------------
     * An error that has been decomposed into properties suitable for rendering purposes
     *----------------------------------------------------------------------------------------------------------------*/

    export class Result {
        private _cause: OptionalStringProperty = NOT_SET;
        private _message: OptionalStringProperty = NOT_SET;
        private _source: OptionalStringProperty = NOT_SET;
        private _stack: OptionalStringProperty = NOT_SET;
        private _type: OptionalStringProperty = NOT_SET;
        private _typeAndMessage: OptionalStringProperty = NOT_SET;

        /**-------------------------------------------------------------------------------------------------------------
         * Initialization
         *------------------------------------------------------------------------------------------------------------*/

        public constructor(public readonly error: unknown) {}

        /**-------------------------------------------------------------------------------------------------------------
         * The error's cause(s) (if present)
         *------------------------------------------------------------------------------------------------------------*/

        public get cause() {
            const cause = this._cause === NOT_SET ? getCause(this.error) : this._cause;
            this._cause = cause;
            return cause;
        }

        /**-------------------------------------------------------------------------------------------------------------
         * The error message
         *------------------------------------------------------------------------------------------------------------*/

        public get message() {
            const message = this._message === NOT_SET ? getMessage(this.error) : this._message;
            this._message = message;
            return message;
        }

        /**-------------------------------------------------------------------------------------------------------------
         * The error's source, extracted from the stack trace's first non-node_modules line (format: "dir/file.js:123")
         *------------------------------------------------------------------------------------------------------------*/

        public get source(): string | undefined {
            const source = this._source === NOT_SET ? getSource(this.stack) : this._source;
            this._source = source;
            return source;
        }

        /**-------------------------------------------------------------------------------------------------------------
         * The stack trace frames (does not include the error type and message)
         *------------------------------------------------------------------------------------------------------------*/

        public get stack() {
            const stack = this._stack === NOT_SET ? getStack(this.error) : this._stack;
            this._stack = stack;
            return stack;
        }

        /**-------------------------------------------------------------------------------------------------------------
         * The error type/class name (if the error is an instance of Error)
         *------------------------------------------------------------------------------------------------------------*/

        public get type() {
            const type = this._type === NOT_SET ? getType(this.error) : this._type;
            this._type = type;
            return type;
        }

        /**-------------------------------------------------------------------------------------------------------------
         * The error type and message (format: "MyError: My Message")
         *------------------------------------------------------------------------------------------------------------*/

        public get typeAndMessage() {
            const typeAndMessage =
                this._typeAndMessage === NOT_SET ? getTypeAndMessage(this.type, this.message) : this._typeAndMessage;
            this._typeAndMessage = typeAndMessage;
            return typeAndMessage;
        }
    }
}

/**---------------------------------------------------------------------------------------------------------------------
 * Get an errors cause (in the form of a nested stack trace)
 *--------------------------------------------------------------------------------------------------------------------*/

function getCause(error: unknown) {
    const causes = new Array<string>();
    for (
        let cause = error instanceof Error ? error.cause : undefined;
        undefined !== cause;
        cause = cause instanceof Error ? cause.cause : undefined
    ) {
        const typeAndMessage = getTypeAndMessage(getType(cause), getMessage(cause))?.trim();
        const stack = getStack(cause);
        const formatted = [typeAndMessage, stack].join("\n") || "<unknown>"; // NOSONAR
        causes.push(`Caused by: ${formatted}`);
    }
    return causes.join("\n") || undefined;
}

/**---------------------------------------------------------------------------------------------------------------------
 * Get an error's message
 *--------------------------------------------------------------------------------------------------------------------*/

export function getMessage(error: unknown) {
    if (!error) {
        return undefined;
    } else {
        return (error instanceof Error ? error.message : `${error}`).trim() || undefined; // NOSONAR
    }
}

/**---------------------------------------------------------------------------------------------------------------------
 * Get the source from a stack (extracted from the top-most non-node_modules line)
 *--------------------------------------------------------------------------------------------------------------------*/

function getSource(stack: string | undefined) {
    return stack
        ?.split(/\r?\n/)
        .map(trim)
        .filter(line => /^at\s.*\([^)]*\)$/.test(line))
        .map(line => line.replace(/^.*\(/, ""))
        .map(line => line.replace(/\)$/, ""))
        .find(line => !/node_modules|^node:/.test(line));
}

/**---------------------------------------------------------------------------------------------------------------------
 * Get the stack frames (without the error type and message header)
 *--------------------------------------------------------------------------------------------------------------------*/

function getStack(error: unknown) {
    const frames = (error instanceof Error ? error.stack : undefined)
        ?.split(/\r?\n/)
        .filter(line => /^\s*at\s.*/.test(line));
    return frames?.join("\n").replaceAll("\\\\", "\\") || undefined; // NOSONAR
}

/**---------------------------------------------------------------------------------------------------------------------
 * Get the error's class name (if applicable)
 *--------------------------------------------------------------------------------------------------------------------*/

function getType(error: unknown) {
    return error instanceof Error ? error.constructor.name.trim() || error.name.trim() || undefined : undefined;
}

/**---------------------------------------------------------------------------------------------------------------------
 * Concatenate an error type and message into one string (omitting either if not present)
 *--------------------------------------------------------------------------------------------------------------------*/

function getTypeAndMessage(type: string | undefined, message: string | undefined) {
    return (
        [type, message]
            .map(item => item?.trim())
            .filter(item => item)
            .join(": ") || undefined
    );
}
