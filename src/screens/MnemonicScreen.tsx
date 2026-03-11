import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, StatusBar, FlatList, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import Logo from '../../assets/images/logo.svg';
import COLORS from '../../constants/colors';
import { scale, fontSize, spacing } from '../../utils/responsive';
import { Button } from '../../components/Button';

export default function MnemonicScreen({ navigation, route }: any) {
  const { mnemonic, userData } = route.params;
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [countdown, setCountdown] = useState(5);

  const mnemonicArray = mnemonic.split(' ').map((word: string, index: number) => ({
    id: (index + 1).toString(),
    word: word,
  }));

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

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(mnemonic);
    Alert.alert("Copied!", "Recovery phrase copied to clipboard.");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <Logo width={scale(120)} height={scale(120)} style={{alignSelf: 'center'}} fill={COLORS.white} />
      <Text style={styles.title}>Secret Recovery Phrase</Text>
      <Text style={styles.subtitle}>Write this down. It is the only way to recover your account.</Text>
      <FlatList
        data={mnemonicArray}
        renderItem={({item}) => (
          <View style={styles.wordBadge}>
            <Text style={styles.wordNumber}>{item.id}</Text>
            <Text style={styles.wordText}>{item.word}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        numColumns={3}
        columnWrapperStyle={{justifyContent: 'space-between', marginBottom: 10}}
      />
      <TouchableOpacity onPress={copyToClipboard}><Text style={styles.copyText}>Copy to Clipboard</Text></TouchableOpacity>
      <Button 
        title={isButtonDisabled ? `Wait ${countdown}s` : "I have written it down"} 
        onPress={() => navigation.navigate('VerifyMnemonic', { mnemonic, userData })} 
        disabled={isButtonDisabled}
        style={{backgroundColor: COLORS.white, opacity: isButtonDisabled ? 0.5 : 1}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary, padding: spacing.lg, paddingTop: scale(50) },
  title: { fontSize: fontSize['2xl'], fontWeight: 'bold', color: COLORS.white, textAlign: 'center', marginTop: 20 },
  subtitle: { fontSize: fontSize.md, color: COLORS.white, opacity: 0.8, textAlign: 'center', marginVertical: 20 },
  wordBadge: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', borderRadius: 8, width: '31%', padding: 10, flexDirection: 'row', justifyContent: 'center' },
  wordNumber: { color: 'rgba(255,255,255,0.5)', marginRight: 5 },
  wordText: { color: COLORS.white, fontWeight: '600' },
  copyText: { color: COLORS.white, textAlign: 'center', textDecorationLine: 'underline', marginVertical: 20 }
});