import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '../../constants/theme';
import { Zap } from 'lucide-react-native';
import { estimateCost } from '../../utils/costEstimator';

interface CostTrackerProps {
  provider: string;
  inputTokens: number;
  outputTokens: number;
}

export function CostTracker({ provider, inputTokens, outputTokens }: CostTrackerProps) {
  const cost = estimateCost(provider, inputTokens, outputTokens);
  return (
    <View style={styles.container}>
      <Zap size={16} color={Theme.colors.dark.accent} />
      <Text style={styles.label}>Est. Cost: </Text>
      <Text style={styles.cost}>{cost}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', padding: 8 },
  label: { color: Theme.colors.dark.textSecondary, fontSize: 13 },
  cost: { color: Theme.colors.dark.text, fontWeight: 'bold', fontSize: 13 },
});
