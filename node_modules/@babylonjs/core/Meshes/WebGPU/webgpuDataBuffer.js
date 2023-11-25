import { DataBuffer } from "../../Buffers/dataBuffer.js";
/** @internal */
export class WebGPUDataBuffer extends DataBuffer {
    constructor(resource, capacity = 0) {
        super();
        this.capacity = capacity;
        this._buffer = resource;
    }
    get underlyingResource() {
        return this._buffer;
    }
}
//# sourceMappingURL=webgpuDataBuffer.js.map