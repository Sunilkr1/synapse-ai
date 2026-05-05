// GoogleAuth — placeholder for future OAuth Google Sign-In integration.
// Currently the app uses Supabase Email/Password auth.
// To enable Google OAuth: configure a Google Cloud project, add the redirect URI to Supabase,
// and call supabase.auth.signInWithOAuth({ provider: 'google' }).

import { supabase } from '../../src/services/supabase/client';

export const GoogleAuth = {
  signIn: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) throw error;
    return data;
  },
};
