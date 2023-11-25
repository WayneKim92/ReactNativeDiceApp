import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import MainScreen from './src/MainScreen';

function App() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{flex: 1}}>
        <MainScreen />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

export default App;
