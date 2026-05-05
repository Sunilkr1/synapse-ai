import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Theme } from '../../constants/theme';
import { Copy } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';

interface MessageActionsProps {
  content: string;
  onDismiss?: () => void;
}

export function MessageActions({ content, onDismiss }: MessageActionsProps) {
  const handleCopy = async () => {
    await Clipboard.setStringAsync(content);
    onDismiss?.();
  };

  return (
    <View style={styles.row}>
      <TouchableOpacity style={styles.btn} onPress={handleCopy}>
        <Copy size={18} color={Theme.colors.dark.textSecondary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 4 },
  btn: { padding: 8, borderRadius: 8, backgroundColor: Theme.colors.dark.surface, borderWidth: 1, borderColor: Theme.colors.dark.border },
});
