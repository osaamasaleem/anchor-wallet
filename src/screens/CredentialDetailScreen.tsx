// src/screens/CredentialDetailScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useEffect } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Clipboard,
  Linking,
  Modal,
  ActivityIndicator
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { AppHeader } from '../../components/AppHeader';
import { Button } from '../../components/Button';
import { FloatingCard } from '../../components/FloatingCard';
import { Section } from '../../components/Section';
import { StatusBadge } from '../../components/StatusBadge';
import COLORS from '../../constants/colors';
import { fontSize, scale, spacing } from '../../utils/responsive';
import { RootStackParamList } from '../types/navigation';

import * as SecureStore from 'expo-secure-store';
import { ethers } from 'ethers';
import { API_BASE_URL } from '../config/api';

const CONTRACT_ADDRESS = "0x798f2bB3C65867B33D01Beb92D7E86a5e5F01F17";
const CONTRACT_ABI = [{"inputs":[{"internalType":"string","name":"_cid","type":"string"}],"name":"isRevoked","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}];

type CredentialDetailScreenRouteProp = RouteProp<RootStackParamList, 'CredentialDetail'>;
type CredentialDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CredentialDetail'>;

export default function CredentialDetailScreen() {
  const navigation = useNavigation<CredentialDetailScreenNavigationProp>();
  const route = useRoute<CredentialDetailScreenRouteProp>();
  const { credential } = route.params as { credential: any };
  
  const [txHash, setTxHash] = useState(credential.blockchainProofTx || 'Pending Sync');
  const [isRevoked, setIsRevoked] = useState(credential.isRevoked || false);
  
  const [showPublicQRModal, setShowPublicQRModal] = useState(false);
  const [showVPModal, setShowVPModal] = useState(false);
  
  const [qrPayload, setQrPayload] = useState<string | null>(null);
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);

  const targetCid = credential.rawIpfsCid || credential.id;
  const LOCAL_VERIFIER_URL = `http://192.168.1.12:5500/verifier-portal/dashboard.html?cid=${targetCid}`;

  useEffect(() => {
    fetchLiveBlockchainProof();
    checkRevocationStatus();
  }, []);

  const checkRevocationStatus = async () => {
    try {
      if (!targetCid || targetCid.startsWith('cred-')) return;
      const provider = new ethers.providers.JsonRpcProvider("https://rpc-amoy.polygon.technology");
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      const revoked = await contract.isRevoked(targetCid);
      setIsRevoked(revoked);
    } catch (error) {
      console.log("Could not check revocation status:", error);
    }
  };

  const fetchLiveBlockchainProof = async () => {
    try {
      if (!targetCid || targetCid.startsWith('cred-')) return;
      const response = await fetch(`${API_BASE_URL}/api/credentials/proof/${targetCid}`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.blockchainTx) {
          setTxHash(data.blockchainTx);
        }
      }
    } catch (error) {
      console.log("Background ledger sync omitted:", error);
    }
  };

  const generateVerifiablePresentation = async () => {
    try {
      setShowVPModal(true);
      setIsGeneratingQR(true);

      const storedData = await SecureStore.getItemAsync('user_identity');
      if (!storedData) throw new Error("Local identity keys missing.");

      const { privateKey } = JSON.parse(storedData);
      const wallet = new ethers.Wallet(privateKey);
      const currentDid = `did:ethr:${wallet.address}`;

      const timestamp = Date.now();
      const messageToSign = `Anchor_VP_Request:${targetCid}:${timestamp}`;
      const signature = await wallet.signMessage(messageToSign);

      const presentationToken = {
        type: "VerifiablePresentation",
        cid: targetCid,
        holderDid: currentDid,
        timestamp: timestamp,
        signature: signature
      };

      setQrPayload(JSON.stringify(presentationToken));
    } catch (error) {
      Alert.alert("Generation Failed", "Could not generate cryptographic proof from local keys.");
      setShowVPModal(false);
    } finally {
      setIsGeneratingQR(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Permanent';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <AppHeader 
          title="Credential" 
          showBackButton={true}
          showNotifications={true}
          hasUnreadNotifications={false}
          onBackPress={() => navigation.goBack()}
          onNotificationPress={() => { (navigation as any).navigate('Notifications'); }}
        />
        
        <FloatingCard offset={-60} style={{ borderLeftWidth: scale(6), borderLeftColor: isRevoked ? '#E53E3E' : (credential.color || '#4F46E5') }}>
          <View style={styles.credentialHeader}>
            <View style={[styles.credentialLogo, { backgroundColor: isRevoked ? '#FED7D7' : `${credential.color || '#4F46E5'}20` }]}>
              <Text style={styles.logoText}>{isRevoked ? '❌' : (credential.logo || '🎓')}</Text>
            </View>
            <View style={styles.credentialTitleContainer}>
              <Text style={[styles.credentialTitle, isRevoked && { textDecorationLine: 'line-through', color: '#742A2A' }]}>{credential.title}</Text>
              <Text style={styles.credentialIssuer}>{credential.issuer}</Text>
            </View>
          </View>

          {/* ✅ DYNAMIC STATUS OVERRIDE */}
          {isRevoked ? (
             <View style={{ backgroundColor: '#FFF5F5', padding: 12, borderRadius: 8, marginTop: 16, borderWidth: 1, borderColor: '#FEB2B2', flexDirection: 'row', alignItems: 'center' }}>
               <Ionicons name="warning" size={20} color="#E53E3E" />
               <Text style={{ marginLeft: 8, color: '#C53030', fontWeight: 'bold' }}>Revoked by Issuer</Text>
             </View>
          ) : (
            <View style={styles.typeContainer}>
              <Text style={styles.typeLabel}>Type</Text>
              <Text style={styles.typeValue}>{credential.type || 'Degree'}</Text>
            </View>
          )}
        </FloatingCard>

        <Section title="Details">
          <View style={styles.detailRow}>
            <View style={styles.detailLabelContainer}>
              <Ionicons name="calendar-outline" size={scale(18)} color={COLORS.textGrey} />
              <Text style={styles.detailLabel}>Issue Date</Text>
            </View>
            <Text style={styles.detailValue}>{formatDate(credential.issueDate)}</Text>
          </View>

          {credential.expiryDate && (
            <View style={styles.detailRow}>
              <View style={styles.detailLabelContainer}>
                <Ionicons name="timer-outline" size={scale(18)} color={COLORS.textGrey} />
                <Text style={styles.detailLabel}>Expiry Date</Text>
              </View>
              <Text style={[styles.detailValue, credential.status === 'expiring_soon' && styles.expiringText]}>
                {formatDate(credential.expiryDate)}{credential.status === 'expiring_soon' && ' ⚠️'}
              </Text>
            </View>
          )}

          <View style={styles.detailRow}>
            <View style={styles.detailLabelContainer}>
              <Ionicons name="folder-outline" size={scale(18)} color={COLORS.textGrey} />
              <Text style={styles.detailLabel}>Category</Text>
            </View>
            <View style={[styles.categoryBadge, { backgroundColor: `${credential.color || '#4F46E5'}20` }]}>
              <Text style={[styles.categoryText, { color: credential.color || '#4F46E5' }]}>
                {credential.category ? credential.category.charAt(0).toUpperCase() + credential.category.slice(1) : 'Education'}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailLabelContainer}>
              <Ionicons name="finger-print-outline" size={scale(18)} color={COLORS.textGrey} />
              <Text style={styles.detailLabel}>Credential ID</Text>
            </View>
            <Text style={styles.detailValueSmall}>{credential.id}</Text>
          </View>
        </Section>

        <Section title="Cryptographic Ledger Proofs">
          <View style={styles.technicalCardContainer}>
            <Text style={styles.technicalCardLabel}>IPFS Storage Content ID (CID):</Text>
            <TouchableOpacity style={styles.hashLinkRow} onPress={() => {
              if (targetCid && !targetCid.startsWith('cred-')) {
                Linking.openURL(`https://gateway.pinata.cloud/ipfs/${targetCid}`);
              } else {
                Alert.alert("Local Asset", "This is an offline cached profile metadata element.");
              }
            }}>
              <Text style={styles.technicalText} numberOfLines={1}>{targetCid}</Text>
              <Ionicons name="open-outline" size={scale(14)} color={COLORS.primary} />
            </TouchableOpacity>

            <Text style={[styles.technicalCardLabel, { marginTop: 12 }]}>Polygon Blockchain Transaction Hash:</Text>
            <TouchableOpacity style={styles.hashLinkRow} onPress={() => {
              if (txHash && txHash !== 'Pending Sync' && !txHash.startsWith('Local_')) {
                Linking.openURL(`https://amoy.polygonscan.com/tx/${txHash}`);
              } else {
                Alert.alert("Syncing Proof Ledger", "Connecting to Polygon RPC nodes to confirm cryptographic validation state.");
              }
            }}>
              <Text style={styles.technicalText} numberOfLines={1}>{txHash}</Text>
              <Ionicons name="open-outline" size={scale(14)} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </Section>

        <Section title="Verification Status">
          <View style={styles.verificationInfo}>
            <Ionicons name={isRevoked ? "close-circle" : (credential.verified ? "shield-checkmark" : "shield")} size={scale(24)} color={isRevoked ? '#E53E3E' : (credential.verified ? COLORS.success : COLORS.warning)} />
            <View style={styles.verificationTextContainer}>
              <Text style={[styles.verificationTitle, isRevoked && { color: '#E53E3E' }]}>{isRevoked ? 'Invalid / Revoked' : (credential.verified ? 'Credential Verified' : 'Verification Pending')}</Text>
              <Text style={styles.verificationText}>
                {isRevoked ? 'This credential has been permanently revoked by the issuing institution.' : (credential.verified ? 'This credential has been verified on the blockchain and is authentic.' : 'This credential needs to be verified for authenticity.')}
              </Text>
            </View>
          </View>
        </Section>

        {/* ✅ ACTION LOCK: Hide presentation buttons if revoked */}
        {!isRevoked ? (
          <View style={styles.actionButtons}>
            <Button 
              title="Share Public Link" 
              onPress={() => setShowPublicQRModal(true)} 
              icon="share-outline" 
              iconPosition="left" 
              style={styles.actionButton} 
            />
            <Button 
              title="Show VP QR" 
              onPress={generateVerifiablePresentation} 
              icon="qr-code-outline" 
              iconPosition="left" 
              style={[styles.actionButton, { backgroundColor: COLORS.primary }]} 
            />
          </View>
        ) : (
          <View style={{ marginHorizontal: spacing.lg, marginTop: spacing.lg, padding: 16, backgroundColor: '#FFF5F5', borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#FEB2B2' }}>
             <Ionicons name="lock-closed" size={24} color="#E53E3E" style={{ marginBottom: 8 }} />
             <Text style={{ color: '#C53030', fontWeight: '600', textAlign: 'center' }}>Presentation actions are locked for revoked credentials.</Text>
          </View>
        )}

        <Text style={styles.infoText}>Anchor Wallet securely stores your verifiable credentials on your device.</Text>
      </ScrollView>

      {/* 🟢 PUBLIC SHARE MODAL */}
      <Modal visible={showPublicQRModal} animationType="slide" transparent={true} onRequestClose={() => setShowPublicQRModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.qrModalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Public Verification</Text>
              <TouchableOpacity onPress={() => setShowPublicQRModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.textDark} />
              </TouchableOpacity>
            </View>
            <View style={styles.qrModalContent}>
              <Text style={styles.qrInstructions}>Anyone can scan this static QR code or use the link below to verify this degree exists on the public blockchain.</Text>
              <View style={styles.qrWrapper}>
                <QRCode value={LOCAL_VERIFIER_URL} size={scale(200)} color={COLORS.textDark} backgroundColor={COLORS.white} />
              </View>
              <TouchableOpacity style={styles.copyLinkButton} onPress={() => { Clipboard.setString(LOCAL_VERIFIER_URL); Alert.alert("Local Link Copied!", "Paste this link into your browser to test."); }}>
                <Ionicons name="copy-outline" size={18} color={COLORS.primary} style={{ marginRight: 8 }} />
                <Text style={styles.copyLinkText}>Copy Local Web Link</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 🔴 HIGH-SECURITY VP MODAL */}
      <Modal visible={showVPModal} animationType="slide" transparent={true} onRequestClose={() => setShowVPModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.qrModalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Verifiable Presentation</Text>
              <TouchableOpacity onPress={() => setShowVPModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.textDark} />
              </TouchableOpacity>
            </View>
            <View style={styles.qrModalContent}>
              <Text style={styles.qrInstructions}>Show this code to a verifier. It contains a cryptographic proof uniquely signed by your device to prove ownership.</Text>
              <View style={[styles.qrWrapper, { borderColor: COLORS.primary, borderWidth: 2 }]}>
                {isGeneratingQR || !qrPayload ? (
                  <View style={styles.qrLoadingState}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.qrLoadingText}>Signing Cryptographic Proof...</Text>
                  </View>
                ) : (
                  <QRCode value={qrPayload} size={scale(220)} color={COLORS.textDark} backgroundColor={COLORS.white} />
                )}
              </View>
              <View style={styles.securityNoteContainer}>
                <Ionicons name="shield-checkmark" size={16} color={COLORS.success} />
                <Text style={styles.securityNoteText}>Anti-replay timestamp active & secured</Text>
              </View>
              {qrPayload && !isGeneratingQR && (
                <TouchableOpacity style={[styles.copyLinkButton, { marginTop: 16 }]} onPress={() => { Clipboard.setString(qrPayload); Alert.alert("Payload Copied!", "Paste this JSON into the Verifier Portal."); }}>
                  <Ionicons name="copy-outline" size={18} color={COLORS.primary} style={{ marginRight: 8 }} />
                  <Text style={styles.copyLinkText}>Copy JSON Payload</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  scrollView: { flex: 1 },
  scrollContent: { paddingTop: 0, paddingBottom: spacing['2xl'] * 2.5 },
  credentialHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  credentialLogo: { width: scale(60), height: scale(60), borderRadius: scale(12), justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  logoText: { fontSize: fontSize['2xl'] },
  credentialTitleContainer: { flex: 1 },
  credentialTitle: { fontSize: fontSize.lg, fontWeight: 'bold', color: COLORS.textDark, marginBottom: spacing.xs },
  credentialIssuer: { fontSize: fontSize.base, color: COLORS.textGrey },
  typeContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: COLORS.border },
  typeLabel: { fontSize: fontSize.base, color: COLORS.textGrey },
  typeValue: { fontSize: fontSize.base, fontWeight: '600', color: COLORS.primary },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  detailLabelContainer: { flexDirection: 'row', alignItems: 'center' },
  detailLabel: { fontSize: fontSize.base, color: COLORS.textGrey, marginLeft: spacing.sm },
  detailValue: { fontSize: fontSize.base, fontWeight: '600', color: COLORS.textDark },
  detailValueSmall: { fontSize: fontSize.sm, color: COLORS.textGrey, fontFamily: 'monospace' },
  expiringText: { color: COLORS.warning, fontWeight: 'bold' },
  categoryBadge: { paddingHorizontal: spacing.sm, paddingVertical: scale(6), borderRadius: scale(12) },
  categoryText: { fontSize: fontSize.sm, fontWeight: '600' },
  verificationInfo: { flexDirection: 'row', alignItems: 'flex-start' },
  verificationTextContainer: { flex: 1, marginLeft: spacing.md },
  verificationTitle: { fontSize: fontSize.md, fontWeight: '600', color: COLORS.textDark, marginBottom: spacing.xs },
  verificationText: { fontSize: fontSize.base, color: COLORS.textGrey, lineHeight: scale(20) },
  actionButtons: { flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: spacing.lg, marginTop: spacing.lg },
  actionButton: { flex: 1, marginHorizontal: spacing.xs },
  technicalCardContainer: { backgroundColor: '#F1F5F9', padding: spacing.md, borderRadius: scale(12), borderWidth: 1, borderColor: '#E2E8F0' },
  technicalCardLabel: { fontSize: fontSize.sm, color: COLORS.textDark, fontWeight: '700', marginBottom: 4 },
  hashLinkRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.white, padding: spacing.sm, borderRadius: scale(8), borderWidth: 1, borderColor: '#E2E8F0' },
  technicalText: { fontSize: fontSize.sm, color: COLORS.primary, fontFamily: 'monospace', width: '85%' },
  infoText: { textAlign: 'center', fontSize: fontSize.sm, color: COLORS.textGrey, marginTop: spacing.lg, marginBottom: spacing['2xl'], paddingHorizontal: spacing['2xl'], fontStyle: 'italic' },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
  qrModalContainer: { backgroundColor: COLORS.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.textDark },
  qrModalContent: { padding: 24, alignItems: 'center' },
  qrInstructions: { fontSize: 14, color: COLORS.textGrey, textAlign: 'center', marginBottom: 30, lineHeight: 20 },
  qrWrapper: { padding: 20, backgroundColor: COLORS.white, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5, marginBottom: 24 },
  qrLoadingState: { width: scale(220), height: scale(220), justifyContent: 'center', alignItems: 'center' },
  qrLoadingText: { marginTop: 16, fontSize: 14, color: COLORS.textGrey, fontWeight: '600' },
  copyLinkButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12, marginTop: 10 },
  copyLinkText: { fontSize: 16, color: COLORS.primary, fontWeight: '700' },
  securityNoteContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ECFDF5', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  securityNoteText: { marginLeft: 8, fontSize: 12, color: COLORS.success, fontWeight: '600' }
});