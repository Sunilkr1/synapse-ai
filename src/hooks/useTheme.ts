import { useSettingsStore } from '../stores/settingsStore';
import { Theme } from '../constants/theme';

export function useTheme() {
  const { theme, accentColor } = useSettingsStore();
  const themeColors = theme === 'dark' ? Theme.colors.dark : Theme.colors.light;
  
  const colors = {
    ...themeColors,
    accent: accentColor || themeColors.accent,
  };

  return { colors, theme };
}
