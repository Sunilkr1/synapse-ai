import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  TextInput, Alert, KeyboardAvoidingView, Platform, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Send, CheckCircle, AlertCircle } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useAuthStore } from '../../src/stores/authStore';
import { BugReportService } from '../../src/services/supabase/bugReports';

const CATEGORIES = ['Chat', 'Compare', 'API Keys', 'UI/Design', 'Notifications', 'App Crash', 'Other'];
const SEVERITIES = [
  { label: 'Low', value: 'low', color: '#10B981' },
  { label: 'Medium', value: 'medium', color: '#F59E0B' },
  { label: 'High', value: 'high', color: '#EF4444' },
  { label: 'Critical', value: 'critical', color: '#8B5CF6' },
];

export default function BugReportScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const session = useAuthStore(s => s.session);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form State
  const [category, setCategory] = useState('Chat');
  const [severity, setSeverity] = useState('low');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState('');
  const [expected, setExpected] = useState('');
  const [actual, setActual] = useState('');
  const [email, setEmail] = useState(session?.user?.email || '');

  const handleSubmit = async () => {
    if (!title || !description) {
      Alert.alert('Missing Fields', 'Please provide at least a title and description.');
      return;
    }

    if (!session?.user?.id) {
      Alert.alert('Error', 'You must be logged in to report a bug.');
      return;
    }

    setLoading(true);
    try {
      const res = await BugReportService.submitReport(session.user.id, {
        category,
        severity,
        title,
        description,
        steps_to_reproduce: steps,
        expected_behavior: expected,
        actual_behavior: actual,
        email
      });

      if (res.success) {
        setSubmitted(true);
      } else {
        Alert.alert('Error', 'Failed to submit report. Please try again.');
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <SafeAreaView style={styles.successContent}>
          <CheckCircle size={80} color={colors.accent} />
          <Text style={[styles.successTitle, { color: colors.text }]}>Report Submitted!</Text>
          <Text style={[styles.successSubtitle, { color: colors.textSecondary }]}>
            Thank you for helping us improve Synapse AI. Our team will look into this shortly.
          </Text>
          <TouchableOpacity 
            style={[styles.backHomeBtn, { backgroundColor: colors.accent }]}
            onPress={() => router.replace('/(tabs)/settings')}
          >
            <Text style={styles.backHomeBtnText}>Back to Settings</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ChevronLeft size={24} color={colors.text} />
            </TouchableOpacity>
            <View>
              <Text style={[styles.title, { color: colors.text }]}>Report a Bug</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Help us squash those bugs 🐛</Text>
            </View>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Category Section */}
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>What is the issue related to?</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {CATEGORIES.map(cat => (
                <TouchableOpacity 
                  key={cat}
                  onPress={() => setCategory(cat)}
                  style={[
                    styles.categoryChip, 
                    { backgroundColor: category === cat ? colors.accent : colors.surface, borderColor: colors.border }
                  ]}
                >
                  <Text style={[styles.categoryText, { color: category === cat ? '#fff' : colors.text }]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Severity Section */}
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Severity Level</Text>
            <View style={styles.severityRow}>
              {SEVERITIES.map(sev => (
                <TouchableOpacity 
                  key={sev.value}
                  onPress={() => setSeverity(sev.value)}
                  style={[
                    styles.severityBtn, 
                    { 
                      borderColor: severity === sev.value ? sev.color : colors.border,
                      backgroundColor: severity === sev.value ? sev.color + '15' : colors.surface
                    }
                  ]}
                >
                  <View style={[styles.dot, { backgroundColor: sev.color }]} />
                  <Text style={[styles.severityText, { color: severity === sev.value ? sev.color : colors.textSecondary }]}>
                    {sev.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Inputs */}
            <View style={styles.form}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Bug Title</Text>
              <TextInput 
                style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                placeholder="e.g. Chat history not loading"
                placeholderTextColor={colors.textSecondary + '80'}
                value={title}
                onChangeText={setTitle}
              />

              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Detailed Description</Text>
              <TextInput 
                style={[styles.input, styles.textArea, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                placeholder="Tell us exactly what happened..."
                placeholderTextColor={colors.textSecondary + '80'}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={description}
                onChangeText={setDescription}
              />

              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Steps to Reproduce</Text>
              <TextInput 
                style={[styles.input, styles.textArea, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                placeholder="1. Open settings&#10;2. Click on..."
                placeholderTextColor={colors.textSecondary + '80'}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                value={steps}
                onChangeText={setSteps}
              />

              <View style={styles.sideBySide}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Expected</Text>
                  <TextInput 
                    style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                    placeholder="What should happen?"
                    placeholderTextColor={colors.textSecondary + '80'}
                    value={expected}
                    onChangeText={setExpected}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Actual</Text>
                  <TextInput 
                    style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                    placeholder="What happened?"
                    placeholderTextColor={colors.textSecondary + '80'}
                    value={actual}
                    onChangeText={setActual}
                  />
                </View>
              </View>

              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Contact Email (Optional)</Text>
              <TextInput 
                style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                placeholder="email@example.com"
                placeholderTextColor={colors.textSecondary + '80'}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity 
              style={[styles.submitBtn, { backgroundColor: colors.accent }]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Send size={18} color="#fff" />
                  <Text style={styles.submitBtnText}>Submit Bug Report</Text>
                </>
              )}
            </TouchableOpacity>
            
            <Text style={[styles.disclaimer, { color: colors.textSecondary }]}>
              Device logs and system version will be automatically attached to this report.
            </Text>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16, 
    borderBottomWidth: 1,
  },
  backButton: { marginRight: 16 },
  title: { fontSize: 18, fontWeight: '800' },
  subtitle: { fontSize: 13 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  sectionLabel: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginTop: 8 },
  categoryScroll: { flexDirection: 'row', marginBottom: 20 },
  categoryChip: { 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 12, 
    marginRight: 8, 
    borderWidth: 1 
  },
  categoryText: { fontSize: 14, fontWeight: '600' },
  severityRow: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  severityBtn: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 10, 
    borderRadius: 12, 
    borderWidth: 1,
    gap: 6
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  severityText: { fontSize: 12, fontWeight: '700' },
  form: { gap: 16 },
  inputLabel: { fontSize: 13, fontWeight: '600', marginBottom: 6 },
  input: { 
    borderRadius: 12, 
    paddingHorizontal: 16, 
    paddingVertical: 12, 
    fontSize: 15, 
    borderWidth: 1 
  },
  textArea: { minHeight: 80 },
  sideBySide: { flexDirection: 'row' },
  submitBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    height: 56, 
    borderRadius: 16, 
    marginTop: 32,
    gap: 10
  },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  disclaimer: { textAlign: 'center', fontSize: 11, marginTop: 16, opacity: 0.6 },
  successContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  successTitle: { fontSize: 24, fontWeight: '800', marginTop: 24, marginBottom: 12 },
  successSubtitle: { fontSize: 16, textAlign: 'center', lineHeight: 24, marginBottom: 32 },
  backHomeBtn: { paddingHorizontal: 32, paddingVertical: 16, borderRadius: 16 },
  backHomeBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' }
});
