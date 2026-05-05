import NetInfo from '@react-native-community/netinfo';

/**
 * Checks if the device has an active internet connection.
 */
export async function isConnected(): Promise<boolean> {
  const state = await NetInfo.fetch();
  return state.isConnected === true;
}
