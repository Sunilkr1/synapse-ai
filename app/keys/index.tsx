import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Linking, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApiKeys } from '../../src/hooks/useApiKeys';
import { Key, Eye, EyeOff, Check, ChevronLeft, ExternalLink, ShieldCheck, AlertCircle } from 'lucide-react-native';
import { useRouter, Stack } from 'expo-router';
import { ProviderType } from '../../src/types';
import { useTheme } from '../../src/hooks/useTheme';

const PROVIDERS: { id: ProviderType; name: string; url: string; description: string }[] = [
  { id: 'gemini', name: 'Google Gemini', url: 'https://aistudio.google.com/app/apikey', description: 'Powering Gemini Flash & Pro' },
  { id: 'openai', name: 'OpenAI (GPT)', url: 'https://platform.openai.com/api-keys', description: 'GPT-4o & GPT-4o Mini' },
  { id: 'anthropic', name: 'Anthropic (Claude)', url: 'https://console.anthropic.com/settings/keys', description: 'Claude 3.5 Sonnet' },
  { id: 'groq', name: 'Groq Cloud', url: 'https://console.groq.com/keys', description: 'Llama 3.3 70B (Fast)' },
  { id: 'mistral', name: 'Mistral AI', url: 'https://console.mistral.ai/api-keys', description: 'Mistral & Pixtral models' },
  { id: 'deepseek', name: 'DeepSeek / OpenRouter', url: 'https://openrouter.ai/keys', description: 'DeepSeek Chat & more' },
];

export default function ApiKeysScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { keys, updateKey } = useApiKeys();
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [localKeys, setLocalKeys] = useState<Record<string, string>>({});

  useEffect(() => {
    const initial: Record<string, string> = {};
    Object.entries(keys).forEach(([p, val]) => {
      initial[p] = val || '';
    });
    setLocalKeys(initial);
  }, [keys]);

  const toggleShow = (id: string) => {
    setShowKey(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = async (provider: ProviderType) => {
    const key = localKeys[provider]?.trim() || '';
    await updateKey(provider, key);
    
    if (key === '') {
      Alert.alert('Success', `${provider.toUpperCase()} key removed.`);
    } else {
      Alert.alert('Success', 'Your API key has been securely updated.');
    }
  };

  const openPortal = (url: string) => {
    Linking.openURL(url).catch(() => Alert.alert('Error', 'Could not open browser.'));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={[styles.backBtn, { backgroundColor: colors.surface }]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.7}
          >
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>API Key Manager</Text>
            <Text style={[styles.headerSub, { color: colors.textSecondary }]}>Secure Encrypted Storage</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Privacy Note */}
          <View style={[styles.privacyNotice, { backgroundColor: colors.accent + '08', borderColor: colors.accent + '30' }]}>
            <ShieldCheck size={18} color={colors.accent} />
            <Text style={[styles.privacyText, { color: colors.textSecondary }]}>
              All keys are stored locally on your device. We <Text style={{ fontWeight: 'bold', color: colors.text }}>never</Text> upload your keys to any server.
            </Text>
          </View>

          {PROVIDERS.map((provider) => (
            <View key={provider.id} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={[styles.providerName, { color: colors.text }]}>{provider.name}</Text>
                  <Text style={[styles.providerDesc, { color: colors.textSecondary }]}>{provider.description}</Text>
                </View>
                {keys[provider.id] ? (
                  <View style={[styles.statusBadge, { backgroundColor: '#4ADE8015' }]}>
                    <View style={[styles.dot, { backgroundColor: '#4ADE80' }]} />
                    <Text style={[styles.statusText, { color: '#4ADE80' }]}>Active</Text>
                  </View>
                ) : (
                  <View style={[styles.statusBadge, { backgroundColor: colors.textSecondary + '15' }]}>
                    <View style={[styles.dot, { backgroundColor: colors.textSecondary }]} />
                    <Text style={[styles.statusText, { color: colors.textSecondary }]}>Missing</Text>
                  </View>
                )}
              </View>

              <View style={[styles.inputWrapper, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Paste your API key here..."
                  placeholderTextColor={colors.textSecondary}
                  value={localKeys[provider.id] || ''}
                  onChangeText={(text) => setLocalKeys(prev => ({ ...prev, [provider.id]: text }))}
                  secureTextEntry={!showKey[provider.id]}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity style={styles.eyeBtn} onPress={() => toggleShow(provider.id)}>
                  {showKey[provider.id] ? <EyeOff size={20} color={colors.textSecondary} /> : <Eye size={20} color={colors.textSecondary} />}
                </TouchableOpacity>
              </View>

              <View style={styles.cardActions}>
                <TouchableOpacity 
                  style={[styles.linkBtn, { backgroundColor: colors.accent + '15' }]} 
                  onPress={() => openPortal(provider.url)}
                >
                  <ExternalLink size={14} color={colors.accent} />
                  <Text style={[styles.linkText, { color: colors.accent }]}>Get Key</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[
                    styles.saveBtn, 
                    { backgroundColor: colors.accent },
                    localKeys[provider.id] === keys[provider.id] && { opacity: 0.6 }
                  ]} 
                  onPress={() => handleSave(provider.id)}
                >
                  <Check size={16} color="#fff" />
                  <Text style={styles.saveBtnText}>Update</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {/* Warning Footer */}
          <View style={styles.footerInfo}>
            <AlertCircle size={14} color={colors.textSecondary} />
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Keep your keys private. Never share them with anyone.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingTop: Platform.OS === 'android' ? 12 : 10,
    paddingBottom: 16,
    borderBottomWidth: 1,
    gap: 16,
  },
  backBtn: { 
    width: 40, 
    height: 40, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
      android: { elevation: 2 }
    })
  },
  headerTitle: { fontSize: 22, fontWeight: '900', letterSpacing: -0.5 },
  headerSub: { fontSize: 13, fontWeight: '500', marginTop: -2 },
  headerTextContainer: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  
  privacyNotice: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12, 
    padding: 16, 
    borderRadius: 16, 
    borderWidth: 1, 
    marginBottom: 24,
  },
  privacyText: { flex: 1, fontSize: 13, lineHeight: 18 },
  
  card: { 
    borderRadius: 24, 
    padding: 20, 
    marginBottom: 16, 
    borderWidth: 1,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8 },
      android: { elevation: 3 }
    })
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  providerName: { fontSize: 18, fontWeight: '800' },
  providerDesc: { fontSize: 12, marginTop: 2, fontWeight: '500' },
  
  statusBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6, 
    paddingHorizontal: 10, 
    paddingVertical: 6, 
    borderRadius: 12 
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  
  inputWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderRadius: 16, 
    borderWidth: 1,
    marginBottom: 16,
  },
  input: { flex: 1, height: 52, paddingHorizontal: 16, fontSize: 14, fontWeight: '500' },
  eyeBtn: { padding: 14 },
  
  cardActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  linkBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6, 
    paddingHorizontal: 14, 
    paddingVertical: 10, 
    borderRadius: 12 
  },
  linkText: { fontSize: 13, fontWeight: '700' },
  
  saveBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8, 
    paddingHorizontal: 24, 
    paddingVertical: 12, 
    borderRadius: 14,
    minWidth: 110,
    justifyContent: 'center'
  },
  saveBtnText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  
  footerInfo: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'center', marginTop: 10, opacity: 0.6 },
  footerText: { fontSize: 12, fontWeight: '500' },
});
