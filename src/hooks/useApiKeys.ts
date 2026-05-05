import { useState, useEffect } from 'react';
import { getApiKey, saveApiKey } from '../services/storage/secureStore';
import { ProviderType } from '../types';

const PROVIDERS: ProviderType[] = ['gemini', 'openai', 'anthropic', 'groq', 'mistral', 'deepseek'];

export function useApiKeys() {
  const [keys, setKeys] = useState<Record<string, string | null>>({});
  const [isLoading, setIsLoading] = useState(true);

  const loadKeys = async () => {
    setIsLoading(true);
    const loaded: Record<string, string | null> = {};
    await Promise.all(
      PROVIDERS.map(async (p) => {
        loaded[p] = await getApiKey(p);
      })
    );
    setKeys(loaded);
    setIsLoading(false);
  };

  useEffect(() => { loadKeys(); }, []);

  const updateKey = async (provider: ProviderType, key: string) => {
    await saveApiKey(provider, key);
    setKeys(prev => ({ ...prev, [provider]: key }));
  };

  const hasKey = (provider: ProviderType) => !!keys[provider];

  return { keys, isLoading, updateKey, hasKey, reload: loadKeys };
}
