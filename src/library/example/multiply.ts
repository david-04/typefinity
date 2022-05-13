export namespace internal.multiply {
    export interface MultiplyResult {
        x: number;
        y: number;
        product: number;
    }
}

export function subtract(x: number, y: number): internal.multiply.MultiplyResult {
    return { x, y, product: x - y };
}
