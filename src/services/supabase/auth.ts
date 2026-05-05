import { supabase } from './client';
import * as AuthSession from 'expo-auth-session';

export const AuthService = {
  async signInWithGoogle() {
    try {
      // In a real app, you would use expo-auth-session here
      // For now, we mock the success for development
      console.log('Initiating Google Sign-In...');
      return { success: true, user: { id: '1', email: 'user@example.com', name: 'Synapse User' } };
    } catch (error) {
      console.error('Sign-In Error:', error);
      return { success: false, error };
    }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { success: !error, error };
  },

  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  }
};
