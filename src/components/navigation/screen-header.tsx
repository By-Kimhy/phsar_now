import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { useTheme } from '@/hooks/use-theme';

export function ScreenHeader({
  title,
  onBack,
  right,
}: {
  title: string;
  onBack?: () => void;
  right?: ReactNode;
}) {
  const router = useRouter();
  const theme = useTheme();

  return (
    <View style={styles.row}>
      <Pressable
        onPress={onBack ?? (() => router.back())}
        hitSlop={8}
        accessibilityLabel="Back"
        style={styles.back}>
        <Ionicons name="chevron-back" size={24} color={theme.text} />
      </Pressable>
      <AppText variant="headline" style={styles.title} numberOfLines={1}>
        {title}
      </AppText>
      <View style={styles.right}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    marginBottom: 8,
  },
  back: { width: 40 },
  title: { flex: 1, textAlign: 'center' },
  right: { minWidth: 40, alignItems: 'flex-end' },
});
