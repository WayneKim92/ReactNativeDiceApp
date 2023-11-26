import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import MainScreen from './src/MainScreen';
import {initAdmob} from './src/ads/admob';
import {useEffect} from 'react';

function App() {
  useEffect(() => {
    initAdmob().catch(e => console.log(e));
  }, []);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{flex: 1}}>
        <MainScreen />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

export default App;
