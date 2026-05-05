import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Database } from '../../services/storage/database';
import { Trash2 } from 'lucide-react-native';

export function CacheSettings() {
  const { colors } = useTheme();
  const handleClearCache = () => {
    Alert.alert(
      'Clear All History',
      'This will permanently delete all your chat history. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => Database.clearAll() },
      ]
    );
  };

  return (
    <TouchableOpacity style={styles.row} onPress={handleClearCache} activeOpacity={0.7}>
      <Trash2 size={20} color="#EF4444" />
      <View style={styles.text}>
        <Text style={styles.label}>Clear Chat History</Text>
        <Text style={[styles.sub, { color: colors.textSecondary }]}>Permanently delete all local conversations</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 16 },
  text: { flex: 1 },
  label: { color: '#EF4444', fontSize: 16, fontWeight: '600' },
  sub: { fontSize: 13, marginTop: 2 },
});
