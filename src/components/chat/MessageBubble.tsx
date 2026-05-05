import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { MarkdownRenderer } from './MarkdownRenderer';

interface MessageBubbleProps {
  content: string;
  role: 'user' | 'assistant';
  model?: string;
}

export function MessageBubble({ content, role, model }: MessageBubbleProps) {
  const { colors } = useTheme();
  const isUser = role === 'user';

  return (
    <View style={[
      styles.container, 
      isUser ? [styles.userContainer, { backgroundColor: colors.accent }] : [styles.aiContainer, { backgroundColor: colors.surface, borderColor: colors.border }]
    ]}>
      {!isUser && model && (
        <Text style={[styles.modelLabel, { color: colors.accent }]}>{model.toUpperCase()}</Text>
      )}
      {isUser ? (
        <Text style={styles.userText}>{content}</Text>
      ) : (
        <MarkdownRenderer content={content} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { maxWidth: '90%', padding: 14, borderRadius: 20, marginVertical: 4, marginHorizontal: 16 },
  userContainer: { alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  aiContainer: { alignSelf: 'flex-start', borderWidth: 1, borderBottomLeftRadius: 4 },
  userText: { color: '#fff', fontSize: 15, lineHeight: 22 },
  modelLabel: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 4 },
});
