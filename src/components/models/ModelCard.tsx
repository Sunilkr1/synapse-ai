import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Theme } from '../../constants/theme';
import { AIModel } from '../../types';
import { ModelBadge } from './ModelBadge';
import { CheckCircle } from 'lucide-react-native';

interface ModelCardProps {
  model: AIModel;
  isSelected?: boolean;
  onSelect?: (model: AIModel) => void;
}

export function ModelCard({ model, isSelected, onSelect }: ModelCardProps) {
  return (
    <TouchableOpacity style={[styles.card, isSelected && styles.selected]} onPress={() => onSelect?.(model)} activeOpacity={0.7}>
      <View style={styles.top}>
        <ModelBadge provider={model.provider} />
        {isSelected && <CheckCircle size={20} color={Theme.colors.dark.accent} />}
      </View>
      <Text style={styles.name}>{model.displayName}</Text>
      <Text style={styles.desc} numberOfLines={2}>{model.description}</Text>
      <Text style={styles.context}>{(model.contextWindow / 1000).toFixed(0)}K context</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: Theme.colors.dark.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: Theme.colors.dark.border },
  selected: { borderColor: Theme.colors.dark.accent, borderWidth: 2 },
  top: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  name: { fontSize: 17, fontWeight: 'bold', color: Theme.colors.dark.text, marginBottom: 4 },
  desc: { fontSize: 13, color: Theme.colors.dark.textSecondary, lineHeight: 18, marginBottom: 8 },
  context: { fontSize: 11, color: Theme.colors.dark.accent, fontWeight: '700', textTransform: 'uppercase' },
});
