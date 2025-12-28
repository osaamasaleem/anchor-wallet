import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
import { scale } from '../utils/responsive';

interface LoadingStateProps {
  type: 'loading' | 'empty' | 'error';
  message?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  type,
  message,
  icon,
}) => {
  const getConfig = () => {
    switch (type) {
      case 'loading':
        return {
          icon: null,
          message: message || 'Loading...',
          showSpinner: true,
        };
      case 'empty':
        return {
          icon: icon || 'document-outline',
          message: message || 'No items found',
          showSpinner: false,
        };
      case 'error':
        return {
          icon: icon || 'alert-circle-outline',
          message: message || 'Something went wrong',
          showSpinner: false,
        };
    }
  };

  const config = getConfig();

  return (
    <View style={styles.container}>
      {config.showSpinner ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : config.icon ? (
        <Ionicons name={config.icon} size={scale(64)} color={COLORS.grey} />
      ) : null}
      <Text style={styles.message}>{config.message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(60),
    paddingHorizontal: scale(40),
  },
  message: {
    fontSize: scale(16),
    color: COLORS.textGrey,
    marginTop: scale(16),
    textAlign: 'center',
  },
});

