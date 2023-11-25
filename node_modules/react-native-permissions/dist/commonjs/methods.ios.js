"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkNotifications = checkNotifications;
exports.methods = void 0;
exports.requestNotifications = requestNotifications;
var _NativePermissionsModule = _interopRequireDefault(require("./NativePermissionsModule"));
var _results = require("./results");
var _utils = require("./utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
let available = undefined;
function getAvailable() {
  if (available == null) {
    available = _NativePermissionsModule.default.getConstants().available;
  }
  return available;
}
async function openLimitedPhotoLibraryPicker() {
  await _NativePermissionsModule.default.openLimitedPhotoLibraryPicker();
}
async function openSettings() {
  await _NativePermissionsModule.default.openSettings();
}
async function check(permission) {
  return getAvailable()?.includes(permission) ? _NativePermissionsModule.default.check(permission) : _results.RESULTS.UNAVAILABLE;
}
async function request(permission) {
  return getAvailable()?.includes(permission) ? _NativePermissionsModule.default.request(permission) : _results.RESULTS.UNAVAILABLE;
}
function checkLocationAccuracy() {
  return _NativePermissionsModule.default.checkLocationAccuracy();
}
function requestLocationAccuracy(options) {
  return _NativePermissionsModule.default.requestLocationAccuracy(options.purposeKey);
}
function checkNotifications() {
  return _NativePermissionsModule.default.checkNotifications();
}
function requestNotifications(options) {
  return _NativePermissionsModule.default.requestNotifications(options);
}
async function checkMultiple(permissions) {
  const output = {};
  const dedup = (0, _utils.uniq)(permissions);
  await Promise.all(dedup.map(async permission => {
    output[permission] = await check(permission);
  }));
  return output;
}
async function requestMultiple(permissions) {
  const output = {};
  const dedup = (0, _utils.uniq)(permissions);
  for (let index = 0; index < dedup.length; index++) {
    const permission = dedup[index];
    output[permission] = await request(permission);
  }
  return output;
}
const methods = exports.methods = {
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
//# sourceMappingURL=methods.ios.js.map