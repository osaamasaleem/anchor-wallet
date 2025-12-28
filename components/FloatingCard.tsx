import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import COLORS from '../constants/colors';
import { scale } from '../utils/responsive';

interface FloatingCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  offset?: number;
}

export const FloatingCard: React.FC<FloatingCardProps> = ({
  children,
  style,
  offset = -60,
}) => {
  // Scale the absolute value and preserve the sign for proper overlap
  // Negative values pull the card up to overlap the header
  const marginTop = offset < 0 ? -scale(Math.abs(offset)) : scale(offset);
  
  return (
    <View style={[styles.card, { marginTop }, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    marginHorizontal: scale(24),
    borderRadius: scale(16),
    padding: scale(20),
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
    zIndex: 10, // Ensure card appears above header
  },
});

