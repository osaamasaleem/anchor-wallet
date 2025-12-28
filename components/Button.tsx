import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
import { scale } from '../utils/responsive';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: any;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = true,
  style,
}) => {
  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return { backgroundColor: COLORS.primary };
      case 'secondary':
        return { backgroundColor: COLORS.secondary };
      case 'outline':
        return { 
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: COLORS.primary,
        };
      case 'danger':
        return { backgroundColor: COLORS.error };
      default:
        return { backgroundColor: COLORS.primary };
    }
  };

  const getTextStyle = () => {
    if (variant === 'outline') {
      return { color: COLORS.primary };
    }
    return { color: COLORS.white };
  };

  const buttonStyle = getButtonStyle();
  
  // Check if custom style has white background, then use primary text color
  const customBackgroundColor = style?.backgroundColor;
  const isWhiteBackground = customBackgroundColor === COLORS.white || customBackgroundColor === '#FFFFFF';
  const textColor = isWhiteBackground ? COLORS.primary : getTextStyle().color;
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        buttonStyle, // Sets backgroundColor based on variant
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
        style, // Custom style - merge with buttonStyle
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={isWhiteBackground ? COLORS.primary : (variant === 'outline' ? COLORS.primary : COLORS.white)} />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Ionicons name={icon} size={scale(20)} color={textColor} style={styles.iconLeft} />
          )}
          <Text style={[styles.text, { color: textColor }]}>{title}</Text>
          {icon && iconPosition === 'right' && (
            <Ionicons name={icon} size={scale(20)} color={textColor} style={styles.iconRight} />
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: scale(50),
    borderRadius: scale(8),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: scale(16),
    fontWeight: 'bold',
  },
  iconLeft: {
    marginRight: scale(8),
  },
  iconRight: {
    marginLeft: scale(8),
  },
});

