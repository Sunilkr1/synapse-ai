import { useState, useEffect } from 'react';

export function useOffline() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // In a real implementation, this would use @react-native-community/netinfo
    // For now, we assume online. NetInfo integration is in networkUtils.ts.
    setIsOffline(false);
  }, []);

  return { isOffline };
}
