import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../../src/constants/theme';
import { ALL_MODELS } from '../../src/constants/models';
import { AIModel } from '../../src/types';
import { ModelCard } from '../../src/components/models/ModelCard';
import { ModelFilter } from '../../src/components/models/ModelFilter';
import { useRouter } from 'expo-router';

export default function ModelsScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState('All');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = filter === 'All' ? ALL_MODELS : ALL_MODELS.filter(m => m.provider === filter);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Models</Text>
        <Text style={styles.sub}>{ALL_MODELS.length} models available</Text>
      </View>

      <ModelFilter selected={filter} onSelect={setFilter} />

      <FlatList
        data={filtered}
        keyExtractor={m => m.id}
        renderItem={({ item }) => (
          <ModelCard
            model={item}
            isSelected={selectedId === item.id}
            onSelect={(m) => setSelectedId(m.id)}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.dark.background },
  header: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  title: { fontSize: 28, fontWeight: 'bold', color: Theme.colors.dark.text },
  sub: { fontSize: 14, color: Theme.colors.dark.textSecondary, marginTop: 2 },
  list: { paddingHorizontal: 16, paddingBottom: 32, gap: 12 },
});
