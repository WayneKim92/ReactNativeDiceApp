import { ReactNativeEngine } from './ReactNativeEngine';
import './VersionValidation';
export declare function useModuleInitializer(): boolean | undefined;
export declare function useRenderLoop(engine: ReactNativeEngine | undefined, renderCallback: () => void): void;
