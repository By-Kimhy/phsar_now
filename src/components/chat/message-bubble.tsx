import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Radius, Spacing } from '@/theme';
import { useTheme } from '@/hooks/use-theme';
import type { ChatMessage } from '@/types';

export function MessageBubble({ message, mine }: { message: ChatMessage; mine: boolean }) {
  const theme = useTheme();

  return (
    <View style={[styles.row, mine && styles.mineRow]}>
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: mine ? theme.tint : theme.backgroundElevated,
            borderColor: theme.border,
          },
        ]}>
        <AppText variant="callout" style={{ color: mine ? '#fff' : theme.text }}>
          {message.text ?? (message.kind === 'image' ? 'Photo' : '')}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { marginBottom: Spacing.two, alignItems: 'flex-start' },
  mineRow: { alignItems: 'flex-end' },
  bubble: {
    maxWidth: '80%',
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
