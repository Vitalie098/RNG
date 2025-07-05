import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Game from '@/components/Game';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Game />

      <StatusBar style="light" />
    </GestureHandlerRootView>
  );
}