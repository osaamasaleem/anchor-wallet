import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import COLORS from '../constants/colors';
import { scale } from '../utils/responsive';

interface SectionProps {
  title: string;
  children: React.ReactNode;
  containerStyle?: ViewStyle;
  showBackground?: boolean;
}

export const Section: React.FC<SectionProps> = ({
  title,
  children,
  containerStyle,
  showBackground = true,
}) => {
  return (
    <View style={[
      showBackground && styles.container,
      containerStyle
    ]}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    marginHorizontal: scale(24),
    marginTop: scale(24),
    borderRadius: scale(16),
    padding: scale(20),
  },
  title: {
    fontSize: scale(18),
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: scale(16),
  },
});

