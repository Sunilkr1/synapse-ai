import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Theme } from '../../constants/theme';
import { ChevronLeft, Zap } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface CompareHeaderProps {
  title?: string;
}

export function CompareHeader({ title = 'Compare Mode' }: CompareHeaderProps) {
  const router = useRouter();
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <ChevronLeft size={24} color={Theme.colors.dark.text} />
      </TouchableOpacity>
      <View style={styles.titleRow}>
        <Zap size={18} color="#FBBF24" />
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={{ width: 40 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Theme.colors.dark.border },
  back: { width: 40 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 18, fontWeight: 'bold', color: Theme.colors.dark.text },
});
