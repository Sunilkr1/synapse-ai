import { create } from 'zustand';
import { getApiKey, saveApiKey, removeApiKey, ProviderType } from '../services/storage/secureStore';

interface KeyState {
  keys: Record<ProviderType, boolean>;
  isLoading: boolean;
  loadKeys: () => Promise<void>;
  setKey: (provider: ProviderType, key: string) => Promise<boolean>;
  deleteKey: (provider: ProviderType) => Promise<boolean>;
  hasKey: (provider: ProviderType) => boolean;
}

export const useKeyStore = create<KeyState>((set, get) => ({
  keys: {
    openai: false,
    anthropic: false,
    gemini: false,
    groq: false,
    mistral: false,
    deepseek: false,
    grok: false,
  },
  isLoading: true,

  loadKeys: async () => {
    set({ isLoading: true });
    
    // Check all providers in parallel
    const providers: ProviderType[] = ['openai', 'anthropic', 'gemini', 'groq', 'mistral', 'deepseek', 'grok'];
    const results = await Promise.all(
      providers.map(async (provider) => {
        const key = await getApiKey(provider);
        return { provider, exists: !!key };
      })
    );

    const newKeys = { ...get().keys };
    results.forEach(({ provider, exists }) => {
      newKeys[provider] = exists;
    });

    set({ keys: newKeys, isLoading: false });
  },

  setKey: async (provider, key) => {
    const success = await saveApiKey(provider, key);
    if (success) {
      set((state) => ({
        keys: { ...state.keys, [provider]: key.trim() !== '' },
      }));
    }
    return success;
  },

  deleteKey: async (provider) => {
    const success = await removeApiKey(provider);
    if (success) {
      set((state) => ({
        keys: { ...state.keys, [provider]: false },
      }));
    }
    return success;
  },

  hasKey: (provider) => {
    return get().keys[provider];
  },
}));
