import React from 'react';
import { Modal, View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { Theme } from '../../constants/theme';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export function LoadingOverlay({ visible, message = 'Loading...' }: LoadingOverlayProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.box}>
          <ActivityIndicator size="large" color={Theme.colors.dark.accent} />
          <Text style={styles.text}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  box: { backgroundColor: Theme.colors.dark.surface, borderRadius: 20, padding: 32, alignItems: 'center', gap: 16, borderWidth: 1, borderColor: Theme.colors.dark.border },
  text: { color: Theme.colors.dark.text, fontSize: 15, fontWeight: '600' },
});
