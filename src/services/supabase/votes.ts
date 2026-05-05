import { supabase } from './client';

export const SupabaseVotes = {
  castVote: async (compareSessionId: string, userId: string, vote: 'A' | 'B' | 'tie') => {
    const { error } = await supabase.from('votes').upsert({
      compare_session_id: compareSessionId,
      user_id: userId,
      vote,
    });
    if (error) console.error('Supabase vote error:', error);
  },
};
