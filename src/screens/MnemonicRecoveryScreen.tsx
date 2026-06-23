import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TextInput, StatusBar, Alert, 
  KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import COLORS from '../../constants/colors';
import { scale, fontSize, spacing } from '../../utils/responsive';
import { Button } from '../../components/Button';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ethers } from 'ethers';

// ⚠️ CHANGE THIS to match your local network IP or backend URL (e.g., http://192.168.1.X:5000)
const BACKEND_URL = "http://192.168.1.12:5000"; 

type Props = { navigation: StackNavigationProp<RootStackParamList, 'MnemonicRecovery'> };

export default function MnemonicRecoveryScreen({ navigation }: Props) {
  const [mnemonic, setMnemonic] = useState('');
  const [isRecovering, setIsRecovering] = useState(false);

  const handleRecover = async () => {
    const cleanedPhrase = mnemonic.trim().replace(/\s+/g, ' ').toLowerCase();
    if (cleanedPhrase.split(' ').length !== 12) {
      Alert.alert("Invalid Phrase", "Please enter exactly 12 words.");
      return;
    }
    
    setIsRecovering(true);

    try {
      // 1. Locally derive keys and DID from the mnemonic phrase
      const wallet = ethers.Wallet.fromMnemonic(cleanedPhrase);
      const identityData = { 
        privateKey: wallet.privateKey, 
        address: wallet.address, 
        did: `did:ethr:${wallet.address}` 
      };
      
      // 2. Securely save the identity on the device
      await SecureStore.setItemAsync('user_identity', JSON.stringify(identityData));

      // 3. Centralized Sync: Quick fetch from your backend database using the DID
      try {
        const response = await fetch(`${BACKEND_URL}/api/credentials/user/${encodeURIComponent(identityData.did)}`);
        
        if (response.ok) {
          const serverCredentials = await response.json();
          
          // Save the fetched list directly into your local wallet cache
          await AsyncStorage.setItem('anchor_secured_credentials', JSON.stringify(serverCredentials));
          console.log("Credentials successfully synced from backend registry.");
        } else {
          console.log("Failed to find credentials for this DID on the server.");
        }
      } catch (fetchError) {
        // If server is down/offline, we still let them log in
        console.log("Backend server unreachable during recovery sync:", fetchError);
      }
      
      // 4. Redirect smoothly to the dashboard
      navigation.reset({ index: 0, routes: [{ name: 'MainApp' }] });
      
    } catch (e) {
      Alert.alert("Recovery Failed", "Invalid phrase. Please check your spelling.");
    } finally {
      setIsRecovering(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={scale(28)} color={COLORS.white} />
        </TouchableOpacity>

        <View style={styles.iconContainer}>
          <Ionicons name="key-outline" size={scale(40)} color={COLORS.primary} />
        </View>

        <Text style={styles.title}>Account Recovery</Text>
        <Text style={styles.subtitle}>Enter your 12-word secret recovery phrase exactly as you saved it.</Text>

        <View style={styles.inputCard}>
          <TextInput
            style={styles.textInput}
            placeholder="apple brave cat dog elephant..."
            placeholderTextColor="rgba(113, 128, 150, 0.5)"
            multiline
            textAlignVertical="top"
            value={mnemonic}
            onChangeText={setMnemonic}
            editable={!isRecovering}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button 
          title={isRecovering ? "Syncing Account..." : "Restore Wallet"} 
          onPress={handleRecover} 
          disabled={isRecovering}
          style={styles.restoreButton}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary },
  scrollContent: { padding: spacing.lg, paddingTop: 60 },
  backButton: { marginBottom: spacing.md },
  iconContainer: { width: scale(70), height: scale(70), backgroundColor: COLORS.white, borderRadius: scale(35), justifyContent: 'center', alignItems: 'center', marginBottom: spacing.lg },
  title: { fontSize: fontSize['3xl'], fontWeight: 'bold', color: COLORS.white, marginBottom: spacing.sm },
  subtitle: { fontSize: fontSize.base, color: COLORS.white, opacity: 0.8, marginBottom: spacing.xl },
  inputCard: { backgroundColor: COLORS.white, padding: spacing.md, borderRadius: scale(16), minHeight: scale(150) },
  textInput: { fontSize: fontSize.md, color: COLORS.textDark, height: '100%' },
  footer: { padding: spacing.lg, backgroundColor: COLORS.primary },
  restoreButton: { backgroundColor: COLORS.white, color: COLORS.primary }
});