import { type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Radius, Shadows, Spacing } from '@/theme';
import { useTheme } from '@/hooks/use-theme';

import { GlassSurface } from './glass-surface';

type Props = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
  glass?: boolean;
};

export function GlassCard({ children, style, padded = true, glass = false }: Props) {
  const theme = useTheme();

  if (glass) {
    return (
      <GlassSurface style={[padded && styles.padded, style]}>
        {children}
      </GlassSurface>
    );
  }

  return (
    <View
      style={[
        styles.solid,
        Shadows.card,
        padded && styles.padded,
        { backgroundColor: theme.backgroundElevated, borderColor: theme.border },
        style,
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  solid: {
    borderRadius: Radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
  },
  padded: {
    padding: Spacing.four,
  },
});
