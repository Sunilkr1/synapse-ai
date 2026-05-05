import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Theme } from '../../constants/theme';
import { FileAttachment } from '../../utils/fileHandler';
import { FileText } from 'lucide-react-native';

interface AttachmentPreviewProps {
  attachment: FileAttachment;
}

export function AttachmentPreview({ attachment }: AttachmentPreviewProps) {
  const isImage = attachment.type.startsWith('image/');

  return (
    <View style={styles.container}>
      {isImage ? (
        <Image source={{ uri: attachment.uri }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.filePlaceholder}>
          <FileText size={24} color={Theme.colors.dark.accent} />
          <Text style={styles.fileName} numberOfLines={1}>{attachment.name}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 8, marginHorizontal: 16, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: Theme.colors.dark.border },
  image: { width: '100%', height: 180 },
  filePlaceholder: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 10, backgroundColor: Theme.colors.dark.surface },
  fileName: { color: Theme.colors.dark.text, flex: 1, fontSize: 14 },
});
