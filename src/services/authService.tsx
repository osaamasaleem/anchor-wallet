import * as LocalAuthentication from 'expo-local-authentication';
import { Alert } from 'react-native';

/**
 * authService handles hardware-level security (Fingerprint, FaceID, or Device PIN).
 */
export const AuthService = {
  /**
   * Triggers the native phone security prompt.
   * Returns true if the user successfully unlocks the phone.
   */
  authenticateUser: async (): Promise<boolean> => {
    try {
      // 1. Check if the phone actually has biometric hardware (sensors)
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      
      // 2. Check if the user has actually set up a PIN/Fingerprint on this phone
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        Alert.alert(
          "Security Warning",
          "This device does not have a PIN or Biometrics set up. Please secure your phone to protect your identity."
        );
        // For development, we return true so you don't get locked out
        return true; 
      }

      // 3. The actual prompt
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock Anchor Wallet',
        fallbackLabel: 'Use Passcode', // If fingerprint fails, use phone PIN
        disableDeviceFallback: false,
      });

      return result.success;
    } catch (error) {
      console.error("Auth Service Error:", error);
      return false;
    }
  }
};