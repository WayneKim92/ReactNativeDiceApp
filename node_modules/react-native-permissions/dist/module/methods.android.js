import { Alert } from 'react-native';
import NativeModule from './NativePermissionsModule';
import { checkLocationAccuracy, openLimitedPhotoLibraryPicker, requestLocationAccuracy } from './unsupportedPlatformMethods';
import { platformVersion, uniq } from './utils';
const TIRAMISU_VERSION_CODE = 33;
async function openSettings() {
  await NativeModule.openSettings();
}
function check(permission) {
  return NativeModule.checkPermission(permission);
}
async function showRationaleAlert(rationale) {
  return new Promise(resolve => {
    const {
      title,
      message,
      buttonPositive,
      buttonNegative,
      buttonNeutral
    } = rationale;
    const buttons = [];
    if (buttonNegative) {
      const onPress = () => resolve(false);
      buttonNeutral && buttons.push({
        text: buttonNeutral,
        onPress
      });
      buttons.push({
        text: buttonNegative,
        onPress
      });
    }
    buttons.push({
      text: buttonPositive,
      onPress: () => resolve(true)
    });
    Alert.alert(title, message, buttons, {
      cancelable: false
    });
  });
}
async function request(permission, rationale) {
  if (rationale == null || !(await NativeModule.shouldShowRequestPermissionRationale(permission))) {
    return NativeModule.requestPermission(permission);
  }
  return (typeof rationale === 'function' ? rationale() : showRationaleAlert(rationale)).then(shouldRequestPermission => shouldRequestPermission ? NativeModule.requestPermission(permission) : NativeModule.checkPermission(permission));
}
async function checkNotifications() {
  if (platformVersion < TIRAMISU_VERSION_CODE) {
    return NativeModule.checkNotifications();
  }
  const status = await check('android.permission.POST_NOTIFICATIONS');
  return {
    status,
    settings: {}
  };
}
async function requestNotifications() {
  if (platformVersion < TIRAMISU_VERSION_CODE) {
    return NativeModule.checkNotifications();
  }
  const status = await request('android.permission.POST_NOTIFICATIONS');
  return {
    status,
    settings: {}
  };
}
function checkMultiple(permissions) {
  const dedup = uniq(permissions);
  return NativeModule.checkMultiplePermissions(dedup);
}
function requestMultiple(permissions) {
  const dedup = uniq(permissions);
  return NativeModule.requestMultiplePermissions(dedup);
}
export const methods = {
  check,
  checkLocationAccuracy,
  checkMultiple,
  checkNotifications,
  openLimitedPhotoLibraryPicker,
  openSettings,
  request,
  requestLocationAccuracy,
  requestMultiple,
  requestNotifications
};
//# sourceMappingURL=methods.android.js.map