import React, { useEffect, useState, useRef } from 'react';
import { Text, StyleSheet } from 'react-native';
import { Theme } from '../../constants/theme';

interface StreamingTextProps {
  text: string;
  speed?: number; // ms per character
}

// Animates text appearing character by character (simulates streaming)
export function StreamingText({ text, speed = 10 }: StreamingTextProps) {
  const [displayed, setDisplayed] = useState('');
  const indexRef = useRef(0);

  useEffect(() => {
    indexRef.current = 0;
    setDisplayed('');

    const interval = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayed(prev => prev + text[indexRef.current]);
        indexRef.current++;
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text]);

  return <Text style={styles.text}>{displayed}</Text>;
}

const styles = StyleSheet.create({
  text: { color: Theme.colors.dark.text, fontSize: 15, lineHeight: 22 },
});
