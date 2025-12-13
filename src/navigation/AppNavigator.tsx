import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import MnemonicScreen from '../screens/MnemonicScreen';
import TabNavigator from './TabNavigator'; // Import your TabNavigator

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  SignUp: undefined;
  Mnemonic: undefined;
  MainApp: undefined; // Define the new route
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="Mnemonic" component={MnemonicScreen} />
      
      {/* Add the TabNavigator as a screen named "MainApp" */}
      <Stack.Screen name="MainApp" component={TabNavigator} />
    </Stack.Navigator>
  );
}