import { supabase } from './client';

export const SystemConfigService = {
  async getMasterKey(provider: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('system_config')
        .select('key_value')
        .eq('key_name', `${provider}_master_key`)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error(`Error fetching master key for ${provider}:`, error.message);
        return null;
      }

      return data?.key_value || null;
    } catch (err) {
      console.error('SystemConfigService error:', err);
      return null;
    }
  },

  async isProUser(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_pro')
        .eq('id', userId)
        .single();

      return data?.is_pro || false;
    } catch {
      return false;
    }
  }
};
