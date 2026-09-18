import { Pressable, StyleSheet, Text } from 'react-native';

import { Palette, Radius, Spacing, Typography } from '@/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export function GlassChip({ label, selected, onPress }: Props) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[
        styles.chip,
        { backgroundColor: selected ? Palette.blue : theme.backgroundElevated, borderColor: selected ? Palette.blue : theme.border },
      ]}>
      <Text style={[styles.label, { color: selected ? '#fff' : theme.text }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: Spacing.four,
    paddingVertical: 8,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
  label: {
    ...Typography.subhead,
    fontWeight: '600',
  },
});
