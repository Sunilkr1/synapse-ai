import { useEffect, useRef } from 'react';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { attachNotificationHandlers } from '../services/notifications/handlers';

export function useNotifications(
  onReceive?: (n: any) => void,
  onResponse?: (r: any) => void
) {
  const cleanupRef = useRef<(() => void) | undefined>(undefined);
  const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

  useEffect(() => {
    if (isExpoGo) return;

    try {
      cleanupRef.current = attachNotificationHandlers(onReceive, onResponse);
    } catch (e) {
      console.warn('Notification handlers failed to attach:', e);
    }

    return () => {
      cleanupRef.current?.();
    };
  }, [onReceive, onResponse, isExpoGo]);
}
