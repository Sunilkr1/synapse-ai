import { supabase } from './client';
import { UsageStats } from '../../types';

export const SupabaseStats = {
  getStats: async (userId: string): Promise<UsageStats | null> => {
    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (error) { console.error('Supabase get stats error:', error); return null; }
    return data as UsageStats;
  },

  incrementMessages: async (userId: string) => {
    await supabase.rpc('increment_message_count', { uid: userId });
  },
};
