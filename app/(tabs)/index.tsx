import React, { useState, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Alert, TouchableOpacity, Text, ScrollView, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageList } from '../../src/components/chat/MessageList';
import { ChatInput } from '../../src/components/chat/ChatInput';
import { TypingIndicator } from '../../src/components/chat/TypingIndicator';
import { useChatStore } from '../../src/stores/chatStore';
import { useApiKeys } from '../../src/hooks/useApiKeys';
import { aiRouter } from '../../src/services/ai/aiRouter';
import { ModelPicker } from '../../src/components/models/ModelPicker';
import { ModelBadge } from '../../src/components/models/ModelBadge';
import { ProGuardModal } from '../../src/components/ui/ProGuardModal';
import { BUILT_IN_PERSONAS } from '../../src/constants/personas';
import { ChevronDown, Zap, User as UserIcon, Settings, Plus, Sparkles, Key, Bell } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useRouter } from 'expo-router';
import { useNotificationStore } from '../../src/stores/notificationStore';
import { Database } from '../../src/services/storage/database';

export default function ChatScreen() {
  const { colors, theme } = useTheme();
  const router = useRouter();
  const { messages, addMessage, activeModel, setActiveModel, activePersonaId, clearChat } = useChatStore();
  const unreadCount = useNotificationStore(s => s.getUnreadCount());
  const { keys } = useApiKeys();
  const [isTyping, setIsTyping] = useState(false);
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isProModalVisible, setProModalVisible] = useState(false);

  const isModelLocked = (model: any) => !model.isFree && (!keys[model.provider] || keys[model.provider] === '');

  useEffect(() => {
    const showSub = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => setKeyboardVisible(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const activePersona = BUILT_IN_PERSONAS.find(p => p.id === activePersonaId) || BUILT_IN_PERSONAS[0];

  const handleSend = async (text: string, imageUri?: string) => {
    if (!text.trim() && !imageUri) return;

    if (isModelLocked(activeModel)) {
      setProModalVisible(true);
      return;
    }

    let currentSessionId = useChatStore.getState().activeSessionId;
    let isNewSession = false;
    
    if (!currentSessionId) {
      currentSessionId = Math.random().toString(36).substring(7);
      useChatStore.getState().setActiveSession(currentSessionId);
      isNewSession = true;
    }

    addMessage({ 
      role: 'user', 
      content: text, 
      imageUri: imageUri 
    });
    setIsTyping(true);

    // Save session immediately so it appears in history
    const saveCurrentSession = async (aiReply?: string) => {
      const state = useChatStore.getState();
      const currentMessages = state.messages;
      if (currentMessages.length === 0) return;
      
      const title = currentMessages[0].content.substring(0, 40) + (currentMessages[0].content.length > 40 ? '...' : '') || 'New Conversation';
      
      await Database.saveChat({
        id: currentSessionId!,
        title,
        model: activeModel.name,
        date: Date.now(),
        preview: aiReply ? aiReply.substring(0, 100) : currentMessages[currentMessages.length - 1].content.substring(0, 100),
        messages: currentMessages,
      });
    };

    await saveCurrentSession();

    try {
      const provider = activeModel.provider;
      let apiKey = keys[provider];

      // Fallback to default developer API keys if user hasn't set their own
      if (!apiKey) {
        if (provider === 'gemini') apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
        else if (provider === 'openai') apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY || '';
        else if (provider === 'anthropic') apiKey = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY || '';
        else if (provider === 'groq') apiKey = process.env.EXPO_PUBLIC_GROQ_API_KEY || '';
        else if (provider === 'mistral') apiKey = process.env.EXPO_PUBLIC_MISTRAL_API_KEY || '';
        else if (provider === 'deepseek') apiKey = process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY || '';
      }

      if (!apiKey) {
        throw new Error(`Missing API Key for ${provider.toUpperCase()}. Please add your own key in Settings to continue chatting.`);
      }

      let imageBase64: string | undefined;
      let mimeType: string | undefined;

      if (imageUri) {
        const FileSystem = require('expo-file-system');
        imageBase64 = await FileSystem.readAsStringAsync(imageUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        const extension = imageUri.split('.').pop()?.toLowerCase();
        mimeType = extension === 'png' ? 'image/png' : 'image/jpeg';
      }

      const fullHistory = [
        { id: 'sys', role: 'system' as const, content: activePersona.systemPrompt },
        ...messages.slice(-10),
        { id: 'user-now', role: 'user' as const, content: text }
      ];

      const response = await aiRouter.generateResponse(
        provider,
        activeModel.name,
        fullHistory,
        apiKey,
        imageBase64,
        mimeType
      );

      addMessage({ 
        role: 'assistant', 
        content: response,
        model: activeModel.id 
      });
      
      // Update session with AI response
      await saveCurrentSession(response);

    } catch (error: any) {
      const errorMsg = `**Error:** ${error.message}`;
      addMessage({ 
        role: 'assistant', 
        content: errorMsg 
      });
      await saveCurrentSession(errorMsg);
    } finally {
      setIsTyping(false);
    }
  };

  const handleNewChat = () => {
    useChatStore.getState().setActiveSession(null);
    clearChat();
  };


  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        {/* Custom Premium Header */}
        <View style={[styles.premiumHeader, { borderBottomColor: colors.border }]}>
          <View style={styles.headerTopRow}>
            <View style={styles.logoContainer}>
              <View style={[styles.logoIcon, { backgroundColor: colors.accent }]}>
                <Sparkles size={16} color="#FFFFFF" />
              </View>
              <Text style={[styles.logoText, { color: colors.text }]}>Synapse</Text>
            </View>
            
            <View style={styles.headerActions}>
              <TouchableOpacity style={[styles.iconAction, { backgroundColor: colors.surface }]} onPress={() => router.push('/notifications')}>
                <Bell size={20} color={colors.text} />
                {unreadCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity style={[styles.newChatButton, { backgroundColor: colors.accent }]} onPress={handleNewChat}>
                <Plus size={16} color="#FFFFFF" />
                <Text style={styles.newChatText}>New</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.iconAction, { backgroundColor: colors.surface }]} onPress={() => router.push('/settings')}>
                <Settings size={20} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.headerBottomRow}>
            <TouchableOpacity 
              style={[
                styles.modelSelector, 
                { 
                  backgroundColor: colors.surface, 
                  borderColor: isModelLocked(activeModel) ? '#FF9500' : colors.border 
                }
              ]} 
              onPress={() => setPickerVisible(true)}
              activeOpacity={0.7}
            >
              <ModelBadge provider={activeModel.provider} size="sm" />
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={[styles.modelName, { color: colors.text }]}>{activeModel.displayName}</Text>
                {isModelLocked(activeModel) && <Key size={12} color="#FF9500" />}
              </View>
              <ChevronDown size={14} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.personaSelector, { backgroundColor: activePersona.color + '15' }]}>
               <View style={[styles.personaIndicator, { backgroundColor: activePersona.color }]}>
                 <UserIcon size={12} color="#FFFFFF" />
               </View>
               <Text style={[styles.personaLabel, { color: activePersona.color }]}>{activePersona.name}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <KeyboardAvoidingView 
          style={{ flex: 1 }} 
          behavior="padding"
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          {/* Messages List */}
          <View style={styles.chatArea}>
            {messages.length === 0 ? (
              <View style={styles.emptyState}>
                <View style={[styles.sparkleCircle, { backgroundColor: colors.accent + '10' }]}>
                  <Zap size={40} color={colors.accent} />
                </View>
                <Text style={[styles.emptyTitle, { color: colors.text }]}>Synapse AI</Text>
                <Text style={[styles.emptySub, { color: colors.textSecondary }]}>
                  I'm your {activePersona.role}. How can I help you today?
                </Text>
              </View>
            ) : (
              <MessageList messages={messages} />
            )}
            {isTyping && <TypingIndicator />}
          </View>

          {/* Input area */}
          <ChatInput 
            onSend={handleSend} 
            disabled={isTyping} 
            requiresKey={!activeModel.isFree && !keys[activeModel.provider]}
            onSetupKey={() => setProModalVisible(true)}
          />

          {/* Model Selection Sheet */}
          <ModelPicker 
            visible={isPickerVisible} 
            onClose={() => setPickerVisible(false)} 
            selectedModelId={activeModel.id}
            onSelect={(model) => {
              setPickerVisible(false);
              
              // PRO model: show guard modal and do NOT select yet
              if (!model.isFree) {
                setProModalVisible(true);
                return;
              }
              
              // Free model: select immediately
              setActiveModel(model);
            }}
          />

          {/* Premium Pro Guard Modal */}
          <ProGuardModal
            visible={isProModalVisible}
            modelName={activeModel.displayName}
            onClose={() => setProModalVisible(false)}
            onSetup={() => {
              setProModalVisible(false);
              router.push('/settings');
            }}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  premiumHeader: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconAction: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
  },
  newChatText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  headerBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modelSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  modelName: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  personaSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  personaIndicator: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  personaLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  chatArea: { flex: 1 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  sparkleCircle: { 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  emptyTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  emptySub: { fontSize: 16, textAlign: 'center', lineHeight: 24 },
  badge: {
    position: 'absolute',
    top: 6,
    right: 8,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#000',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: 'bold',
    paddingHorizontal: 3,
  }
});
