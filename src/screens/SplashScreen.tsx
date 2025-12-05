import { StyleSheet, View, Text, StatusBar, ActivityIndicator } from 'react-native';
import Logo from '../../assets/images/logo.svg'; // Your SVG Logo
import { useEffect } from 'react';

// --- Import navigation types ---
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

// --- THIS IS YOUR COLOR PALETTE ---
const COLORS = {
  primary: '#311F5A', // Your Deep Purple
  white: '#FFFFFF',
};

// --- Define the navigation prop type ---
type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Splash'>;

type Props = {
  navigation: SplashScreenNavigationProp;
};

export default function SplashScreen({ navigation }: Props) {

  useEffect(() => {
    // Wait for 3 seconds
    const timer = setTimeout(() => {
      // 'replace' swaps the screen, so the user can't press "back"
      // and go back to the splash screen.
      navigation.replace('Login');
    }, 3000); // 3000 milliseconds = 3 seconds

    // Clear the timer if the component unmounts
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    // Full-screen container
    <View style={styles.container}>
      {/* This makes the top status bar translucent (draws under it) */}
      <StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent"/>

      {/* --- YOUR LOGO (FROM FIGMA) --- */}
      <Logo 
        width={100} // Based on your "Anchor Wallet" logo design
        height={100} // Based on your "Anchor Wallet" logo design
        fill={COLORS.white} // Forces the SVG to be white
        style={styles.logo}
      />

      {/* --- APP NAME --- */}
      <Text style={styles.title}>Anchor Wallet</Text>

      {/* --- TAGLINE --- */}
      <Text style={styles.subtitle}>Your Credentials, Secured</Text>

      {/* --- LOADING INDICATOR --- */}
      <ActivityIndicator 
        size="small" 
        color={COLORS.white} 
        style={styles.spinner} 
      />
    </View>
  );
}

// --- STYLESHEET ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'center', // Centers everything
    alignItems: 'center',
    paddingHorizontal: 34, 
  },
  logo: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32, // Based on your Figma design
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16, // Based on your Figma design
    color: COLORS.white,
    opacity: 0.8,
    textAlign: 'center',
    marginTop: 8,
  },
  spinner: {
    marginTop: 40, // Space between tagline and spinner
  },
});