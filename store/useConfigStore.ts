import { create } from 'zustand';
import { CONFIG } from '../src/constants/config';
import { ProviderType } from '../src/types';

interface ConfigStore {
  appName: string;
  defaultProvider: ProviderType;
  maxContextMessages: number;
  setDefaultProvider: (provider: ProviderType) => void;
}

export const useConfigStore = create<ConfigStore>((set) => ({
  appName: CONFIG.APP_NAME,
  defaultProvider: CONFIG.DEFAULT_PROVIDER,
  maxContextMessages: CONFIG.MAX_CONTEXT_MESSAGES,
  setDefaultProvider: (provider) => set({ defaultProvider: provider }),
}));
