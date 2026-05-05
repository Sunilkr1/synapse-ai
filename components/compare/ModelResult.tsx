import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Theme } from '../../src/constants/theme';
import { ModelBadge } from '../../src/components/models/ModelBadge';

interface ModelResultProps {
  provider: string;
  response: string | null;
  isLoading: boolean;
}

export function ModelResult({ provider, response, isLoading }: ModelResultProps) {
  return (
    <View style={styles.container}>
      <ModelBadge provider={provider} />
      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 12 }} color={Theme.colors.dark.accent} />
      ) : (
        <Text style={styles.text}>{response ?? '—'}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.dark.surface, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: Theme.colors.dark.border },
  text: { color: Theme.colors.dark.text, fontSize: 13, lineHeight: 20, marginTop: 10 },
});
