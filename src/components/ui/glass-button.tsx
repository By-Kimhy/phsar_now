import { type ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { Palette, Radius, Spacing, Typography } from '@/theme';
import { useTheme } from '@/hooks/use-theme';
import { selectionHaptic } from '@/utils/haptics';

import { GlassSurface } from './glass-surface';

type Variant = 'primary' | 'secondary' | 'glass' | 'ghost' | 'danger';

type Props = {
  children: ReactNode;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

export function GlassButton({
  children,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  style,
  accessibilityLabel,
}: Props) {
  const theme = useTheme();
  const isPrimary = variant === 'primary';
  const isDanger = variant === 'danger';

  const handlePress = () => {
    void selectionHaptic();
    onPress?.();
  };

  const content = loading ? (
    <ActivityIndicator color={isPrimary || isDanger ? '#fff' : theme.text} />
  ) : (
    <Text
      style={[
        styles.label,
        {
          color:
            isPrimary || isDanger ? '#fff' : variant === 'ghost' ? theme.tint : theme.text,
        },
      ]}>
      {children}
    </Text>
  );

  if (variant === 'glass') {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        disabled={disabled || loading}
        onPress={handlePress}
        style={({ pressed }) => [style, pressed && styles.pressed, disabled && styles.disabled]}>
        <GlassSurface interactive style={styles.glassInner}>
          {content}
        </GlassSurface>
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      disabled={disabled || loading}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && { backgroundColor: Palette.blue },
        variant === 'secondary' && { backgroundColor: theme.backgroundElement },
        variant === 'ghost' && { backgroundColor: 'transparent' },
        variant === 'danger' && { backgroundColor: theme.danger },
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.five,
  },
  glassInner: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.five,
    borderRadius: Radius.lg,
  },
  label: {
    ...Typography.headline,
  },
  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
  },
});
