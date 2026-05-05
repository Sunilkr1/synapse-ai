import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Theme } from '../../src/constants/theme';
import { Brain, Zap, Globe, Check, ArrowRight } from 'lucide-react-native';
import { supabase } from '../../src/services/supabase/client';
import * as AuthSession from 'expo-auth-session';
import * as Linking from 'expo-linking';
import { useTheme } from '../../src/hooks/useTheme';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const { colors, theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);

  // Dynamic Redirect URI for Expo Go / Production
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'synapse',
    path: 'auth-callback'
  });

  const handleGoogleLogin = async () => {
    if (!isAgreed) {
      Alert.alert('Notice', 'Please agree to the Terms and Privacy Policy first.');
      return;
    }

    try {
      setIsLoading(true);
      console.log('Google Auth Redirecting to:', redirectUri);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUri,
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;

      if (data?.url) {
        await Linking.openURL(data.url);
      }
    } catch (error: any) {
      Alert.alert('Google Auth Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const openLink = (url: string) => {
    Linking.openURL(url).catch(() => Alert.alert('Error', 'Could not open the link.'));
  };

  const activeColors = colors;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: activeColors.background }]}>
      {/* Decorative Background Elements */}
      <View style={[styles.circle, { top: -100, right: -100, backgroundColor: activeColors.accent + '20' }]} />
      <View style={[styles.circle, { bottom: -150, left: -100, width: 300, height: 300, backgroundColor: activeColors.accent + '10' }]} />

      <View style={styles.inner}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={[styles.logoGlow, { backgroundColor: activeColors.accent }]} />
            <Brain size={64} color={activeColors.accent} strokeWidth={1.5} />
            <View style={styles.sparkleContainer}>
              <Zap size={24} color={activeColors.accent} />
            </View>
          </View>
          <Text style={[styles.title, { color: activeColors.text }]}>Synapse AI</Text>
          <Text style={[styles.subtitle, { color: activeColors.textSecondary }]}>Your Secure Multimodal Intelligence Hub</Text>
        </View>

        {/* Action Section */}
        <View style={styles.actionContainer}>
          
          {/* Terms & Conditions Checkbox */}
          <TouchableOpacity 
            style={[styles.termsWrapper, { backgroundColor: theme === 'dark' ? '#ffffff05' : '#00000005', borderColor: activeColors.border }]}
            onPress={() => setIsAgreed(!isAgreed)}
            activeOpacity={0.8}
          >
            <View style={[styles.checkbox, { borderColor: activeColors.border }, isAgreed && { backgroundColor: activeColors.accent, borderColor: activeColors.accent }]}>
              {isAgreed && <Check size={14} color="#fff" strokeWidth={3} />}
            </View>
            <Text style={[styles.termsText, { color: activeColors.textSecondary }]}>
              I agree to the{' '}
              <Text style={[styles.link, { color: activeColors.accent }]} onPress={() => openLink('https://synapseai-legal.netlify.app/')}>
                Terms
              </Text>
              {' '}and{' '}
              <Text style={[styles.link, { color: activeColors.accent }]} onPress={() => openLink('https://synapseai-legal.netlify.app/')}>
                Privacy Policy
              </Text>
            </Text>
          </TouchableOpacity>

          {/* Google Login Button */}
          <TouchableOpacity 
            style={[
              styles.googleButton, 
              { backgroundColor: activeColors.text, shadowColor: activeColors.accent },
              !isAgreed && [styles.googleButtonDisabled, { backgroundColor: activeColors.surface, borderColor: activeColors.border }]
            ]} 
            onPress={handleGoogleLogin}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={activeColors.background} />
            ) : (
              <>
                <View style={styles.googleIconBox}>
                  <Globe size={22} color={isAgreed ? activeColors.background : activeColors.textSecondary} />
                </View>
                <Text style={[styles.googleButtonText, { color: isAgreed ? activeColors.background : activeColors.textSecondary }]}>
                  Continue with Google
                </Text>
                <ArrowRight size={18} color={isAgreed ? activeColors.background : activeColors.textSecondary} style={{ marginLeft: 8 }} />
              </>
            )}
          </TouchableOpacity>

          <Text style={[styles.securityNote, { color: activeColors.textSecondary }]}>
            Secure authentication powered by Supabase
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.version, { color: activeColors.textSecondary }]}>Synapse AI Hub • v1.0.0</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.dark.background },
  inner: { flex: 1, padding: 32, justifyContent: 'space-between', paddingVertical: 60 },
  circle: { position: 'absolute', width: 400, height: 400, borderRadius: 200, zIndex: -1 },
  
  header: { alignItems: 'center' },
  logoContainer: { position: 'relative', marginBottom: 24, alignItems: 'center', justifyContent: 'center' },
  logoGlow: { position: 'absolute', width: 120, height: 120, borderRadius: 60, backgroundColor: Theme.colors.dark.accent, opacity: 0.1 },
  sparkleContainer: { position: 'absolute', top: -12, right: -12 },
  title: { fontSize: 42, fontWeight: '900', color: Theme.colors.dark.text, letterSpacing: -1.5 },
  subtitle: { fontSize: 16, color: Theme.colors.dark.textSecondary, marginTop: 12, textAlign: 'center', maxWidth: 250, lineHeight: 22 },

  actionContainer: { gap: 20, width: '100%' },
  termsWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#ffffff05',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ffffff10'
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Theme.colors.dark.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  checkboxActive: {
    backgroundColor: Theme.colors.dark.accent,
    borderColor: Theme.colors.dark.accent,
  },
  termsText: { flex: 1, fontSize: 13, color: Theme.colors.dark.textSecondary, lineHeight: 18 },
  link: { color: Theme.colors.dark.accent, fontWeight: 'bold' },

  googleButton: {
    backgroundColor: Theme.colors.dark.text,
    borderRadius: 22,
    height: 64,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Theme.colors.dark.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8
  },
  googleButtonDisabled: {
    backgroundColor: Theme.colors.dark.surface,
    borderWidth: 1,
    borderColor: Theme.colors.dark.border,
    shadowOpacity: 0
  },
  googleIconBox: { marginRight: 12 },
  googleButtonText: { fontSize: 18, fontWeight: '800' },

  securityNote: { textAlign: 'center', fontSize: 11, color: Theme.colors.dark.textSecondary, opacity: 0.5, marginTop: 8 },
  footer: { alignItems: 'center' },
  version: { fontSize: 12, color: Theme.colors.dark.textSecondary, opacity: 0.4 }
});
