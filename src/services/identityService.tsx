import { ethers } from 'ethers';
import * as SecureStore from 'expo-secure-store';
import * as bip39 from 'bip39';

/**
 * Generates a secure 12-word mnemonic phrase (BIP-39 standard).
 */
export const generateMnemonicPhrase = (): string => {
  // 16 bytes of entropy results in a 12-word phrase
  const entropy = ethers.utils.randomBytes(16);
  const mnemonic = ethers.utils.entropyToMnemonic(entropy);
  return mnemonic;
};

/**
 * Validates if a mnemonic phrase is a valid BIP-39 phrase.
 */
export const validateMnemonic = (phrase: string): boolean => {
  return ethers.utils.isValidMnemonic(phrase);
};

/**
 * Task 3: Derives the full cryptographic identity from a mnemonic phrase.
 */
export const deriveIdentityFromMnemonic = (mnemonic: string) => {
  try {
    // Create a wallet instance from the 12 words
    const wallet = ethers.Wallet.fromMnemonic(mnemonic);

    return {
      mnemonic: mnemonic, // The 12 words
      privateKey: wallet.privateKey, // The secret "signing" key
      address: wallet.address, // The public address (0x...)
      did: `did:ethr:${wallet.address}`, // The formal W3C DID
    };
  } catch (error) {
    console.error("Identity derivation failed:", error);
    throw error;
  }
};

/**
 * Task 4: Securely stores the mnemonic and private key on the device.
 */
export const saveIdentitySecurely = async (mnemonic: string, privateKey: string) => {
  try {
    const sensitiveData = JSON.stringify({ mnemonic, privateKey });

    // SecureStore automatically uses the device's hardware-backed keystore
    await SecureStore.setItemAsync('user_identity', sensitiveData, {
      keychainAccessible: SecureStore.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
    });
    
    console.log("Identity stored in Expo SecureStore ✅");
    return true;
  } catch (error) {
    console.error("Secure storage failed:", error);
    return false;
  }
};

/**
 * Retrieves the identity from secure storage.
 */
export const getStoredIdentity = async () => {
  try {
    const result = await SecureStore.getItemAsync('user_identity');

    if (result) {
      return JSON.parse(result);
    }
    return null;
  } catch (error) {
    console.error("Could not retrieve identity:", error);
    return null;
  }
};


/**
 * Task 7: Secure Mnemonic Challenge
 * Pulls from the official 2,048-word BIP-39 list to create believable distractors.
 */
export const getMnemonicChallenge = (mnemonic: string) => {
  const allWords = mnemonic.split(' ');
  const wordlist = bip39.wordlists.english; // The official English BIP-39 wordlist
  const indices: number[] = [];
  
  // 1. Pick 3 unique random positions
  while (indices.length < 3) {
    const r = Math.floor(Math.random() * 12);
    if (!indices.includes(r)) indices.push(r);
  }
  
  // 2. Map indices to challenges with dynamic distractors
  return indices.sort((a, b) => a - b).map(index => {
    const correctWord = allWords[index];
    const distractors: string[] = [];
    
    // Pick 2 random words from the 2,048 available words
    while (distractors.length < 2) {
      const randomWord = wordlist[Math.floor(Math.random() * wordlist.length)];
      if (randomWord !== correctWord && !distractors.includes(randomWord)) {
        distractors.push(randomWord);
      }
    }
      
    return {
      index,
      correctWord,
      // Randomly shuffle the 1 correct and 2 fake words
      options: [correctWord, ...distractors].sort(() => 0.5 - Math.random())
    };
  });
};