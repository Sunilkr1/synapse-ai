import { useState, useEffect } from 'react';
import { UsageStats } from '../types';
import { Database } from '../services/storage/database';
import { ProviderType } from '../types';

export function useStats() {
  const [stats, setStats] = useState<UsageStats>({
    totalMessages: 0,
    totalChats: 0,
    favoriteModel: null,
    totalTokensUsed: 0,
    mostUsedPersona: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const compute = async () => {
      setIsLoading(true);
      const chats = await Database.getAllChats();

      const totalChats = chats.length;
      const totalMessages = chats.reduce((sum, c) => sum + c.messages.length, 0);
      
      // Count model usage
      const modelCount: Record<string, number> = {};
      chats.forEach(c => {
        modelCount[c.model] = (modelCount[c.model] ?? 0) + 1;
      });
      const favoriteModel = Object.entries(modelCount)
        .sort((a, b) => b[1] - a[1])[0]?.[0] as ProviderType ?? null;

      // Rough token estimate
      const totalTokensUsed = chats.reduce((sum, c) =>
        sum + c.messages.reduce((s, m) => s + Math.ceil(m.content.length / 4), 0), 0);

      setStats({ totalMessages, totalChats, favoriteModel, totalTokensUsed, mostUsedPersona: null });
      setIsLoading(false);
    };
    compute();
  }, []);

  return { stats, isLoading };
}
