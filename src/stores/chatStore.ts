import { create } from 'zustand';
import { ChatMessage, ChatSession, AIModel } from '../types';
import { ALL_MODELS } from '../constants/models';
import { SupabaseChats } from '../services/supabase/chats';
import { useAuthStore } from './authStore';

// --- HELPERS (OUTSIDE STORE) ---

// Helper to generate UUID v4 for Supabase compatibility
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Helper to check if string is valid UUID
const isUUID = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

interface ChatStore {
  sessions: ChatSession[];
  activeSessionId: string | null;
  messages: ChatMessage[];
  isLoading: boolean;
  activePersonaId: string;
  activeModel: AIModel;
  
  // Actions
  setActivePersona: (personaId: string) => void;
  setActiveModel: (model: AIModel) => void;
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: Omit<ChatMessage, 'id' | 'createdAt'>) => void;
  setLoading: (loading: boolean) => void;
  setActiveSession: (id: string | null) => void;
  updateSession: (session: ChatSession) => void;
  resetChat: () => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  sessions: [],
  activeSessionId: null,
  messages: [],
  isLoading: false,
  activePersonaId: 'general',
  activeModel: ALL_MODELS[0],

  setActivePersona: (personaId) => set({ activePersonaId: personaId }),
  
  setActiveModel: (model) => set({ activeModel: model }),

  setMessages: (messages) => set({ messages }),

  addMessage: (message) => {
    const newMessage = {
      ...message,
      id: generateUUID(),
      createdAt: Date.now()
    } as ChatMessage;

    set((state) => ({
      messages: [...state.messages, newMessage]
    }));

    // Auto-sync current chat session if logged in
    const session = useAuthStore.getState().session;
    let activeId = get().activeSessionId;

    // AUTO-FIX: If activeId exists but is NOT a UUID, migrate it now
    if (activeId && !isUUID(activeId)) {
      activeId = generateUUID();
      set({ activeSessionId: activeId });
    }

    // If no active session, create one
    if (!activeId) {
      activeId = generateUUID();
      set({ activeSessionId: activeId });
    }

    if (session && activeId) {
      SupabaseChats.saveChatSync({
        id: activeId,
        title: 'New Chat',
        model: get().activeModel.id,
        date: Date.now(),
        preview: newMessage.content.substring(0, 100),
        messages: get().messages,
      }, session.user.id);
    }
  },

  setLoading: (loading) => set({ isLoading: loading }),

  setActiveSession: (id) => set({ activeSessionId: id }),

  updateSession: (updatedSession) => {
    set((state) => ({
      sessions: state.sessions.map(s => s.id === updatedSession.id ? updatedSession : s)
    }));
    
    // Sync to Supabase
    const user = useAuthStore.getState().session?.user;
    if (user) {
      SupabaseChats.saveChatSync(updatedSession, user.id);
    }
  },

  resetChat: () => set({ messages: [], activeSessionId: null }),

  clearChat: () => set({ messages: [] }),
}));
