import { useState, useEffect } from 'react';
import { Database } from '../services/storage/database';
import { ChatSession } from '../types';

export function useHistory() {
  const [history, setHistory] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    setIsLoading(true);
    const data = await Database.getAllChats();
    setHistory(data);
    setIsLoading(false);
  };

  useEffect(() => { load(); }, []);

  const deleteChat = async (id: string) => {
    await Database.deleteChat(id);
    await load();
  };

  const clearAll = async () => {
    await Database.clearAll();
    setHistory([]);
  };

  return { history, isLoading, reload: load, deleteChat, clearAll };
}
