import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../../src/constants/theme';
import { BUILT_IN_PROMPTS } from '../../src/constants/prompts';
import { Prompt } from '../../src/types';
import { Copy, Star, Search, ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';

export default function PromptsScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const filtered = BUILT_IN_PROMPTS.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const copyPrompt = async (content: string) => {
    await Clipboard.setStringAsync(content);
  };

  const renderItem = ({ item }: { item: Prompt }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => toggleFavorite(item.id)} style={styles.iconBtn}>
            <Star
              size={18}
              color={favorites.has(item.id) ? '#FBBF24' : Theme.colors.dark.textSecondary}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => copyPrompt(item.content)} style={styles.iconBtn}>
            <Copy size={18} color={Theme.colors.dark.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.preview} numberOfLines={3}>{item.content}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={Theme.colors.dark.text} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Prompt Library</Text>
          <Text style={styles.headerSub}>Ready-to-use AI prompt templates</Text>
        </View>
      </View>

      <View style={styles.searchBar}>
        <Search size={18} color={Theme.colors.dark.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search prompts..."
          placeholderTextColor={Theme.colors.dark.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.dark.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: Theme.colors.dark.border },
  backBtn: { marginRight: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: Theme.colors.dark.text },
  headerSub: { fontSize: 13, color: Theme.colors.dark.textSecondary },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: Theme.colors.dark.surface, margin: 16, borderRadius: 12, paddingHorizontal: 12, borderWidth: 1, borderColor: Theme.colors.dark.border },
  searchInput: { flex: 1, height: 44, color: Theme.colors.dark.text, marginLeft: 8, fontSize: 16 },
  list: { paddingHorizontal: 16, paddingBottom: 32 },
  card: { backgroundColor: Theme.colors.dark.surface, borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: Theme.colors.dark.border },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  categoryBadge: { backgroundColor: Theme.colors.dark.accent + '20', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  categoryText: { color: Theme.colors.dark.accent, fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase' },
  actions: { flexDirection: 'row', gap: 12 },
  iconBtn: { padding: 4 },
  title: { fontSize: 17, fontWeight: 'bold', color: Theme.colors.dark.text, marginBottom: 8 },
  preview: { fontSize: 14, color: Theme.colors.dark.textSecondary, lineHeight: 20 },
});
