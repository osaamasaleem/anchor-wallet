// src/screens/CredentialDetailScreen.tsx
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackParamList } from '../navigation/HomeStack';

// --- COLOR PALETTE ---
const COLORS = {
  primary: '#311F5A',
  secondary: '#4C35AA',
  white: '#FFFFFF',
  grey: '#F1F3F6',
  lightGrey: '#F8F9FA',
  textDark: '#1A202C',
  textGrey: '#718096',
  success: '#22543D',
  successLight: '#C6F6D5',
  warning: '#B45309',
  warningLight: '#FEF3C7',
  error: '#DC2626',
  errorLight: '#FEE2E2',
  shadow: '#000000',
  border: '#E0E0E0',
};

// Define route params type
type CredentialDetailScreenRouteProp = RouteProp<HomeStackParamList, 'CredentialDetail'>;
type CredentialDetailScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'CredentialDetail'>;

export default function CredentialDetailScreen() {
  const navigation = useNavigation<CredentialDetailScreenNavigationProp>();
  const route = useRoute<CredentialDetailScreenRouteProp>();
  const { credential } = route.params;

  // --- HANDLE SHARE ---
  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Check out my credential: ${credential.title}\nIssued by: ${credential.issuer}\nType: ${credential.type}`,
        title: credential.title,
      });
      
      if (result.action === Share.sharedAction) {
        Alert.alert('Shared successfully!');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  // --- FORMAT DATE ---
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* --- HEADER SECTION (Same as other screens) --- */}
        <View style={styles.header}>
          {/* Top Navigation Row */}
          <View style={styles.topNav}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <Text style={styles.appName}>Credential</Text>
            <TouchableOpacity style={styles.notificationBtn}>
              <Ionicons name="notifications-outline" size={24} color={COLORS.white} />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>
        </View>

        {/* --- CREDENTIAL CARD (Floating over header) --- */}
        <View style={[styles.credentialCard, { borderLeftColor: credential.color || '#4F46E5' }]}>
          <View style={styles.credentialHeader}>
            <View style={[styles.credentialLogo, { backgroundColor: `${credential.color}20` }]}>
              <Text style={styles.logoText}>{credential.logo}</Text>
            </View>
            <View style={styles.credentialTitleContainer}>
              <Text style={styles.credentialTitle}>{credential.title}</Text>
              <Text style={styles.credentialIssuer}>{credential.issuer}</Text>
            </View>
            <View style={[
              styles.statusBadge,
              credential.status === 'valid' && styles.statusValid,
              credential.status === 'expiring_soon' && styles.statusWarning,
            ]}>
              <Ionicons
                name={credential.verified ? "checkmark-circle" : "alert-circle"}
                size={16}
                color={credential.verified ? COLORS.success : COLORS.warning}
              />
              <Text style={styles.statusText}>
                {credential.verified ? 'Verified' : 'Pending'}
              </Text>
            </View>
          </View>

          {/* Credential Type */}
          <View style={styles.typeContainer}>
            <Text style={styles.typeLabel}>Type</Text>
            <Text style={styles.typeValue}>{credential.type}</Text>
          </View>
        </View>

        {/* --- DETAILS SECTION --- */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Details</Text>
          
          {/* Issue Date */}
          <View style={styles.detailRow}>
            <View style={styles.detailLabelContainer}>
              <Ionicons name="calendar-outline" size={18} color={COLORS.textGrey} />
              <Text style={styles.detailLabel}>Issue Date</Text>
            </View>
            <Text style={styles.detailValue}>{formatDate(credential.issueDate)}</Text>
          </View>

          {/* Expiry Date */}
          {credential.expiryDate && (
            <View style={styles.detailRow}>
              <View style={styles.detailLabelContainer}>
                <Ionicons name="timer-outline" size={18} color={COLORS.textGrey} />
                <Text style={styles.detailLabel}>Expiry Date</Text>
              </View>
              <Text style={[
                styles.detailValue,
                credential.status === 'expiring_soon' && styles.expiringText
              ]}>
                {formatDate(credential.expiryDate)}
                {credential.status === 'expiring_soon' && ' ⚠️'}
              </Text>
            </View>
          )}

          {/* Category */}
          <View style={styles.detailRow}>
            <View style={styles.detailLabelContainer}>
              <Ionicons name="folder-outline" size={18} color={COLORS.textGrey} />
              <Text style={styles.detailLabel}>Category</Text>
            </View>
            <View style={[styles.categoryBadge, { backgroundColor: `${credential.color}20` }]}>
              <Text style={[styles.categoryText, { color: credential.color }]}>
                {credential.category.charAt(0).toUpperCase() + credential.category.slice(1)}
              </Text>
            </View>
          </View>

          {/* Credential ID */}
          <View style={styles.detailRow}>
            <View style={styles.detailLabelContainer}>
              <Ionicons name="finger-print-outline" size={18} color={COLORS.textGrey} />
              <Text style={styles.detailLabel}>Credential ID</Text>
            </View>
            <Text style={styles.detailValueSmall}>{credential.id}</Text>
          </View>
        </View>

        {/* --- VERIFICATION INFO --- */}
        <View style={styles.verificationSection}>
          <Text style={styles.sectionTitle}>Verification Status</Text>
          <View style={styles.verificationInfo}>
            <Ionicons 
              name={credential.verified ? "shield-checkmark" : "shield"} 
              size={24} 
              color={credential.verified ? COLORS.success : COLORS.warning} 
            />
            <View style={styles.verificationTextContainer}>
              <Text style={styles.verificationTitle}>
                {credential.verified ? 'Credential Verified' : 'Verification Pending'}
              </Text>
              <Text style={styles.verificationText}>
                {credential.verified 
                  ? 'This credential has been verified on the blockchain and is authentic.'
                  : 'This credential needs to be verified for authenticity.'}
              </Text>
            </View>
          </View>
        </View>

        {/* --- ACTION BUTTONS --- */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={22} color={COLORS.white} />
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.qrButton]}
            onPress={() => Alert.alert('QR Code', 'Show QR code for this credential')}
          >
            <Ionicons name="qr-code-outline" size={22} color={COLORS.white} />
            <Text style={styles.actionButtonText}>Show QR</Text>
          </TouchableOpacity>
        </View>

        {/* --- TECHNICAL DETAILS --- */}
        <View style={styles.technicalSection}>
          <Text style={styles.sectionTitle}>Technical Details</Text>
          <View style={styles.technicalInfo}>
            <Text style={styles.technicalText}>Format: Verifiable Credential (VC)</Text>
            <Text style={styles.technicalText}>Proof Type: Ed25519Signature2020</Text>
            <Text style={styles.technicalText}>Issuer DID: did:ethr:{credential.issuer.substring(0, 20)}...</Text>
            <Text style={styles.technicalText}>Holder DID: did:ethr:0x1234...5678</Text>
            <Text style={styles.technicalText}>Created: {formatDate(credential.issueDate)}</Text>
            <Text style={styles.technicalText}>Proof Purpose: assertion</Text>
          </View>
        </View>

        {/* --- APP VERSION / INFO --- */}
        <Text style={styles.infoText}>
          Anchor Wallet securely stores your verifiable credentials on your device.
        </Text>
        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    backgroundColor: COLORS.primary,
    height: 220,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 20 : 60,
    alignItems: 'flex-start',
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  notificationBtn: {
    position: 'relative',
    padding: 4,
  },
  notificationDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'red',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  credentialCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 24,
    marginTop: -60,
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 6,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  credentialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  credentialLogo: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  logoText: {
    fontSize: 28,
  },
  credentialTitleContainer: {
    flex: 1,
  },
  credentialTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  credentialIssuer: {
    fontSize: 14,
    color: COLORS.textGrey,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusValid: {
    backgroundColor: `${COLORS.success}15`,
  },
  statusWarning: {
    backgroundColor: `${COLORS.warning}15`,
  },
  statusText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  typeLabel: {
    fontSize: 14,
    color: COLORS.textGrey,
  },
  typeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  detailsSection: {
    backgroundColor: COLORS.white,
    marginHorizontal: 24,
    marginTop: 24,
    borderRadius: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  detailLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.textGrey,
    marginLeft: 8,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  detailValueSmall: {
    fontSize: 12,
    color: COLORS.textGrey,
    fontFamily: 'monospace',
  },
  expiringText: {
    color: COLORS.warning,
    fontWeight: 'bold',
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  verificationSection: {
    backgroundColor: COLORS.white,
    marginHorizontal: 24,
    marginTop: 24,
    borderRadius: 16,
    padding: 20,
  },
  verificationInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  verificationTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  verificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  verificationText: {
    fontSize: 14,
    color: COLORS.textGrey,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 24,
    marginTop: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  qrButton: {
    backgroundColor: '#10B981',
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  technicalSection: {
    backgroundColor: COLORS.white,
    marginHorizontal: 24,
    marginTop: 24,
    borderRadius: 16,
    padding: 20,
  },
  technicalInfo: {
    backgroundColor: COLORS.lightGrey,
    padding: 16,
    borderRadius: 12,
  },
  technicalText: {
    fontSize: 12,
    color: COLORS.textGrey,
    fontFamily: 'monospace',
    marginBottom: 6,
  },
  infoText: {
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.textGrey,
    marginTop: 24,
    marginBottom: 40,
    paddingHorizontal: 40,
    fontStyle: 'italic',
  },
});