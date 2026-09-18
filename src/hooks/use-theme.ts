import { Appearance, useColorScheme as useSystemColorScheme } from 'react-native';

import { Colors, type ThemeColors } from '@/theme';
import { useThemeStore } from '@/store/theme-store';

export function useResolvedScheme(): 'light' | 'dark' {
  const preference = useThemeStore((state) => state.preference);
  const system = useSystemColorScheme();
  if (preference === 'system') {
    return system === 'dark' ? 'dark' : 'light';
  }
  return preference;
}

export function useTheme(): ThemeColors {
  return Colors[useResolvedScheme()];
}

export function getThemeNow(): ThemeColors {
  const preference = useThemeStore.getState().preference;
  const system = Appearance.getColorScheme();
  const scheme = preference === 'system' ? (system === 'dark' ? 'dark' : 'light') : preference;
  return Colors[scheme];
}
