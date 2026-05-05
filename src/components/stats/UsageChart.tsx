import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '../../constants/theme';

interface UsageChartProps {
  data: { label: string; value: number; color: string }[];
}

export function UsageChart({ data }: UsageChartProps) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <View style={styles.container}>
      {data.map((item) => (
        <View key={item.label} style={styles.row}>
          <Text style={styles.label} numberOfLines={1}>{item.label}</Text>
          <View style={styles.barBg}>
            <View style={[styles.bar, { width: `${(item.value / max) * 100}%`, backgroundColor: item.color }]} />
          </View>
          <Text style={styles.count}>{item.value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  label: { width: 70, color: Theme.colors.dark.textSecondary, fontSize: 12 },
  barBg: { flex: 1, height: 8, backgroundColor: Theme.colors.dark.surfaceSecondary, borderRadius: 4, overflow: 'hidden' },
  bar: { height: 8, borderRadius: 4 },
  count: { width: 30, color: Theme.colors.dark.text, fontSize: 12, textAlign: 'right', fontWeight: 'bold' },
});
