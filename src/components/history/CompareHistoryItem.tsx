import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CompareResult } from '../../types';
import { Zap, Trash2 } from 'lucide-react-native';
import { formatDate } from '../../utils/dateFormatter';
import { useTheme } from '../../hooks/useTheme';

interface CompareHistoryItemProps {
  session: CompareResult;
  onPress: () => void;
  onDelete: () => void;
}

export function CompareHistoryItem({ session, onPress, onDelete }: CompareHistoryItemProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity 
      style={[styles.item, { borderBottomColor: colors.border }]} 
      onPress={onPress} 
      activeOpacity={0.7}
    >
      <View style={styles.iconBg}>
        <Zap size={20} color="#FBBF24" />
      </View>
      <View style={styles.content}>
        <Text style={[styles.vs, { color: colors.text }]}>{session.modelA.toUpperCase()} vs {session.modelB.toUpperCase()}</Text>
        <Text style={[styles.prompt, { color: colors.textSecondary }]} numberOfLines={1}>{session.prompt}</Text>
        {session.winner && (
          <View style={styles.winRow}>
            <Zap size={12} color="#FBBF24" />
            <Text style={styles.winner}>Winner: Model {session.winner}</Text>
          </View>
        )}
        <Text style={[styles.date, { color: colors.textSecondary }]}>{formatDate(session.createdAt)}</Text>
      </View>
      <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
        <Trash2 size={20} color={colors.error} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: { flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: 1, gap: 12 },
  iconBg: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#FBBF2415', justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1 },
  vs: { fontSize: 13, fontWeight: 'bold', marginBottom: 3 },
  prompt: { fontSize: 13, marginBottom: 4 },
  winRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 3 },
  winner: { color: '#FBBF24', fontSize: 11, fontWeight: '700' },
  date: { fontSize: 11 },
  deleteBtn: { padding: 8 },
});
