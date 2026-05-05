import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '../../constants/theme';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  accent?: string;
}

export function StatCard({ label, value, icon, accent = Theme.colors.dark.accent }: StatCardProps) {
  return (
    <View style={[styles.card, { borderTopColor: accent }]}>
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Theme.colors.dark.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Theme.colors.dark.border,
    borderTopWidth: 3,
    minWidth: 140,
  },
  icon: { marginBottom: 12 },
  value: { fontSize: 28, fontWeight: 'bold', color: Theme.colors.dark.text, marginBottom: 4 },
  label: { fontSize: 13, color: Theme.colors.dark.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
});
