import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '../../constants/theme';
import { CodeBlock } from './CodeBlock';

interface MarkdownRendererProps {
  content: string;
}

// Simple markdown-to-RN renderer for bold, code blocks, and paragraphs
export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Split by code block markers
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <View>
      {parts.map((part, i) => {
        if (part.startsWith('```')) {
          const lines = part.replace(/```/g, '').trim().split('\n');
          const lang = lines[0] && !lines[0].includes(' ') ? lines[0] : undefined;
          const code = lang ? lines.slice(1).join('\n') : lines.join('\n');
          return <CodeBlock key={i} code={code} language={lang} />;
        }

        // Render inline bold and plain text
        const segments = part.split(/(\*\*.*?\*\*)/g);
        return (
          <Text key={i} style={styles.text}>
            {segments.map((seg, j) =>
              seg.startsWith('**') ? (
                <Text key={j} style={styles.bold}>{seg.replace(/\*\*/g, '')}</Text>
              ) : (
                <Text key={j}>{seg}</Text>
              )
            )}
          </Text>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  text: { color: Theme.colors.dark.text, fontSize: 15, lineHeight: 22 },
  bold: { fontWeight: 'bold' },
});
