export const ROUTES = {
  AUTH: {
    LOGIN: '/(auth)/login',
    ONBOARDING: '/(auth)/onboarding',
  },
  TABS: {
    HOME: '/(tabs)/',
    COMPARE: '/(tabs)/compare',
    HISTORY: '/(tabs)/history',
    SETTINGS: '/(tabs)/settings',
  },
  CHAT: (id: string) => `/chat/${id}`,
  COMPARE_SESSION: (id: string) => `/compare/${id}`,
  MODELS: '/models',
  PROMPTS: '/prompts',
  PERSONAS: '/personas',
  KEYS: '/keys',
  STATS: '/stats',
  PROFILE: '/profile',
} as const;

export type AppRoutes = typeof ROUTES;
