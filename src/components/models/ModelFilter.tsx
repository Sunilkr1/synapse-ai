import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Theme } from '../../constants/theme';

const PROVIDERS = ['All', 'gemini', 'openai', 'anthropic', 'groq', 'mistral', 'deepseek'];

interface ModelFilterProps {
  selected: string;
  onSelect: (provider: string) => void;
}

export function ModelFilter({ selected, onSelect }: ModelFilterProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {PROVIDERS.map((p) => (
        <TouchableOpacity
          key={p}
          style={[styles.chip, selected === p && styles.active]}
          onPress={() => onSelect(p)}
        >
          <Text style={[styles.label, selected === p && styles.activeLabel]}>{p.charAt(0).toUpperCase() + p.slice(1)}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: Theme.colors.dark.border, backgroundColor: Theme.colors.dark.surface },
  active: { backgroundColor: Theme.colors.dark.text, borderColor: Theme.colors.dark.text },
  label: { color: Theme.colors.dark.textSecondary, fontSize: 13, fontWeight: '600' },
  activeLabel: { color: Theme.colors.dark.background },
});
