

import { StyleSheet, View, Text, TextInput, TouchableOpacity, StatusBar } from 'react-native';
import Logo from '../../assets/images/logo.svg'; 
// Import navigation types
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

// --- THIS IS YOUR COLOR PALETTE ---
const COLORS = {
  primary: '#311F5A', // Your Deep Purple
  white: '#FFFFFF',
};

// --- This type is for React Navigation ---
type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

export default function LoginScreen({ navigation }: Props) {
  return (
    // Full-screen container
    <View style={styles.container}>
      {/* This makes the top status bar translucent */}
      <StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" />

      {/* --- YOUR LOGO (NOW WHITE) --- */}
      <Logo 
        width={184.05} 
        height={199.29} 
        style={styles.logo} 
        fill={COLORS.white} 
      />

      {/* --- WELCOME TEXT --- */}
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      {/* --- INPUT FIELDS --- */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email Address"
          placeholderTextColor="#FFFFFF80" // White with 50% opacity
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#FFFFFF80" // White with 50% opacity
          style={styles.input}
          secureTextEntry // Hides password
        />
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      {/* --- BUTTONS --- */}
      <View style={styles.buttonContainer}>
        {/* --- SIGN IN BUTTON --- */}
        <TouchableOpacity style={styles.signInButton}>
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>

        {/* --- SIGN UP LINK (NOW NAVIGATES) --- */}
        <View style={styles.signUpRow}>
          <Text style={styles.signUpText}>New to Anchor? </Text>
          {/* This TouchableOpacity now uses the navigation prop */}
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signUpLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
        
      </View>
    </View>
  );
}

// --- STYLESHEET (Using your final styles) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 34, 
    // Get top padding from status bar, add a little extra
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 20 : 68, 
  },
  logo: {
    marginLeft:-35, // Centered your logo
    marginBottom: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.white,
    opacity: 0.8,
    textAlign: 'left',
    marginBottom: 32,
  },
  inputContainer: { // Added this wrapper
    width: '100%',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#FFFFFF80', // White with 50% opacity
    borderRadius: 8,
    paddingHorizontal: 16,
    color: COLORS.white,
    fontSize: 16,
    marginBottom: 16,
  },
  forgotPassword: {
    fontSize: 14,
    color: COLORS.white,
    textAlign: 'right',
    opacity: 0.8,
    marginBottom: 32,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  signInButton: {
    width: '100%',
    height: 50,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  signInButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  signUpRow: {
    flexDirection: 'row',
  },
  signUpText: {
    color: COLORS.white,
    opacity: 0.8,
    fontSize: 14,
  },
  signUpLink: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
});