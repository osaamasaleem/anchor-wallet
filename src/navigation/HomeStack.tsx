// src/navigation/HomeStack.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import QRScannerScreen from '../screens/QRScannerScreen';
import CredentialDetailScreen from '../screens/CredentialDetailScreen';
import NotificationsScreen from '../screens/NotificationsScreen';


export type HomeStackParamList = {
  HomeMain: undefined;
  QRScanner: undefined;
  CredentialDetail: { credential: any };
    Notifications: undefined; 
};

const Stack = createStackNavigator<HomeStackParamList>();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="QRScanner" component={QRScannerScreen} />
      <Stack.Screen name="CredentialDetail" component={CredentialDetailScreen} />
       <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
}