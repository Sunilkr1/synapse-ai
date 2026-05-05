import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Theme } from '../../constants/theme';
import { Persona } from '../../types';

interface PersonaCardProps {
  persona: Persona;
  isActive: boolean;
  onSelect: (id: string) => void;
}

export function PersonaCard({ persona, isActive, onSelect }: PersonaCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, isActive && { borderColor: persona.color, borderWidth: 2 }]}
      onPress={() => onSelect(persona.id)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconBg, { backgroundColor: persona.color + '20' }]}>
        <Text style={styles.iconText}>{persona.name.charAt(0)}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{persona.name}</Text>
        <Text style={styles.role}>{persona.role}</Text>
        <Text style={styles.desc} numberOfLines={2}>{persona.description}</Text>
      </View>
      {isActive && <View style={[styles.activeDot, { backgroundColor: persona.color }]} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: Theme.colors.dark.surface, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: Theme.colors.dark.border },
  iconBg: { width: 52, height: 52, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  iconText: { fontSize: 24 },
  content: { flex: 1 },
  name: { fontSize: 17, fontWeight: 'bold', color: Theme.colors.dark.text, marginBottom: 2 },
  role: { fontSize: 12, color: Theme.colors.dark.textSecondary, textTransform: 'uppercase', fontWeight: '700', marginBottom: 4 },
  desc: { fontSize: 13, color: Theme.colors.dark.textSecondary, lineHeight: 18 },
  activeDot: { width: 10, height: 10, borderRadius: 5, marginLeft: 8 },
});
