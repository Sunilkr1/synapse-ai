import { useState } from 'react';
import * as FileSystem from 'expo-file-system';
import { ChatSession, ProviderType, ChatMessage } from '../types';
import { Database } from '../services/storage/database';
import { aiRouter } from '../services/ai/aiRouter';
import { useChatStore } from '../stores/chatStore';
import { useKeyStore } from '../stores/keyStore';
import { useAuthStore } from '../stores/authStore';
import { generateChatTitle } from '../utils/chatTitleGenerator';
import { stripMarkdown } from '../utils/markdownUtils';
import { SystemConfigService } from '../services/supabase/systemConfig';
import { supabase } from '../services/supabase/client';

export function useChat(provider: ProviderType) {
  const store = useChatStore();
  const { keys } = useKeyStore();
  const { session } = useAuthStore();
  const [sessionId] = useState(() => Date.now().toString());

  const sendMessage = async (content: string, imageUri?: string) => {
    if (!content.trim() && !imageUri) return;

    // Add user message
    const userMsg: ChatMessage = { 
      id: Date.now().toString(), 
      role: 'user', 
      content,
      imageUri 
    };
    store.addMessage(userMsg);
    store.setLoading(true);

    try {
      let imageBase64;
      let mimeType;

      if (imageUri) {
        imageBase64 = await FileSystem.readAsStringAsync(imageUri, { encoding: 'base64' });
        mimeType = 'image/jpeg';
      }

      const allMessages = [...store.messages, userMsg];
      const rawKey = keys[provider];
      const apiKey = typeof rawKey === 'string' ? rawKey : '';
      const activeModelId = store.activeModel?.id || 'gemini-1.5-flash';

      const response = await aiRouter.generateResponse(
        provider, 
        activeModelId, 
        allMessages, 
        apiKey,
        imageBase64,
        mimeType
      );

      const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: response };
      store.addMessage(aiMsg);

      // Increment Usage in Supabase (Freemium logic)
      if (session?.user?.id) {
        await supabase.rpc('increment_user_usage', { user_id: session.user.id });
      }

      // Save to local DB
      const finalMessages = [...allMessages, aiMsg];
      await Database.saveChat({
        id: sessionId,
        title: store.messages.length < 2 ? generateChatTitle(content || 'New Chat') : (store.messages[0]?.content?.substring(0, 30) || 'Chat'),
        model: provider,
        date: Date.now(),
        preview: stripMarkdown(response).substring(0, 80),
        messages: finalMessages,
      });
    } catch (e: any) {
      console.error('useChat error:', e);
    } finally {
      store.setLoading(false);
    }
  };

  return {
    messages: store.messages,
    isLoading: store.isLoading,
    sendMessage,
    resetChat: store.resetChat,
  };
}
