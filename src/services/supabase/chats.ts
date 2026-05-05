import { supabase } from './client';
import { ChatSession, ChatMessage } from '../../types';

export const SupabaseChats = {
  /**
   * Saves a chat and all its messages to Supabase.
   */
  saveChatSync: async (session: ChatSession, userId: string) => {
    // 1. Upsert the chat session
    const { error: chatError } = await supabase.from('chats').upsert({
      id: session.id,
      user_id: userId,
      title: session.title,
      model: session.model,
      preview: session.preview,
      updated_at: new Date().toISOString(),
    });

    if (chatError) {
      console.error('Supabase save chat error:', chatError);
      return;
    }

    // 2. Sync messages (Delete old ones and re-insert for simplicity in this version, 
    // or use upsert if message IDs are stable)
    // NOTE: For high performance, you'd only sync new messages.
    if (session.messages.length > 0) {
      const formattedMessages = session.messages.map(m => ({
        chat_id: session.id,
        role: m.role,
        content: m.content,
        created_at: new Date(m.createdAt || Date.now()).toISOString(),
      }));

      // For simplicity, we clear and re-insert messages for the session
      // (This is okay for small chats, but for production consider incremental sync)
      await supabase.from('messages').delete().eq('chat_id', session.id);
      const { error: msgError } = await supabase.from('messages').insert(formattedMessages);
      
      if (msgError) console.error('Supabase messages sync error:', msgError);
    }
  },

  getAllChats: async (userId: string): Promise<ChatSession[]> => {
    const { data, error } = await supabase
      .from('chats')
      .select('*, messages(*)')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Supabase get chats error:', error);
      return [];
    }

    return (data ?? []).map(d => ({
      id: d.id,
      title: d.title,
      model: d.model,
      date: new Date(d.updated_at).getTime(),
      preview: d.preview,
      messages: (d.messages ?? []).map((m: any) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        createdAt: new Date(m.created_at).getTime(),
      })),
    }));
  },

  deleteChat: async (chatId: string) => {
    const { error } = await supabase.from('chats').delete().eq('id', chatId);
    if (error) console.error('Supabase delete chat error:', error);
  },
};
