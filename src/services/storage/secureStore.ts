import * as SecureStore from 'expo-secure-store';

export type ProviderType = 'openai' | 'anthropic' | 'gemini' | 'groq' | 'mistral' | 'deepseek' | 'grok';

const KEY_PREFIX = 'synapse_api_key_';

/**
 * Saves an API key securely on the device.
 */
export const saveApiKey = async (provider: ProviderType, key: string): Promise<boolean> => {
  try {
    if (!key || key.trim() === '') {
      await SecureStore.deleteItemAsync(`${KEY_PREFIX}${provider}`);
      return true;
    }
    
    await SecureStore.setItemAsync(`${KEY_PREFIX}${provider}`, key.trim());
    return true;
  } catch (error) {
    console.error(`Error saving ${provider} API key:`, error);
    return false;
  }
};

/**
 * Retrieves an API key securely from the device.
 */
export const getApiKey = async (provider: ProviderType): Promise<string | null> => {
  try {
    const key = await SecureStore.getItemAsync(`${KEY_PREFIX}${provider}`);
    return key;
  } catch (error) {
    console.error(`Error retrieving ${provider} API key:`, error);
    return null;
  }
};

/**
 * Deletes an API key securely from the device.
 */
export const removeApiKey = async (provider: ProviderType): Promise<boolean> => {
  try {
    await SecureStore.deleteItemAsync(`${KEY_PREFIX}${provider}`);
    return true;
  } catch (error) {
    console.error(`Error removing ${provider} API key:`, error);
    return false;
  }
};

/**
 * Checks if a specific API key exists.
 */
export const hasApiKey = async (provider: ProviderType): Promise<boolean> => {
  try {
    const key = await getApiKey(provider);
    return key !== null && key.trim() !== '';
  } catch (error) {
    return false;
  }
};
