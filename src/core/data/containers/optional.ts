/**---------------------------------------------------------------------------------------------------------------------
 * Wrapper for a value that might or might not be present.
 *--------------------------------------------------------------------------------------------------------------------*/

export abstract class Optional<T> {
    /**-----------------------------------------------------------------------------------------------------------------
     * Create an empty Optional instance
     *----------------------------------------------------------------------------------------------------------------*/

    public static empty<T>(): Optional<Exclude<T, undefined | null>> {
        return EmptyOptional.INSTANCE as Optional<unknown> as Optional<Exclude<T, undefined | null>>;
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Filter the value (if present)
     *----------------------------------------------------------------------------------------------------------------*/

    public filter(filter: (value: T) => unknown): Optional<T> {
        return this.isPresent() && filter(this.get()) ? this : Optional.empty<T>();
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Map the value (if present) and unwrap the resulting Optional
     *----------------------------------------------------------------------------------------------------------------*/

    public flatMap<R>(map: (value: T) => Optional<R>): Optional<R> {
        return this.isPresent() ? map(this.get()) : Optional.empty<R>();
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Perform an action if the Optional does not contain a value
     *----------------------------------------------------------------------------------------------------------------*/

    public ifEmpty(action: () => void): this {
        if (this.isEmpty()) {
            action();
        }
        return this;
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Perform an action if the Optional contains a value
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
        return !this.isPresent();
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Check if the Optional contains a value
     *----------------------------------------------------------------------------------------------------------------*/

    public abstract isPresent(): this is Optional<T> & { /** Get the Optional's value */ get: () => T };

    /**-----------------------------------------------------------------------------------------------------------------
     * Map the value (if present)
     *----------------------------------------------------------------------------------------------------------------*/

    public map<R>(
        map: (value: T) => R
    ): Optional<Exclude<R, undefined | null>> extends never ? Optional<Exclude<R, undefined | null>> : Optional<R> {
        return this.isPresent() ? Optional.of(map(this.get())) : Optional.empty<R>();
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Create an Optional from the given value
     *----------------------------------------------------------------------------------------------------------------*/

    public static of<T>(value: T): Optional<Exclude<T, undefined | null>> {
        if (null === value || undefined === value) {
            return this.empty<T>();
        } else {
            return new NonEmptyOptional<Exclude<T, undefined | null>>(value as Exclude<T, undefined | null>);
        }
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Get the value (if present) or return the specified default value otherwise
     *----------------------------------------------------------------------------------------------------------------*/

    public orDefault<D>(defaultValue: D): T | D {
        return this.isPresent() ? this.get() : defaultValue;
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Get the value (if present) or call the specified function and return its return value otherwise
     *----------------------------------------------------------------------------------------------------------------*/

    public orGet<R>(get: () => R): T | R {
        return this.isPresent() ? this.get() : get();
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Get the value (if present) or throw an error otherwise
     *----------------------------------------------------------------------------------------------------------------*/

    public orThrow(error?: string | Error): T {
        if (this.isPresent()) {
            return this.get();
        } else if (error) {
            throw error instanceof Error ? error : new Error(error satisfies string);
        } else {
            throw new Error("Optional is empty");
        }
    }
}

/**---------------------------------------------------------------------------------------------------------------------
 * An Optional that contains a value
 *--------------------------------------------------------------------------------------------------------------------*/

class NonEmptyOptional<T> extends Optional<T> {
    private readonly value;

    /**-----------------------------------------------------------------------------------------------------------------
     * Initialization
     *----------------------------------------------------------------------------------------------------------------*/

    public constructor(value: T) {
        super();
        if (null === value || undefined === value) {
            throw new Error(`${JSON.stringify(value)} was passed to the constructor of PresentOptional`);
        }
        this.value = value;
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Check if the Optional contains a value
     *----------------------------------------------------------------------------------------------------------------*/

    public isPresent(): this is Optional<T> & { get: () => T } {
        this satisfies Optional<T> & { get: () => T };
        return true;
    }

    /**-----------------------------------------------------------------------------------------------------------------
     * Get the Optional's value
     *----------------------------------------------------------------------------------------------------------------*/

    public get(): T {
        return this.value;
    }
}

/**---------------------------------------------------------------------------------------------------------------------
 * An Optional that does not contain a value
 *--------------------------------------------------------------------------------------------------------------------*/

class EmptyOptional<T> extends Optional<T> {
    public static readonly INSTANCE = new EmptyOptional<unknown>();

    /**-----------------------------------------------------------------------------------------------------------------
     * Check if the Optional contains a value
     *----------------------------------------------------------------------------------------------------------------*/

    public isPresent(): this is Optional<T> & { get: () => T } {
        return false;
    }
}

/**---------------------------------------------------------------------------------------------------------------------
 * Wrap the given value into an Optional
 *--------------------------------------------------------------------------------------------------------------------*/

export const optional = Optional.of;
