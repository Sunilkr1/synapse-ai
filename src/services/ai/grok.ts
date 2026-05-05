import { AIProvider } from './baseProvider';
import { ChatMessage } from '../../types';

// xAI Grok uses an OpenAI-compatible API
export const GrokProvider: AIProvider = {
  id: 'grok',
  name: 'Grok (xAI)',
  generateResponse: async (messages: ChatMessage[], apiKey: string): Promise<string> => {
    try {
      const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'grok-2-latest',
          messages: messages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || 'Grok API error');
      }

      const data = await response.json();
      return data.choices[0]?.message?.content ?? '';
    } catch (error: any) {
      console.error('Grok Error:', error);
      return `⚠️ Grok Error: ${error.message}`;
    }
  },
};
