import { create } from 'zustand';
import { ProviderType } from '../types';

interface CompareStore {
  modelA: ProviderType;
  modelB: ProviderType;
  prompt: string;
  responseA: string | null;
  responseB: string | null;
  isLoadingA: boolean;
  isLoadingB: boolean;
  winner: 'A' | 'B' | 'tie' | null;
  setModelA: (model: ProviderType) => void;
  setModelB: (model: ProviderType) => void;
  setPrompt: (prompt: string) => void;
  setResponseA: (response: string | null) => void;
  setResponseB: (response: string | null) => void;
  setLoadingA: (val: boolean) => void;
  setLoadingB: (val: boolean) => void;
  setWinner: (winner: 'A' | 'B' | 'tie' | null) => void;
  reset: () => void;
}

export const useCompareStore = create<CompareStore>((set) => ({
  modelA: 'gemini',
  modelB: 'openai',
  prompt: '',
  responseA: null,
  responseB: null,
  isLoadingA: false,
  isLoadingB: false,
  winner: null,
  setModelA: (model) => set({ modelA: model }),
  setModelB: (model) => set({ modelB: model }),
  setPrompt: (prompt) => set({ prompt }),
  setResponseA: (response) => set({ responseA: response }),
  setResponseB: (response) => set({ responseB: response }),
  setLoadingA: (val) => set({ isLoadingA: val }),
  setLoadingB: (val) => set({ isLoadingB: val }),
  setWinner: (winner) => set({ winner }),
  reset: () => set({ prompt: '', responseA: null, responseB: null, winner: null }),
}));
