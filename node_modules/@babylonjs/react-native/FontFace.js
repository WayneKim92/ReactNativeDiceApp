import { Tools } from '@babylonjs/core';
/**
 * Partial Polyfill for FontFace Web API to wrap the NativeCanvas object.
 */
export class FontFace {
    family;
    source;
    _status = "unloaded";
    get status() {
        return this._status;
    }
    get loaded() {
        return this._status === "loaded";
    }
    constructor(family, source) {
        this.family = family;
        this.source = source;
    }
    async load() {
        try {
            this._status = "loading";
            if (typeof this.source === 'string') {
                this.source = await Tools.LoadFileAsync(this.source);
            }
            await _native.Canvas.loadTTFAsync(this.family, this.source);
            this.source = undefined;
            this._status = "loaded";
        }
        catch (ex) {
            console.error("Error encountered when loading font: " + ex);
            this._status = "error";
        }
    }
}
//# sourceMappingURL=FontFace.js.map