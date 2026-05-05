import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Sun, Moon } from 'lucide-react-native';
import { useSettingsStore } from '../../stores/settingsStore';
import { useTheme } from '../../hooks/useTheme';

export function ThemeToggle() {
  const { theme, updateSettings } = useSettingsStore();
  const { colors } = useTheme();
  const isDark = theme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceSecondary }]}>
      <TouchableOpacity
        style={[
          styles.option, 
          isDark && { backgroundColor: colors.accent }
        ]}
        onPress={() => updateSettings({ theme: 'dark' })}
        activeOpacity={0.8}
      >
        <Moon size={16} color={isDark ? '#FFFFFF' : colors.textSecondary} />
        <Text style={[styles.label, { color: colors.textSecondary }, isDark && { color: '#FFFFFF' }]}>Dark</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.option, 
          !isDark && { backgroundColor: colors.accent }
        ]}
        onPress={() => updateSettings({ theme: 'light' })}
        activeOpacity={0.8}
      >
        <Sun size={16} color={!isDark ? '#FFFFFF' : colors.textSecondary} />
        <Text style={[styles.label, { color: colors.textSecondary }, !isDark && { color: '#FFFFFF' }]}>Light</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexDirection: 'row', 
    borderRadius: 14, 
    padding: 4, 
    width: 180,
  },
  option: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 10, 
    borderRadius: 11, 
    gap: 8,
  },
  label: { 
    fontWeight: '700', 
    fontSize: 13,
  },
});
