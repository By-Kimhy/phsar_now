import Ionicons from '@expo/vector-icons/Ionicons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { queryClient } from '@/api/query-client';
import { queryKeys } from '@/api/query-keys';
import { ProductCard } from '@/components/product/product-card';
import { ScreenHeader } from '@/components/navigation/screen-header';
import { AppText } from '@/components/ui/app-text';
import { Avatar } from '@/components/ui/avatar';
import { GlassButton } from '@/components/ui/glass-button';
import { GlassCard } from '@/components/ui/glass-card';
import { GlassChip } from '@/components/ui/glass-chip';
import { messageService, productService, userService } from '@/services';
import { useTheme } from '@/hooks/use-theme';
import { Palette, Radius, ScreenPadding, Spacing } from '@/theme';
import { formatMemberSince, formatRelativeTime } from '@/utils/format';

export default function SellerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<'listings' | 'reviews'>('listings');
  const seller = useQuery({ queryKey: queryKeys.users.detail(id), queryFn: () => userService.getUserById(id) });
  const listings = useQuery({
    queryKey: queryKeys.products.list({}),
    queryFn: () => productService.getProducts({ sort: 'newest' }),
  });
  const reviews = useQuery({ queryKey: queryKeys.users.reviews(id), queryFn: () => userService.getReviews(id) });
  const follow = useQuery({ queryKey: ['follow', id], queryFn: () => userService.isFollowing(id) });
  const followMut = useMutation({
    mutationFn: async () => {
      if (follow.data) await userService.unfollowSeller(id);
      else await userService.followSeller(id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['follow', id] }),
  });
  const active = (listings.data ?? []).filter((item) => item.sellerId === id && item.status === 'active');

  if (!seller.data) return null;
  const profile = seller.data;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{ paddingTop: insets.top, paddingHorizontal: ScreenPadding, paddingBottom: 40, gap: Spacing.four }}>
      <ScreenHeader title={profile.name} />
      <View style={styles.hero}>
        <Avatar uri={profile.avatar} size={92} />
        <AppText variant="title2">{profile.name}</AppText>
        <AppText color="secondary">@{profile.email.split('@')[0]} · Tier 3</AppText>
        <AppText variant="caption" color="tertiary">
          {profile.location} · Since {formatMemberSince(profile.memberSince)}
        </AppText>
      </View>
      <View style={styles.stats}>
        <Stat value={profile.rating.toFixed(1)} label={`${profile.reviewCount} reviews`} icon="star" />
        <Stat value={`${profile.responseRate}%`} label="On-time deals" icon="flash" />
        <Stat value="< 5 mins" label="Avg. response" icon="time" />
        <Stat value="ABA + Bakong" label="KHR verified" icon="card" />
      </View>
      <View style={styles.row}>
        <GlassButton
          style={{ flex: 1 }}
          onPress={async () => {
            const listing = active[0];
            if (!listing) return;
            const result = await messageService.sendMessage({
              productId: listing.id,
              recipientId: profile.id,
              text: 'Hi, I am interested in your listings.',
            });
            router.push(`/chat/${result.conversation.id}`);
          }}>
          Message Seller
        </GlassButton>
        <GlassButton variant="secondary" style={{ flex: 1 }} onPress={() => followMut.mutate()}>
          {follow.data ? 'Following' : 'Follow'}
        </GlassButton>
      </View>
      <View style={styles.stats}>
        <Mini value={String(active.length)} label="Active Items" />
        <Mini value={String(profile.soldCount)} label="Sold" />
        <Mini value="98.5%" label="Positive Recs" />
      </View>
      <View style={styles.row}>
        <GlassChip label={`Listings (${active.length})`} selected={tab === 'listings'} onPress={() => setTab('listings')} />
        <GlassChip label={`Reviews (${reviews.data?.length ?? 0})`} selected={tab === 'reviews'} onPress={() => setTab('reviews')} />
      </View>
      {tab === 'listings' ? (
        <>
          <AppText variant="title3">Featured Catalog</AppText>
          <View style={styles.grid}>
            {active.map((product) => (
              <View key={product.id} style={{ width: '48%' }}>
                <ProductCard product={product} />
              </View>
            ))}
          </View>
        </>
      ) : (
        <>
          {(reviews.data ?? []).map((review) => (
            <GlassCard key={review.id}>
              <AppText variant="headline">{'★'.repeat(review.rating)}</AppText>
              <AppText>{review.text}</AppText>
              <AppText variant="caption" color="tertiary">{formatRelativeTime(review.createdAt)}</AppText>
            </GlassCard>
          ))}
          <GlassButton variant="ghost" onPress={() => router.push(`/reviews/${id}`)}>See all reviews</GlassButton>
        </>
      )}
      <GlassCard>
        <AppText variant="headline">Verified Safe Meetup Zones</AppText>
        <AppText>AEON Mall Mean Chey / BKK1 Station</AppText>
        <AppText color="secondary">Brown Coffee Roastery (St. 57 BKK1)</AppText>
      </GlassCard>
      <GlassButton variant="ghost" onPress={() => router.push({ pathname: '/report', params: { userId: id } })}>
        Report user
      </GlassButton>
    </ScrollView>
  );
}

function Stat({ value, label, icon }: { value: string; label: string; icon: keyof typeof Ionicons.glyphMap }) {
  const theme = useTheme();
  return (
    <View style={[styles.stat, { backgroundColor: theme.backgroundElevated, borderColor: theme.border }]}>
      <Ionicons name={icon} size={14} color={Palette.blue} />
      <AppText variant="headline">{value}</AppText>
      <AppText variant="caption" color="secondary">{label}</AppText>
    </View>
  );
}

function Mini({ value, label }: { value: string; label: string }) {
  return (
    <GlassCard style={{ flex: 1, alignItems: 'center' }}>
      <AppText variant="title3">{value}</AppText>
      <AppText variant="caption" color="secondary">{label}</AppText>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: 6 },
  row: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  stat: { width: '48%', padding: 12, borderRadius: Radius.xl, borderWidth: StyleSheet.hairlineWidth, gap: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12 },
});
