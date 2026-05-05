import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Theme } from '../../constants/theme';
import { Search } from 'lucide-react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChangeText, placeholder = 'Search...' }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <Search size={18} color={Theme.colors.dark.textSecondary} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Theme.colors.dark.textSecondary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', backgroundColor: Theme.colors.dark.surface, borderRadius: 12, paddingHorizontal: 12, marginHorizontal: 16, marginVertical: 10, borderWidth: 1, borderColor: Theme.colors.dark.border },
  input: { flex: 1, height: 44, color: Theme.colors.dark.text, marginLeft: 8, fontSize: 15 },
});
