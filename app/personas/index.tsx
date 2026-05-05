import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../../src/constants/theme';
import { Bot, Code, Globe, Edit, Brain, ChevronLeft, Zap, Star } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const PERSONAS = [
  { id: '1', name: 'General AI', role: 'Helpful Assistant', icon: Bot, color: Theme.colors.dark.accent, desc: 'Your standard, all-knowing helpful AI assistant.' },
  { id: '2', name: 'Master Coder', role: 'Senior Developer', icon: Code, color: '#4ADE80', desc: 'Expert in React, Python, and fixing annoying bugs.' },
  { id: '3', name: 'Polyglot', role: 'Translator', icon: Globe, color: '#60A5FA', desc: 'Translates any language with native-level accuracy.' },
  { id: '4', name: 'The Poet', role: 'Creative Writer', icon: Edit, color: '#F472B6', desc: 'Writes beautiful poems, stories, and creative copy.' },
  { id: '5', name: 'Data Scientist', role: 'Analyst', icon: Brain, color: '#FBBF24', desc: 'Analyzes complex data and explains it simply.' },
];

export default function PersonasScreen() {
  const router = useRouter();

  const renderItem = ({ item }: { item: typeof PERSONAS[0] }) => {
    const Icon = item.icon;
    return (
      <TouchableOpacity 
        style={styles.card} 
        activeOpacity={0.7}
        onPress={() => {
          // Future: Set this persona in global state and go to chat
          router.push('/(tabs)');
        }}
      >
        <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
          <Icon size={32} color={item.color} />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.role}>{item.role}</Text>
          <Text style={styles.desc} numberOfLines={2}>{item.desc}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={Theme.colors.dark.text} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>AI Personas</Text>
          <Text style={styles.headerSub}>Choose who you want to talk to</Text>
        </View>
        <Zap size={24} color={Theme.colors.dark.accent} />
      </View>

      <FlatList
        data={PERSONAS}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.dark.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.dark.border,
  },
  backButton: {
    marginRight: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Theme.colors.dark.text,
  },
  headerSub: {
    fontSize: 14,
    color: Theme.colors.dark.textSecondary,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.dark.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Theme.colors.dark.border,
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Theme.colors.dark.text,
    marginBottom: 2,
  },
  role: {
    fontSize: 14,
    color: Theme.colors.dark.textSecondary,
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  desc: {
    fontSize: 13,
    color: Theme.colors.dark.textSecondary,
    lineHeight: 18,
  },
});
