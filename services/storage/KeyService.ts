import * as SecureStore from 'expo-secure-store';

const KEYS_PREFIX = 'synapse_api_key_';

export const KeyService = {
  async saveKey(provider: string, key: string) {
    try {
      await SecureStore.setItemAsync(`${KEYS_PREFIX}${provider}`, key);
      return true;
    } catch (error) {
      console.error('Error saving key:', error);
      return false;
    }
  },

  async getKey(provider: string) {
    try {
      return await SecureStore.getItemAsync(`${KEYS_PREFIX}${provider}`);
    } catch (error) {
      console.error('Error getting key:', error);
      return null;
    }
  },

  async deleteKey(provider: string) {
    try {
      await SecureStore.deleteItemAsync(`${KEYS_PREFIX}${provider}`);
      return true;
    } catch (error) {
      console.error('Error deleting key:', error);
      return false;
    }
  },

  async hasKey(provider: string) {
    const key = await this.getKey(provider);
    return !!key;
  }
};
