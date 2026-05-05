import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Zap, Copy } from 'lucide-react-native';
import Markdown from 'react-native-markdown-display';
import { useTheme } from '../../hooks/useTheme';

import { ChatMessage as ChatMessageType } from '../../types';

export function ChatMessage({ role, content, imageUri }: ChatMessageType) {
  const { colors } = useTheme();
  const isUser = role === 'user';

  const handleCopy = async () => {
    await Clipboard.setStringAsync(content);
    Alert.alert('Copied!', 'Message copied to clipboard.');
  };

  const markdownStyles = StyleSheet.create({
    body: { color: colors.text, fontSize: 16, lineHeight: 26 },
    code_inline: { backgroundColor: colors.surfaceSecondary, color: colors.accent, padding: 4, borderRadius: 4, fontFamily: 'monospace' },
    fence: { backgroundColor: colors.surfaceSecondary, padding: 12, borderRadius: 8, marginTop: 8, marginBottom: 8, borderWidth: 1, borderColor: colors.border },
    code_block: { color: colors.textSecondary, fontFamily: 'monospace' },
    strong: { fontWeight: 'bold', color: colors.text },
    a: { color: colors.accent, textDecorationLine: 'underline' },
    p: { marginTop: 0, marginBottom: 12 },
  });

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.aiContainer]}>
      {!isUser && (
        <View style={[styles.avatar, { backgroundColor: colors.accent }]}>
          <Zap size={16} color={colors.background} />
        </View>
      )}
      
      <View style={[
        styles.bubble, 
        isUser ? [styles.userBubble, { backgroundColor: colors.border }] : [styles.aiBubble, { backgroundColor: 'transparent', borderWidth: 0 }]
      ]}>
        {imageUri && (
          <Image source={{ uri: imageUri }} style={styles.messageImage} />
        )}
        {isUser ? (
          <Text selectable style={[styles.userText, { color: colors.text }]}>{content}</Text>
        ) : (
          <>
            <Markdown style={markdownStyles}>
              {content}
            </Markdown>
            <TouchableOpacity onPress={handleCopy} style={styles.copyButton}>
              <Copy size={14} color={colors.textSecondary} />
              <Text style={[styles.copyText, { color: colors.textSecondary }]}>Copy</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginVertical: 12,
    maxWidth: '100%',
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  aiContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 4,
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    flex: 1,
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderWidth: 0,
  },
  userText: {
    fontSize: 16,
    lineHeight: 24,
  },
  messageImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 8,
    resizeMode: 'cover',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    opacity: 0.7,
  },
  copyText: {
    fontSize: 12,
  },
});
