import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '../../constants/theme';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function EmptyState({ icon, title, subtitle }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  icon: { marginBottom: 16 },
  title: { fontSize: 18, fontWeight: 'bold', color: Theme.colors.dark.text, textAlign: 'center' },
  subtitle: { fontSize: 14, color: Theme.colors.dark.textSecondary, textAlign: 'center', marginTop: 8, lineHeight: 20 },
});
