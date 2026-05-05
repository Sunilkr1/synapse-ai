import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Theme } from '../../constants/theme';
import { ChatSession } from '../../types';
import { MessageSquare, ChevronRight, Clock } from 'lucide-react-native';
import { formatDate } from '../../utils/dateFormatter';

interface ChatHistoryItemProps {
  session: ChatSession;
  onPress: () => void;
}

export function ChatHistoryItem({ session, onPress }: ChatHistoryItemProps) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconBg}>
        <MessageSquare size={20} color={Theme.colors.dark.accent} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{session.title}</Text>
        <Text style={styles.preview} numberOfLines={1}>{session.preview}</Text>
        <View style={styles.meta}>
          <Clock size={12} color={Theme.colors.dark.textSecondary} />
          <Text style={styles.date}>{formatDate(session.date)}</Text>
          <Text style={styles.model}>{session.model}</Text>
        </View>
      </View>
      <ChevronRight size={18} color={Theme.colors.dark.textSecondary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: { flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: Theme.colors.dark.border, gap: 12 },
  iconBg: { width: 44, height: 44, borderRadius: 12, backgroundColor: Theme.colors.dark.accent + '15', justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1 },
  title: { color: Theme.colors.dark.text, fontSize: 15, fontWeight: '700', marginBottom: 3 },
  preview: { color: Theme.colors.dark.textSecondary, fontSize: 13, marginBottom: 4 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  date: { color: Theme.colors.dark.textSecondary, fontSize: 11 },
  model: { color: Theme.colors.dark.accent, fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase' },
});
