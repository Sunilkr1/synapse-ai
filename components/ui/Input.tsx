import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Theme } from '../../src/constants/theme';

interface InputProps extends TextInputProps {
  icon?: React.ReactNode;
}

export function Input({ icon, style, ...props }: InputProps) {
  return (
    <View style={styles.wrapper}>
      {icon && <View style={styles.icon}>{icon}</View>}
      <TextInput
        style={[styles.input, icon && styles.inputWithIcon, style as any]}
        placeholderTextColor={Theme.colors.dark.textSecondary}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: 'relative', justifyContent: 'center' },
  icon: { position: 'absolute', left: 14, zIndex: 1 },
  input: {
    backgroundColor: Theme.colors.dark.surface,
    color: Theme.colors.dark.text,
    borderRadius: 12,
    height: 52,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Theme.colors.dark.border,
  },
  inputWithIcon: { paddingLeft: 44 },
});
