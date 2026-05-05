import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProviderType, AppSettings } from '../types';
import { ProfileService } from '../services/supabase/profiles';
import { useAuthStore } from './authStore';

interface SettingsStore extends AppSettings {
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  updateSettings: (updates: Partial<AppSettings>) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      _hasHydrated: false,
      theme: 'dark',
      accentColor: '#6366F1',
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      defaultModel: 'gemini' as ProviderType,
      streamingEnabled: false,
      notificationsEnabled: true,
      hapticFeedbackEnabled: true,
      fontSize: 'medium',
      updateSettings: async (updates) => {
        set((state) => ({ ...state, ...updates }));
        
        // Sync to Supabase if logged in
        const session = useAuthStore.getState().session;
        if (session) {
          const { theme, accentColor } = get();
          ProfileService.updateProfile(session.user.id, {
            theme,
            accent_color: accentColor,
          });
        }
      },
    }),
    {
      name: 'synapse-settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
