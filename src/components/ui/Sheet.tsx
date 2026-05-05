import React from 'react';
import { Modal, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Theme } from '../../constants/theme';

interface SheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Sheet({ visible, onClose, children }: SheetProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        {children}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: {
    backgroundColor: Theme.colors.dark.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderColor: Theme.colors.dark.border,
  },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: Theme.colors.dark.border, alignSelf: 'center', marginBottom: 16 },
});
