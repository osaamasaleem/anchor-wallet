// This MUST be the very first line of your app
import 'react-native-gesture-handler';

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'react-native';

/**
 * This is the new root of your app.
 * It does nothing but load the NavigationContainer and your AppNavigator.
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {/* Set the default status bar style for the whole app */}
        <StatusBar barStyle="light-content" />
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

