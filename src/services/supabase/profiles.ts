import { supabase } from './client';

export interface UserProfile {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  accent_color?: string;
  theme?: string;
  push_token?: string;
}

export const ProfileService = {
  async getProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.error('Error fetching profile:', error);
      }
      return null;
    }
    return data;
  },

  async updateProfile(userId: string, updates: Partial<UserProfile>) {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        ...updates,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error updating profile:', error);
      return { success: false, error };
    }
    return { success: true };
  },

  async deleteAccount(userId: string) {
    // This will trigger cascading deletes for chats, messages, personas, etc.
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) throw error;
    
    // Also sign out locally
    await supabase.auth.signOut();
    return true;
  }
};
