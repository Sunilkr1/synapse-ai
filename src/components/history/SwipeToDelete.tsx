import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Theme } from '../../constants/theme';
import { Trash2 } from 'lucide-react-native';

interface SwipeToDeleteProps {
  children: React.ReactNode;
  onDelete: () => void;
}

// Simplified non-animated swipe delete (uses a reveal button approach)
// A full Gesture Handler swipe can be added later when native modules are stable
export function SwipeToDelete({ children, onDelete }: SwipeToDeleteProps) {
  return (
    <View style={styles.wrapper}>
      {children}
      <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
        <Trash2 size={20} color="#fff" />
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: 'relative' },
  deleteBtn: { position: 'absolute', right: 0, top: 0, bottom: 0, backgroundColor: '#EF4444', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, borderRadius: 8, gap: 4 },
  deleteText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
});
