import { AIModel } from '../types';

export const ALL_MODELS: AIModel[] = [
  { id: 'llama-3.3-70b', provider: 'groq', name: 'llama-3.3-70b-versatile', displayName: 'Llama 3.3 70B', description: 'Ultra-fast inference on Groq hardware.', contextWindow: 128000, isAvailable: true, isFree: true },
  { id: 'deepseek-chat', provider: 'deepseek', name: 'deepseek-chat', displayName: 'DeepSeek Chat', description: 'Powerful and affordable open-source model.', contextWindow: 128000, isAvailable: true, isFree: true },
  { id: 'gemini-1.5-flash', provider: 'gemini', name: 'gemini-1.5-flash', displayName: 'Gemini Flash', description: 'Fast and efficient from Google DeepMind.', contextWindow: 1000000, isAvailable: true, isFree: false },
  { id: 'gemini-1.5-pro', provider: 'gemini', name: 'gemini-1.5-pro', displayName: 'Gemini Pro', description: 'Most capable Google model for complex tasks.', contextWindow: 2000000, isAvailable: true, isFree: false },
  { id: 'gpt-4o', provider: 'openai', name: 'gpt-4o', displayName: 'GPT-4o', description: 'Flagship multimodal model from OpenAI.', contextWindow: 128000, isAvailable: true, isFree: false },
  { id: 'gpt-4o-mini', provider: 'openai', name: 'gpt-4o-mini', displayName: 'GPT-4o Mini', description: 'Fast and affordable OpenAI model.', contextWindow: 128000, isAvailable: true, isFree: false },
  { id: 'claude-3-5-sonnet', provider: 'anthropic', name: 'claude-3-5-sonnet-20241022', displayName: 'Claude 3.5 Sonnet', description: 'Best-in-class coding & reasoning from Anthropic.', contextWindow: 200000, isAvailable: true, isFree: false },
  { id: 'mistral-large', provider: 'mistral', name: 'mistral-large-latest', displayName: 'Mistral Large', description: 'Flagship from Mistral AI.', contextWindow: 128000, isAvailable: true, isFree: false },
];

export const MODELS = ALL_MODELS;
