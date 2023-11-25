import React, { useCallback, useEffect, useState, useRef, useMemo } from 'react';
import { View, Text, findNodeHandle, UIManager } from 'react-native';
import { SceneInstrumentation } from '@babylonjs/core';
import { useModuleInitializer, useRenderLoop } from './NativeEngineHook';
import { NativeEngineView } from './NativeEngineView';
export const EngineView = (props) => {
    //const [fps, setFps] = useState<number>();
    const [sceneStats, setSceneStats] = useState();
    const engineViewRef = useRef(null);
    const snapshotPromise = useRef();
    const isTransparent = props.isTransparent ?? false;
    const antiAliasing = props.antiAliasing ?? 0;
    const androidView = props.androidView ?? "";
    const initialized = useModuleInitializer();
    const engine = useMemo(() => {
        return props.camera?.getScene().getEngine();
    }, [props.camera]);
    const renderLoop = useCallback(() => {
        for (let scene of engine.scenes) {
            scene.render();
        }
    }, [engine]);
    useRenderLoop(engine, renderLoop);
    useEffect(() => {
        if (props.camera && (props.displayFrameRate ?? __DEV__)) {
            const scene = props.camera.getScene();
            const engine = scene.getEngine();
            if (!engine.isDisposed) {
                setSceneStats({ frameRate: 0, frameTime: 0 });
                const sceneInstrumentation = new SceneInstrumentation(scene);
                sceneInstrumentation.captureFrameTime = true;
                const timerHandle = setInterval(() => {
                    setSceneStats({ frameRate: engine.getFps(), frameTime: sceneInstrumentation.frameTimeCounter.lastSecAverage });
                }, 1000);
                return () => {
                    clearInterval(timerHandle);
                    setSceneStats(undefined);
                    sceneInstrumentation.dispose();
                };
            }
        }
        return undefined;
    }, [props.camera, props.displayFrameRate]);
    // Call onInitialized if provided, and include the callback for takeSnapshot.
    useEffect(() => {
        if (props.onInitialized) {
            props.onInitialized({
                takeSnapshot: () => {
                    if (!snapshotPromise.current) {
                        let resolveFunction;
                        const promise = new Promise((resolutionFunc) => {
                            resolveFunction = resolutionFunc;
                        });
                        // Resolution functions should always be initialized.
                        if (resolveFunction) {
                            snapshotPromise.current = { promise: promise, resolve: resolveFunction };
                        }
                        else {
                            throw new Error("Resolution functions not initialized after snapshot promise creation.");
                        }
                        UIManager.dispatchViewManagerCommand(findNodeHandle(engineViewRef.current), "takeSnapshot", []);
                    }
                    return snapshotPromise.current.promise;
                }
            });
        }
    }, [props.onInitialized]);
    // Handle snapshot data returned.
    const snapshotDataReturnedHandler = useCallback((event) => {
        // The nativeEvent is a DOMEvent which doesn't have a typescript definition. Cast it to an Event object with a data property.
        const { data } = event.nativeEvent;
        if (snapshotPromise.current) {
            snapshotPromise.current.resolve(data);
            snapshotPromise.current = undefined;
        }
    }, []);
    if (initialized !== false) {
        return (React.createElement(View, { style: [{ flex: 1 }, props.style, { overflow: "hidden" }] },
            initialized && React.createElement(NativeEngineView, { ref: engineViewRef, style: { flex: 1 }, onSnapshotDataReturned: snapshotDataReturnedHandler, isTransparent: isTransparent, antiAliasing: antiAliasing, androidView: androidView }),
            sceneStats !== undefined &&
                React.createElement(View, { style: { backgroundColor: '#00000040', opacity: 1, position: 'absolute', right: 0, left: 0, top: 0, flexDirection: 'row-reverse' } },
                    React.createElement(Text, { style: { color: 'yellow', alignSelf: 'flex-end', margin: 3, fontVariant: ['tabular-nums'] } },
                        "FPS: ",
                        sceneStats.frameRate.toFixed(0)))));
    }
    else {
        const message = "Could not initialize Babylon Native.";
        if (!__DEV__) {
            throw new Error(message);
        }
        return (React.createElement(View, { style: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' } },
            React.createElement(Text, { style: { fontSize: 24, color: 'black' } }, message),
            React.createElement(Text, { style: { fontSize: 12, color: 'black' } }, "React Native remote debugging does not work with Babylon Native.")));
    }
};
//# sourceMappingURL=EngineView.js.map