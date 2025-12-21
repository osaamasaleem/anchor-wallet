// src/screens/QRScannerScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  StatusBar,
  Linking,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

// --- COLOR PALETTE ---
const COLORS = {
  primary: '#311F5A',
  secondary: '#4C35AA',
  white: '#FFFFFF',
  black: '#000000',
  grey: '#F1F3F6',
  lightGrey: '#F8F9FA',
  textDark: '#1A202C',
  textGrey: '#718096',
  success: '#22543D',
  error: '#DC2626',
  overlay: 'rgba(0, 0, 0, 0.7)',
  scanner: '#00FF00',
};

type QRScannerScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MainApp'>;

export default function QRScannerScreen() {
  const navigation = useNavigation<QRScannerScreenNavigationProp>();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [cameraType, setCameraType] = useState<CameraType>('back');

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScanned(true);
    
    // Parse the QR code data (could be a URL, JSON credential, etc.)
    try {
      // Check if it's a URL
      if (data.startsWith('http://') || data.startsWith('https://')) {
        Alert.alert(
          'Open Link?',
          `Do you want to open: ${data}`,
          [
            { text: 'Cancel', onPress: () => setScanned(false), style: 'cancel' },
            { text: 'Open', onPress: () => {
              Linking.openURL(data);
              setTimeout(() => setScanned(false), 2000);
            }},
          ]
        );
      }
      // Check if it's a JSON credential
      else if (data.startsWith('{') && data.endsWith('}')) {
        const credential = JSON.parse(data);
        Alert.alert(
          'Credential Found',
          `Would you like to add: ${credential.title || 'Unknown Credential'}`,
          [
            { text: 'Cancel', onPress: () => setScanned(false), style: 'cancel' },
            { text: 'Add Credential', onPress: () => {
              // In a real app, you would save the credential
              Alert.alert('Success', 'Credential added to your wallet!');
              setTimeout(() => {
                setScanned(false);
                navigation.goBack();
              }, 1500);
            }},
          ]
        );
      }
      // Check if it's a verifiable credential (VC)
      else if (data.includes('verifiableCredential') || data.includes('vc:')) {
        Alert.alert(
          'Verifiable Credential',
          'Found a verifiable credential. Add to wallet?',
          [
            { text: 'Cancel', onPress: () => setScanned(false), style: 'cancel' },
            { text: 'Add', onPress: () => {
              Alert.alert('Success', 'Verifiable credential added!');
              setTimeout(() => {
                setScanned(false);
                navigation.goBack();
              }, 1500);
            }},
          ]
        );
      }
      else {
        Alert.alert(
          'Scanned Data',
          data,
          [
            { text: 'OK', onPress: () => setScanned(false) },
          ]
        );
      }
    } catch (error) {
      Alert.alert(
        'Scanned Data',
        data.substring(0, 100) + (data.length > 100 ? '...' : ''),
        [
          { text: 'OK', onPress: () => setScanned(false) },
        ]
      );
    }
  };

  const toggleTorch = () => {
    setTorchOn(!torchOn);
  };

  const toggleCamera = () => {
    setCameraType(current => (current === 'back' ? 'front' : 'back'));
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="camera-off" size={64} color={COLORS.textGrey} />
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionText}>
          Anchor Wallet needs camera access to scan QR codes for credentials.
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.black} />
      
      {/* Camera View */}
      <CameraView
        style={styles.camera}
        facing={cameraType}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        enableTorch={torchOn}
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'pdf417', 'ean13', 'code128'],
        }}
      >
        {/* Overlay */}
        <View style={styles.overlay}>
          {/* Top Bar */}
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
              <Ionicons name="close" size={28} color={COLORS.white} />
            </TouchableOpacity>
            <Text style={styles.title}>Scan QR Code</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Scanner Frame */}
          <View style={styles.scannerFrame}>
            <View style={styles.frameTopLeft} />
            <View style={styles.frameTopRight} />
            <View style={styles.frameBottomLeft} />
            <View style={styles.frameBottomRight} />
            
            <View style={styles.scannerLine} />
          </View>

          {/* Instructions */}
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsText}>
              Position the QR code within the frame
            </Text>
            <Text style={styles.instructionsSubtext}>
              The code will be scanned automatically
            </Text>
          </View>

          {/* Control Buttons */}
          <View style={styles.controlButtons}>
            <TouchableOpacity style={styles.controlButton} onPress={toggleTorch}>
              <Ionicons
                name={torchOn ? "flashlight" : "flashlight-outline"}
                size={28}
                color={COLORS.white}
              />
              <Text style={styles.controlButtonText}>{torchOn ? 'Flash On' : 'Flash'}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.scanAgainButton, !scanned && styles.hidden]}
              onPress={() => setScanned(false)}
            >
              <Text style={styles.scanAgainText}>Tap to Scan Again</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlButton} onPress={toggleCamera}>
              <Ionicons name="camera-reverse" size={28} color={COLORS.white} />
              <Text style={styles.controlButtonText}>Flip</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Info */}
          <View style={styles.bottomInfo}>
            <Text style={styles.bottomInfoText}>
              Scan credentials, DID documents, or verification requests
            </Text>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginTop: 24,
    marginBottom: 12,
  },
  permissionText: {
    fontSize: 16,
    color: COLORS.textGrey,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  permissionButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 20,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.white,
  },
  placeholder: {
    width: 44,
  },
  scannerFrame: {
    width: 280,
    height: 280,
    alignSelf: 'center',
    marginTop: 40,
    position: 'relative',
  },
  frameTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 50,
    height: 50,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: COLORS.scanner,
  },
  frameTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 50,
    height: 50,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: COLORS.scanner,
  },
  frameBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 50,
    height: 50,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: COLORS.scanner,
  },
  frameBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 50,
    height: 50,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: COLORS.scanner,
  },
  scannerLine: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    height: 2,
    backgroundColor: COLORS.scanner,
    shadowColor: COLORS.scanner,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  instructionsContainer: {
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: 24,
  },
  instructionsText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: 8,
  },
  instructionsSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: 40,
  },
  controlButton: {
    alignItems: 'center',
  },
  controlButtonText: {
    fontSize: 12,
    color: COLORS.white,
    marginTop: 8,
  },
  scanAgainButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  scanAgainText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  hidden: {
    opacity: 0,
  },
  bottomInfo: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  bottomInfoText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
  },
});