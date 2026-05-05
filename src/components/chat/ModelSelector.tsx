import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronDown, Zap } from 'lucide-react-native';
import { ProviderType } from '../../services/storage/secureStore';
import { useTheme } from '../../hooks/useTheme';

interface ModelSelectorProps {
  selectedModel: ProviderType;
  onPress: () => void;
}

const PROVIDER_NAMES: Record<ProviderType, string> = {
  openai: 'GPT-4o',
  anthropic: 'Claude 3.5',
  gemini: 'Gemini Pro',
  groq: 'Llama 3 (Groq)',
  mistral: 'Mistral Large',
  deepseek: 'DeepSeek Chat',
  grok: 'Grok-1'
};

export function ModelSelector({ selectedModel, onPress }: ModelSelectorProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]} 
      onPress={onPress} 
      activeOpacity={0.7}
    >
      <Zap size={16} color={colors.accent} style={styles.icon} />
      <Text style={[styles.modelText, { color: colors.text }]}>{PROVIDER_NAMES[selectedModel]}</Text>
      <ChevronDown size={16} color={colors.textSecondary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'center',
  },
  icon: {
    marginRight: 8,
  },
  modelText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 6,
  },
});
