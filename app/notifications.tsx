import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Trash2, Bell } from 'lucide-react-native';
import { useTheme } from '../src/hooks/useTheme';
import { useNotificationStore } from '../src/stores/notificationStore';
import { AppNotification } from '../src/types';

import Markdown from 'react-native-markdown-display';

export default function NotificationsScreen() {
  const { colors, theme } = useTheme();
  const router = useRouter();
  const { notifications, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotificationStore();

  useEffect(() => {
    // Automatically mark all as read when opening the screen
    markAllAsRead();
  }, []);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const linkify = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, (url) => `[${url}](${url})`);
  };

  const renderItem = ({ item }: { item: AppNotification }) => (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.cardHeader}>
        <View style={styles.titleRow}>
          <View style={[styles.iconWrapper, { backgroundColor: colors.accent + '20' }]}>
            <Bell size={14} color={colors.accent} />
          </View>
          <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
        </View>
        <Text style={[styles.cardDate, { color: colors.textSecondary }]}>{formatDate(item.date)}</Text>
      </View>
      <View style={styles.bodyContainer}>
        <Markdown
          onLinkPress={(url) => {
            Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
            return true;
          }}
          style={{
            body: { color: colors.textSecondary, fontSize: 14, lineHeight: 20 },
            link: { color: '#3B82F6', textDecorationLine: 'underline', fontWeight: 'bold' }
          }}
        >
          {linkify(item.body)}
        </Markdown>
      </View>
      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={() => deleteNotification(item.id)}
      >
        <Trash2 size={16} color={colors.error} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Inbox</Text>
        <TouchableOpacity onPress={clearAll} style={styles.clearAll}>
          <Trash2 size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Bell size={48} color={colors.border} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No new notifications</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1 },
  back: { width: 40 },
  title: { fontSize: 18, fontWeight: 'bold' },
  clearAll: { width: 40, alignItems: 'flex-end' },
  listContent: { padding: 16, gap: 12 },
  card: { padding: 16, borderRadius: 12, borderWidth: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  titleRow: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 8, gap: 8 },
  iconWrapper: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '600', flex: 1 },
  cardDate: { fontSize: 12 },
  bodyContainer: { paddingRight: 30, marginBottom: 8 },
  deleteButton: { position: 'absolute', bottom: 16, right: 16, padding: 8 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 100 },
  emptyText: { marginTop: 12, fontSize: 15 },
});
