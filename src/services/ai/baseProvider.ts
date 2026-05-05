import { ProviderType, ChatMessage } from '../../types';

export interface AIProvider {
  id: ProviderType;
  name: string;
  generateResponse: (messages: ChatMessage[], apiKey: string, modelId?: string, imageBase64?: string, mimeType?: string) => Promise<string>;
}
