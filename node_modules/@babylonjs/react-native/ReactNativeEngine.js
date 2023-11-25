import { ensureInitialized, reset } from './BabylonModule';
import { NativeEngine } from '@babylonjs/core';
export class ReactNativeEngine extends NativeEngine {
    _isDisposed = false;
    static async tryCreateAsync(abortSignal) {
        if (!await ensureInitialized() || abortSignal.aborted) {
            return null;
        }
        // This waits Graphics/NativeEngine to be created.
        await BabylonNative.initializationPromise;
        // Check for cancellation.
        if (abortSignal.aborted) {
            return null;
        }
        return new ReactNativeEngine();
    }
    get isDisposed() {
        return this._isDisposed;
    }
    dispose() {
        if (!this.isDisposed) {
            super.dispose();
            BabylonNative.resetInitializationPromise();
            reset();
            this._isDisposed = true;
        }
    }
}
//# sourceMappingURL=ReactNativeEngine.js.map