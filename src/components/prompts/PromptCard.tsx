import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Theme } from '../../constants/theme';
import { Copy, Star } from 'lucide-react-native';
import { Prompt } from '../../types';

interface PromptCardProps {
  prompt: Prompt;
  isFavorite: boolean;
  onCopy: (content: string) => void;
  onToggleFavorite: (id: string) => void;
}

export function PromptCard({ prompt, isFavorite, onCopy, onToggleFavorite }: PromptCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.category}>{prompt.category}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => onToggleFavorite(prompt.id)}>
            <Star size={18} color={isFavorite ? '#FBBF24' : Theme.colors.dark.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onCopy(prompt.content)}>
            <Copy size={18} color={Theme.colors.dark.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.title}>{prompt.title}</Text>
      <Text style={styles.preview} numberOfLines={2}>{prompt.content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: Theme.colors.dark.surface, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: Theme.colors.dark.border },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  badge: { backgroundColor: Theme.colors.dark.accent + '20', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  category: { color: Theme.colors.dark.accent, fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase' },
  actions: { flexDirection: 'row', gap: 12 },
  title: { fontSize: 16, fontWeight: 'bold', color: Theme.colors.dark.text, marginBottom: 6 },
  preview: { fontSize: 13, color: Theme.colors.dark.textSecondary, lineHeight: 18 },
});
