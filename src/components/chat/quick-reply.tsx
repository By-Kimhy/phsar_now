import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { QUICK_REPLIES } from '@/constants/app';
import { Radius, Spacing } from '@/theme';
import { useTheme } from '@/hooks/use-theme';
import { AppText } from '@/components/ui/app-text';

export function QuickReply({ onSelect }: { onSelect: (text: string) => void }) {
  const theme = useTheme();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {QUICK_REPLIES.map((reply) => (
        <Pressable
          key={reply}
          onPress={() => onSelect(reply)}
          style={[styles.chip, { borderColor: theme.border, backgroundColor: theme.backgroundElevated }]}>
          <AppText variant="caption">{reply}</AppText>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: Spacing.two, paddingVertical: Spacing.two },
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
