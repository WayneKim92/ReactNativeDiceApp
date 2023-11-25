import React, {FunctionComponent} from 'react';
import {View, ViewProps} from 'react-native';
import {EngineView} from '@babylonjs/react-native';
import {useBabylonStore} from './stores';
import {useInitBabylon} from './babylon/useInitBabylon';
import {Header, Footer, SettingBottomSheet} from './components';

const EngineScreen: FunctionComponent<ViewProps> = () => {
  const {camera} = useBabylonStore();

  useInitBabylon();

  return (
    <View style={{flex: 1}}>
      <EngineView camera={camera} displayFrameRate={true} />

      <Header />
      <Footer />
      <SettingBottomSheet />
    </View>
  );
};

const MainScreen = () => {
  return <EngineScreen />;
};

export default MainScreen;
