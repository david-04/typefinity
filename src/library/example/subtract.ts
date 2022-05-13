export interface SubtractResult {
    x: number;
    y: number;
    difference: number;
}

export function subtract(x: number, y: number): SubtractResult {
    return { x, y, difference: x - y };
}
