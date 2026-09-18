import Ionicons from '@expo/vector-icons/Ionicons';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { queryKeys } from '@/api/query-keys';
import { BrandHeader } from '@/components/navigation/brand-header';
import { AppText } from '@/components/ui/app-text';
import { Avatar } from '@/components/ui/avatar';
import { GlassButton } from '@/components/ui/glass-button';
import { GlassCard } from '@/components/ui/glass-card';
import { Price } from '@/components/ui/price';
import { listingService } from '@/services';
import { useAuthStore } from '@/store/auth-store';
import { useTheme } from '@/hooks/use-theme';
import { Palette, Radius, ScreenPadding, Spacing } from '@/theme';
import { formatMemberSince } from '@/utils/format';

export default function ProfileScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);
  const listings = useQuery({ queryKey: queryKeys.listings.mine(), queryFn: () => listingService.getMyListings() });
  const active = (listings.data ?? []).filter((item) => item.status === 'active').slice(0, 2);

  if (!user) return null;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{ paddingTop: insets.top + 8, paddingHorizontal: ScreenPadding, paddingBottom: 130, gap: 14 }}>
      <BrandHeader />
      <View style={styles.safeguard}>
        <Ionicons name="shield-checkmark" size={14} color={Palette.success} />
        <AppText variant="caption" style={{ color: Palette.success }}>PhsarNow Safeguard Active</AppText>
      </View>
      <View style={styles.hero}>
        <Avatar uri={user.avatar} size={84} />
        <AppText variant="title2">{user.name}</AppText>
        <AppText color="secondary">{user.location}</AppText>
        <AppText variant="caption" color="tertiary">Member since {formatMemberSince(user.memberSince)}</AppText>
        <View style={styles.pills}>
          <Pill icon="star" label={`${user.rating} (${user.reviewCount} reviews)`} />
          <Pill icon="flash" label={`${user.responseRate}% response`} />
        </View>
        <View style={styles.pills}>
          <Pill icon="checkmark-circle" label="ID Verified" />
          <Pill icon="card" label="ABA Bank Verified" />
          <Pill icon="ribbon" label="Top Seller" />
        </View>
        <View style={styles.row}>
          <GlassButton variant="secondary" style={{ flex: 1 }} onPress={() => router.push('/settings')}>Edit Profile</GlassButton>
          <GlassButton variant="ghost" style={{ flex: 1 }} onPress={() => router.push(`/seller/${user.id}`)}>Public View</GlassButton>
        </View>
      </View>
      <View style={styles.stats}>
        <Stat label="Active Listings" value={String(user.listingsCount)} />
        <Stat label="Sold Volume" value={String(user.soldCount)} />
      </View>
      <View style={styles.stats}>
        <Stat label="Purchases Made" value="23" />
        <Stat label="Escrow Trust" value="99.2%" />
      </View>
      <Pressable onPress={() => router.push('/wallet')}>
        <View style={styles.wallet}>
          <AppText variant="caption" style={{ color: '#D7E3FF' }}>PHSARNOW ESCROW BALANCE</AppText>
          <AppText variant="title" style={{ color: '#fff' }}>$1,240.00</AppText>
          <AppText variant="caption" style={{ color: '#D7E3FF' }}>Cleared & ready for instant ABA payout</AppText>
          <View style={styles.row}>
            <AppText variant="caption" style={{ color: '#fff', flex: 1 }}>ABA Bank PayWay · ···9802</AppText>
            <View style={styles.cash}><AppText variant="caption" color="tint">Cash Out</AppText></View>
          </View>
        </View>
      </Pressable>
      <View style={styles.row}>
        <AppText variant="title3">My Listings</AppText>
        <Pressable onPress={() => router.push('/listings')}><AppText color="tint">See all</AppText></Pressable>
      </View>
      {active.map((item) => (
        <Pressable key={item.id} onPress={() => router.push(`/product/${item.id}`)} style={[styles.listing, { backgroundColor: theme.backgroundElevated, borderColor: theme.border }]}>
          <Image source={{ uri: item.images[0] }} style={styles.thumb} />
          <View style={{ flex: 1, gap: 2 }}>
            <AppText variant="headline" numberOfLines={1}>{item.title}</AppText>
            <Price value={item.price} size="sm" />
            <AppText variant="caption" color="tertiary">{item.views} views · {item.messageCount} offers</AppText>
          </View>
        </Pressable>
      ))}
      <GlassCard>
        <AppText variant="headline">Safe Hub & Verification</AppText>
        <LinkRow icon="location" label="Safe Exchange Points" hint="AEON Mall BKK1" onPress={() => router.push('/listings')} />
        <LinkRow icon="heart" label="Saved & Followed Sellers" hint="Favorites" onPress={() => router.push('/favorites')} />
        <LinkRow icon="lock-closed" label="Security & Biometric Lock" hint="Settings" onPress={() => router.push('/settings')} />
        <LinkRow icon="help-circle" label="Dispute Resolution" hint="24/7 support" onPress={() => router.push('/orders')} />
      </GlassCard>
    </ScrollView>
  );
}

function Pill({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  const theme = useTheme();
  return (
    <View style={[styles.pill, { backgroundColor: theme.backgroundElement }]}>
      <Ionicons name={icon} size={12} color={theme.tint} />
      <AppText variant="caption">{label}</AppText>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <GlassCard style={{ flex: 1 }}>
      <AppText variant="title3">{value}</AppText>
      <AppText variant="caption" color="secondary">{label}</AppText>
    </GlassCard>
  );
}

function LinkRow({ icon, label, hint, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; hint: string; onPress: () => void }) {
  const theme = useTheme();
  return (
    <Pressable onPress={onPress} style={styles.link}>
      <Ionicons name={icon} size={18} color={theme.tint} />
      <View style={{ flex: 1 }}>
        <AppText variant="subhead">{label}</AppText>
        <AppText variant="caption" color="tertiary">{hint}</AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeguard: { flexDirection: 'row', gap: 6, alignItems: 'center', alignSelf: 'center' },
  hero: { alignItems: 'center', gap: 6 },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center' },
  pill: { flexDirection: 'row', gap: 4, alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.pill },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stats: { flexDirection: 'row', gap: 10 },
  wallet: { backgroundColor: Palette.blue, borderRadius: Radius.xl, padding: 18, gap: 6 },
  cash: { backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 8, borderRadius: Radius.pill },
  listing: { flexDirection: 'row', gap: 12, padding: 12, borderRadius: Radius.xl, borderWidth: StyleSheet.hairlineWidth },
  thumb: { width: 64, height: 64, borderRadius: Radius.md },
  link: { flexDirection: 'row', gap: 10, alignItems: 'center', paddingVertical: 8 },
});
