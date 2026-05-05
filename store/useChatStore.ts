import { create } from 'zustand';
import { MODELS, AIModel } from '../constants/Models';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  modelId?: string;
}

interface ChatState {
  messages: Message[];
  selectedModel: AIModel;
  isStreaming: boolean;
  
  // Actions
  addMessage: (message: Message) => void;
  setSelectedModel: (model: AIModel) => void;
  setStreaming: (status: boolean) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [
    {
      id: '1',
      text: "Hello! I'm Synapse. How can I help you today?",
      sender: 'ai',
      timestamp: new Date(),
      modelId: 'gpt-4o'
    }
  ],
  selectedModel: MODELS[0],
  isStreaming: false,

  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),

  setSelectedModel: (model) => set({ selectedModel: model }),

  setStreaming: (status) => set({ isStreaming: status }),

  clearChat: () => set({ 
    messages: [
      {
        id: Date.now().toString(),
        text: "Chat cleared. How can I help you now?",
        sender: 'ai',
        timestamp: new Date(),
      }
    ] 
  }),
}));
