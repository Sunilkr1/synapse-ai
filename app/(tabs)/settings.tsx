import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { 
  Key, Shield, Bell, Moon, LogOut, Globe, 
  Info, Palette, MessageSquare, Zap, Star, ChevronRight, User, Settings
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useAuthStore } from '../../src/stores/authStore';
import { supabase } from '../../src/services/supabase/client';
import { SettingsRow } from '../../src/components/settings/SettingsRow';
import { ThemeToggle } from '../../src/components/settings/ThemeToggle';
import { NotificationSettings } from '../../src/components/settings/NotificationSettings';
import { CacheSettings } from '../../src/components/settings/CacheSettings';
import { AccentPicker } from '../../src/components/settings/AccentPicker';
import { useSettingsStore } from '../../src/stores/settingsStore';
import { useApiKeys } from '../../src/hooks/useApiKeys';
import { Database } from '../../src/services/storage/database';
import { ProfileService } from '../../src/services/supabase/profiles';

export default function SettingsScreen() {
  const { colors, theme } = useTheme();
  const router = useRouter();
  const { keys } = useApiKeys();
  const session = useAuthStore(s => s.session);
  const [chatCount, setChatCount] = React.useState(0);

  React.useEffect(() => {
    Database.getAllChats().then(chats => setChatCount(chats.length));
  }, []);

  const userEmail = session?.user?.email || 'Local User';
  const userInitial = userEmail.charAt(0).toUpperCase();
  const userName = userEmail.includes('@') ? userEmail.split('@')[0] : userEmail;

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Kya aap waqai sign out karna chahte hain?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive', 
          onPress: async () => { await supabase.auth.signOut(); } 
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? All your chat history and settings will be permanently removed.',
      [
        { text: 'NO, CANCEL', style: 'cancel' },
        { 
          text: 'YES, DELETE', 
          style: 'destructive', 
          onPress: () => {
            Alert.alert(
              'Final Warning!',
              'This action cannot be undone. Are you absolutely sure?',
              [
                { text: 'CANCEL', style: 'cancel' },
                { 
                  text: 'DELETE EVERYTHING', 
                  style: 'destructive', 
                  onPress: async () => {
                    if (session?.user?.id) {
                      try {
                        await ProfileService.deleteAccount(session.user.id);
                        // Store updates handled by onAuthStateChange in _layout
                      } catch (err) {
                        Alert.alert('Error', 'Account delete nahi ho paaya. Please support se contact karein.');
                      }
                    }
                  } 
                }
              ]
            );
          } 
        },
      ]
    );
  };

  const openLink = (url: string) => {
    Linking.openURL(url).catch(() => Alert.alert('Error', 'Could not open the link.'));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>

        {/* Header */}
        <View style={[styles.pageHeader, { borderBottomColor: colors.border }]}>
          <View style={[styles.headerIconBox, { backgroundColor: colors.accent }]}>
            <Settings size={18} color="#fff" />
          </View>
          <Text style={[styles.pageTitle, { color: colors.text }]}>Settings</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* ─── Profile Hero Card ─── */}
          <View style={[styles.profileHero, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {/* Avatar */}
            <View style={[styles.avatarCircle, { backgroundColor: colors.accent }]}>
              <Text style={styles.avatarText}>{userInitial}</Text>
            </View>

            {/* Info */}
            <Text style={[styles.userName, { color: colors.text }]}>{userName}</Text>
            <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{userEmail}</Text>

            {/* Stats Row */}
            <View style={[styles.statsRow, { borderTopColor: colors.border }]}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.accent }]}>{chatCount}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Chats</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.accent }]}>∞</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Models</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.accent }]}>Free</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Plan</Text>
              </View>
            </View>
          </View>

          {/* ─── AI & Security ─── */}
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>AI & Security</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <SettingsRow 
              icon={<Key size={20} color={colors.accent} />} 
              label="API Key Manager" 
              value={Object.values(keys).filter(k => k && k !== '').length > 0 
                ? `${Object.values(keys).filter(k => k && k !== '').length} Keys Active` 
                : "Setup Keys"}
              onPress={() => router.push('/keys')}
            />
            <SettingsRow 
              icon={<Shield size={20} color={colors.accent} />} 
              label="Privacy Policy" 
              onPress={() => openLink('https://synapseai-legal.netlify.app/')} 
            />
          </View>

          {/* ─── Customization ─── */}
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Customization</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.settingContainer}>
              <View style={styles.iconRow}>
                <Palette size={20} color={colors.accent} />
                <Text style={[styles.settingLabel, { color: colors.text }]}>Accent Color</Text>
              </View>
              <AccentPicker 
                selectedColor={colors.accent} 
                onSelect={(color) => {
                  const { updateSettings } = useSettingsStore.getState();
                  updateSettings({ accentColor: color });
                }} 
              />
            </View>
            <View style={[styles.settingContainer, { borderTopWidth: 1, borderTopColor: colors.border }]}>
              <View style={styles.themeRow}>
                <View style={styles.iconRow}>
                  <Moon size={20} color={colors.accent} />
                  <Text style={[styles.settingLabel, { color: colors.text }]}>App Theme</Text>
                </View>
                <ThemeToggle />
              </View>
            </View>
          </View>

          {/* ─── Preferences ─── */}
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Preferences</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <NotificationSettings />
            <View style={{ height: 1, backgroundColor: colors.border }} />
            <CacheSettings />
          </View>

          {/* ─── More ─── */}
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>More</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <SettingsRow 
              icon={<Star size={20} color={colors.textSecondary} />} 
              label="Rate the App" 
              onPress={() => openLink('https://play.google.com/store/apps/details?id=com.synapse.ai')} 
            />
            <SettingsRow 
              icon={<Globe size={20} color={colors.textSecondary} />} 
              label="Star on GitHub" 
              onPress={() => openLink('https://github.com/Ankus/synapse-ai')} 
            />
            <SettingsRow 
              icon={<Info size={20} color={colors.textSecondary} />} 
              label="Help & Support" 
              onPress={() => router.push('/help')} 
            />
          </View>

          {/* ─── Sign Out & Delete ─── */}
          <View style={styles.accountActions}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={handleSignOut}
              activeOpacity={0.8}
            >
              <LogOut size={18} color={colors.textSecondary} />
              <Text style={[styles.actionBtnText, { color: colors.text }]}>Sign Out</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: '#EF444415', borderColor: '#EF4444' }]}
              onPress={handleDeleteAccount}
              activeOpacity={0.8}
            >
              <User size={18} color="#EF4444" />
              <Text style={[styles.actionBtnText, { color: '#EF4444' }]}>Delete Account</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.version, { color: colors.textSecondary }]}>
            Synapse AI Hub  •  v1.0.0
          </Text>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageTitle: { fontSize: 18, fontWeight: '800' },
  scrollContent: { padding: 16, paddingBottom: 60 },

  /* Profile Hero */
  profileHero: {
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    paddingTop: 28,
    marginBottom: 24,
    overflow: 'hidden',
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: { fontSize: 34, fontWeight: '800', color: '#fff' },
  userName: { fontSize: 20, fontWeight: '800', textTransform: 'capitalize', marginBottom: 4 },
  userEmail: { fontSize: 13, marginBottom: 20 },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    borderTopWidth: 1,
    marginTop: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
  },
  statDivider: { width: 1, marginVertical: 12 },
  statNumber: { fontSize: 20, fontWeight: '900' },
  statLabel: { fontSize: 11, fontWeight: '600', marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.5 },

  /* Sections */
  sectionTitle: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginLeft: 4, marginTop: 8 },
  card: { borderRadius: 16, overflow: 'hidden', borderWidth: 1, marginBottom: 16 },
  settingContainer: { padding: 16 },
  themeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: 44 },
  iconRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  settingLabel: { fontSize: 16, fontWeight: '500' },

  /* Account Actions */
  accountActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 24,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
  },
  actionBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
  version: { textAlign: 'center', fontSize: 12, opacity: 0.4, marginBottom: 8 },
});

