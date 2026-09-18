import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet } from 'react-native';

import { Radius } from '@/theme';
import { useTheme } from '@/hooks/use-theme';

import { GlassSurface } from './glass-surface';

type Props = {
  name: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  accessibilityLabel: string;
  size?: number;
};

export function IconButton({ name, onPress, accessibilityLabel, size = 20 }: Props) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      style={({ pressed }) => pressed && styles.pressed}>
      <GlassSurface style={styles.btn} interactive>
        <Ionicons name={name} size={size} color={theme.text} />
      </GlassSurface>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 44,
    height: 44,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { transform: [{ scale: 0.96 }] },
});
