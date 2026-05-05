/**
 * Attach listeners to handle notification interactions.
 * Call cleanup() when the component unmounts.
 */
export function attachNotificationHandlers(
  onReceive?: (notification: any) => void,
  onResponse?: (response: any) => void
) {
  try {
    const Notifications = require('expo-notifications');

    const receiveSubscription = Notifications.addNotificationReceivedListener(
      (notification: any) => {
        console.log('Notification received:', notification);
        onReceive?.(notification);
      }
    );

    const responseSubscription = Notifications.addNotificationResponseReceivedListener(
      (response: any) => {
        console.log('Notification tapped:', response);
        onResponse?.(response);
      }
    );

    return () => {
      receiveSubscription.remove();
      responseSubscription.remove();
    };
  } catch (e) {
    console.warn('Notifications: Failed to attach handlers (possibly Expo Go):', e);
    return () => {};
  }
}
