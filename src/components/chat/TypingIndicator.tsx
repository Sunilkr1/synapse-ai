import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export function TypingIndicator() {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <View style={[styles.bubble, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={[styles.dot, { backgroundColor: colors.accent }]} />
        <View style={[styles.dot, { backgroundColor: colors.accent, opacity: 0.4 }]} />
        <View style={[styles.dot, { backgroundColor: colors.accent, opacity: 0.2 }]} />
      </View>
      <Text style={[styles.label, { color: colors.textSecondary }]}>AI is thinking...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, gap: 10 },
  bubble: { flexDirection: 'row', alignItems: 'center', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 12, gap: 5, borderWidth: 1 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  label: { fontSize: 12 },
});
