import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { GlassCard } from '@/components/ui/glass-card';
import { useTheme } from '@/hooks/use-theme';
import type { User } from '@/types';
import { formatMemberSince } from '@/utils/format';

export function TrustBadges({ user }: { user: User }) {
  const theme = useTheme();
  const items = [
    { ok: user.verified, label: 'Verified account' },
    { ok: user.phoneVerified, label: 'Verified phone' },
    { ok: user.identityVerified, label: 'Verified identity' },
    { ok: user.completedTransactions > 0, label: `${user.completedTransactions} transactions` },
  ];

  return (
    <GlassCard>
      <AppText variant="headline">Trust & safety</AppText>
      <View style={styles.grid}>
        {items.map((item) => (
          <View key={item.label} style={styles.row}>
            <Ionicons
              name={item.ok ? 'shield-checkmark' : 'shield-outline'}
              size={16}
              color={item.ok ? theme.success : theme.textTertiary}
            />
            <AppText variant="footnote" color={item.ok ? 'text' : 'tertiary'}>
              {item.label}
            </AppText>
          </View>
        ))}
      </View>
      <AppText variant="caption" color="tertiary">
        Seller {user.rating.toFixed(1)} · Buyer {user.buyerRating.toFixed(1)} · Joined{' '}
        {formatMemberSince(user.memberSince)}
      </AppText>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  grid: { marginTop: 12, gap: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
