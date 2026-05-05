import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  ChevronLeft, MessageSquare, AlertCircle, Mail, Info,
  ChevronDown, X, ExternalLink 
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';

const FAQS = [
  {
    question: "How do I add my own API Key?",
    answer: "Go to Settings > API Key Manager. You can paste your Gemini, Groq, or OpenRouter keys there. Once saved, the app will use your personal quota."
  },
  {
    question: "Is my data private?",
    answer: "Yes! Your API keys are stored locally on your device (or securely in your private Supabase vault). We do not sell or track your personal chat data."
  },
  {
    question: "Why am I seeing a 'Locked' icon?",
    answer: "Some premium models (like Gemini Pro) require a personal API key to maintain high performance. You can unlock them by adding your key in Settings."
  },
  {
    question: "How does Cloud Sync work?",
    answer: "If you are logged in, your chats and settings are automatically backed up to Supabase. You can access them from any device by signing in."
  }
];

export default function HelpScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const handleSupportEmail = (subject: string) => {
    const email = 'support@synapse-ai.app';
    const body = `Device: ${Platform.OS}\nVersion: 1.0.0\n\nDescribe your issue here...`;
    Linking.openURL(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Help & Support</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {/* Support Actions */}
          <View style={styles.actionRow}>
            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => router.push('/help/report')}
            >
              <View style={[styles.iconBox, { backgroundColor: '#EF444420' }]}>
                <AlertCircle size={24} color="#EF4444" />
              </View>
              <Text style={[styles.actionLabel, { color: colors.text }]}>Report Bug</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => handleSupportEmail('Support Request - Synapse AI')}
            >
              <View style={[styles.iconBox, { backgroundColor: colors.accent + '20' }]}>
                <Mail size={24} color={colors.accent} />
              </View>
              <Text style={[styles.actionLabel, { color: colors.text }]}>Contact Us</Text>
            </TouchableOpacity>
          </View>

          {/* FAQ Section */}
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Frequently Asked Questions</Text>
          
          {FAQS.map((faq, index) => (
            <TouchableOpacity 
              key={index}
              style={[styles.faqCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
              activeOpacity={0.7}
              onPress={() => setExpandedIndex(expandedIndex === index ? null : index)}
            >
              <View style={styles.faqHeader}>
                <Text style={[styles.faqQuestion, { color: colors.text }]}>{faq.question}</Text>
                {expandedIndex === index ? 
                  <X size={20} color={colors.textSecondary} /> : 
                  <ChevronDown size={20} color={colors.textSecondary} />
                }
              </View>
              {expandedIndex === index && (
                <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>{faq.answer}</Text>
              )}
            </TouchableOpacity>
          ))}

          {/* Community Links */}
          <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 24 }]}>Community & Legal</Text>
          <TouchableOpacity 
            style={[styles.legalRow, { borderBottomColor: colors.border }]}
            onPress={() => Linking.openURL('https://synapseai-legal.netlify.app/')}
          >
            <Info size={20} color={colors.textSecondary} />
            <Text style={[styles.legalText, { color: colors.text }]}>Documentation</Text>
            <ExternalLink size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.legalRow}
            onPress={() => Linking.openURL('https://synapseai-legal.netlify.app/')}
          >
            <MessageSquare size={20} color={colors.textSecondary} />
            <Text style={[styles.legalText, { color: colors.text }]}>Terms of Service</Text>
            <ExternalLink size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <Text style={styles.footer}>Synapse AI Hub v1.0.0</Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16, 
    borderBottomWidth: 1 
  },
  backButton: { marginRight: 16 },
  title: { fontSize: 20, fontWeight: 'bold' },
  content: { padding: 16 },
  actionRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  actionCard: { 
    flex: 1, 
    padding: 16, 
    borderRadius: 20, 
    borderWidth: 1, 
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconBox: { 
    width: 50, 
    height: 50, 
    borderRadius: 15, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 10 
  },
  actionLabel: { fontSize: 14, fontWeight: '600' },
  sectionTitle: { 
    fontSize: 12, 
    fontWeight: '800', 
    textTransform: 'uppercase', 
    letterSpacing: 1, 
    marginBottom: 12,
    marginLeft: 4
  },
  faqCard: { 
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 12, 
    borderWidth: 1 
  },
  faqHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  faqQuestion: { fontSize: 16, fontWeight: '600', flex: 1, marginRight: 8 },
  faqAnswer: { fontSize: 14, marginTop: 12, lineHeight: 20 },
  legalRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 16, 
    borderBottomWidth: 1 
  },
  legalText: { flex: 1, fontSize: 16, marginLeft: 12 },
  footer: { 
    textAlign: 'center', 
    marginTop: 40, 
    marginBottom: 20, 
    fontSize: 12, 
    color: '#888' 
  }
});
