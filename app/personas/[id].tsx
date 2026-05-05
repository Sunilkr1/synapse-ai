import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BUILT_IN_PERSONAS } from '../../src/constants/personas';
import { Theme } from '../../src/constants/theme';
import { ChevronLeft, MessageCircle } from 'lucide-react-native';
import { useChatStore } from '../../src/stores/chatStore';

export default function PersonaDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const setActivePersona = useChatStore(s => s.setActivePersona);

  const persona = BUILT_IN_PERSONAS.find(p => p.id === id);

  if (!persona) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ color: '#fff', padding: 20 }}>Persona not found.</Text>
      </SafeAreaView>
    );
  }

  const handleSelect = () => {
    setActivePersona(persona.id);
    router.push('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={Theme.colors.dark.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Persona</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: persona.color + '25' }]}>
          <Text style={styles.iconText}>{persona.name.charAt(0)}</Text>
        </View>

        <Text style={styles.name}>{persona.name}</Text>
        <Text style={[styles.role, { color: persona.color }]}>{persona.role}</Text>
        <Text style={styles.description}>{persona.description}</Text>

        <View style={styles.promptBox}>
          <Text style={styles.promptLabel}>System Prompt</Text>
          <Text style={styles.promptText}>{persona.systemPrompt}</Text>
        </View>

        <TouchableOpacity style={[styles.selectBtn, { backgroundColor: persona.color }]} onPress={handleSelect}>
          <MessageCircle size={20} color="#fff" />
          <Text style={styles.selectText}>Chat with {persona.name}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.dark.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Theme.colors.dark.border },
  backBtn: { width: 40 },
  headerTitle: { color: Theme.colors.dark.text, fontSize: 17, fontWeight: 'bold' },
  content: { padding: 24, alignItems: 'center' },
  iconContainer: { width: 100, height: 100, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  iconText: { fontSize: 48 },
  name: { fontSize: 28, fontWeight: 'bold', color: Theme.colors.dark.text, textAlign: 'center', marginBottom: 6 },
  role: { fontSize: 14, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  description: { color: Theme.colors.dark.textSecondary, fontSize: 16, textAlign: 'center', lineHeight: 24, marginBottom: 28, paddingHorizontal: 16 },
  promptBox: { width: '100%', backgroundColor: Theme.colors.dark.surface, borderRadius: 16, padding: 16, marginBottom: 32, borderWidth: 1, borderColor: Theme.colors.dark.border },
  promptLabel: { color: Theme.colors.dark.textSecondary, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  promptText: { color: Theme.colors.dark.text, fontSize: 14, lineHeight: 22 },
  selectBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 16, paddingHorizontal: 32, borderRadius: 30 },
  selectText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
