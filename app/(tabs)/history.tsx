import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock, Search, MessageSquare, ChevronRight, Zap, Trash2, History } from 'lucide-react-native';
import { Database, ChatSession } from '../../src/services/storage/database';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/hooks/useTheme';
import { useChatStore } from '../../src/stores/chatStore';
import { CompareResult } from '../../src/types';
import { CompareHistoryItem } from '../../src/components/history/CompareHistoryItem';

export default function HistoryScreen() {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [history, setHistory] = useState<ChatSession[]>([]);
  const [compares, setCompares] = useState<CompareResult[]>([]);
  const [activeTab, setActiveTab] = useState<'chats' | 'compares'>('chats');
  const isFocused = useIsFocused();
  const router = useRouter();
  const { setMessages, setActiveSession } = useChatStore();

  const handleResumeChat = (session: ChatSession) => {
    setActiveSession(session.id);
    setMessages(session.messages || []);
    router.replace('/');
  };

  const loadHistory = async () => {
    const chatData = await Database.getAllChats();
    const compareData = await Database.getAllCompares();
    setHistory(chatData);
    setCompares(compareData);
  };

  useEffect(() => {
    if (isFocused) {
      loadHistory();
    }
  }, [isFocused]);

  const handleDeleteChat = (id: string) => {
    Alert.alert(
      "Delete Chat",
      "Are you sure you want to delete this conversation?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            await Database.deleteChat(id);
            loadHistory();
          }
        }
      ]
    );
  };

  const handleDeleteCompare = (id: string) => {
    Alert.alert(
      "Delete Comparison",
      "Are you sure you want to delete this comparison history?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            await Database.deleteCompare(id);
            loadHistory();
          }
        }
      ]
    );
  };

  const filteredChats = history.filter(chat => 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCompares = compares.filter(comp => 
    comp.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comp.modelA.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comp.modelB.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const renderChat = ({ item }: { item: ChatSession }) => (
    <TouchableOpacity 
      style={[styles.historyCard, { backgroundColor: colors.surface, borderColor: colors.border }]} 
      activeOpacity={0.7}
      onPress={() => handleResumeChat(item)}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.modelBadge, { backgroundColor: colors.text }]}>
          {item.model === 'Multi-Model' ? (
            <Zap size={12} color={colors.background} />
          ) : (
            <MessageSquare size={12} color={colors.background} />
          )}
          <Text style={[styles.modelText, { color: colors.background }]}>{item.model}</Text>
        </View>
        <View style={styles.timeWrapper}>
          <Clock size={12} color={colors.textSecondary} />
          <Text style={[styles.dateText, { color: colors.textSecondary }]}>{formatDate(item.date)}</Text>
        </View>
      </View>
      
      <Text style={[styles.chatTitle, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
      <Text style={[styles.chatPreview, { color: colors.textSecondary }]} numberOfLines={2}>{item.preview}</Text>
      
      <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteChat(item.id)}>
          <Trash2 size={16} color={colors.error} />
          <Text style={[styles.deleteText, { color: colors.error }]}>Delete</Text>
        </TouchableOpacity>

        <View style={styles.openWrapper}>
          <Text style={[styles.openText, { color: colors.accent }]}>Open Chat</Text>
          <ChevronRight size={16} color={colors.accent} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        {/* Custom Simple Header */}
        <View style={[styles.simpleHeader, { borderBottomColor: colors.border }]}>
          <View style={styles.headerRow}>
            <View style={[styles.headerIcon, { backgroundColor: colors.accent }]}>
              <History size={18} color="#FFFFFF" />
            </View>
            <View>
              <Text style={[styles.headerTitleText, { color: colors.text }]}>History</Text>
              <Text style={[styles.headerSubText, { color: colors.textSecondary }]}>Your past conversations</Text>
            </View>
          </View>
        </View>

        {/* Segmented Control */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'chats' && { backgroundColor: colors.accent }]} 
            onPress={() => setActiveTab('chats')}
          >
            <MessageSquare size={16} color={activeTab === 'chats' ? '#fff' : colors.textSecondary} />
            <Text style={[styles.tabText, { color: activeTab === 'chats' ? '#fff' : colors.textSecondary }]}>Chats</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'compares' && { backgroundColor: colors.accent }]} 
            onPress={() => setActiveTab('compares')}
          >
            <Zap size={16} color={activeTab === 'compares' ? '#fff' : colors.textSecondary} />
            <Text style={[styles.tabText, { color: activeTab === 'compares' ? '#fff' : colors.textSecondary }]}>Compares</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Search size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder={activeTab === 'chats' ? "Search chats..." : "Search comparisons..."}
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {activeTab === 'chats' ? (
          <FlatList
            data={filteredChats}
            keyExtractor={item => item.id}
            renderItem={renderChat}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <MessageSquare size={48} color={colors.border} />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No chats found</Text>
              </View>
            }
          />
        ) : (
          <FlatList
            data={filteredCompares}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <CompareHistoryItem 
                session={item} 
                onPress={() => {
                  Alert.alert("Compare Result", `A: ${item.modelA}\nB: ${item.modelB}\n\nPrompt: ${item.prompt}`);
                }} 
                onDelete={() => handleDeleteCompare(item.id)}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Zap size={48} color={colors.border} />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No comparisons found</Text>
              </View>
            }
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  simpleHeader: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16, borderBottomWidth: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  headerTitleText: { fontSize: 20, fontWeight: '900', letterSpacing: -0.5 },
  headerSubText: { fontSize: 12, marginTop: 1 },
  tabsContainer: { flexDirection: 'row', paddingHorizontal: 16, paddingTop: 16, gap: 12 },
  tabButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: 'transparent' },
  tabText: { fontSize: 14, fontWeight: 'bold' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', margin: 16, paddingHorizontal: 12, height: 46, borderRadius: 12, borderWidth: 1 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, height: 44, fontSize: 16 },
  listContent: { paddingHorizontal: 16, paddingBottom: 24 },
  historyCard: { borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  modelBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  modelText: { fontSize: 10, fontWeight: 'bold', marginLeft: 4, textTransform: 'uppercase' },
  timeWrapper: { flexDirection: 'row', alignItems: 'center' },
  dateText: { fontSize: 12, marginLeft: 4 },
  chatTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  chatPreview: { fontSize: 14, lineHeight: 20, marginBottom: 16 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, paddingTop: 12 },
  deleteButton: { flexDirection: 'row', alignItems: 'center', padding: 4 },
  deleteText: { fontSize: 14, marginLeft: 4 },
  openWrapper: { flexDirection: 'row', alignItems: 'center' },
  openText: { fontSize: 14, fontWeight: 'bold', marginRight: 4 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  emptyText: { marginTop: 16, fontSize: 16 },
});
