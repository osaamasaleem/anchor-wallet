import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  StatusBar, 
  TouchableOpacity, 
  Alert,
  Platform,
  ScrollView 
} from 'react-native';
import Logo from '../../assets/images/logo.svg';
import COLORS from '../../constants/colors';
import { scale, fontSize, spacing } from '../../utils/responsive';
import { Button } from '../../components/Button';
import { getMnemonicChallenge } from '../services/identityService';

// ✅ IMPORT CENTRALIZED CONFIGURATION ENTITY
import { API_BASE_URL } from '../config/api';

export default function VerifyMnemonicScreen({ navigation, route }: any) {
  const { mnemonic, userData } = route.params;
  const [challenges, setChallenges] = useState<any[]>([]);
  const [selections, setSelections] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    setChallenges(getMnemonicChallenge(mnemonic));
  }, []);

  const handleSelect = (challengeIndex: number, word: string) => {
    setSelections(prev => ({ ...prev, [challengeIndex]: word }));
  };

  const handleFinalVerify = async () => {
    const isComplete = challenges.every((c, i) => selections[i] === c.correctWord);

    if (isComplete) {
      try {
        console.log(`Attempting registration handshake to: ${API_BASE_URL}`);

        // Clean, direct backend fetch calling our central API rule set 
        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: userData.name,
            email: userData.email,
            did: userData.did
          }),
        });

        const data = await response.json();

        if (response.ok) {
          Alert.alert(
            "Success!", 
            "Identity Secured & Registered. Please sign in to access your wallet.",
            [{ text: "OK", onPress: () => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Login' }], 
                });
            }}]
          );
        } else {
          Alert.alert("Registration Error", data.message || "Something went wrong.");
        }
      } catch (error) {
        console.error("Connection Error:", error);
        Alert.alert("Network Error", "Could not connect to AnchorBackend. Is the server running?");
      }
    } else {
      Alert.alert("Incorrect", "One or more words are wrong. Please check your phrase again.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <Logo 
        width={scale(100)} 
        height={scale(110)} 
        style={styles.logo} 
        fill={COLORS.white} 
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Verify Phrase</Text>
          <Text style={styles.subtitle}>Select the correct word for each position to verify your backup.</Text>
        </View>

        {challenges.map((challenge, i) => (
          <View key={i} style={styles.challengeBox}>
            <Text style={styles.challengeLabel}>What is word #{challenge.index + 1}?</Text>
            <View style={styles.optionsRow}>
              {challenge.options.map((option: string) => (
                <TouchableOpacity 
                  key={option} 
                  style={[
                    styles.optionButton, 
                    selections[i] === option && styles.optionSelected
                  ]}
                  onPress={() => handleSelect(i, option)}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.footer}>
          <Button
            title="Verify & Complete"
            onPress={handleFinalVerify}
            disabled={Object.keys(selections).length < 3}
            variant="outline"
            style={{ 
              backgroundColor: COLORS.white, 
              borderColor: COLORS.white,
              opacity: Object.keys(selections).length < 3 ? 0.5 : 1
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingHorizontal: spacing.lg,
    paddingTop: scale(40),
  },
  logo: { alignSelf: 'center', marginBottom: spacing.md },
  header: { marginBottom: spacing.xl, alignItems: 'center' },
  title: { fontSize: fontSize['2xl'], fontWeight: 'bold', color: COLORS.white },
  subtitle: { fontSize: fontSize.md, color: COLORS.white, opacity: 0.7, textAlign: 'center', marginTop: spacing.xs },
  challengeBox: { marginBottom: spacing.xl },
  challengeLabel: { color: COLORS.white, fontSize: fontSize.lg, marginBottom: spacing.md, fontWeight: '600' },
  optionsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  optionButton: {
    width: '31%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: scale(8),
    paddingVertical: scale(12),
    alignItems: 'center'
  },
  optionSelected: { backgroundColor: 'rgba(255, 255, 255, 0.2)', borderColor: COLORS.white },
  optionText: { color: COLORS.white, fontSize: fontSize.md },
  footer: { marginVertical: spacing.xl },
});