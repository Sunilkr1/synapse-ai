import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, Image, Text } from 'react-native';
import { Send, Image as ImageIcon, Mic2, X, Square, Plus, Key as KeyIcon } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Theme } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';

interface ChatInputProps {
  onSend: (message: string, imageUri?: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
  requiresKey?: boolean;
  onSetupKey?: () => void;
}

export function ChatInput({ onSend, isLoading, disabled, requiresKey, onSetupKey }: ChatInputProps) {
  const { colors } = useTheme();
  const [message, setMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleSend = () => {
    if (requiresKey) {
      onSetupKey?.();
      return;
    }
    if ((message.trim() || selectedImage) && !isLoading) {
      onSend(message.trim(), selectedImage || undefined);
      setMessage('');
      setSelectedImage(null);
    }
  };

  const handleImagePick = async () => {
    if (requiresKey) {
      onSetupKey?.();
      return;
    }
    
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need access to your photos to use the Vision feature.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
        base64: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error: any) {
      Alert.alert('Image Upload Error', error.message || 'Something went wrong while opening the gallery.');
    }
  };

  const [recording, setRecording] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = async () => {
    if (requiresKey) {
      onSetupKey?.();
      return;
    }
    Alert.alert('Coming Soon', 'Voice recording requires a native app rebuild to support the audio module. It is currently in development.');
  };

  const stopRecording = async () => {
    setIsRecording(false);
    setRecording(null);
  };

  const handleVoicePress = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const hasContent = message.trim().length > 0 || !!selectedImage;

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
      {requiresKey && (
        <View style={[styles.keyWarning, { backgroundColor: colors.accent + '10' }]}>
          <Text style={[styles.keyWarningText, { color: colors.textSecondary }]}>
            This model requires your own API Key.
          </Text>
        </View>
      )}
      {/* Row: Plus | InputBox | SendButton */}
      <View style={styles.row}>
        
        {/* Left: Plus button */}
        <TouchableOpacity 
          style={[styles.outerButton, { backgroundColor: colors.surface, borderColor: colors.border }]} 
          onPress={handleImagePick}
        >
          <Plus size={22} color={colors.text} />
        </TouchableOpacity>

        {/* Middle: Input box */}
        <View style={[
          styles.inputBox, 
          { 
            backgroundColor: colors.surface, 
            borderColor: requiresKey ? colors.accent : colors.border,
            borderWidth: requiresKey ? 1.5 : 1
          }
        ]}>
          {selectedImage && (
            <View style={styles.previewContainer}>
              <Image source={{ uri: selectedImage }} style={[styles.previewImage, { borderColor: colors.border }]} />
              <TouchableOpacity style={[styles.removeImage, { backgroundColor: colors.accent }]} onPress={() => setSelectedImage(null)}>
                <X size={12} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder={requiresKey ? "API Key required..." : "Ask me anything..."}
              placeholderTextColor={colors.textSecondary}
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={2000}
              editable={!requiresKey}
            />
            {/* Mic icon inside box — only when empty */}
            {!hasContent && (
              <TouchableOpacity onPress={handleVoicePress} style={{ marginRight: 4, marginBottom: 8, padding: 4 }}>
                <Mic2 size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Right: Send button */}
        <TouchableOpacity 
          style={[
            styles.sendButton, 
            { 
              backgroundColor: requiresKey ? colors.accent + '20' : (hasContent ? colors.accent : colors.surface), 
              borderColor: requiresKey ? colors.accent : colors.border 
            }
          ]}
          onPress={requiresKey ? onSetupKey : handleSend}
          disabled={(!requiresKey && !hasContent) || isLoading || disabled}
        >
          {requiresKey ? (
            <KeyIcon size={20} color={colors.accent} />
          ) : isLoading ? (
            <Square size={16} color={hasContent ? '#fff' : colors.textSecondary} />
          ) : (
            <Send size={18} color={hasContent ? '#fff' : colors.textSecondary} />
          )}
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'android' ? 16 : 10,
    borderTopWidth: 1,
  },
  keyWarning: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  keyWarningText: {
    fontSize: 12,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  outerButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  inputBox: {
    flex: 1,
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 4,
    minHeight: 44,
    justifyContent: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 120,
    minHeight: 36,
    paddingVertical: 8,
  },
  previewContainer: {
    marginTop: 8,
    marginBottom: 4,
    alignSelf: 'flex-start',
    position: 'relative',
  },
  previewImage: {
    width: 72,
    height: 72,
    borderRadius: 12,
    borderWidth: 1,
  },
  removeImage: {
    position: 'absolute',
    top: -6,
    right: -6,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
});
