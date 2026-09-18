import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { GlassCard } from '@/components/ui/glass-card';
import { Price } from '@/components/ui/price';
import { Palette, Radius, Spacing } from '@/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Offer } from '@/types';

export function OfferMessage({
  offer,
  onAccept,
  onDecline,
  onCounter,
  canRespond,
}: {
  offer: Offer;
  onAccept?: () => void;
  onDecline?: () => void;
  onCounter?: () => void;
  canRespond?: boolean;
}) {
  const theme = useTheme();
  const previous = offer.history[0]?.amount;

  return (
    <GlassCard>
      <View style={styles.head}>
        <View style={styles.dot} />
        <AppText variant="caption" color="tint">
          Counter Offer Received
        </AppText>
      </View>
      <Price value={offer.amount} size="lg" />
      {previous ? (
        <AppText variant="caption" color="secondary">
          Previous {previous.currency} {previous.amount}
        </AppText>
      ) : null}
      {canRespond ? (
        <View style={styles.actions}>
          <Pressable onPress={onAccept} style={[styles.btn, { backgroundColor: Palette.blue }]}>
            <AppText variant="caption" style={{ color: '#fff' }}>Accept Offer</AppText>
          </Pressable>
          <Pressable onPress={onCounter} style={[styles.btn, { borderColor: theme.border, borderWidth: 1 }]}>
            <AppText variant="caption">Counter</AppText>
          </Pressable>
          <Pressable onPress={onDecline} style={[styles.btn, { borderColor: theme.border, borderWidth: 1 }]}>
            <AppText variant="caption" color="danger">Decline</AppText>
          </Pressable>
        </View>
      ) : null}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Palette.success },
  actions: { gap: Spacing.two, marginTop: Spacing.three },
  btn: {
    minHeight: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
