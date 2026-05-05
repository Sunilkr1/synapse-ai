import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '../../constants/theme';
import { Star } from 'lucide-react-native';

interface BestModelBadgeProps {
  model: string | null;
}

export function BestModelBadge({ model }: BestModelBadgeProps) {
  if (!model) return null;
  return (
    <View style={styles.badge}>
      <Star size={14} color="#FBBF24" />
      <Text style={styles.text}>Favourite: {model.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FBBF2420', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#FBBF24', gap: 6, alignSelf: 'flex-start' },
  text: { color: '#FBBF24', fontWeight: 'bold', fontSize: 13 },
});
