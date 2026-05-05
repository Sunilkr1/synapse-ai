import AsyncStorage from '@react-native-async-storage/async-storage';

const QUEUE_KEY = 'synapse_offline_queue';

interface QueueItem {
  id: string;
  provider: string;
  prompt: string;
  queuedAt: number;
}

export const OfflineQueue = {
  getAll: async (): Promise<QueueItem[]> => {
    const raw = await AsyncStorage.getItem(QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  },
  add: async (item: QueueItem) => {
    const existing = await OfflineQueue.getAll();
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify([...existing, item]));
  },
  remove: async (id: string) => {
    const existing = await OfflineQueue.getAll();
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(existing.filter(i => i.id !== id)));
  },
  clear: async () => {
    await AsyncStorage.removeItem(QUEUE_KEY);
  },
};
