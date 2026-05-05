import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { ChevronRight } from 'lucide-react-native';

interface SettingsRowProps {
  label: string;
  value?: string;
  icon?: React.ReactNode;
  onPress?: () => void;
  showArrow?: boolean;
  rightContent?: React.ReactNode;
}

export function SettingsRow({ label, value, icon, onPress, showArrow = true, rightContent }: SettingsRowProps) {
  const { colors } = useTheme();
  const Wrapper = (onPress ? TouchableOpacity : View) as any;
  
  return (
    <Wrapper 
      onPress={onPress} 
      style={[styles.row, { borderBottomColor: colors.border }]} 
      activeOpacity={onPress ? 0.7 : undefined}
    >
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <View style={styles.right}>
        {rightContent ?? (value && <Text style={[styles.value, { color: colors.textSecondary }]}>{value}</Text>)}
        {showArrow && onPress && <ChevronRight size={18} color={colors.textSecondary} />}
      </View>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1 },
  icon: { marginRight: 12 },
  label: { flex: 1, fontSize: 16 },
  right: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  value: { fontSize: 14 },
});
