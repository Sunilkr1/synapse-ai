import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface AvatarProps {
  name?: string;
  size?: number;
  color?: string;
}

export function Avatar({ name = '?', size = 40, color: propColor }: AvatarProps) {
  const { colors } = useTheme();
  const color = propColor || colors.accent;
  const initial = name.charAt(0).toUpperCase();

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2, backgroundColor: color + '25', borderColor: color }]}>
      <Text style={[styles.initial, { fontSize: size * 0.4, color }]}>{initial}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  initial: { fontWeight: 'bold' },
});
