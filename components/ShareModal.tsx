import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import COLORS from '../constants/colors';
import { fontSize, scale, spacing } from '../utils/responsive';

interface ShareModalProps {
  visible: boolean;
  onClose: () => void;
  credentialId: string;
  credentialTitle: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  visible,
  onClose,
  credentialId,
  credentialTitle,
}) => {
  // Hardcoded verification code and link
  const verificationCode = '0x2hyota3vjw8hi5yvpz4mi';
  const verificationLink = 'https://anchor-portal.vercel.app/verifier-portal/pages/dashboard.html?txHash=0x2hyota3vjw8hi5yvpz4mi';
  const qrData = JSON.stringify({
    type: 'credential_verification',
    id: credentialId,
    code: verificationCode,
    link: verificationLink,
  });

  const [activeTab, setActiveTab] = useState<'qr' | 'code' | 'link'>('qr');

  const handleCopy = async (text: string, label: string) => {
    await Clipboard.setStringAsync(text);
    Alert.alert('Copied!', `${label} copied to clipboard`);
  };

  const handleShare = async (text: string, label: string) => {
    try {
      const result = await Share.share({
        message: `${credentialTitle}\n\n${label}: ${text}`,
        title: 'Share Credential',
      });
      
      if (result.action === Share.sharedAction) {
        Alert.alert('Shared successfully!');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  // Simple QR Code Pattern (Placeholder - can be replaced with actual QR library)
  const renderQRCode = () => {
    const size = scale(200);
    const cellSize = size / 25;
    
    return (
      <View style={[styles.qrContainer, { width: size, height: size }]}>
        {/* QR Code Pattern - Simplified representation */}
        <View style={styles.qrPattern}>
          {Array.from({ length: 25 }).map((_, row) => (
            <View key={row} style={styles.qrRow}>
              {Array.from({ length: 25 }).map((_, col) => {
                // Create a pattern that looks like a QR code
                const shouldFill = (row + col) % 3 === 0 || 
                                  (row === 0 || row === 24 || col === 0 || col === 24) ||
                                  (row < 7 && col < 7) || 
                                  (row < 7 && col > 17) ||
                                  (row > 17 && col < 7);
                return (
                  <View
                    key={col}
                    style={[
                      styles.qrCell,
                      {
                        width: cellSize,
                        height: cellSize,
                        backgroundColor: shouldFill ? COLORS.textDark : COLORS.white,
                      },
                    ]}
                  />
                );
              })}
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Share Credential</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={scale(24)} color={COLORS.textDark} />
            </TouchableOpacity>
          </View>

          {/* Tab Selector */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'qr' && styles.tabActive]}
              onPress={() => setActiveTab('qr')}
            >
              <Ionicons
                name="qr-code-outline"
                size={scale(20)}
                color={activeTab === 'qr' ? COLORS.primary : COLORS.textGrey}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'qr' && styles.tabTextActive,
                ]}
              >
                QR Code
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === 'code' && styles.tabActive]}
              onPress={() => setActiveTab('code')}
            >
              <Ionicons
                name="key-outline"
                size={scale(20)}
                color={activeTab === 'code' ? COLORS.primary : COLORS.textGrey}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'code' && styles.tabTextActive,
                ]}
              >
                Code
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === 'link' && styles.tabActive]}
              onPress={() => setActiveTab('link')}
            >
              <Ionicons
                name="link-outline"
                size={scale(20)}
                color={activeTab === 'link' ? COLORS.primary : COLORS.textGrey}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'link' && styles.tabTextActive,
                ]}
              >
                Link
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.content} 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* QR Code Tab */}
            {activeTab === 'qr' && (
              <View style={styles.tabContent}>
                <Text style={styles.label}>Scan this QR code to verify</Text>
                <View style={styles.qrWrapper}>
                  {renderQRCode()}
                </View>
                <Text style={styles.hint}>
                  Verifiers can scan this QR code to verify your credential
                </Text>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.copyButton]}
                    onPress={() => handleCopy(verificationLink, 'QR Code data')}
                  >
                    <Ionicons name="copy-outline" size={scale(18)} color={COLORS.white} />
                    <Text style={styles.copyButtonText}>Copy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.shareButton]}
                    onPress={() => handleShare(verificationLink, 'Verification Link')}
                  >
                    <Ionicons name="share-outline" size={scale(18)} color={COLORS.white} />
                    <Text style={styles.shareButtonText}>Share</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Verification Code Tab */}
            {activeTab === 'code' && (
              <View style={styles.tabContent}>
                <Text style={styles.label}>Verification Code</Text>
                <View style={styles.codeContainer}>
                  <Text style={styles.codeText} selectable={true}>
                    0x2hyota3vjw8hi5yvpz4mi
                  </Text>
                </View>
                <Text style={styles.hint}>
                  Share this code with verifiers to verify your credential
                </Text>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.copyButton]}
                    onPress={() => handleCopy(verificationCode, 'Verification code')}
                  >
                    <Ionicons name="copy-outline" size={scale(18)} color={COLORS.white} />
                    <Text style={styles.copyButtonText}>Copy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.shareButton]}
                    onPress={() => handleShare(verificationCode, 'Verification Code')}
                  >
                    <Ionicons name="share-outline" size={scale(18)} color={COLORS.white} />
                    <Text style={styles.shareButtonText}>Share</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Verification Link Tab */}
            {activeTab === 'link' && (
              <View style={styles.tabContent}>
                <Text style={styles.label}>Verification Link</Text>
                <View style={styles.linkContainer}>
                  <Text style={styles.linkText} numberOfLines={3} selectable={true}>
                    https://anchor-portal.vercel.app/verifier-portal/pages/dashboard.html?txHash=0x2hyota3vjw8hi5yvpz4mi
                  </Text>
                </View>
                <Text style={styles.hint}>
                  Share this link with verifiers to verify your credential
                </Text>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.copyButton]}
                    onPress={() => handleCopy(verificationLink, 'Verification link')}
                  >
                    <Ionicons name="copy-outline" size={scale(18)} color={COLORS.white} />
                    <Text style={styles.copyButtonText}>Copy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.shareButton]}
                    onPress={() => handleShare(verificationLink, 'Verification Link')}
                  >
                    <Ionicons name="share-outline" size={scale(18)} color={COLORS.white} />
                    <Text style={styles.shareButtonText}>Share</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Footer Info */}
          <View style={styles.footer}>
            <Ionicons name="shield-checkmark" size={scale(16)} color={COLORS.success} />
            <Text style={styles.footerText}>
              This credential is verified and secure
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: scale(24),
    borderTopRightRadius: scale(24),
    maxHeight: '90%',
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  closeButton: {
    padding: scale(4),
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    marginLeft: scale(6),
    fontSize: fontSize.base,
    color: COLORS.textGrey,
    fontWeight: '500',
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },
  tabContent: {
    padding: spacing.lg,
    alignItems: 'center',
    width: '100%',
  },
  label: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  qrWrapper: {
    backgroundColor: COLORS.white,
    padding: spacing.lg,
    borderRadius: scale(16),
    marginBottom: spacing.lg,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  qrContainer: {
    backgroundColor: COLORS.white,
    borderRadius: scale(8),
    overflow: 'hidden',
  },
  qrPattern: {
    flexDirection: 'column',
  },
  qrRow: {
    flexDirection: 'row',
  },
  qrCell: {
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  codeContainer: {
    backgroundColor: COLORS.white,
    padding: spacing.xl,
    borderRadius: scale(12),
    marginBottom: spacing.md,
    width: '100%',
    minHeight: scale(80),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  codeText: {
    fontSize: fontSize['2xl'],
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    letterSpacing: scale(1),
  },
  linkContainer: {
    backgroundColor: COLORS.white,
    padding: spacing.xl,
    borderRadius: scale(12),
    marginBottom: spacing.md,
    width: '100%',
    minHeight: scale(80),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  linkText: {
    fontSize: fontSize.lg,
    color: COLORS.primary,
    textAlign: 'center',
    fontWeight: '700',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  hint: {
    fontSize: fontSize.sm,
    color: COLORS.textGrey,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: scale(20),
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: scale(8),
  },
  copyButton: {
    backgroundColor: COLORS.primary,
  },
  shareButton: {
    backgroundColor: COLORS.success,
  },
  copyButtonText: {
    color: COLORS.white,
    fontSize: fontSize.base,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  shareButtonText: {
    color: COLORS.white,
    fontSize: fontSize.base,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerText: {
    fontSize: fontSize.sm,
    color: COLORS.textGrey,
    marginLeft: scale(6),
  },
});

