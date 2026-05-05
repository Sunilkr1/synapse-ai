import React, { useEffect, useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import { Theme } from '../../constants/theme';

interface ResponseTimerProps {
  isRunning: boolean;
}

export function ResponseTimer({ isRunning }: ResponseTimerProps) {
  const [ms, setMs] = useState(0);

  useEffect(() => {
    if (!isRunning) { setMs(0); return; }
    const start = Date.now();
    const interval = setInterval(() => setMs(Date.now() - start), 100);
    return () => clearInterval(interval);
  }, [isRunning]);

  if (!isRunning && ms === 0) return null;

  return <Text style={styles.timer}>{(ms / 1000).toFixed(1)}s</Text>;
}

const styles = StyleSheet.create({
  timer: { color: Theme.colors.dark.accent, fontWeight: 'bold', fontSize: 13 },
});
