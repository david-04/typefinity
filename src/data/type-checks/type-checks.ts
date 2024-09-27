// https://dev.to/ecyrbe/how-to-unit-test-your-typescript-utility-types-3cnm

const typeOfBuilder = { is: () => {} };

export function typeOf<T>(_value: T): {
    is: <U>(
        ...params: (<V>() => V extends T ? 1 : 2) extends <V>() => V extends U ? 1 : 2
            ? []
            : ["ERROR: The types are not the same"]
    ) => void;
} {
    return typeOfBuilder;
}
