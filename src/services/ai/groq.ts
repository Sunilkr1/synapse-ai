import { AIProvider } from './baseProvider';
import { ChatMessage } from '../../types';

// Groq uses an OpenAI-compatible API
export const GroqProvider: AIProvider = {
  id: 'groq',
  name: 'Groq (Llama)',
  generateResponse: async (messages: ChatMessage[], apiKey: string, modelId: string = 'llama3-70b-8192'): Promise<string> => {
    try {
      const cleanApiKey = apiKey.trim();
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cleanApiKey}`,
        },
        body: JSON.stringify({
          model: modelId,
          messages: messages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || 'Groq API error');
      }

      const data = await response.json();
      return data.choices[0]?.message?.content ?? '';
    } catch (error: any) {
      console.error('Groq Error:', error);
      return `⚠️ Groq Error: ${error.message}`;
    }
  },
};
