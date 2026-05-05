import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Theme } from '../../constants/theme';

interface VoteButtonProps {
  onVote: (winner: 'A' | 'B' | 'tie') => void;
  winner: 'A' | 'B' | 'tie' | null;
  providerA: string;
  providerB: string;
}

export function VoteButton({ onVote, winner, providerA, providerB }: VoteButtonProps) {
  const options: { label: string; value: 'A' | 'B' | 'tie' }[] = [
    { label: `${providerA.toUpperCase()} Won`, value: 'A' },
    { label: 'Tie', value: 'tie' },
    { label: `${providerB.toUpperCase()} Won`, value: 'B' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Who did better?</Text>
      <View style={styles.row}>
        {options.map(opt => (
          <TouchableOpacity
            key={opt.value}
            style={[styles.btn, winner === opt.value && styles.selected]}
            onPress={() => onVote(opt.value)}
          >
            <Text style={[styles.label, winner === opt.value && styles.selectedLabel]}>{opt.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  heading: { color: Theme.colors.dark.textSecondary, fontSize: 13, fontWeight: '700', textTransform: 'uppercase', textAlign: 'center', marginBottom: 12 },
  row: { flexDirection: 'row', gap: 8 },
  btn: { flex: 1, padding: 10, borderRadius: 10, borderWidth: 1, borderColor: Theme.colors.dark.border, alignItems: 'center' },
  selected: { backgroundColor: Theme.colors.dark.accent, borderColor: Theme.colors.dark.accent },
  label: { color: Theme.colors.dark.textSecondary, fontWeight: '600', fontSize: 12 },
  selectedLabel: { color: Theme.colors.dark.background },
});
