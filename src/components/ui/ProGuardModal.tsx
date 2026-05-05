import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Key, ChevronRight, X } from 'lucide-react-native';
import { useTheme } from '../../hooks/useTheme';

interface ProGuardModalProps {
  visible: boolean;
  onClose: () => void;
  onSetup: () => void;
  modelName: string;
}

export function ProGuardModal({ visible, onClose, onSetup, modelName }: ProGuardModalProps) {
  const { colors } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.content, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {/* Header Icon */}
          <View style={[styles.iconCircle, { backgroundColor: '#FF950020' }]}>
            <Key size={32} color="#FF9500" />
          </View>

          {/* Text Content */}
          <Text style={[styles.title, { color: colors.text }]}>PRO Model Required</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            The model <Text style={{ fontWeight: 'bold', color: colors.text }}>{modelName}</Text> requires your personal API key to function.
          </Text>

          {/* Features list */}
          <View style={styles.features}>
            <View style={styles.featureItem}>
              <View style={[styles.dot, { backgroundColor: colors.accent }]} />
              <Text style={[styles.featureText, { color: colors.textSecondary }]}>Unlimited high-reasoning tokens</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={[styles.dot, { backgroundColor: colors.accent }]} />
              <Text style={[styles.featureText, { color: colors.textSecondary }]}>Direct provider access</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <TouchableOpacity 
            style={[styles.primaryBtn, { backgroundColor: colors.accent }]} 
            onPress={onSetup}
            activeOpacity={0.8}
          >
            <Key size={18} color="#fff" />
            <Text style={styles.primaryBtnText}>Setup API Key</Text>
            <ChevronRight size={18} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryBtn} onPress={onClose}>
            <Text style={[styles.secondaryBtnText, { color: colors.textSecondary }]}>Maybe Later</Text>
          </TouchableOpacity>

          {/* Close X */}
          <TouchableOpacity style={styles.closeX} onPress={onClose}>
            <X size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    width: '100%',
    borderRadius: 32,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    position: 'relative',
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  features: {
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    gap: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  featureText: {
    fontSize: 13,
    fontWeight: '500',
  },
  primaryBtn: {
    width: '100%',
    flexDirection: 'row',
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    marginLeft: 18,
  },
  secondaryBtn: {
    paddingVertical: 12,
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  closeX: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 4,
  }
});
