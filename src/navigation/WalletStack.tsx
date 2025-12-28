// src/navigation/WalletStack.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WalletScreen from '../screens/WalletScreen';
import { WalletStackParamList } from '../types/navigation';

const Stack = createStackNavigator<WalletStackParamList>();

export default function WalletStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WalletMain" component={WalletScreen} />
    </Stack.Navigator>
  );
}