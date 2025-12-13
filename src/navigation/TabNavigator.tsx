import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; 

// Import your main app screens (You will create these next)
import HomeScreen from '../screens/HomeScreen';
import WalletScreen from '../screens/WalletScreen';
import ProfileScreen from '../screens/ProfileScreen';

// --- COLOR PALETTE ---
const COLORS = {
  primary: '#311F5A', // Your Deep Purple
  white: '#FFFFFF',
  grey: '#A0A0A0',
};

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // Hide header for all tabs
        tabBarActiveTintColor: COLORS.primary, // Active tab color
        tabBarInactiveTintColor: COLORS.grey,  // Inactive tab color
        tabBarStyle: {
          height: 60,
          paddingBottom: 10,
          paddingTop: 10,
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: '#F1F3F6',
          elevation: 5, // Shadow for Android
        },
        // Icon Logic
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Wallet') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
             iconName = 'alert-circle'; // Default fallback
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Wallet" component={WalletScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}