import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppNotification } from '../types';

interface NotificationStore {
  notifications: AppNotification[];
  addNotification: (notification: Omit<AppNotification, 'id' | 'date' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  getUnreadCount: () => number;
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [],
      
      addNotification: (notif) => set((state) => ({
        notifications: [
          {
            id: Date.now().toString() + Math.random().toString(36).substring(7),
            date: Date.now(),
            read: false,
            ...notif
          },
          ...state.notifications
        ]
      })),

      markAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => 
          n.id === id ? { ...n, read: true } : n
        )
      })),

      markAllAsRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, read: true }))
      })),

      deleteNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      })),

      clearAll: () => set({ notifications: [] }),

      getUnreadCount: () => {
        return get().notifications.filter(n => !n.read).length;
      }
    }),
    {
      name: 'synapse-notifications-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
