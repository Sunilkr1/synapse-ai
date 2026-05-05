import { AIModel } from '../types';

const ALL_MODELS: AIModel[] = [
  { id: 'gemini-1.5-flash', provider: 'gemini', name: 'gemini-1.5-flash', displayName: 'Gemini Flash', description: 'Fast and efficient from Google.', contextWindow: 1000000, isAvailable: true },
  { id: 'gpt-4o', provider: 'openai', name: 'gpt-4o', displayName: 'GPT-4o', description: 'Flagship model from OpenAI.', contextWindow: 128000, isAvailable: true },
  { id: 'claude-3-5-sonnet', provider: 'anthropic', name: 'claude-3-5-sonnet-20241022', displayName: 'Claude 3.5 Sonnet', description: 'Best model from Anthropic.', contextWindow: 200000, isAvailable: true },
  { id: 'llama3-70b', provider: 'groq', name: 'llama3-70b-8192', displayName: 'Llama 3 70B (Groq)', description: 'Ultra-fast inference via Groq.', contextWindow: 8192, isAvailable: true },
  { id: 'mistral-large', provider: 'mistral', name: 'mistral-large-latest', displayName: 'Mistral Large', description: 'Flagship from Mistral AI.', contextWindow: 128000, isAvailable: true },
  { id: 'deepseek-chat', provider: 'deepseek', name: 'deepseek-chat', displayName: 'DeepSeek Chat', description: 'Powerful open-source model.', contextWindow: 128000, isAvailable: true },
];

export function useModels() {
  return { models: ALL_MODELS };
}
