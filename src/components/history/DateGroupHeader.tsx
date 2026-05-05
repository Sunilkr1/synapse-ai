import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '../../constants/theme';

interface DateGroupHeaderProps {
  label: string;
}

export function DateGroupHeader({ label }: DateGroupHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.label}>{label}</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10 },
  line: { flex: 1, height: 1, backgroundColor: Theme.colors.dark.border },
  label: { color: Theme.colors.dark.textSecondary, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', marginHorizontal: 12, letterSpacing: 1 },
});
