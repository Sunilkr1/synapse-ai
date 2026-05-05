import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Theme } from '../../constants/theme';
import { estimateTokens } from '../../utils/tokenCounter';

interface TokenCountProps {
  text: string;
}

export function TokenCount({ text }: TokenCountProps) {
  const tokens = estimateTokens(text);
  return <Text style={styles.text}>~{tokens} tokens</Text>;
}

const styles = StyleSheet.create({
  text: { color: Theme.colors.dark.textSecondary, fontSize: 11 },
});
