import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { Theme } from '../../src/constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  icon?: React.ReactNode;
}

export function Button({ title, onPress, variant = 'primary', loading, disabled, style, icon }: ButtonProps) {
  const bgColor = variant === 'primary' ? Theme.colors.dark.text
    : variant === 'secondary' ? Theme.colors.dark.surface
    : variant === 'danger' ? '#EF4444'
    : 'transparent';

  const textColor = variant === 'primary' ? Theme.colors.dark.background
    : variant === 'danger' ? '#fff'
    : Theme.colors.dark.text;

  return (
    <TouchableOpacity
      style={[styles.btn, { backgroundColor: bgColor }, variant === 'outline' && styles.outline, (disabled || loading) && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <>
          {icon}
          <Text style={[styles.text, { color: textColor }]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 52, borderRadius: 14, paddingHorizontal: 24, gap: 8 },
  outline: { borderWidth: 1.5, borderColor: Theme.colors.dark.border },
  disabled: { opacity: 0.5 },
  text: { fontSize: 16, fontWeight: 'bold' },
});
