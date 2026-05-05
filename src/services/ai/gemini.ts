import { ChatMessage } from '../../types';

export const GeminiProvider: any = {
  id: 'gemini',
  name: 'Google Gemini',
  generateResponse: async (messages: ChatMessage[], apiKey: string, modelId: string = 'gemini-1.5-flash'): Promise<string> => {
    try {
      let cleanKey = apiKey?.trim();
      let isUserKey = true;
      
      // If no key or it's our placeholder, use system fallback via OpenRouter
      if (!cleanKey || cleanKey === process.env.EXPO_PUBLIC_GEMINI_API_KEY) {
        cleanKey = process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY || '';
        isUserKey = false;
      }

      if (!cleanKey) {
        throw new Error('Gemini API Key missing.');
      }

      // ROUTING LOGIC:
      // 1. If it's a Google Key (AIza...) OR if we're not sure, try Direct Google REST API (more stable for native keys)
      // 2. If it's an OpenRouter Key (sk-or...) OR if it's our fallback, use OpenRouter
      
      if (cleanKey.startsWith('sk-or') || !isUserKey) {
        // --- OpenRouter Route ---
        const orModel = modelId.includes('pro') ? 'google/gemini-pro-1.5' : 'google/gemini-flash-1.5';
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cleanKey}`,
            'HTTP-Referer': 'https://synapse-ai.app',
          },
          body: JSON.stringify({
            model: orModel,
            messages: messages.map(m => ({
              role: m.role === 'assistant' ? 'assistant' : 'user',
              content: m.content
            })),
          }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error?.message || 'OpenRouter Gemini Error');
        return data.choices?.[0]?.message?.content || 'No response';
      } else {
        // --- Direct Google REST API Route (v1) ---
        // For users who provide their own AIza... keys
        const googleModel = modelId.includes('pro') ? 'gemini-1.5-pro' : 'gemini-1.5-flash';
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${googleModel}:generateContent?key=${cleanKey}`;
        
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: messages.map(m => ({
              role: m.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: m.content }]
            })),
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 2048,
            }
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error?.message || 'Google API Error. Please check if your API key is valid and has Gemini access.');
        }

        return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Google Gemini.';
      }

    } catch (error: any) {
      console.error('Gemini Provider Error:', error);
      throw new Error(error.message || 'Gemini failed to respond');
    }
  }
};
