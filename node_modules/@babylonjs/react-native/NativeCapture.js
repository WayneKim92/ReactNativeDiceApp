;
export class CaptureSession {
    nativeCapture;
    constructor(camera, onCaptureCallback) {
        console.warn(`CaptureSession is experimental and likely to change significantly.`);
        // HACK: There is no exposed way to access the frame buffer from render target texture
        this.nativeCapture = new NativeCapture(camera?.outputRenderTarget?.renderTarget?._framebuffer);
        this.nativeCapture.addCallback(onCaptureCallback);
    }
    dispose() {
        this.nativeCapture.dispose();
    }
}
//# sourceMappingURL=NativeCapture.js.map