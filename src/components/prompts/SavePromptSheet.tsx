import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Theme } from '../../constants/theme';
import { Sheet } from '../ui/Sheet';

interface SavePromptSheetProps {
  visible: boolean;
  onClose: () => void;
  onSave: (title: string, content: string) => void;
}

export function SavePromptSheet({ visible, onClose, onSave }: SavePromptSheetProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;
    onSave(title, content);
    setTitle('');
    setContent('');
    onClose();
  };

  return (
    <Sheet visible={visible} onClose={onClose}>
      <Text style={styles.heading}>Save Prompt</Text>
      <TextInput style={styles.input} placeholder="Title" placeholderTextColor={Theme.colors.dark.textSecondary} value={title} onChangeText={setTitle} />
      <TextInput style={[styles.input, styles.multiline]} placeholder="Prompt content..." placeholderTextColor={Theme.colors.dark.textSecondary} value={content} onChangeText={setContent} multiline numberOfLines={4} />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.btnText}>Save Prompt</Text>
      </TouchableOpacity>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 20, fontWeight: 'bold', color: Theme.colors.dark.text, marginBottom: 20 },
  input: { backgroundColor: Theme.colors.dark.background, color: Theme.colors.dark.text, borderRadius: 10, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: Theme.colors.dark.border, fontSize: 15 },
  multiline: { height: 100, textAlignVertical: 'top' },
  button: { backgroundColor: Theme.colors.dark.text, padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 4 },
  btnText: { color: Theme.colors.dark.background, fontWeight: 'bold', fontSize: 16 },
});
