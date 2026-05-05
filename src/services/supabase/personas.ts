import { supabase } from './client';

export interface CustomPersona {
  id: string;
  user_id: string;
  name: string;
  role: string;
  system_prompt: string;
  color?: string;
  is_public: boolean;
  created_at: string;
}

export const PersonaService = {
  /**
   * Fetch all custom personas for the current user.
   */
  async getUserPersonas(userId: string): Promise<CustomPersona[]> {
    const { data, error } = await supabase
      .from('personas')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching personas:', error);
      return [];
    }
    return data || [];
  },

  /**
   * Save or update a custom persona.
   */
  async savePersona(userId: string, persona: Partial<CustomPersona>) {
    const { data, error } = await supabase
      .from('personas')
      .upsert({
        user_id: userId,
        ...persona,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving persona:', error);
      return { success: false, error };
    }
    return { success: true, data };
  },

  /**
   * Delete a custom persona.
   */
  async deletePersona(personaId: string) {
    const { error } = await supabase
      .from('personas')
      .delete()
      .eq('id', personaId);

    if (error) {
      console.error('Error deleting persona:', error);
      return { success: false, error };
    }
    return { success: true };
  }
};
