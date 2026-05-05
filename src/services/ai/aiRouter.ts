import { GeminiProvider } from './gemini';
import { OpenAIProvider } from './openai';
import { AnthropicProvider } from './anthropic';
import { GroqProvider } from './groq';
import { DeepSeekProvider } from './deepseek';
import { ProxyService } from './proxy';
import { ProviderType, ChatMessage } from '../../types';

const PROVIDERS: Record<string, any> = {
  gemini: GeminiProvider,
  openai: OpenAIProvider,
  anthropic: AnthropicProvider,
  groq: GroqProvider,
  deepseek: DeepSeekProvider,
};

export const aiRouter = {
  async generateResponse(
    provider: ProviderType,
    modelId: string,
    messages: ChatMessage[],
    apiKey: string,
    imageBase64?: string,
    mimeType?: string
  ): Promise<string> {
    
    // 1. If user has their own key, use direct local provider (Fastest)
    if (apiKey && apiKey.trim() !== '') {
      const service = PROVIDERS[provider];
      if (!service) throw new Error(`Provider "${provider}" is not supported.`);
      return service.generateResponse(messages, apiKey, modelId, imageBase64, mimeType);
    }

    // 2. If NO user key, use secure Cloud Proxy (Uses Developer Keys from Supabase Secrets)
    console.log(`User key for ${provider} missing, using Secure Cloud Proxy...`);
    return ProxyService.generateResponse(provider, messages, modelId);
  }
};
