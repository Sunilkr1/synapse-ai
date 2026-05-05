import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Theme } from '../../constants/theme';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  return (
    <View style={styles.wrapper}>
      {language && (
        <View style={styles.header}>
          <Text style={styles.lang}>{language}</Text>
        </View>
      )}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Text style={styles.code}>{code}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { backgroundColor: '#0D1117', borderRadius: 10, overflow: 'hidden', marginVertical: 8 },
  header: { backgroundColor: '#1C2128', paddingHorizontal: 12, paddingVertical: 6 },
  lang: { color: '#8B949E', fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  code: { fontFamily: 'monospace', color: '#E6EDF3', fontSize: 13, lineHeight: 20, padding: 12 },
});
