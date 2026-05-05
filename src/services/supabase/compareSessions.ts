import { supabase } from './client';
import { CompareResult } from '../../types';

export const SupabaseCompareSessions = {
  saveSession: async (session: CompareResult, userId: string) => {
    const { error } = await supabase.from('compare_sessions').upsert({
      id: session.id,
      user_id: userId,
      prompt: session.prompt,
      model_a: session.modelA,
      model_b: session.modelB,
      response_a: session.responseA,
      response_b: session.responseB,
      winner: session.winner,
      created_at: new Date(session.createdAt).toISOString(),
    });
    if (error) console.error('Supabase save compare error:', error);
  },

  getAllSessions: async (userId: string): Promise<CompareResult[]> => {
    const { data, error } = await supabase
      .from('compare_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) { console.error('Supabase get compare sessions error:', error); return []; }
    return (data ?? []).map(d => ({
      id: d.id, prompt: d.prompt, modelA: d.model_a, modelB: d.model_b,
      responseA: d.response_a, responseB: d.response_b,
      winner: d.winner, createdAt: new Date(d.created_at).getTime(),
    }));
  },
};
