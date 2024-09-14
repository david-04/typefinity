/** This is a web interface */
export interface WebInterface {
    /** property */
    property: string;
}

/** This is a web function */
export function webFunction(data: WebInterface) {
    return document.getElementById(data.property)?.innerHTML;
}
