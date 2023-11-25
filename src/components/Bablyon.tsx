import {EngineView} from '@babylonjs/react-native';
import React from 'react';
import {useBabylonStore} from '../stores';
import {useInitBabylon} from '../babylon/useInitBabylon';

export function Bablyon() {
  const {camera} = useBabylonStore();

  useInitBabylon();

  return <EngineView camera={camera} displayFrameRate={true} />;
}
