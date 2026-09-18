import { BlurView } from 'expo-blur';
import { GlassView, isGlassEffectAPIAvailable } from 'expo-glass-effect';
import { type ReactNode } from 'react';
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Glass, Radius } from '@/theme';
import { useResolvedScheme, useTheme } from '@/hooks/use-theme';

type Props = {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: 'regular' | 'clear';
  interactive?: boolean;
};

export function GlassSurface({ children, style, intensity = 'regular', interactive = false }: Props) {
  const theme = useTheme();
  const scheme = useResolvedScheme();
  const canUseLiquidGlass = Platform.OS === 'ios' && isGlassEffectAPIAvailable();

  if (canUseLiquidGlass) {
    return (
      <GlassView
        style={[styles.base, { borderColor: theme.glassBorder }, style]}
        glassEffectStyle={intensity}
        isInteractive={interactive}
        colorScheme={scheme}
        tintColor={scheme === 'dark' ? 'rgba(20,22,46,0.35)' : 'rgba(255,255,255,0.18)'}>
        {children}
      </GlassView>
    );
  }

  if (Platform.OS === 'ios') {
    return (
      <BlurView
        intensity={Glass.blurIntensity}
        tint={scheme === 'dark' ? 'systemThinMaterialDark' : 'systemThinMaterialLight'}
        style={[styles.base, { borderColor: theme.glassBorder }, style]}>
        {children}
      </BlurView>
    );
  }

  return (
    <View
      style={[
        styles.base,
        styles.fallback,
        { backgroundColor: theme.glassFill, borderColor: theme.glassBorder },
        style,
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
    borderWidth: Glass.borderWidth,
    borderRadius: Radius.xl,
  },
  fallback: {
    backgroundColor: 'rgba(255,255,255,0.86)',
  },
});
