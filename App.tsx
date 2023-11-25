import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import DiceExample from './src/DiceExample';

function App() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{flex: 1}}>
        <DiceExample />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

export default App;
