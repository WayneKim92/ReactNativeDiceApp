import { NativeEngine } from '@babylonjs/core';
export declare class ReactNativeEngine extends NativeEngine {
    _isDisposed: boolean;
    static tryCreateAsync(abortSignal: AbortSignal): Promise<ReactNativeEngine | null>;
    get isDisposed(): boolean;
    dispose(): void;
}
