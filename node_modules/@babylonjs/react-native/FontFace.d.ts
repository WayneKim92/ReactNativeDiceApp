/**
 * Partial Polyfill for FontFace Web API to wrap the NativeCanvas object.
 */
export declare class FontFace {
    readonly family: string;
    private source;
    private _status;
    get status(): "unloaded" | "loading" | "loaded" | "error";
    get loaded(): boolean;
    constructor(family: string, source: string | ArrayBuffer);
    load(): Promise<void>;
}
