// ============================================================
// All core TypeScript types for the Synapse AI project
// ============================================================



// --- Auth ---
export interface AuthUser {
  id: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  createdAt: string;
}

// --- Chat ---
export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  imageUri?: string;
  createdAt?: number;
  model?: string;
}

export interface ChatSession {
  id: string;
  userId?: string;
  title: string;
  model: string;
  date: number;
  preview: string;
  messages: ChatMessage[];
}

// --- Compare ---
export interface CompareResult {
  id: string;
  prompt: string;
  modelA: string;
  modelB: string;
  responseA: string;
  responseB: string;
  winner?: 'A' | 'B' | 'tie';
  createdAt: number;
}

// --- Model ---
export type ProviderType = 'gemini' | 'openai' | 'anthropic' | 'groq' | 'mistral' | 'deepseek' | 'grok';

export interface AIModel {
  id: string;
  provider: ProviderType;
  name: string;
  displayName: string;
  description: string;
  contextWindow: number;
  isAvailable: boolean;
  isFree?: boolean;
}

// --- Persona ---
export interface Persona {
  id: string;
  name: string;
  role: string;
  description: string;
  systemPrompt: string;
  icon: string;
  color: string;
  isBuiltIn: boolean;
}

// --- Prompt ---
export interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: number;
}

// --- Stats ---
export interface UsageStats {
  totalMessages: number;
  totalChats: number;
  favoriteModel: ProviderType | null;
  totalTokensUsed: number;
  mostUsedPersona: string | null;
}

// --- Notification ---
export interface AppNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  body: string;
  scheduledAt?: number;
  date: number;
  read: boolean;
  data?: any;
}

// --- Settings ---
export interface AppSettings {
  theme: 'dark' | 'light' | 'auto';
  accentColor?: string;
  defaultModel: ProviderType;
  streamingEnabled: boolean;
  notificationsEnabled: boolean;
  hapticFeedbackEnabled: boolean;
  fontSize: 'small' | 'medium' | 'large';
}
