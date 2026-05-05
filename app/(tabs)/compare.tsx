import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Zap, ChevronDown, Send, Trash2, Key } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Markdown from 'react-native-markdown-display';
import { useTheme } from '../../src/hooks/useTheme';
import { useApiKeys } from '../../src/hooks/useApiKeys';
import { Database } from '../../src/services/storage/database';

import { GeminiProvider } from '../../src/services/ai/gemini';
import { OpenAIProvider } from '../../src/services/ai/openai';
import { AnthropicProvider } from '../../src/services/ai/anthropic';
import { GroqProvider } from '../../src/services/ai/groq';
import { DeepSeekProvider } from '../../src/services/ai/deepseek';
import { ChatMessage } from '../../src/types';
import { ALL_MODELS } from '../../src/constants/models';
import { AIModel } from '../../src/types';
import { ModelPicker } from '../../src/components/models/ModelPicker';
import { ProGuardModal } from '../../src/components/ui/ProGuardModal';

export default function CompareScreen() {
  const { colors } = useTheme();
  const { keys } = useApiKeys();
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [modelA, setModelA] = useState<AIModel>(ALL_MODELS.find(m => m.id === 'llama-3.3-70b') || ALL_MODELS[0]);
  const [modelB, setModelB] = useState<AIModel>(ALL_MODELS.find(m => m.id === 'deepseek-chat') || ALL_MODELS[1]);
  const [isComparing, setIsComparing] = useState(false);
  const [results, setResults] = useState<{ submittedPrompt?: string; A?: string; B?: string; timeA?: number; timeB?: number } | null>(null);
  const [pickerFor, setPickerFor] = useState<'A' | 'B' | null>(null);
  const [isProModalVisible, setProModalVisible] = useState(false);
  const [lockedModelName, setLockedModelName] = useState('');

  const markdownStyles = StyleSheet.create({
    body: { color: colors.text, fontSize: 15, lineHeight: 24 },
    code_inline: { backgroundColor: colors.surfaceSecondary, color: colors.accent, padding: 4, borderRadius: 4, fontFamily: 'monospace' },
    fence: { backgroundColor: colors.surfaceSecondary, padding: 12, borderRadius: 8, marginTop: 8, marginBottom: 8, borderWidth: 1, borderColor: colors.border },
    p: { marginTop: 0, marginBottom: 8 },
    strong: { color: colors.text, fontWeight: 'bold' },
  });

  const PROVIDERS: Record<string, any> = {
    gemini: GeminiProvider,
    openai: OpenAIProvider,
    anthropic: AnthropicProvider,
    groq: GroqProvider,
    deepseek: DeepSeekProvider,
  };

  const getFallbackKey = (provider: string): string => {
    if (provider === 'gemini') return process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
    if (provider === 'openai') return process.env.EXPO_PUBLIC_OPENAI_API_KEY || '';
    if (provider === 'anthropic') return process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY || '';
    if (provider === 'groq') return process.env.EXPO_PUBLIC_GROQ_API_KEY || '';
    if (provider === 'deepseek') return process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY || '';
    return '';
  };

  const handleProAlert = (modelName: string) => {
    setLockedModelName(modelName);
    setProModalVisible(true);
  };

  const isModelLocked = (model: AIModel) => !model.isFree && (!keys[model.provider] || keys[model.provider] === '');

  const runModel = async (model: AIModel, text: string): Promise<{ response: string; time: number }> => {
    if (isModelLocked(model)) {
      return { response: `⚠️ **PRO Model:** ${model.displayName} requires your own API Key.`, time: 0 };
    }
    const start = Date.now();
    try {
      const service = PROVIDERS[model.provider];
      if (!service) return { response: `⚠️ Provider "${model.provider}" not supported.`, time: 0 };

      const apiKey = (keys[model.provider] || getFallbackKey(model.provider)).trim();
      if (!apiKey) return { response: `⚠️ No API Key for ${model.provider.toUpperCase()}.`, time: 0 };

      const messages: ChatMessage[] = [{ id: '1', role: 'user', content: text, createdAt: Date.now() }];
      const response = await service.generateResponse(messages, apiKey, model.name);
      return { response, time: Date.now() - start };
    } catch (error: any) {
      return { response: `⚠️ Error: ${error.message}`, time: Date.now() - start };
    }
  };

  const handleCompare = async () => {
    if (!prompt.trim()) return;

    // Check if any model is locked
    if (isModelLocked(modelA)) {
      handleProAlert(modelA.displayName);
      return;
    }
    if (isModelLocked(modelB)) {
      handleProAlert(modelB.displayName);
      return;
    }

    const currentPrompt = prompt.trim();
    setPrompt(''); // Clear input box immediately
    setIsComparing(true);
    setResults({ submittedPrompt: currentPrompt, A: undefined, B: undefined });

    const [resA, resB] = await Promise.all([
      runModel(modelA, currentPrompt),
      runModel(modelB, currentPrompt),
    ]);

    setResults({ submittedPrompt: currentPrompt, A: resA.response, B: resB.response, timeA: resA.time, timeB: resB.time });
    setIsComparing(false);

    // Save to history
    Database.saveCompare({
      id: Date.now().toString(),
      prompt: currentPrompt,
      modelA: modelA.id,
      modelB: modelB.id,
      responseA: resA.response,
      responseB: resB.response,
      createdAt: Date.now(),
    });
  };

  const ModelButton = ({ model, label, onPress }: { model: AIModel; label: string; onPress: () => void }) => {
    const locked = isModelLocked(model);
    return (
      <TouchableOpacity
        style={[styles.modelButton, { backgroundColor: colors.surface, borderColor: locked ? '#FF9500' : colors.border }]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={[styles.modelDot, { backgroundColor: label === 'A' ? colors.accent : colors.accentSecondary || '#8B5CF6' }]} />
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={[styles.modelLabel, { color: colors.textSecondary }]}>Model {label}</Text>
            {locked && <Key size={10} color="#FF9500" />}
          </View>
          <Text style={[styles.modelName, { color: colors.text }]} numberOfLines={1}>{model.displayName}</Text>
        </View>
        <ChevronDown size={16} color={colors.textSecondary} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <View style={[styles.headerIcon, { backgroundColor: colors.accent }]}>
            <Zap size={18} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Model Arena</Text>
            <Text style={[styles.headerSub, { color: colors.textSecondary }]}>Compare models head-to-head</Text>
          </View>
          {(results || prompt.trim()) && (
            <TouchableOpacity
              style={[styles.clearBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => { setResults(null); setPrompt(''); }}
            >
              <Trash2 size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

          {/* Model Selectors */}
          <View style={styles.modelsRow}>
            <ModelButton model={modelA} label="A" onPress={() => setPickerFor('A')} />
            <View style={[styles.vsBadge, { backgroundColor: colors.surfaceSecondary }]}>
              <Text style={[styles.vsText, { color: colors.textSecondary }]}>VS</Text>
            </View>
            <ModelButton model={modelB} label="B" onPress={() => setPickerFor('B')} />
          </View>

          {/* Prompt Input */}
          <View style={[styles.inputCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Ask both models the same question..."
              placeholderTextColor={colors.textSecondary}
              multiline
              value={prompt}
              onChangeText={setPrompt}
            />
            <TouchableOpacity
              style={[styles.sendBtn, { backgroundColor: prompt.trim() ? colors.accent : colors.border }]}
              onPress={handleCompare}
              disabled={!prompt.trim() || isComparing}
            >
              {isComparing
                ? <ActivityIndicator size="small" color="#fff" />
                : <Send size={16} color={prompt.trim() ? '#fff' : colors.textSecondary} />
              }
            </TouchableOpacity>
          </View>

          {/* Results */}
          {results && (
            <View style={styles.resultsRow}>
              {/* User Prompt Bubble */}
              {results.submittedPrompt && (
                <View style={[styles.userBubble, { backgroundColor: colors.accent }]}>
                  <Text style={styles.userBubbleText}>{results.submittedPrompt}</Text>
                </View>
              )}

              {/* Model A */}
              <View style={[styles.resultCard, { backgroundColor: colors.surface, borderColor: colors.accent + '60' }]}>
                <View style={[styles.resultHeader, { borderBottomColor: colors.border }]}>
                  <View style={[styles.modelDot, { backgroundColor: colors.accent }]} />
                  <Text style={[styles.resultModelName, { color: colors.accent }]}>{modelA.displayName}</Text>
                  {results.timeA !== undefined && (
                    <Text style={[styles.timer, { color: colors.textSecondary }]}>{(results.timeA / 1000).toFixed(1)}s</Text>
                  )}
                </View>
                {results.A ? (
                  <Markdown style={markdownStyles}>{results.A}</Markdown>
                ) : (
                  <ActivityIndicator color={colors.accent} style={{ marginTop: 20 }} />
                )}
              </View>

              {/* Model B */}
              <View style={[styles.resultCard, { backgroundColor: colors.surface, borderColor: (colors.accentSecondary || '#8B5CF6') + '60' }]}>
                <View style={[styles.resultHeader, { borderBottomColor: colors.border }]}>
                  <View style={[styles.modelDot, { backgroundColor: colors.accentSecondary || '#8B5CF6' }]} />
                  <Text style={[styles.resultModelName, { color: colors.accentSecondary || '#8B5CF6' }]}>{modelB.displayName}</Text>
                  {results.timeB !== undefined && (
                    <Text style={[styles.timer, { color: colors.textSecondary }]}>{(results.timeB / 1000).toFixed(1)}s</Text>
                  )}
                </View>
                {results.B ? (
                  <Markdown style={markdownStyles}>{results.B}</Markdown>
                ) : (
                  <ActivityIndicator color={colors.accentSecondary || '#8B5CF6'} style={{ marginTop: 20 }} />
                )}
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

      {/* Model Pickers */}
      <ModelPicker
        visible={pickerFor === 'A'}
        onClose={() => setPickerFor(null)}
        selectedModelId={modelA.id}
        onSelect={(m) => { 
          setPickerFor(null); 
          if (!m.isFree) {
            setLockedModelName(m.displayName);
            setProModalVisible(true);
            return;
          }
          if (pickerFor === 'A') setModelA(m);
          else setModelB(m);
        }}
      />
      <ModelPicker
        visible={pickerFor === 'B'}
        onClose={() => setPickerFor(null)}
        selectedModelId={modelB.id}
        onSelect={(m) => { 
          setPickerFor(null); 
          if (!m.isFree) {
            setLockedModelName(m.displayName);
            setProModalVisible(true);
            return;
          }
          setModelB(m);
        }}
      />

      <ProGuardModal
        visible={isProModalVisible}
        modelName={lockedModelName}
        onClose={() => setProModalVisible(false)}
        onSetup={() => {
          setProModalVisible(false);
          router.push('/settings');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 60, gap: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  headerSub: { fontSize: 12 },
  clearBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  modelsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  modelDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  modelLabel: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase' },
  modelName: { fontSize: 13, fontWeight: '700' },
  vsBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vsText: { fontSize: 11, fontWeight: '800' },
  inputCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    minHeight: 40,
    maxHeight: 120,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsRow: {
    gap: 12,
  },
  userBubble: {
    padding: 14,
    borderRadius: 20,
    borderBottomRightRadius: 4,
    alignSelf: 'flex-end',
    maxWidth: '85%',
    marginBottom: 8,
  },
  userBubbleText: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 22,
  },
  resultCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 14,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
  },
  resultModelName: { flex: 1, fontSize: 13, fontWeight: '700', textTransform: 'uppercase' },
  timer: { fontSize: 12, fontWeight: '600' },
});
