import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Theme } from '../../constants/theme';

interface PersonaFormProps {
  onSave: (name: string, role: string, description: string, systemPrompt: string) => void;
  onCancel: () => void;
}

export function PersonaForm({ onSave, onCancel }: PersonaFormProps) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [description, setDescription] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');

  const handleSave = () => {
    if (!name || !systemPrompt) return;
    onSave(name, role, description, systemPrompt);
  };

  return (
    <ScrollView contentContainerStyle={styles.form}>
      <Text style={styles.heading}>Create Custom Persona</Text>
      {[
        { label: 'Name', value: name, set: setName, placeholder: 'e.g. The Philosopher' },
        { label: 'Role', value: role, set: setRole, placeholder: 'e.g. Thinker' },
        { label: 'Description', value: description, set: setDescription, placeholder: 'Short description...' },
      ].map(f => (
        <View key={f.label}>
          <Text style={styles.label}>{f.label}</Text>
          <TextInput style={styles.input} value={f.value} onChangeText={f.set} placeholder={f.placeholder} placeholderTextColor={Theme.colors.dark.textSecondary} />
        </View>
      ))}
      <Text style={styles.label}>System Prompt *</Text>
      <TextInput style={[styles.input, styles.big]} value={systemPrompt} onChangeText={setSystemPrompt} placeholder="You are an AI that..." placeholderTextColor={Theme.colors.dark.textSecondary} multiline />
      <View style={styles.row}>
        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}><Text style={styles.cancelText}>Cancel</Text></TouchableOpacity>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}><Text style={styles.saveText}>Save</Text></TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  form: { padding: 16 },
  heading: { fontSize: 22, fontWeight: 'bold', color: Theme.colors.dark.text, marginBottom: 20 },
  label: { color: Theme.colors.dark.textSecondary, fontSize: 13, fontWeight: '600', marginBottom: 6, textTransform: 'uppercase' },
  input: { backgroundColor: Theme.colors.dark.surface, color: Theme.colors.dark.text, borderRadius: 10, padding: 12, marginBottom: 14, borderWidth: 1, borderColor: Theme.colors.dark.border, fontSize: 15 },
  big: { height: 120, textAlignVertical: 'top' },
  row: { flexDirection: 'row', gap: 12, marginTop: 8 },
  cancelBtn: { flex: 1, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: Theme.colors.dark.border, alignItems: 'center' },
  cancelText: { color: Theme.colors.dark.text, fontWeight: 'bold' },
  saveBtn: { flex: 1, padding: 14, borderRadius: 12, backgroundColor: Theme.colors.dark.text, alignItems: 'center' },
  saveText: { color: Theme.colors.dark.background, fontWeight: 'bold' },
});
