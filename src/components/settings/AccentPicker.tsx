import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Theme } from '../../constants/theme';

const ACCENT_COLORS = [
  { name: 'Purple', color: '#8B5CF6' },
  { name: 'Blue', color: '#3B82F6' },
  { name: 'Green', color: '#22C55E' },
  { name: 'Pink', color: '#EC4899' },
  { name: 'Orange', color: '#F97316' },
  { name: 'Teal', color: '#14B8A6' },
];

interface AccentPickerProps {
  selectedColor: string;
  onSelect: (color: string) => void;
}

export function AccentPicker({ selectedColor, onSelect }: AccentPickerProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {ACCENT_COLORS.map((c) => (
        <TouchableOpacity
          key={c.color}
          onPress={() => onSelect(c.color)}
          style={[styles.swatch, { backgroundColor: c.color, borderWidth: selectedColor === c.color ? 3 : 0, borderColor: '#fff' }]}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12, padding: 8 },
  swatch: { width: 36, height: 36, borderRadius: 18 },
});
