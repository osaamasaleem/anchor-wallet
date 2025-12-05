import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import your three screen components
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen'; // <-- No spaces at the end

// This exports a "type list" so our other screens know
// what props to expect for navigation.
export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  SignUp: undefined;
};

// This is the "Stack" that will hold all your screens
const Stack = createStackNavigator<RootStackParamList>();

/**
 * This is your "separate file" for navigation.
 * It defines all available screens and hides the top header.
 */
export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* The first screen in the stack is the one that loads first */}
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
}