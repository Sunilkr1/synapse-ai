import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ModelPanel } from '../../src/components/compare/ModelPanel';

interface CompareGridProps {
  modelA: string;
  modelB: string;
  responseA: string | null;
  responseB: string | null;
  isLoadingA: boolean;
  isLoadingB: boolean;
}

export function CompareGrid({ modelA, modelB, responseA, responseB, isLoadingA, isLoadingB }: CompareGridProps) {
  return (
    <View style={styles.grid}>
      <ModelPanel provider={modelA} response={responseA} isLoading={isLoadingA} />
      <ModelPanel provider={modelB} response={responseB} isLoading={isLoadingB} />
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', gap: 8, flex: 1, padding: 8 },
});
