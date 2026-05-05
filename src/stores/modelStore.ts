import { create } from 'zustand';
import { ProviderType } from '../types';

interface ModelStore {
  selectedModel: ProviderType;
  setSelectedModel: (model: ProviderType) => void;
}

export const useModelStore = create<ModelStore>((set) => ({
  selectedModel: 'gemini',
  setSelectedModel: (model) => set({ selectedModel: model }),
}));
