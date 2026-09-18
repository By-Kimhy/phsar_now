import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Avatar } from '@/components/ui/avatar';
import { GlassCard } from '@/components/ui/glass-card';
import { useTheme } from '@/hooks/use-theme';
import type { User } from '@/types';
import { formatMemberSince } from '@/utils/format';

type Props = {
  seller: User;
  onPress?: () => void;
  compact?: boolean;
};

export function SellerCard({ seller, onPress, compact }: Props) {
  const theme = useTheme();

  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`${seller.name} profile`}>
      <GlassCard>
        <View style={styles.row}>
          <Avatar uri={seller.avatar} size={compact ? 44 : 56} />
          <View style={styles.meta}>
            <View style={styles.nameRow}>
              <AppText variant="headline">{seller.name}</AppText>
              {seller.verified ? (
                <Ionicons name="checkmark-circle" size={16} color={theme.tint} />
              ) : null}
            </View>
            <AppText variant="caption" color="secondary">
              {seller.rating.toFixed(1)} · {seller.reviewCount} reviews · {seller.location}
            </AppText>
            {!compact ? (
              <AppText variant="caption" color="tertiary">
                Member since {formatMemberSince(seller.memberSince)} · {seller.responseRate}% response
              </AppText>
            ) : null}
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.textTertiary} />
        </View>
      </GlassCard>
    </Pressable>
  );
}

export function SellerHero({ seller }: { seller: User }) {
  return (
    <View style={styles.hero}>
      <Image source={{ uri: seller.avatar }} style={styles.heroAvatar} />
      <AppText variant="title2">{seller.name}</AppText>
      <AppText variant="subhead" color="secondary">
        {seller.location}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  meta: { flex: 1, gap: 2 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  hero: { alignItems: 'center', gap: 8, paddingVertical: 12 },
  heroAvatar: { width: 88, height: 88, borderRadius: 44 },
});
