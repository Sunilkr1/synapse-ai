import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Theme } from '../../constants/theme';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onDismiss: () => void;
}

export function Toast({ message, type = 'info', onDismiss }: ToastProps) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(2500),
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(onDismiss);
  }, []);

  const bgColor = type === 'success' ? '#22C55E' : type === 'error' ? '#EF4444' : Theme.colors.dark.accent;

  return (
    <Animated.View style={[styles.toast, { backgroundColor: bgColor, opacity }]}>
      <TouchableOpacity onPress={onDismiss}>
        <Text style={styles.text}>{message}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 100,
    left: 24,
    right: 24,
    borderRadius: 12,
    padding: 14,
    zIndex: 9999,
    elevation: 10,
  },
  text: { color: '#fff', fontWeight: 'bold', fontSize: 14, textAlign: 'center' },
});
