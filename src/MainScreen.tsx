import React, {FunctionComponent} from 'react';
import {View, ViewProps} from 'react-native';
import {Header, Footer, SettingBottomSheet} from './components';
import {Bablyon} from './components/Bablyon';

const EngineScreen: FunctionComponent<ViewProps> = () => {
  return (
    <View style={{flex: 1}}>
      <Bablyon />
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
