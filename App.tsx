// 1. Mandatory Polyfills (MUST be at the very top)
import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import { Buffer } from 'buffer';
global.Buffer = Buffer; 

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';

// 2. Import your identity service functions
import { 
  generateMnemonicPhrase, 
  deriveIdentityFromMnemonic, 
  saveIdentitySecurely, 
  getStoredIdentity 
} from './src/services/identityService';

export default function App() {
  
  

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar barStyle="light-content" />
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}