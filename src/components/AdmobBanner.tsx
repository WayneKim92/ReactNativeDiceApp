import React from 'react';
import {Platform} from 'react-native';
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';

const PROD_AD_BANNER_UNIT_ID = Platform.select({
  ios: 'ca-app-pub-7577807657630217/8141095343',
  android: 'ca-app-pub-7577807657630217/9744098858',
}) as string;
const adUnitId = __DEV__ ? TestIds.BANNER : PROD_AD_BANNER_UNIT_ID;

export function AdmobBanner() {
  return (
    <BannerAd
      unitId={adUnitId}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
    />
  );
}
