import { Platform } from 'react-native';

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Typography = {
  largeTitle: { fontSize: 34, lineHeight: 40, fontWeight: '700' as const },
  title: { fontSize: 28, lineHeight: 34, fontWeight: '700' as const },
  title2: { fontSize: 22, lineHeight: 28, fontWeight: '700' as const },
  title3: { fontSize: 18, lineHeight: 24, fontWeight: '600' as const },
  headline: { fontSize: 16, lineHeight: 22, fontWeight: '600' as const },
  body: { fontSize: 16, lineHeight: 22, fontWeight: '400' as const },
  callout: { fontSize: 15, lineHeight: 21, fontWeight: '500' as const },
  subhead: { fontSize: 14, lineHeight: 20, fontWeight: '500' as const },
  footnote: { fontSize: 13, lineHeight: 18, fontWeight: '500' as const },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '500' as const },
};
