import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text } from 'react-native';

import { Palette, Radius, Spacing, Typography } from '@/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
};

export function GlassChip({ label, selected, onPress, icon }: Props) {
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
      {icon ? <Ionicons name={icon} size={14} color={selected ? '#fff' : theme.textSecondary} /> : null}
      <Text style={[styles.label, { color: selected ? '#fff' : theme.textSecondary }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
