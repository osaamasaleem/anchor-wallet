
import { StyleSheet, View, Text, TextInput, TouchableOpacity, StatusBar } from 'react-native';
import Logo from '../../assets/images/logo.svg';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import COLORS from '../../constants/colors';
import { scale, fontSize, spacing } from '../../utils/responsive';
import { Button } from '../../components/Button';

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

      <Logo 
        width={scale(184.05)} 
        height={scale(199.29)} 
        style={styles.logo} 
        fill={COLORS.white} 
      />

      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      <View style={styles.inputContainer}>
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
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <Button 
          title="Sign In" 
          onPress={() => navigation.navigate('MainApp')}
          variant="outline"
          style={[styles.signInButton, { backgroundColor: COLORS.white, borderColor: COLORS.white }]}
        />

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
  forgotPassword: {
    fontSize: fontSize.base,
    color: COLORS.white,
    textAlign: 'right',
    opacity: 0.8,
    marginBottom: spacing.xl,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  signInButton: {
    marginBottom: spacing.lg,
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