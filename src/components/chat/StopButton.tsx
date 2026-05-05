import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Square } from 'lucide-react-native';
import { Theme } from '../../constants/theme';

interface StopButtonProps {
  onStop: () => void;
}

export function StopButton({ onStop }: StopButtonProps) {
  return (
    <TouchableOpacity style={styles.btn} onPress={onStop} activeOpacity={0.8}>
      <Square size={16} color="#EF4444" />
      <Text style={styles.text}>Stop</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#EF4444', marginVertical: 8 },
  text: { color: '#EF4444', fontWeight: 'bold', fontSize: 14 },
});
