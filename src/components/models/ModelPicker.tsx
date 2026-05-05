import React from 'react';
import { Modal, View, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { ALL_MODELS } from '../../constants/models';
import { AIModel } from '../../types';
import { X } from 'lucide-react-native';

interface ModelPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (model: AIModel) => void;
  selectedModelId?: string;
}

export function ModelPicker({ visible, onClose, onSelect, selectedModelId }: ModelPickerProps) {
  const { colors, theme } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={[styles.overlay, { backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)' }]}>
        <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Choose Model</Text>
            <TouchableOpacity onPress={onClose}><X size={24} color={colors.text} /></TouchableOpacity>
          </View>
          <FlatList
            data={ALL_MODELS}
            keyExtractor={m => m.id}
            renderItem={({ item }) => {
              const isSelected = item.id === selectedModelId;
              return (
                <TouchableOpacity 
                  style={[
                    styles.item, 
                    { borderBottomColor: colors.border },
                    isSelected && { backgroundColor: colors.accent + '15', borderColor: colors.accent, borderWidth: 1, borderRadius: 12 }
                  ]} 
                  onPress={() => { onSelect(item); onClose(); }}
                >
                  <View style={styles.itemHeader}>
                    <Text style={[styles.name, { color: colors.text }]}>{item.displayName}</Text>
                    <View style={[
                      styles.badge, 
                      { backgroundColor: item.isFree ? colors.accent + '20' : '#FF950020' }
                    ]}>
                      <Text style={[
                        styles.badgeText, 
                        { color: item.isFree ? colors.accent : '#FF9500' }
                      ]}>
                        {item.isFree ? 'FREE' : 'PRO'}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.provider, { color: colors.textSecondary }]}>{item.provider}</Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '70%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 20, fontWeight: 'bold' },
  item: { paddingVertical: 14, borderBottomWidth: 1, paddingHorizontal: 12 },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  badgeText: { fontSize: 10, fontWeight: '800' },
  name: { fontSize: 16, fontWeight: '600' },
  provider: { fontSize: 13, marginTop: 2, textTransform: 'uppercase' },
});
