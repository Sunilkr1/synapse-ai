import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useSettingsStore } from '../../stores/settingsStore';
import { useTheme } from '../../hooks/useTheme';
import { setupNotifications } from '../../services/notifications/setup';
import { ProfileService } from '../../services/supabase/profiles';
import { useAuthStore } from '../../stores/authStore';

export function NotificationSettings() {
  const { notificationsEnabled, updateSettings } = useSettingsStore();
  const { colors } = useTheme();
  const { session } = useAuthStore();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async (val: boolean) => {
    setIsUpdating(true);
    try {
      if (val) {
        // Turning ON: Request permission and get token
        const token = await setupNotifications();
        if (token) {
          updateSettings({ notificationsEnabled: true });
          
          // Save token to Supabase if logged in
          if (session?.user?.id) {
            await ProfileService.updateProfile(session.user.id, {
              push_token: token
            });
          }
          Alert.alert('Success', 'Push notifications enabled!');
        } else {
          // If token failed (likely emulator or permission denied)
          Alert.alert('Notice', 'Notifications could not be enabled. Please check app permissions.');
          updateSettings({ notificationsEnabled: false });
        }
      } else {
        // Turning OFF
        updateSettings({ notificationsEnabled: false });
        // Optionally remove token from Supabase
        if (session?.user?.id) {
          await ProfileService.updateProfile(session.user.id, {
            push_token: ''
          });
        }
      }
    } catch (error) {
      console.error('Notification toggle error:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.label, { color: colors.text }]}>Push Notifications</Text>
        <Text style={[styles.sub, { color: colors.textSecondary }]}>Get notified for updates and tips</Text>
      </View>
      {isUpdating ? (
        <ActivityIndicator size="small" color={colors.accent} style={{ marginRight: 10 }} />
      ) : (
        <Switch
          value={notificationsEnabled}
          onValueChange={handleToggle}
          trackColor={{ false: colors.border, true: colors.accent }}
          thumbColor="#fff"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  label: { fontSize: 16, fontWeight: '600' },
  sub: { fontSize: 13, marginTop: 2 },
});
