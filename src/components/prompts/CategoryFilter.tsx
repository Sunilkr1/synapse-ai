import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Theme } from '../../constants/theme';

const CATEGORIES = ['All', 'Learning', 'Development', 'Writing', 'Analysis', 'Productivity'];

interface CategoryFilterProps {
  selected: string;
  onSelect: (cat: string) => void;
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {CATEGORIES.map((cat) => (
        <TouchableOpacity
          key={cat}
          style={[styles.chip, selected === cat && styles.activeChip]}
          onPress={() => onSelect(cat)}
        >
          <Text style={[styles.label, selected === cat && styles.activeLabel]}>{cat}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: Theme.colors.dark.border, backgroundColor: Theme.colors.dark.surface },
  activeChip: { backgroundColor: Theme.colors.dark.text, borderColor: Theme.colors.dark.text },
  label: { color: Theme.colors.dark.textSecondary, fontSize: 13, fontWeight: '600' },
  activeLabel: { color: Theme.colors.dark.background },
});
