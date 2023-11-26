import React, {useEffect, useState} from 'react';
import {Button, Platform} from 'react-native';
import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

const PROD_AD_UNIT_ID = Platform.select({
  ios: 'ca-app-pub-7577807657630217/2504134595',
  android: 'ca-app-pub-7577807657630217/8055898079',
}) as string;
const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : PROD_AD_UNIT_ID;

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
  // TODO: 적절한 키워드 넣기
  // keywords: ['fashion', 'clothing'],
});

// TODO: iOS release build에서는 광고가 안나옴
export function DevAdTest() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    interstitial.load();

    console.log('🐞interstitial');

    const unsubscribeLoaded = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setLoaded(true);
      },
    );

    const unsubscribeClose = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setLoaded(false);
        interstitial.load();
      },
    );

    const unsubscribeError = interstitial.addAdEventListener(
      AdEventType.ERROR,
      error => {
        console.log('🐞error', error);
      },
    );

    // Unsubscribe from events on unmount
    return () => {
      unsubscribeLoaded();
      unsubscribeClose();
      unsubscribeError();
    };
  }, []);

  // No advert ready to show yet
  if (!loaded) {
    return null;
  }

  return (
    <Button
      title="Show Interstitial"
      onPress={() => {
        interstitial.show();
      }}
    />
  );
}
