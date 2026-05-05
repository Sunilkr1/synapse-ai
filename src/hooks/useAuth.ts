import { useAuthStore } from '../stores/authStore';
import { AuthService } from '../services/supabase/auth';
import { useRouter } from 'expo-router';

export const useAuth = () => {
  const { user, session, initialized, signOut } = useAuthStore();
  const router = useRouter();

  const signIn = async () => {
    // This should call your actual sign in logic, for now it's handled in login.tsx
    return true;
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/login');
  };

  return {
    user,
    session,
    isLoggedIn: !!session,
    isLoading: !initialized,
    signIn,
    signOut: handleSignOut,
  };
};
