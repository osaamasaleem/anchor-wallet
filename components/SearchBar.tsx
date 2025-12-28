import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
import { scale } from '../utils/responsive';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  onClear,
}) => {
  return (
    <View style={styles.container}>
      <Ionicons name="search-outline" size={scale(20)} color={COLORS.textGrey} style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textGrey}
        value={value}
        onChangeText={onChangeText}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => {
          onChangeText('');
          onClear?.();
        }}>
          <Ionicons name="close-circle" size={scale(20)} color={COLORS.textGrey} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGrey,
    borderRadius: scale(12),
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
  },
  icon: {
    marginRight: scale(12),
  },
  input: {
    flex: 1,
    fontSize: scale(16),
    color: COLORS.textDark,
  },
});

