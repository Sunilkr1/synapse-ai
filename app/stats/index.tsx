import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../../src/constants/theme';
import { useStats } from '../../src/hooks/useStats';
import { StatCard } from '../../src/components/stats/StatCard';
import { UsageChart } from '../../src/components/stats/UsageChart';
import { BestModelBadge } from '../../src/components/stats/BestModelBadge';
import { MessageSquare, Zap, Trash2 } from 'lucide-react-native';
import { Database } from '../../src/services/storage/database';

export default function StatsScreen() {
  const { stats, isLoading } = useStats();

  const handleClearAll = () => {
    Alert.alert('Clear All History', 'This will delete all your local chat history permanently.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => Database.clearAll() },
    ]);
  };

  const chartData = [
    { label: 'Gemini', value: 12, color: '#4285F4' },
    { label: 'OpenAI', value: 8, color: '#10A37F' },
    { label: 'Claude', value: 5, color: '#D4A574' },
    { label: 'Groq', value: 3, color: '#F97316' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Stats</Text>
          <Text style={styles.sub}>Usage insights at a glance</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.grid}>
          <StatCard label="Messages" value={isLoading ? '—' : stats.totalMessages} icon={<MessageSquare size={20} color={Theme.colors.dark.accent} />} accent={Theme.colors.dark.accent} />
          <StatCard label="Chats" value={isLoading ? '—' : stats.totalChats} icon={<Zap size={20} color="#4ADE80" />} accent="#4ADE80" />
        </View>
        <View style={styles.grid}>
          <StatCard label="Tokens Used" value={isLoading ? '—' : `~${stats.totalTokensUsed.toLocaleString()}`} icon={<Zap size={20} color="#FBBF24" />} accent="#FBBF24" />
          <StatCard label="Compares" value="—" icon={<Zap size={20} color="#F472B6" />} accent="#F472B6" />
        </View>

        {/* Best Model */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Favourite Model</Text>
          <BestModelBadge model={stats.favoriteModel} />
        </View>

        {/* Usage Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Model Usage</Text>
          <View style={styles.chartCard}>
            <UsageChart data={chartData} />
          </View>
        </View>

        {/* Danger Zone */}
        <TouchableOpacity style={styles.dangerBtn} onPress={handleClearAll}>
          <Trash2 size={18} color="#EF4444" />
          <Text style={styles.dangerText}>Clear All History</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.dark.background },
  content: { padding: 16, paddingBottom: 40 },
  header: { marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: Theme.colors.dark.text },
  sub: { fontSize: 14, color: Theme.colors.dark.textSecondary, marginTop: 4 },
  grid: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  section: { marginTop: 24, marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Theme.colors.dark.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 },
  chartCard: { backgroundColor: Theme.colors.dark.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: Theme.colors.dark.border },
  dangerBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 32, padding: 16, backgroundColor: '#EF444410', borderRadius: 12, borderWidth: 1, borderColor: '#EF4444' },
  dangerText: { color: '#EF4444', fontWeight: 'bold', fontSize: 15 },
});
