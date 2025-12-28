import { StyleSheet, View, Text, StatusBar, ActivityIndicator } from 'react-native';
import Logo from '../../assets/images/logo.svg';
import { useEffect } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import COLORS from '../../constants/colors';
import { scale, fontSize, spacing } from '../../utils/responsive';

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

      <Logo 
        width={scale(100)}
        height={scale(100)}
        fill={COLORS.white}
        style={styles.logo}
      />

      <Text style={styles.title}>Anchor Wallet</Text>
      <Text style={styles.subtitle}>Your Credentials, Secured</Text>

      <ActivityIndicator 
        size="small" 
        color={COLORS.white} 
        style={styles.spinner} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  logo: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize['3xl'],
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSize.md,
    color: COLORS.white,
    opacity: 0.8,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  spinner: {
    marginTop: spacing['2xl'],
  },
});