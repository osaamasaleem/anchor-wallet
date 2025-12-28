import React, { useState, useEffect } from 'react';
import Logo from '../../assets/images/logo.svg';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  StatusBar, 
  FlatList, 
  Alert 
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import { scale, fontSize, spacing } from '../../utils/responsive';
import { Button } from '../../components/Button';

// --- DUMMY DATA (12 WORDS) ---
// In the real app, this comes from ethers.Wallet.createRandom()
const DUMMY_MNEMONIC = [
  { id: '1', word: 'alpha' },
  { id: '2', word: 'bravo' },
  { id: '3', word: 'charlie' },
  { id: '4', word: 'delta' },
  { id: '5', word: 'echo' },
  { id: '6', word: 'foxtrot' },
  { id: '7', word: 'golf' },
  { id: '8', word: 'hotel' },
  { id: '9', word: 'india' },
  { id: '10', word: 'juliet' },
  { id: '11', word: 'kilo' },
  { id: '12', word: 'lima' },
];

export default function MnemonicScreen({ navigation }: any) {

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [countdown, setCountdown] = useState(5);

  // --- TIMER LOGIC ---
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsButtonDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // --- COPY FUNCTION ---
  const copyToClipboard = async () => {
    // Join the words into a single string
    const phrase = DUMMY_MNEMONIC.map(item => item.word).join(' ');
    await Clipboard.setStringAsync(phrase);
    Alert.alert("Copied!", "Your recovery phrase has been copied to clipboard.");
  };

  // --- NAVIGATION HANDLER ---
  const handleContinue = () => {
    // Navigate to the TabNavigator (MainApp) and clear the history stack
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainApp' }],
    });
  };

  // --- RENDER ITEM (For FlatList) ---
  const renderWordItem = ({ item }: { item: { id: string; word: string } }) => (
    <View style={styles.wordBadge}>
      <Text style={styles.wordNumber}>{item.id}</Text>
      <Text style={styles.wordText}>{item.word}</Text>
    </View>
  );

 

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />


      <Logo 
        width={scale(144.05)} 
        height={scale(159.29)} 
        style={styles.logo} 
        fill={COLORS.white} 
      />




      {/* --- HEADER --- */}
      <View style={styles.header}>
        <Text style={styles.title}>Secret Recovery Phrase</Text>
        <Text style={styles.subtitle}>
          This is the only way to recover your account. Write it down and keep it safe.
        </Text>
      </View>

      {/* --- GRID OF WORDS --- */}
      <View style={styles.gridContainer}>
        <FlatList
          data={DUMMY_MNEMONIC}
          renderItem={renderWordItem}
          keyExtractor={(item) => item.id}
          numColumns={3} // Creates the 3-column grid
          columnWrapperStyle={styles.row} // Spacing between columns
          scrollEnabled={false} // Disable scrolling for a static grid feel
        />
      </View>

      {/* --- COPY BUTTON --- */}
      <TouchableOpacity onPress={copyToClipboard} style={styles.copyButton}>
        <Text style={styles.copyText}>Copy to Clipboard</Text>
      </TouchableOpacity>

      {/* --- WARNING BOX --- */}
      <View style={styles.warningContainer}>
        {/* Using a simple text symbol for warning, or use Ionicons name="warning" */}
        <Text style={styles.warningIcon}>⚠️</Text> 
        <Text style={styles.warningText}>
          Never share this with anyone. Anchor Support will never ask for it.
        </Text>
      </View>

      <View style={styles.footer}>
        <Button
          title={isButtonDisabled ? `Wait ${countdown}s` : "I have written it down"}
          onPress={handleContinue}
          disabled={isButtonDisabled}
          variant="outline"
          style={[
            { backgroundColor: COLORS.white, borderColor: COLORS.white },
            isButtonDisabled && { opacity: 0.5 }
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingHorizontal: spacing.lg,
    paddingTop: scale(60),
  },
  logo: {
    marginLeft: scale(-35),
    marginBottom: spacing.md,
  },
  header: {
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: fontSize['2xl'],
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: COLORS.white,
    opacity: 0.8,
    textAlign: 'center',
    lineHeight: scale(22),
  },
  gridContainer: {
    marginBottom: spacing.md,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  wordBadge: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: scale(8),
    width: '31%',
    paddingVertical: scale(10),
    paddingHorizontal: scale(5),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wordNumber: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: fontSize.sm,
    marginRight: scale(6),
  },
  wordText: {
    color: COLORS.white,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  copyButton: {
    alignSelf: 'center',
    marginBottom: spacing['2xl'],
    padding: scale(10),
  },
  copyText: {
    color: COLORS.white,
    fontSize: fontSize.md,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  warningContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    padding: spacing.md,
    borderRadius: scale(12),
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.5)',
  },
  warningIcon: {
    fontSize: fontSize['2xl'],
    marginRight: spacing.sm,
  },
  warningText: {
    color: COLORS.white,
    fontSize: fontSize.base,
    flex: 1,
    fontWeight: '500',
  },
  footer: {
    marginTop: 'auto',
    marginBottom: spacing['2xl'],
  },
});