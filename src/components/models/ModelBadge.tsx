import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface ModelBadgeProps {
  provider: string;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

const PROVIDER_COLORS: Record<string, string> = {
  gemini: '#4285F4', openai: '#10A37F', anthropic: '#D4A574',
  groq: '#F97316', mistral: '#7C3AED', deepseek: '#06B6D4', grok: '#1DA1F2',
};

export function ModelBadge({ provider, size = 'md', showLabel = false }: ModelBadgeProps) {
  const { colors } = useTheme();
  const color = PROVIDER_COLORS[provider] ?? colors.accent;
  const isSmall = size === 'sm';
  
  return (
    <View style={[styles.badge, { backgroundColor: color + '20', borderColor: color }, isSmall && styles.small]}>
      <Text style={[styles.text, { color }, isSmall && styles.smallText]}>
        {showLabel ? `${provider.toUpperCase()}` : provider.charAt(0).toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  small: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 5 },
  text: { fontSize: 11, fontWeight: 'bold', letterSpacing: 0.5 },
  smallText: { fontSize: 9 },
});
