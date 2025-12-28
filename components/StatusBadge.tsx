import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
import { scale } from '../utils/responsive';

interface StatusBadgeProps {
  status: 'valid' | 'expiring_soon' | 'expired';
  verified: boolean;
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  verified,
  showIcon = true,
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'valid':
        return {
          bg: `${COLORS.success}10`,
          icon: verified ? 'checkmark-circle' : 'alert-circle',
          color: verified ? COLORS.success : COLORS.warning,
          text: verified ? 'Verified' : 'Pending',
        };
      case 'expiring_soon':
        return {
          bg: `${COLORS.warning}10`,
          icon: 'time-outline',
          color: COLORS.warning,
          text: 'Expiring Soon',
        };
      default:
        return {
          bg: `${COLORS.error}10`,
          icon: 'close-circle',
          color: COLORS.error,
          text: 'Expired',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      {showIcon && (
        <Ionicons name={config.icon as any} size={scale(14)} color={config.color} />
      )}
      <Text style={[styles.text, { color: config.color }]}>
        {config.text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
    borderRadius: scale(4),
    alignSelf: 'flex-start',
  },
  text: {
    marginLeft: scale(4),
    fontSize: scale(12),
    fontWeight: '600',
  },
});

