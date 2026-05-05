import React from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Theme } from '../../constants/theme';
import { ModelBadge } from '../models/ModelBadge';

interface ModelPanelProps {
  provider: string;
  response: string | null;
  isLoading: boolean;
}

export function ModelPanel({ provider, response, isLoading }: ModelPanelProps) {
  return (
    <View style={styles.panel}>
      <View style={styles.header}>
        <ModelBadge provider={provider} />
      </View>
      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={styles.loading}>
            <ActivityIndicator color={Theme.colors.dark.accent} />
            <Text style={styles.loadingText}>Generating...</Text>
          </View>
        ) : response ? (
          <Text style={styles.response}>{response}</Text>
        ) : (
          <Text style={styles.placeholder}>Response will appear here...</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { flex: 1, backgroundColor: Theme.colors.dark.surface, borderRadius: 16, borderWidth: 1, borderColor: Theme.colors.dark.border, overflow: 'hidden' },
  header: { padding: 12, borderBottomWidth: 1, borderBottomColor: Theme.colors.dark.border },
  body: { flex: 1, padding: 12 },
  response: { color: Theme.colors.dark.text, fontSize: 14, lineHeight: 20 },
  placeholder: { color: Theme.colors.dark.textSecondary, fontSize: 14, fontStyle: 'italic' },
  loading: { alignItems: 'center', paddingVertical: 20, gap: 10 },
  loadingText: { color: Theme.colors.dark.textSecondary, fontSize: 13 },
});
