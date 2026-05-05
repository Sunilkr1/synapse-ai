import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Theme } from '../../constants/theme';
import { LayoutGrid, Menu } from 'lucide-react-native';

interface LayoutToggleProps {
  layout: 'side' | 'stacked';
  onToggle: (layout: 'side' | 'stacked') => void;
}

export function LayoutToggle({ layout, onToggle }: LayoutToggleProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.btn, layout === 'side' && styles.active]} onPress={() => onToggle('side')}>
        <LayoutGrid size={18} color={layout === 'side' ? Theme.colors.dark.background : Theme.colors.dark.textSecondary} />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.btn, layout === 'stacked' && styles.active]} onPress={() => onToggle('stacked')}>
        <Menu size={18} color={layout === 'stacked' ? Theme.colors.dark.background : Theme.colors.dark.textSecondary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', backgroundColor: Theme.colors.dark.surfaceSecondary, borderRadius: 10, padding: 4, gap: 4 },
  btn: { padding: 8, borderRadius: 6 },
  active: { backgroundColor: Theme.colors.dark.text },
});
