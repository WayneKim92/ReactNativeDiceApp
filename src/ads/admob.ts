import mobileAds, {MaxAdContentRating} from 'react-native-google-mobile-ads';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
export const initAdmob = async () => {
  const result = await check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);

  console.log('🐞result', result);
  if (result === RESULTS.DENIED) {
    // The permission has not been requested, so request it.
    await request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
  }

  await mobileAds().setRequestConfiguration({
    // Update all future requests suitable for parental guidance
    maxAdContentRating: MaxAdContentRating.G,

    // Indicates that you want your content treated as child-directed for purposes of COPPA.
    tagForChildDirectedTreatment: true,

    // Indicates that you want the ad request to be handled in a
    // manner suitable for users under the age of consent.
    tagForUnderAgeOfConsent: true,

    // An array of test device IDs to allow.
    testDeviceIdentifiers: ['EMULATOR'],
  });

  const adapterStatuses = await mobileAds().initialize();
  console.log('🐞adapterStatuses', adapterStatuses);
};
