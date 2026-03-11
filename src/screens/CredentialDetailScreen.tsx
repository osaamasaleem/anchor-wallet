// src/screens/CredentialDetailScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { AppHeader } from '../../components/AppHeader';
import { Button } from '../../components/Button';
import { FloatingCard } from '../../components/FloatingCard';
import { Section } from '../../components/Section';
import { ShareModal } from '../../components/ShareModal';
import { StatusBadge } from '../../components/StatusBadge';
import COLORS from '../../constants/colors';
import { fontSize, scale, spacing } from '../../utils/responsive';
import { RootStackParamList } from '../types/navigation';

type CredentialDetailScreenRouteProp = RouteProp<RootStackParamList, 'CredentialDetail'>;
type CredentialDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CredentialDetail'>;

export default function CredentialDetailScreen() {
  const navigation = useNavigation<CredentialDetailScreenNavigationProp>();
  const route = useRoute<CredentialDetailScreenRouteProp>();
  const { credential } = route.params;
  const [showShareModal, setShowShareModal] = useState(false);

  // --- HANDLE SHARE ---
  const handleShare = () => {
    setShowShareModal(true);
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
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        <AppHeader 
          title="Credential" 
          showBackButton={true}
          showNotifications={true}
          hasUnreadNotifications={true}
          onBackPress={() => navigation.goBack()}
          onNotificationPress={() => {
            (navigation.getParent() as any)?.navigate('Notifications');
          }}
        />
        
        <FloatingCard 
          offset={-60}
          style={{ borderLeftWidth: scale(6), borderLeftColor: credential.color || '#4F46E5' }}
        >
          <View style={styles.credentialHeader}>
            <View style={[styles.credentialLogo, { backgroundColor: `${credential.color}20` }]}>
              <Text style={styles.logoText}>{credential.logo}</Text>
            </View>
            <View style={styles.credentialTitleContainer}>
              <Text style={styles.credentialTitle}>{credential.title}</Text>
              <Text style={styles.credentialIssuer}>{credential.issuer}</Text>
            </View>
            <StatusBadge status={credential.status} verified={credential.verified} />
          </View>

          <View style={styles.typeContainer}>
            <Text style={styles.typeLabel}>Type</Text>
            <Text style={styles.typeValue}>{credential.type}</Text>
          </View>
        </FloatingCard>

        <Section title="Details">
          
          {/* Issue Date */}
          <View style={styles.detailRow}>
            <View style={styles.detailLabelContainer}>
              <Ionicons name="calendar-outline" size={scale(18)} color={COLORS.textGrey} />
              <Text style={styles.detailLabel}>Issue Date</Text>
            </View>
            <Text style={styles.detailValue}>{formatDate(credential.issueDate)}</Text>
          </View>

          {/* Expiry Date */}
          {credential.expiryDate && (
            <View style={styles.detailRow}>
              <View style={styles.detailLabelContainer}>
                <Ionicons name="timer-outline" size={scale(18)} color={COLORS.textGrey} />
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
              <Ionicons name="folder-outline" size={scale(18)} color={COLORS.textGrey} />
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
              <Ionicons name="finger-print-outline" size={scale(18)} color={COLORS.textGrey} />
              <Text style={styles.detailLabel}>Credential ID</Text>
            </View>
            <Text style={styles.detailValueSmall}>{credential.id}</Text>
          </View>
        </Section>

        <Section title="Verification Status">
          <View style={styles.verificationInfo}>
            <Ionicons 
              name={credential.verified ? "shield-checkmark" : "shield"} 
              size={scale(24)} 
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
        </Section>

        <View style={styles.actionButtons}>
          <Button
            title="Share"
            onPress={handleShare}
            icon="share-outline"
            iconPosition="left"
            style={styles.actionButton}
          />
          <Button
            title="Show QR"
            onPress={() => Alert.alert('QR Code', 'Show QR code for this credential')}
            icon="qr-code-outline"
            iconPosition="left"
            style={[styles.actionButton, { backgroundColor: '#ce1818ff' }]}
          />
        </View>

        

        {/* --- APP VERSION / INFO --- */}
        <Text style={styles.infoText}>
          Anchor Wallet securely stores your verifiable credentials on your device.
        </Text>
        
      </ScrollView>

      {/* Share Modal */}
      <ShareModal
        visible={showShareModal}
        onClose={() => setShowShareModal(false)}
        credentialId={credential.id}
        credentialTitle={credential.title}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 0, // No padding - FloatingCard will overlap header
    paddingBottom: spacing['2xl'] * 2.5,
  },
  credentialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  credentialLogo: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  logoText: {
    fontSize: fontSize['2xl'],
  },
  credentialTitleContainer: {
    flex: 1,
  },
  credentialTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: spacing.xs,
  },
  credentialIssuer: {
    fontSize: fontSize.base,
    color: COLORS.textGrey,
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  typeLabel: {
    fontSize: fontSize.base,
    color: COLORS.textGrey,
  },
  typeValue: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: COLORS.primary,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  detailLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: fontSize.base,
    color: COLORS.textGrey,
    marginLeft: spacing.sm,
  },
  detailValue: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  detailValueSmall: {
    fontSize: fontSize.sm,
    color: COLORS.textGrey,
    fontFamily: 'monospace',
  },
  expiringText: {
    color: COLORS.warning,
    fontWeight: 'bold',
  },
  categoryBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: scale(6),
    borderRadius: scale(12),
  },
  categoryText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  verificationInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  verificationTextContainer: {
    flex: 1,
    marginLeft: spacing.md,
  },
  verificationTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: spacing.xs,
  },
  verificationText: {
    fontSize: fontSize.base,
    color: COLORS.textGrey,
    lineHeight: scale(20),
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  technicalInfo: {
    backgroundColor: COLORS.lightGrey,
    padding: spacing.md,
    borderRadius: scale(12),
  },
  technicalText: {
    fontSize: fontSize.sm,
    color: COLORS.textGrey,
    fontFamily: 'monospace',
    marginBottom: scale(6),
  },
  infoText: {
    textAlign: 'center',
    fontSize: fontSize.sm,
    color: COLORS.textGrey,
    marginTop: spacing.lg,
    marginBottom: spacing['2xl'],
    paddingHorizontal: spacing['2xl'],
    fontStyle: 'italic',
  },
});