import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StatusBar, 
  KeyboardAvoidingView,
  Platform,
  ScrollView // Added ScrollView
} from 'react-native';
// Import navigation types
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

import Logo from '../../assets/images/logo.svg'; 

const COLORS = {
  primary: '#311F5A', 
  white: '#FFFFFF',
};

// --- This type is for React Navigation ---
type SignUpScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignUp'>;

type Props = {
  navigation: SignUpScreenNavigationProp;
};

export default function SignUpScreen({ navigation }: Props) {
  return (
    // This component automatically handles the keyboard
    <KeyboardAvoidingView 
       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
  style={styles.keyboardAvoidingContainer}
    >
      <StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" /> 

      {/* Use ScrollView to prevent keyboard overlap */}
      <ScrollView 
      
      contentContainerStyle={styles.container}
  keyboardShouldPersistTaps="handled"
  showsVerticalScrollIndicator={false}>
        
        <Logo 
          width={184.05} 
          height={199.29} 
          style={styles.logo} 
          fill={COLORS.white} 
        />

        <Text style={styles.title}>Get Started</Text>
        <Text style={styles.subtitle}>Sign Up to continue</Text>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Full Name"
            placeholderTextColor="#FFFFFF80" 
            style={styles.input}
          />
          <TextInput
            placeholder="Email Address"
            placeholderTextColor="#FFFFFF80" 
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#FFFFFF80" 
            style={styles.input}
            secureTextEntry 
          />
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="#FFFFFF80" 
            style={styles.input}
            secureTextEntry 
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
  style={styles.signUpButton} 
  onPress={() => navigation.navigate('Mnemonic')} // <-- Add this!
>
  <Text style={styles.signUpButtonText}>Sign Up</Text>
</TouchableOpacity>

          <View style={styles.learnMoreRow}>
            <Text style={styles.learnMoreText}>Learn. </Text>
            <TouchableOpacity>
              <Text style={styles.learnMoreLink}>How this works?</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already a user? </Text>
            {/* This now uses the navigation prop to go back to the 'Login' screen */}
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// --- STYLESHEET (Using your final styles) ---
const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  container: {
    flexGrow: 1, // Allows content to grow and scroll
    backgroundColor: COLORS.primary,
    paddingHorizontal: 34, 
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 20 : 68, 
    paddingBottom: 40, // Add some padding at the bottom
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
  inputContainer: {
    width: '100%',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#FFFFFF80', 
    borderRadius: 8,
    paddingHorizontal: 16,
    color: COLORS.white,
    fontSize: 16,
    marginBottom: 16,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 24, // Adjusted spacing
  },
  signUpButton: {
    width: '100%',
    height: 50,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  learnMoreRow: {
    flexDirection: 'row',
    marginTop: 12, 
  },
  learnMoreText: {
    color: COLORS.white,
    opacity: 0.8,
    fontSize: 14,
  },
  learnMoreLink: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  loginRow: {
    flexDirection: 'row',
    marginTop: 40, 
    marginBottom: 40, // Added bottom margin
  },
  loginText: {
    color: COLORS.white,
    opacity: 0.8,
    fontSize: 14,
  },
  loginLink: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
});