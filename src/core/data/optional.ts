import { crash } from "../error/crash.js";
import { fail } from "../error/fail.js";

const EMPTY = Symbol("EMPTY");

/**---------------------------------------------------------------------------------------------------------------------
 * Wrapper for an optional value that might or might not be present
 *--------------------------------------------------------------------------------------------------------------------*/

export class Optional<T> {
    private static EMPTY_INSTANCE?: Optional<unknown>;

    /**-----------------------------------------------------------------------------------------------------------------
     * Initialization
     *----------------------------------------------------------------------------------------------------------------*/

    protected constructor(protected readonly value: T) {}

    /**-----------------------------------------------------------------------------------------------------------------
     * Create an empty Optional instance
     *
     * @type T The type of the (absent) value
     * @returns An empty Optional
     *----------------------------------------------------------------------------------------------------------------*/

    public static empty<T>(): Optional<Exclude<T, undefined | null>> {
        const optional = this.EMPTY_INSTANCE ?? new OptionalWithGet(EMPTY);
        this.EMPTY_INSTANCE = optional;
        return optional as Optional<Exclude<T, undefined | null>>;
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Filter the value (if present)
     *
     * @param   filter A predicate that returns a truthy value (if the Optional's value should be preserved) or a falsy
     *          value (if the Optional's value should be discarded)
     * @returns The current Optional (if it is not empty and if the filter returns a truthy value) or an empty Optional
     *          (if if the current Optional is empty or if the filter returns a falsy value)
     *----------------------------------------------------------------------------------------------------------------*/

    public filter(filter: (value: T) => unknown): Optional<T> {
        return this.isPresent() && filter(this.get()) ? this : Optional.empty<T>();
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Map the value (if present) to another Optional and unwrap it
     *
     * @param   map A function that maps the current Optional's value to another Optional
     * @returns The Optional returned by the map function (if the current Optional is present) or an empty optional
     *          (if the current Optional is empty)
     *----------------------------------------------------------------------------------------------------------------*/

    public flatMap<R>(map: (value: T) => Optional<R>): Optional<R> {
        return this.isPresent() ? map(this.get()) : Optional.empty<R>();
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Perform an action if the Optional does not contain a value
     *
     * @param   action The action to perform
     * @returns The current Optional
     *----------------------------------------------------------------------------------------------------------------*/

    public ifEmpty(action: () => void): this {
        if (this.isEmpty()) {
            action();
        }
        return this;
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Perform an action if the Optional contains a value
     *
     * @param action The action to perform
     * @returns The current Optional
     *----------------------------------------------------------------------------------------------------------------*/

    public ifPresent(action: (value: T) => void): this {
        if (this.isPresent()) {
            action(this.get());
        }
        return this;
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Check if the Optional is empty
     *----------------------------------------------------------------------------------------------------------------*/

    public isEmpty(): boolean {
        return this.value === EMPTY;
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Check if the Optional contains a value
     *----------------------------------------------------------------------------------------------------------------*/

    public isPresent(): this is Optional<T> & {
        /** Get the Optional's value
         * @returns The Optional's value */
        get: () => T;
    } {
        return !this.isEmpty();
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Map the value (if present)
     *----------------------------------------------------------------------------------------------------------------*/

    public map<R>(map: (value: T) => R): Optional<Exclude<R, undefined | null>> {
        return this.isPresent() ? Optional.of(map(this.get())) : Optional.empty<R>();
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Create an optional
     *----------------------------------------------------------------------------------------------------------------*/

    public static of<T>(value: T): Optional<Exclude<T, undefined | null>> {
        if (value === undefined || value === null) {
            return this.empty<T>();
        } else {
            return new OptionalWithGet(value) as Optional<Exclude<T, undefined | null>>;
        }
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Get the value (if present) or fail with a an internal error
     *----------------------------------------------------------------------------------------------------------------*/

    public orCrash(message: string) {
        return this.isPresent() ? this.get() : crash(message);
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Get the value (if present) or return the specified default value otherwise
     *----------------------------------------------------------------------------------------------------------------*/

    public orElse<U>(fallbackValue: U): T | U {
        return this.isPresent() ? this.get() : fallbackValue;
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Get the value (if present) or fail with a user-friendly error message
     *----------------------------------------------------------------------------------------------------------------*/

    public orFail(message: string) {
        return this.isPresent() ? this.get() : fail(message);
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Get the value (if present) or call the specified function and return its return value otherwise
     *----------------------------------------------------------------------------------------------------------------*/

    public orGet<U>(get: () => U): T | U {
        return this.isPresent() ? this.get() : get();
    }
}

/**---------------------------------------------------------------------------------------------------------------------
 * An Optional that contains a value
 *--------------------------------------------------------------------------------------------------------------------*/

class OptionalWithGet<T> extends Optional<T> {
    /**-----------------------------------------------------------------------------------------------------------------
     * Initialization
     *----------------------------------------------------------------------------------------------------------------*/

    public constructor(value: T) {
        super(value);
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Get the Optional's value
     *----------------------------------------------------------------------------------------------------------------*/

    public get(): T {
        return this.isEmpty() ? crash("The Optional is empty") : this.value;
    }
}

/**---------------------------------------------------------------------------------------------------------------------
 * Wrap the given value into an Optional
 *
 * @param value The optional value
 * @returns an Optional of the given value
 *--------------------------------------------------------------------------------------------------------------------*/

export function optional<T>(value: T) {
    return Optional.of(value);
}
