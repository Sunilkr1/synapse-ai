/**
 * Schedule a local notification for later.
 */
export async function scheduleNotification(
  title: string,
  body: string,
  secondsFromNow: number
): Promise<string> {
  try {
    const Notifications = require('expo-notifications');
    return Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: { seconds: secondsFromNow, type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL },
    });
  } catch (e) {
    console.warn('Notifications: Failed to schedule (possibly Expo Go):', e);
    return 'disabled';
  }
}

/**
 * Send an immediate local push notification.
 */
export async function sendImmediateNotification(title: string, body: string): Promise<string> {
  try {
    const Notifications = require('expo-notifications');
    return Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: null,
    });
  } catch (e) {
    console.warn('Notifications: Failed to send (possibly Expo Go):', e);
    return 'disabled';
  }
}

/**
 * Cancel a scheduled notification by its ID.
 */
export async function cancelNotification(id: string): Promise<void> {
  try {
    const Notifications = require('expo-notifications');
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch (e) {
    console.warn('Notifications: Failed to cancel (possibly Expo Go):', e);
  }
}
