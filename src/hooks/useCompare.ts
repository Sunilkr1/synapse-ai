import { useState, useCallback } from 'react';
import { aiRouter } from '../services/ai/aiRouter';
import { useCompareStore } from '../stores/compareStore';
import { ChatMessage, ProviderType } from '../types';

export function useCompare() {
  const store = useCompareStore();

  const runComparison = useCallback(async (prompt: string, modelA: ProviderType, modelB: ProviderType) => {
    store.setPrompt(prompt);
    store.setLoadingA(true);
    store.setLoadingB(true);
    store.setResponseA(null);
    store.setResponseB(null);
    store.setWinner(null);

    const messages: ChatMessage[] = [{ id: '1', role: 'user', content: prompt }];

    // Run both in parallel
    const [resA, resB] = await Promise.all([
      aiRouter.generateResponse(modelA, 'default', messages, ''),
      aiRouter.generateResponse(modelB, 'default', messages, ''),
    ]);

    store.setResponseA(resA);
    store.setLoadingA(false);
    store.setResponseB(resB);
    store.setLoadingB(false);
  }, []);

  const vote = (winner: 'A' | 'B' | 'tie') => {
    store.setWinner(winner);
  };

  return { ...store, runComparison, vote };
}
