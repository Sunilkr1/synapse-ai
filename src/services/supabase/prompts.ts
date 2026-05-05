import { supabase } from './client';
import { Prompt } from '../../types';

export const SupabasePrompts = {
  getPublicPrompts: async (): Promise<Prompt[]> => {
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('is_public', true);
    if (error) { console.error('Supabase prompts error:', error); return []; }
    return data as Prompt[];
  },
};
