import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/hooks/useAuth';
import { Theme } from '../../src/constants/theme';
import { Button } from '../../src/components/ui/Button';
import { User, Mail, LogOut, ChevronLeft } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  if (!user) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          {React.createElement(ChevronLeft, { size: 24, color: Theme.colors.dark.text } as any)}
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 40 }} /> 
      </View>

      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarPlaceholder}>
            {React.createElement(User, { size: 48, color: Theme.colors.dark.textSecondary } as any)}
          </View>
          <Text style={styles.userName}>
            {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
          </Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            {React.createElement(Mail, { size: 20, color: Theme.colors.dark.accent } as any)}
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Button 
            title="Sign Out" 
            onPress={signOut} 
            variant="danger" 
            icon={React.createElement(LogOut, { size: 20, color: "#fff" } as any)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.dark.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: Theme.colors.dark.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Theme.colors.dark.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Theme.colors.dark.border,
  },
  userName: {
    color: Theme.colors.dark.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  userEmail: {
    color: Theme.colors.dark.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },
  infoSection: {
    backgroundColor: Theme.colors.dark.surface,
    borderRadius: Theme.borderRadius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: Theme.colors.dark.border,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoTextContainer: {
    marginLeft: 16,
  },
  infoLabel: {
    color: Theme.colors.dark.textSecondary,
    fontSize: 12,
  },
  infoValue: {
    color: Theme.colors.dark.text,
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    marginTop: 'auto',
    marginBottom: 20,
  },
});
