import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Credential } from '../types';
import COLORS from '../constants/colors';
import { scale } from '../utils/responsive';
import { StatusBadge } from './StatusBadge';

interface CredentialCardProps {
  credential: Credential;
  onPress?: () => void;
  variant?: 'compact' | 'detailed';
  showActions?: boolean;
  onShare?: () => void;
}

export const CredentialCard: React.FC<CredentialCardProps> = ({
  credential,
  onPress,
  variant = 'compact',
  showActions = false,
  onShare,
}) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'valid':
        return { backgroundColor: `${COLORS.success}10` };
      case 'expiring_soon':
        return { backgroundColor: `${COLORS.warning}10` };
      default:
        return { backgroundColor: `${COLORS.error}10` };
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.card, variant === 'detailed' && styles.detailedCard]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={[styles.logo, { backgroundColor: `${credential.color}20` }]}>
          <Text style={styles.logoText}>{credential.logo}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={variant === 'compact' ? 1 : 2}>
            {credential.title}
          </Text>
          <Text style={styles.issuer}>{credential.issuer}</Text>
          {variant === 'detailed' && (
            <View style={styles.metaRow}>
              <Text style={styles.type}>{credential.type}</Text>
              <Text style={styles.date}>Issued: {credential.issueDate}</Text>
            </View>
          )}
        </View>
        {variant === 'compact' && credential.verified && (
          <Ionicons name="checkmark-circle" size={scale(24)} color="green" />
        )}
      </View>
      
      {variant === 'detailed' && (
        <View style={styles.footer}>
          <View style={styles.statusContainer}>
            <StatusBadge status={credential.status} verified={credential.verified} />
            {credential.expiryDate && (
              <Text style={styles.expiryText}> • Expires: {credential.expiryDate}</Text>
            )}
          </View>
          {showActions && (
            <View style={styles.actions}>
              <TouchableOpacity 
                style={styles.actionBtn}
                onPress={onShare}
              >
                <Ionicons name="share-outline" size={scale(20)} color={COLORS.primary} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionBtn}
                onPress={onPress}
              >
                <Ionicons name="eye-outline" size={scale(20)} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: scale(12),
    padding: scale(16),
    marginBottom: scale(12),
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  detailedCard: {
    borderRadius: scale(16),
    padding: scale(16),
    marginBottom: scale(16),
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(8),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(12),
  },
  logoText: {
    fontSize: scale(18),
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: scale(16),
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: scale(4),
  },
  issuer: {
    fontSize: scale(14),
    color: COLORS.textGrey,
    marginTop: scale(2),
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: scale(4),
  },
  type: {
    fontSize: scale(12),
    color: COLORS.primary,
    fontWeight: '500',
    backgroundColor: `${COLORS.primary}10`,
    paddingHorizontal: scale(8),
    paddingVertical: scale(2),
    borderRadius: scale(4),
  },
  date: {
    fontSize: scale(12),
    color: COLORS.textGrey,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: scale(16),
    paddingTop: scale(12),
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  expiryText: {
    fontSize: scale(12),
    color: COLORS.textGrey,
  },
  actions: {
    flexDirection: 'row',
  },
  actionBtn: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    backgroundColor: COLORS.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: scale(8),
  },
});

