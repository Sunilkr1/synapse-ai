import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BUILT_IN_PROMPTS } from '../../src/constants/prompts';
import { Theme } from '../../src/constants/theme';
import { ChevronLeft, Copy } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';

export default function PromptDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const prompt = BUILT_IN_PROMPTS.find(p => p.id === id);

  if (!prompt) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ color: '#fff', padding: 20 }}>Prompt not found.</Text>
      </SafeAreaView>
    );
  }

  const handleCopy = async () => {
    await Clipboard.setStringAsync(prompt.content);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={24} color={Theme.colors.dark.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{prompt.title}</Text>
        <TouchableOpacity onPress={handleCopy}>
          <Copy size={22} color={Theme.colors.dark.accent} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.categoryBadge}>
          <Text style={styles.category}>{prompt.category}</Text>
        </View>
        <Text style={styles.title}>{prompt.title}</Text>
        <View style={styles.promptBox}>
          <Text style={styles.promptText}>{prompt.content}</Text>
        </View>
        <Text style={styles.tip}>💡 Tip: Replace [PLACEHOLDER] text with your specific topic before sending.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.dark.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Theme.colors.dark.border },
  headerTitle: { flex: 1, color: Theme.colors.dark.text, fontSize: 17, fontWeight: 'bold', marginHorizontal: 12 },
  content: { padding: 20 },
  categoryBadge: { backgroundColor: Theme.colors.dark.accent + '20', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 12 },
  category: { color: Theme.colors.dark.accent, fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
  title: { fontSize: 22, fontWeight: 'bold', color: Theme.colors.dark.text, marginBottom: 20 },
  promptBox: { backgroundColor: Theme.colors.dark.surface, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: Theme.colors.dark.border, marginBottom: 20 },
  promptText: { color: Theme.colors.dark.text, fontSize: 15, lineHeight: 24 },
  tip: { color: Theme.colors.dark.textSecondary, fontSize: 14, lineHeight: 22, fontStyle: 'italic' },
});
