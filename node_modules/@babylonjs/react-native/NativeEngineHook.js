import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { ensureInitialized } from './BabylonModule';
import './VersionValidation';
export function useModuleInitializer() {
    const [initialized, setInitialized] = useState();
    useEffect(() => {
        const abortController = new AbortController();
        (async () => {
            const isInitialized = await ensureInitialized();
            if (!abortController.signal.aborted) {
                setInitialized(isInitialized);
            }
        })();
        return () => {
            abortController.abort();
        };
    }, []);
    return initialized;
}
function useAppState() {
    const [appState, setAppState] = useState(AppState.currentState);
    useEffect(() => {
        const onAppStateChanged = (appState) => {
            setAppState(appState);
        };
        const appStateListener = AppState.addEventListener("change", onAppStateChanged);
        // Asserting the type to prevent TS type errors on older RN versions
        const removeListener = appStateListener?.["remove"];
        return () => {
            if (!!removeListener) {
                removeListener();
            }
            else {
                AppState.removeEventListener("change", onAppStateChanged);
            }
        };
    }, []);
    return appState;
}
export function useRenderLoop(engine, renderCallback) {
    const appState = useAppState();
    useEffect(() => {
        if (engine && appState === "active") {
            if (!engine.isDisposed) {
                engine.runRenderLoop(renderCallback);
                return () => {
                    if (!engine.isDisposed) {
                        engine.stopRenderLoop();
                    }
                };
            }
        }
        return undefined;
    }, [appState, engine]);
}
//# sourceMappingURL=NativeEngineHook.js.map