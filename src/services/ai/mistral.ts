import { AIProvider } from './baseProvider';
import { ChatMessage } from '../../types';

// Mistral uses an OpenAI-compatible API
export const MistralProvider: AIProvider = {
  id: 'mistral',
  name: 'Mistral',
  generateResponse: async (messages: ChatMessage[], apiKey: string): Promise<string> => {
    try {
      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'mistral-large-latest',
          messages: messages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Mistral API error');
      }

      const data = await response.json();
      return data.choices[0]?.message?.content ?? '';
    } catch (error: any) {
      console.error('Mistral Error:', error);
      return `⚠️ Mistral Error: ${error.message}`;
    }
  },
};
