import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StatusBar, 
  Alert 
} from 'react-native';
import Logo from '../../assets/images/logo.svg';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import COLORS from '../../constants/colors';
import { scale, fontSize, spacing } from '../../utils/responsive';
import { Button } from '../../components/Button';
import { Ionicons } from '@expo/vector-icons';

// --- TASK 10.5: IMPORT THE AUTH SERVICE ---
import { AuthService } from '../services/authService';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');

  const handleDeviceUnlock = async () => {
    // This triggers the phone's native Fingerprint/PIN prompt
    const success = await AuthService.authenticateUser();
    
    if (success) {
      // If the phone recognizes the user, let them in
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainApp' }],
      });
    } else {
      Alert.alert("Authentication Failed", "Could not verify identity. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" />

      <Logo 
        width={scale(184.05)} 
        height={scale(199.29)} 
        style={styles.logo} 
        fill={COLORS.white} 
      />

      <Text style={styles.title}>Secure Access</Text>
      <Text style={styles.subtitle}>Unlock your Anchor Wallet to manage your credentials.</Text>

      <View style={styles.unlockContainer}>
        {/* Primary Action: Unlock using Device Security */}
        <TouchableOpacity style={styles.biometricButton} onPress={handleDeviceUnlock}>
          <View style={styles.iconBackground}>
            <Ionicons name="finger-print" size={scale(50)} color={COLORS.primary} />
          </View>
          <Text style={styles.unlockText}>Unlock with Device Security</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.dividerContainer}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.line} />
      </View>

      <View style={styles.footer}>
        {/* Secondary Action: Recovery (if user gets a new phone) */}
        <TouchableOpacity onPress={() => navigation.navigate('MnemonicRecovery')}>
           <Text style={styles.recoverText}>Recover with Secret Phrase</Text>
        </TouchableOpacity>

        <View style={styles.signUpRow}>
          <Text style={styles.signUpText}>New to Anchor? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signUpLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingHorizontal: spacing.lg,
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + spacing.md : scale(68),
  },
  logo: {
    marginLeft: scale(-35),
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize['4xl'],
    fontWeight: 'bold',
    color: COLORS.white,
  },
  subtitle: {
    fontSize: fontSize.lg,
    color: COLORS.white,
    opacity: 0.8,
    marginBottom: spacing['2xl'],
    lineHeight: scale(24),
  },
  unlockContainer: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  biometricButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: spacing.xl,
    borderRadius: scale(20),
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  iconBackground: {
    width: scale(90),
    height: scale(90),
    backgroundColor: COLORS.white,
    borderRadius: scale(45),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  unlockText: {
    color: COLORS.white,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dividerText: {
    color: COLORS.white,
    paddingHorizontal: spacing.md,
    opacity: 0.6,
  },
  footer: {
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: spacing['2xl'],
  },
  recoverText: {
    color: COLORS.white,
    fontSize: fontSize.base,
    textDecorationLine: 'underline',
    marginBottom: spacing.lg,
    opacity: 0.9,
  },
  signUpRow: {
    flexDirection: 'row',
  },
  signUpText: {
    color: COLORS.white,
    opacity: 0.8,
    fontSize: fontSize.base,
  },
  signUpLink: {
    color: COLORS.white,
    fontSize: fontSize.base,
    fontWeight: 'bold',
  },
});