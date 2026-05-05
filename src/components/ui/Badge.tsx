import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Theme } from '../../constants/theme';

interface BadgeProps {
  label: string;
  variant?: 'accent' | 'success' | 'warning' | 'error' | 'outline';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({ 
  label, 
  variant = 'accent',
  style 
}) => {
  const colors = Theme.colors.dark;

  const getVariantStyles = () => {
    switch (variant) {
      case 'accent':
        return { backgroundColor: colors.accent + '20', borderColor: colors.accent };
      case 'success':
        return { backgroundColor: colors.success + '20', borderColor: colors.success };
      case 'warning':
        return { backgroundColor: colors.warning + '20', borderColor: colors.warning };
      case 'error':
        return { backgroundColor: colors.error + '20', borderColor: colors.error };
      case 'outline':
        return { backgroundColor: 'transparent', borderColor: colors.border };
      default:
        return { backgroundColor: colors.accent + '20', borderColor: colors.accent };
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'accent': return colors.accent;
      case 'success': return colors.success;
      case 'warning': return colors.warning;
      case 'error': return colors.error;
      case 'outline': return colors.textSecondary;
      default: return colors.accent;
    }
  };

  return (
    <View style={[styles.container, getVariantStyles(), style]}>
      <Text style={[styles.text, { color: getTextColor() }]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Theme.borderRadius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});
