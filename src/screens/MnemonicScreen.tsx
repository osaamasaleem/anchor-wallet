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
// Ideally, replace this with an Icon from @expo/vector-icons
import { Ionicons } from '@expo/vector-icons'; 

// --- COLOR PALETTE ---
const COLORS = {
  primary: '#311F5A', 
  white: '#FFFFFF',
  accent: '#FFD700', // Gold/Yellow for warning
  grey: '#F1F3F6',
  disabled: '#A0A0A0',
};

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
    // Navigate to your main app (Dashboard)
    // For now, we can just log or go back to Login as a placeholder
    console.log("Navigate to Dashboard");
    // navigation.navigate('Dashboard'); // Uncomment when you have a Dashboard
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


      {/* --- YOUR LOGO (NOW WHITE) --- */}
            <Logo 
              width={144.05} 
              height={159.29} 
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

      {/* --- CONTINUE BUTTON (Bottom) --- */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.button, isButtonDisabled && styles.buttonDisabled]} 
          onPress={handleContinue}
          disabled={isButtonDisabled}
        >
          <Text style={[styles.buttonText, isButtonDisabled && styles.buttonTextDisabled]}>
            {isButtonDisabled ? `Wait ${countdown}s` : "I have written it down"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  logo: {
    marginLeft: -35,
    marginBottom: 20,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.8,
    textAlign: 'center',
    lineHeight: 22,
  },
  gridContainer: {
    marginBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12, // Vertical spacing between rows
  },
  wordBadge: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    width: '31%', // Fits 3 items with space
    paddingVertical: 10,
    paddingHorizontal: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wordNumber: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    marginRight: 6,
  },
  wordText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  copyButton: {
    alignSelf: 'center',
    marginBottom: 40,
    padding: 10,
  },
  copyText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  warningContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 215, 0, 0.15)', // Transparent Yellow
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.5)',
  },
  warningIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  warningText: {
    color: COLORS.white,
    fontSize: 14,
    flex: 1,
    fontWeight: '500',
  },
  footer: {
    marginTop: 'auto', // Pushes button to bottom
    marginBottom: 40,
  },
  button: {
    backgroundColor: COLORS.white,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  buttonText: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonTextDisabled: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
});