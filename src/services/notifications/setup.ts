import { Platform, Alert } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import * as Notifications from 'expo-notifications';

/**
 * Requests notification permissions and retrieves the Expo Push Token.
 */
export async function setupNotifications(): Promise<string | null> {
  // 1. Critical Check for Expo Go (SDK 53+)
  const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

  if (isExpoGo) {
    console.log('Notifications: Skipping setup in Expo Go to prevent crash.');
    // Return a mock token for UI testing in Expo Go
    return 'expo-go-mock-token-' + Math.random().toString(36).substring(7);
  }

  try {
    // 2. Configure how notifications appear
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    // 3. Android specific channel setup
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#8B5CF6',
        enableVibrate: true,
        showBadge: true,
      });
    }

    // 4. Request Permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      Alert.alert('Permission Denied', 'Please enable notifications in your phone settings.');
      return null;
    }

    // 5. Get the token (Real Device / Dev Build Only)
    const projectId = Constants.expoConfig?.extra?.eas?.projectId || 
                      Constants.easConfig?.projectId;

    let token;
    try {
      token = (await Notifications.getExpoPushTokenAsync({
        projectId: projectId
      })).data;
    } catch (e: any) {
      // Retry once after 3 seconds if it's a SERVICE_NOT_AVAILABLE error
      if (e?.message?.includes('SERVICE_NOT_AVAILABLE')) {
        console.log('FCM Service busy, retrying in 3s...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        token = (await Notifications.getExpoPushTokenAsync({
          projectId: projectId
        })).data;
      } else {
        throw e;
      }
    }
    
    return token;

  } catch (error: any) {
    const errorMsg = error?.message || String(error);
    // If it's just a network failure (offline), don't annoy the user with an Alert
    if (errorMsg.includes('Network request failed') || 
        errorMsg.includes('network') || 
        errorMsg.includes('SERVICE_NOT_AVAILABLE')) {
      console.log('Notifications: Skipping token fetch due to temporary service/network issues.');
    } else {
      Alert.alert('Push Token Error', errorMsg);
      console.warn('Push Notification Error:', error);
    }
    return null;
  }
}
