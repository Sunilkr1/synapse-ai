import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { Database, ChatSession } from '../../src/services/storage/database';
import { ChatMessage } from '../../src/components/chat/ChatMessage';
import { useTheme } from '../../src/hooks/useTheme';

export default function ChatViewScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [session, setSession] = useState<ChatSession | null>(null);
  const { colors } = useTheme();

  useEffect(() => {
    const loadSession = async () => {
      const chats = await Database.getAllChats();
      const found = chats.find(c => c.id === id);
      if (found) {
        setSession(found);
      }
    };
    loadSession();
  }, [id]);

  if (!session) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>{session.title}</Text>
            <Text style={[styles.headerSub, { color: colors.accent }]}>{session.model}</Text>
          </View>
        </View>

        {/* Chat Messages */}
        <FlatList
          data={session.messages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <ChatMessage {...item} />}
          contentContainerStyle={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
    marginRight: 8,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSub: {
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    marginTop: 2,
  },
  messagesContainer: {
    paddingVertical: 16,
    paddingBottom: 24,
  },
});
