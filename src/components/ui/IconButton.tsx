import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface IconButtonProps {
  onPress: () => void;
  icon: React.ReactNode;
  style?: ViewStyle;
  size?: number;
}

export function IconButton({ onPress, icon, style, size = 44 }: IconButtonProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button, 
        { 
          width: size, 
          height: size, 
          borderRadius: size / 2,
          backgroundColor: colors.surface,
          borderColor: colors.border,
        }, 
        style
      ]}
      activeOpacity={0.7}
    >
      {icon}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
});
