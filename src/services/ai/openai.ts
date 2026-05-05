import { AIProvider } from './baseProvider';
import { ChatMessage } from '../../types';

export const OpenAIProvider: AIProvider = {
  id: 'openai',
  name: 'OpenAI',
  generateResponse: async (messages: ChatMessage[], apiKey: string, modelId: string = 'gpt-4o'): Promise<string> => {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: modelId,
          messages: messages.map(m => ({
            role: m.role,
            content: m.content
          })),
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'OpenAI API Error');
      
      return data.choices[0].message.content;
    } catch (error: any) {
      console.error('OpenAI Error:', error);
      throw error;
    }
  }
};
