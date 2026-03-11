// src/navigation/AppNavigator.tsx (simplified)
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import MnemonicScreen from '../screens/MnemonicScreen';
import VerifyMnemonicScreen from '../screens/VerifyMnemonicScreen';
import CredentialDetailScreen from '../screens/CredentialDetailScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import TabNavigator from './TabNavigator';
import { RootStackParamList } from '../types/navigation';

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="Mnemonic" component={MnemonicScreen} />
      <Stack.Screen name="VerifyMnemonic" component={VerifyMnemonicScreen} />
      <Stack.Screen name="MainApp" component={TabNavigator} />
      <Stack.Screen name="CredentialDetail" component={CredentialDetailScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
}