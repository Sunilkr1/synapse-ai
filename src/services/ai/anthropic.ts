import { AIProvider } from './baseProvider';
import { ChatMessage } from '../../types';

export const AnthropicProvider: AIProvider = {
  id: 'anthropic',
  name: 'Claude 3.5',
  generateResponse: async (messages: ChatMessage[], apiKey: string, modelId: string = 'claude-3-5-sonnet-20241022'): Promise<string> => {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerously-allow-browser': 'true'
        },
        body: JSON.stringify({
          model: modelId,
          max_tokens: 4096,
          messages: messages
            .filter(m => m.role !== 'system')
            .map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || 'Anthropic API error');
      }

      const data = await response.json();
      return data.content[0]?.text ?? '';
    } catch (error: any) {
      console.error('Anthropic Error:', error);
      return `⚠️ Anthropic Error: ${error.message}`;
    }
  },
};
