import { FunctionComponent } from 'react';
import { ViewProps } from 'react-native';
import { Camera } from '@babylonjs/core';
export interface EngineViewProps extends ViewProps {
    camera?: Camera;
    displayFrameRate?: boolean;
    isTransparent?: boolean;
    androidView?: "TextureView" | "SurfaceView" | "SurfaceViewZTopMost" | "SurfaceViewZMediaOverlay";
    antiAliasing?: 0 | 1 | 2 | 4 | 8 | 16;
    onInitialized?: (view: EngineViewCallbacks) => void;
}
export interface EngineViewCallbacks {
    takeSnapshot: () => Promise<string>;
}
export declare const EngineView: FunctionComponent<EngineViewProps>;
