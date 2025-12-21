// src/navigation/WalletStack.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WalletScreen from '../screens/WalletScreen';
import CredentialDetailScreen from '../screens/CredentialDetailScreen';

export type WalletStackParamList = {
  WalletMain: undefined;
  CredentialDetail: { credential: any };
};

const Stack = createStackNavigator<WalletStackParamList>();

export default function WalletStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WalletMain" component={WalletScreen} />
      <Stack.Screen name="CredentialDetail" component={CredentialDetailScreen} />
    </Stack.Navigator>
  );
}