import { create } from 'zustand';
import { ChatMessage } from '../types';

interface OfflineQueueItem {
  id: string;
  messages: ChatMessage[];
  provider: string;
  queuedAt: number;
}

interface OfflineStore {
  isOffline: boolean;
  queue: OfflineQueueItem[];
  setOffline: (offline: boolean) => void;
  enqueue: (item: OfflineQueueItem) => void;
  dequeue: (id: string) => void;
  clearQueue: () => void;
}

export const useOfflineStore = create<OfflineStore>((set) => ({
  isOffline: false,
  queue: [],
  setOffline: (offline) => set({ isOffline: offline }),
  enqueue: (item) => set((state) => ({ queue: [...state.queue, item] })),
  dequeue: (id) => set((state) => ({ queue: state.queue.filter(i => i.id !== id) })),
  clearQueue: () => set({ queue: [] }),
}));
