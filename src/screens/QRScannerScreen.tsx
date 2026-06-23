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
  ActivityIndicator,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import COLORS from '../../constants/colors';
import { scale, fontSize, spacing } from '../../utils/responsive';

// DECENTRALIZED TRUST HANDSHAKE IMPORTS
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ethers } from 'ethers';

type QRScannerScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MainApp'>;

const SCANNER_COLOR = '#00FF00';

export default function QRScannerScreen() {
  const navigation = useNavigation<QRScannerScreenNavigationProp>();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [cameraType, setCameraType] = useState<CameraType>('back');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  /**
   * Core W3C Cryptographic Ingestion Processing Engine
   */
  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    setScanned(true);
    setIsProcessing(true);
    
    try {
      let ipfsTargetHash = '';

      // 1. Upgraded String Parser: Extract IPFS CIDs from raw strings, links, or verification URLs
      if (data.includes('/ipfs/')) {
        ipfsTargetHash = data.split('/ipfs/').pop()?.split('/')[0] || '';
      } 
      // ✅ NEW: Intercept web verification portal links containing the 'cid=' parameter string
      else if (data.includes('cid=')) {
        ipfsTargetHash = data.split('cid=').pop()?.split('&')[0] || '';
      } 
      else if (data.startsWith('Qm') && data.length >= 44) {
        ipfsTargetHash = data.trim();
      }

      // Fallback fallback handler if the scanned item isn't a direct Anchor certificate link
      if (!ipfsTargetHash) {
        setIsProcessing(false);
        Alert.alert(
          'Generic Link Detected',
          `This doesn't appear to be an Anchor degree payload. Would you like to open it in a browser?\n\nContent: ${data}`,
          [
            { text: 'Cancel', onPress: () => setScanned(false), style: 'cancel' },
            { text: 'Open Link', onPress: () => {
                Linking.openURL(data);
                setTimeout(() => setScanned(false), 2000);
            }},
          ]
        );
        return;
      }

      console.log(`🎯 Valid IPFS Hash Extracted from scan: ${ipfsTargetHash}`);

      // 2. Fetch the Decentralized Manifest payload from the public cloud gateway
      const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${ipfsTargetHash}`;
      const response = await fetch(gatewayUrl);
      
      if (!response.ok) throw new Error("Failed to pull document packet from the IPFS gateway network nodes.");
      
      const vcPayload = await response.json();

      // 3. W3C Schema Soundness Check
      if (!vcPayload.credentialSubject || !vcPayload.credentialSubject.id) {
        throw new Error("Target file metadata is unreadable or non-compliant with standard W3C structures.");
      }

      // 4. SSI Ownership Challenge: Look up this physical phone's local active identity
      const storedIdentity = await SecureStore.getItemAsync('user_identity');
      if (!storedIdentity) throw new Error("Local wallet identity keys missing. Please sign up again.");

      const { privateKey } = JSON.parse(storedIdentity);
      const localWallet = new ethers.Wallet(privateKey);
      const localDeviceDID = `did:ethr:${localWallet.address}`;

      const targetStudentDID = vcPayload.credentialSubject.id;

      console.log("🔒 Self-Sovereign Identity Cross-Check:");
      console.log(`Device Local DID:  ${localDeviceDID.toLowerCase()}`);
      console.log(`Credential Target: ${targetStudentDID.toLowerCase()}`);

      // Cryptographic Gate: If your DID doesn't match the degree payload, validation fails
      if (localDeviceDID.toLowerCase() !== targetStudentDID.toLowerCase()) {
        setIsProcessing(false);
        Alert.alert(
          "Identity Mismatch / Access Denied",
          "Security Violation: This digital academic degree was issued to a different wallet identifier profile. Ingestion cancelled.",
          [{ text: "OK", onPress: () => setScanned(false) }]
        );
        return;
      }

      // 5. Normalization Model Mapping: Transform W3C JSON parameters into your Home Dashboard UI structure
      const formattedUIModel = {
        id: vcPayload.id || `cred-${Date.now()}`,
        title: vcPayload.credentialSubject.degree.name,
        issuer: typeof vcPayload.issuer === 'object' ? vcPayload.issuer.name : "Verified Institution",
        issueDate: vcPayload.issuanceDate ? vcPayload.issuanceDate.split('T')[0] : new Date().toISOString().split('T')[0],
        expiryDate: vcPayload.expirationDate ? vcPayload.expirationDate.split('T')[0] : null,
        type: 'Degree',
        status: 'valid' as const,
        verified: true,
        category: 'education' as const,
        logo: '🏛️',
        color: '#4F46E5',
        rawIpfsCid: ipfsTargetHash,
        blockchainProofTx: vcPayload.blockchainTx || 'N/A'
      };

      // 6. Write record array transaction block directly to AsyncStorage cache
      const rawStoredList = await AsyncStorage.getItem('anchor_secured_credentials');
      const activeCredentialsArray = rawStoredList ? JSON.parse(rawStoredList) : [];

      // Check if this credential ID already exists in the local array to prevent duplicate entries
      const checkDuplicate = activeCredentialsArray.some((item: any) => item.id === formattedUIModel.id);
      
      if (!checkDuplicate) {
        activeCredentialsArray.unshift(formattedUIModel); // Place fresh credentials at the top of list
        await AsyncStorage.setItem('anchor_secured_credentials', JSON.stringify(activeCredentialsArray));
        console.log("💾 Certificate committed successfully straight into AsyncStorage cluster local tables.");
      }

      setIsProcessing(false);
      Alert.alert(
        "Credential Secured! 🎓",
        `Successfully imported your "${formattedUIModel.title}" from ${formattedUIModel.issuer}.\n\nIt is now safely anchored to your local digital wallet container inventory ledger.`,
        [{ text: "Awesome", onPress: () => {
            setScanned(false);
            navigation.goBack(); // Snap view trace backwards smoothly to HomeScreen view layer
        }}]
      );

    } catch (error: any) {
      console.error("Scanning pipeline failure exception trace:", error);
      setIsProcessing(false);
      Alert.alert(
        "Ingestion Processing Fault",
        error.message || "An error occurred during cryptographic processing loops verification steps.",
        [{ text: "Retry", onPress: () => setScanned(false) }]
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
        <Text style={{ color: COLORS.white, alignSelf:'center' }}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="videocam-off" size={scale(64)} color={COLORS.textGrey} />
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
      
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing={cameraType}
        onBarcodeScanned={scanned || isProcessing ? undefined : handleBarCodeScanned}
        enableTorch={torchOn}
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'pdf417', 'ean13', 'code128'],
        }}
      />
      
      <View style={styles.overlay}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={scale(28)} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.title}>Scan QR Code</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Scanner Frame */}
        <View style={styles.scannerFrame}>
          {isProcessing ? (
            <View style={styles.processingLoaderSquare}>
              <ActivityIndicator size="large" color={SCANNER_COLOR} />
              <Text style={styles.processingTextLabel}>Verifying Identity...</Text>
            </View>
          ) : (
            <>
              <View style={styles.frameTopLeft} />
              <View style={styles.frameTopRight} />
              <View style={styles.frameBottomLeft} />
              <View style={styles.frameBottomRight} />
              <View style={styles.scannerLine} />
            </>
          )}
        </View>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsText}>
            {isProcessing ? "Processing Cloud Manifest Data..." : "Position the QR code within the frame"}
          </Text>
          <Text style={styles.instructionsSubtext}>
            {isProcessing ? "Connecting to IPFS distributed registry gateway..." : "The code will be scanned automatically"}
          </Text>
        </View>

        {/* Control Buttons */}
        <View style={styles.controlButtons}>
          <TouchableOpacity style={styles.controlButton} onPress={toggleTorch} disabled={isProcessing}>
            <Ionicons
              name={torchOn ? "flashlight" : "flashlight-outline"}
              size={scale(28)}
              color={COLORS.white}
            />
            <Text style={styles.controlButtonText}>{torchOn ? 'Flash On' : 'Flash'}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.scanAgainButton, (!scanned || isProcessing) && styles.hidden]}
            onPress={() => setScanned(false)}
          >
            <Text style={styles.scanAgainText}>Tap to Scan Again</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={toggleCamera} disabled={isProcessing}>
            <Ionicons name="camera-reverse" size={scale(28)} color={COLORS.white} />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.black },
  permissionContainer: {
    flex: 1, backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center', padding: 24,
  },
  permissionTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.textDark, marginTop: 24, marginBottom: 12 },
  permissionText: { fontSize: 16, color: COLORS.textGrey, textAlign: 'center', marginBottom: 32, lineHeight: 22 },
  permissionButton: { backgroundColor: COLORS.primary, paddingHorizontal: 32, paddingVertical: 16, borderRadius: 12 },
  permissionButtonText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
  overlay: { 
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)' 
  },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 60, paddingBottom: 20 },
  closeButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '600', color: COLORS.white },
  placeholder: { width: 44 },
  scannerFrame: { width: 280, height: 280, alignSelf: 'center', marginTop: 40, position: 'relative', justifyContent: 'center', alignItems: 'center' },
  processingLoaderSquare: { backgroundColor: 'rgba(0,0,0,0.8)', padding: 24, borderRadius: 16, alignItems: 'center' },
  processingTextLabel: { color: SCANNER_COLOR, marginTop: 12, fontWeight: '600', fontSize: 14 },
  frameTopLeft: { position: 'absolute', top: 0, left: 0, width: 50, height: 50, borderTopWidth: 4, borderLeftWidth: 4, borderColor: SCANNER_COLOR },
  frameTopRight: { position: 'absolute', top: 0, right: 0, width: 50, height: 50, borderTopWidth: 4, borderRightWidth: 4, borderColor: SCANNER_COLOR },
  frameBottomLeft: { position: 'absolute', bottom: 0, left: 0, width: 50, height: 50, borderBottomWidth: 4, borderLeftWidth: 4, borderColor: SCANNER_COLOR },
  frameBottomRight: { position: 'absolute', bottom: 0, right: 0, width: 50, height: 50, borderBottomWidth: 4, borderRightWidth: 4, borderColor: SCANNER_COLOR },
  scannerLine: { position: 'absolute', top: 10, left: 10, right: 10, height: 2, backgroundColor: SCANNER_COLOR, shadowColor: SCANNER_COLOR, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 10 },
  instructionsContainer: { alignItems: 'center', marginTop: 40, paddingHorizontal: 24 },
  instructionsText: { fontSize: 18, fontWeight: '600', color: COLORS.white, marginBottom: 8, textAlign: 'center' },
  instructionsSubtext: { fontSize: 14, color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center' },
  controlButtons: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 40, marginTop: 40 },
  controlButton: { alignItems: 'center' },
  controlButtonText: { fontSize: 12, color: COLORS.white, marginTop: 8 },
  scanAgainButton: { backgroundColor: COLORS.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 20 },
  scanAgainText: { color: COLORS.white, fontSize: 14, fontWeight: '600' },
  hidden: { opacity: 0 },
  bottomInfo: { position: 'absolute', bottom: 40, left: 0, right: 0, alignItems: 'center', paddingHorizontal: 24 },
  bottomInfoText: { fontSize: 12, color: 'rgba(255, 255, 255, 0.5)', textAlign: 'center' },
});