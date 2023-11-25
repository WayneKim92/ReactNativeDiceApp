import { Camera } from '@babylonjs/core';
export type CapturedFrame = {
    width: number;
    height: number;
    format: "RGBA8" | "BGRA8" | undefined;
    yFlip: boolean;
    data: ArrayBuffer;
};
export type CaptureCallback = (capture: CapturedFrame) => void;
export declare class CaptureSession {
    private readonly nativeCapture;
    constructor(camera: Camera | undefined, onCaptureCallback: CaptureCallback);
    dispose(): void;
}
