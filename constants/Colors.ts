export const Colors = {
  dark: {
    background: '#050505',
    surface: '#121212',
    surfaceSecondary: '#1E1E1E',
    border: '#2A2A2A',
    accent: '#6366F1', // Indigo
    accentSecondary: '#8B5CF6', // Violet
    text: '#FFFFFF',
    textSecondary: '#A1A1AA',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
  },
  light: {
    background: '#FFFFFF',
    surface: '#F4F4F5',
    surfaceSecondary: '#E4E4E7',
    border: '#D4D4D8',
    accent: '#4F46E5',
    accentSecondary: '#7C3AED',
    text: '#09090B',
    textSecondary: '#71717A',
    error: '#DC2626',
    success: '#059669',
    warning: '#D97706',
  }
};

export type ThemeColors = typeof Colors.dark;
