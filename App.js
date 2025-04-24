// App.js

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ReadingScreen from './src/components/ReadingScreen';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ReadingScreen />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
