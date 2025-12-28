import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StatusBar, 
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import Logo from '../../assets/images/logo.svg';
import COLORS from '../../constants/colors';
import { scale, fontSize, spacing } from '../../utils/responsive';
import { Button } from '../../components/Button';

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
          width={scale(184.05)} 
          height={scale(199.29)} 
          style={styles.logo} 
          fill={COLORS.white} 
        />

        <Text style={styles.title}>Get Started</Text>
        <Text style={styles.subtitle}>Sign Up to continue</Text>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Full Name"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            style={styles.input}
          />
          <TextInput
            placeholder="Email Address"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            style={styles.input}
            secureTextEntry 
          />
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            style={styles.input}
            secureTextEntry 
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button 
            title="Sign Up" 
            onPress={() => navigation.navigate('Mnemonic')}
            variant="outline"
            style={[styles.signUpButton, { backgroundColor: COLORS.white, borderColor: COLORS.white }]}
          />

          <View style={styles.learnMoreRow}>
            <Text style={styles.learnMoreText}>Learn. </Text>
            <TouchableOpacity>
              <Text style={styles.learnMoreLink}>How this works?</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already a user? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.primary,
    paddingHorizontal: spacing.lg,
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + spacing.md : scale(68),
    paddingBottom: spacing['2xl'],
  },
  logo: {
    marginLeft: scale(-35),
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize['4xl'],
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: fontSize.lg,
    color: COLORS.white,
    opacity: 0.8,
    textAlign: 'left',
    marginBottom: spacing.xl,
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    width: '100%',
    height: scale(50),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: scale(8),
    paddingHorizontal: spacing.md,
    color: COLORS.white,
    fontSize: fontSize.md,
    marginBottom: spacing.md,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  signUpButton: {
    marginBottom: spacing.sm,
  },
  learnMoreRow: {
    flexDirection: 'row',
    marginTop: spacing.sm,
  },
  learnMoreText: {
    color: COLORS.white,
    opacity: 0.8,
    fontSize: fontSize.base,
  },
  learnMoreLink: {
    color: COLORS.white,
    fontSize: fontSize.base,
    fontWeight: 'bold',
  },
  loginRow: {
    flexDirection: 'row',
    marginTop: spacing['2xl'],
    marginBottom: spacing['2xl'],
  },
  loginText: {
    color: COLORS.white,
    opacity: 0.8,
    fontSize: fontSize.base,
  },
  loginLink: {
    color: COLORS.white,
    fontSize: fontSize.base,
    fontWeight: 'bold',
  },
});