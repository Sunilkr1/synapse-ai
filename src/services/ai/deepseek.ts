import { AIProvider } from './baseProvider';
import { ChatMessage } from '../../types';

// DeepSeek uses an OpenAI-compatible API
// Also supports OpenRouter keys (sk-or-v1-...)
export const DeepSeekProvider: AIProvider = {
  id: 'deepseek',
  name: 'DeepSeek',
  generateResponse: async (messages: ChatMessage[], apiKey: string, modelId: string = 'deepseek-chat'): Promise<string> => {
    try {
      const cleanKey = apiKey.trim();
      const isOpenRouter = cleanKey.startsWith('sk-or-');
      
      const baseUrl = isOpenRouter
        ? 'https://openrouter.ai/api/v1/chat/completions'
        : 'https://api.deepseek.com/v1/chat/completions';

      const model = isOpenRouter ? 'deepseek/deepseek-chat' : modelId;

      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cleanKey}`,
          ...(isOpenRouter && { 'HTTP-Referer': 'https://synapse-ai.app', 'X-Title': 'Synapse AI' }),
        },
        body: JSON.stringify({
          model,
          messages: messages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || 'DeepSeek API error');
      }

      const data = await response.json();
      return data.choices[0]?.message?.content ?? '';
    } catch (error: any) {
      console.error('DeepSeek Error:', error);
      return `⚠️ DeepSeek Error: ${error.message}`;
    }
  },
};
