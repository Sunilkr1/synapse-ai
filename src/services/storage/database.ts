import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChatSession, ChatMessage } from '../../types';
export { ChatSession, ChatMessage };

const CHATS_KEY = 'synapse_chats_history';

export const Database = {
  /**
   * Get all chat sessions
   */
  getAllChats: async (): Promise<ChatSession[]> => {
    try {
      const json = await AsyncStorage.getItem(CHATS_KEY);
      if (json) {
        return JSON.parse(json) as ChatSession[];
      }
    } catch (e) {
      console.error('Failed to load chats', e);
    }
    return [];
  },

  /**
   * Save or update a chat session
   */
  saveChat: async (chat: ChatSession) => {
    try {
      const existing = await Database.getAllChats();
      const index = existing.findIndex(c => c.id === chat.id);
      
      if (index >= 0) {
        existing[index] = chat; // Update
      } else {
        existing.unshift(chat); // Add new at the beginning
      }
      
      await AsyncStorage.setItem(CHATS_KEY, JSON.stringify(existing));
    } catch (e) {
      console.error('Failed to save chat', e);
    }
  },

  deleteChat: async (id: string) => {
    try {
      const existing = await Database.getAllChats();
      const filtered = existing.filter(c => c.id !== id);
      await AsyncStorage.setItem(CHATS_KEY, JSON.stringify(filtered));
    } catch (e) {
      console.error('Failed to delete chat', e);
    }
  },

  /**
   * Get all compare sessions
   */
  getAllCompares: async (): Promise<any[]> => {
    try {
      const json = await AsyncStorage.getItem('synapse_compares_history');
      if (json) {
        return JSON.parse(json);
      }
    } catch (e) {
      console.error('Failed to load compares', e);
    }
    return [];
  },

  /**
   * Save a compare session
   */
  saveCompare: async (compareResult: any) => {
    try {
      const existing = await Database.getAllCompares();
      existing.unshift(compareResult);
      await AsyncStorage.setItem('synapse_compares_history', JSON.stringify(existing));
    } catch (e) {
      console.error('Failed to save compare', e);
    }
  },


  /**
   * Delete a compare session
   */
  deleteCompare: async (id: string) => {
    try {
      const existing = await Database.getAllCompares();
      const filtered = existing.filter(c => c.id !== id);
      await AsyncStorage.setItem('synapse_compares_history', JSON.stringify(filtered));
    } catch (e) {
      console.error('Failed to delete compare', e);
    }
  },

  /**
   * Clear all history (both chats and compares)
   */
  clearAll: async () => {
    await AsyncStorage.removeItem(CHATS_KEY);
    await AsyncStorage.removeItem('synapse_compares_history');
  }
};
