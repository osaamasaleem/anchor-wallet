import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TextInput, StatusBar, 
  KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator 
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import Logo from '../../assets/images/logo.svg';
import COLORS from '../../constants/colors';
import { scale, fontSize, spacing } from '../../utils/responsive';
import { Button } from '../../components/Button';
import { generateMnemonicPhrase, deriveIdentityFromMnemonic, saveIdentitySecurely } from '../services/identityService';

type SignUpScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignUp'>;

export default function SignUpScreen({ navigation }: { navigation: SignUpScreenNavigationProp }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name || !email) {
      Alert.alert("Required", "Please enter your name and email.");
      return;
    }

    setLoading(true);
    setTimeout(async () => {
      try {
        const mnemonic = generateMnemonicPhrase();
        const identity = deriveIdentityFromMnemonic(mnemonic);
        await saveIdentitySecurely(mnemonic, identity.privateKey);

        navigation.navigate('Mnemonic', { 
          mnemonic, 
          userData: { name, email, did: identity.did } 
        });
      } catch (error) {
        Alert.alert("Error", "Security identity generation failed.");
      } finally {
        setLoading(false);
      }
    }, 100); 
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{flex: 1, backgroundColor: COLORS.primary}}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" /> 
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Logo width={scale(180)} height={scale(180)} style={styles.logo} fill={COLORS.white} />
        <Text style={styles.title}>Get Started</Text>
        <Text style={styles.subtitle}>Create your decentralized identity</Text>
        <View style={styles.inputContainer}>
          <TextInput placeholder="Full Name" placeholderTextColor="rgba(255,255,255,0.5)" style={styles.input} value={name} onChangeText={setName} />
          <TextInput placeholder="Email Address" placeholderTextColor="rgba(255,255,255,0.5)" style={styles.input} keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
        </View>
        <View style={styles.buttonContainer}>
          {loading ? <ActivityIndicator color={COLORS.white} size="large" /> : (
            <Button title="Sign Up" onPress={handleSignUp} variant="outline" style={{backgroundColor: COLORS.white, borderColor: COLORS.white}} />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingHorizontal: spacing.lg, paddingTop: scale(60), paddingBottom: spacing.xl },
  logo: { marginLeft: scale(-30), marginBottom: spacing.md },
  title: { fontSize: fontSize['4xl'], fontWeight: 'bold', color: COLORS.white },
  subtitle: { fontSize: fontSize.lg, color: COLORS.white, opacity: 0.8, marginBottom: spacing.xl },
  inputContainer: { width: '100%' },
  input: { width: '100%', height: scale(50), borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)', borderRadius: scale(8), paddingHorizontal: spacing.md, color: COLORS.white, marginBottom: spacing.md },
  buttonContainer: { width: '100%', alignItems: 'center', marginTop: spacing.lg }
});