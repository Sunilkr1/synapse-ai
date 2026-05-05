import { supabase } from '../supabase/client';
import { ChatMessage } from '../../types';

/**
 * ProxyProvider: Calls the Supabase Edge Function (ai-proxy)
 * This allows using developer keys securely without exposing them in the app.
 */
export const ProxyService = {
  generateResponse: async (
    provider: string,
    messages: ChatMessage[],
    modelId: string,
    temperature: number = 0.7
  ): Promise<string> => {
    try {
      // 1. Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('ai-proxy', {
        body: {
          provider,
          model: modelId,
          messages: messages.map(m => ({ role: m.role, content: m.content })),
          temperature
        }
      });

      if (error) {
        console.error('Proxy Invocation Error:', error);
        throw new Error('Cloud Proxy failed to respond.');
      }

      // 2. Parse the response based on provider format
      if (provider === 'gemini') {
        return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Proxy Gemini.';
      } else {
        // OpenAI format (Groq, OpenRouter, OpenAI)
        return data.choices?.[0]?.message?.content || 'No response from Proxy.';
      }

    } catch (error: any) {
      console.error('ProxyService Error:', error);
      throw new Error(error.message || 'Failed to connect to AI Cloud.');
    }
  }
};
