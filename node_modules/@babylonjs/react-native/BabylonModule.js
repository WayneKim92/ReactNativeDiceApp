import { NativeModules } from 'react-native';
const isRemoteDebuggingEnabled = !global.nativeCallSyncHook;
// This legacy React Native module is created by Babylon React Native, and is only used to bootstrap the JSI object creation.
// This will likely be removed when the BabylonNative global object is eventually converted to a TurboModule.
const BabylonModule = NativeModules.BabylonModule;
export async function ensureInitialized() {
    if (isRemoteDebuggingEnabled) {
        // When remote debugging is enabled, JavaScript runs on the debugging host machine, not on the device where the app is running.
        // JSI (which Babylon Native uses heavily) can not work in this mode. In the future, this debugging mode will be phased out as it is incompatible with TurboModules for the same reason.
        return false;
    }
    else {
        // This does the first stage of Babylon Native initialization, including creating the BabylonNative JSI object.
        await BabylonModule.initialize();
        return true;
    }
}
export async function reset() {
    return BabylonModule.resetView();
}
//# sourceMappingURL=BabylonModule.js.map