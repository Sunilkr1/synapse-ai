export interface AIModel {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'google' | 'meta' | 'deepseek' | 'xai';
  icon: string;
  description: string;
  contextWindow: string;
  speed: 'Fast' | 'Normal' | 'Slow';
  capabilities: string[];
}

export const MODELS: AIModel[] = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    icon: 'zap',
    description: 'Most intelligent and versatile model from OpenAI.',
    contextWindow: '128k',
    speed: 'Fast',
    capabilities: ['Vision', 'Analysis', 'Coding'],
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'anthropic',
    icon: 'brain',
    description: 'Highest intelligence with human-like reasoning.',
    contextWindow: '200k',
    speed: 'Normal',
    capabilities: ['Reasoning', 'Coding', 'Nuance'],
  },
  {
    id: 'gemini-1-5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'google',
    icon: 'star',
    description: 'Deep integration with Google ecosystem and huge context.',
    contextWindow: '1M',
    speed: 'Fast',
    capabilities: ['Long Context', 'Vision', 'Multimodal'],
  },
  {
    id: 'deepseek-chat',
    name: 'DeepSeek V3',
    provider: 'deepseek',
    icon: 'search',
    description: 'Highly efficient and powerful open-weights model.',
    contextWindow: '64k',
    speed: 'Fast',
    capabilities: ['Efficient', 'Coding'],
  },
];
