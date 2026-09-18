import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { queryClient } from '@/api/query-client';
import { queryKeys } from '@/api/query-keys';
import { BrandHeader } from '@/components/navigation/brand-header';
import { AppText } from '@/components/ui/app-text';
import { EmptyState } from '@/components/ui/states';
import { GlassButton } from '@/components/ui/glass-button';
import { GlassCard } from '@/components/ui/glass-card';
import { GlassChip } from '@/components/ui/glass-chip';
import { Price } from '@/components/ui/price';
import { listingService } from '@/services';
import { useTheme } from '@/hooks/use-theme';
import type { ListingStatus } from '@/types';
import { Palette, Radius, ScreenPadding, Spacing } from '@/theme';

const TABS: { id: ListingStatus; label: string }[] = [
  { id: 'active', label: 'Active' },
  { id: 'pending', label: 'Under Escrow' },
  { id: 'sold', label: 'Sold' },
  { id: 'draft', label: 'Drafts' },
];

export default function ListingsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<ListingStatus>('active');
  const query = useQuery({ queryKey: queryKeys.listings.mine(tab), queryFn: () => listingService.getMyListings(tab) });
  const all = useQuery({ queryKey: queryKeys.listings.mine(), queryFn: () => listingService.getMyListings() });
  const value = (all.data ?? []).filter((item) => item.status !== 'draft').reduce((sum, item) => sum + item.price.amount, 0);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background }} contentContainerStyle={{ paddingTop: insets.top, paddingHorizontal: ScreenPadding, paddingBottom: 40, gap: 12 }}>
      <BrandHeader />
      <View style={styles.row}>
        <AppText variant="title">My Listings</AppText>
        <GlassButton onPress={() => router.push('/sell')}>Add Item</GlassButton>
      </View>
      <GlassCard>
        <AppText variant="caption" color="secondary">Active Portfolio Value</AppText>
        <AppText variant="title">${value.toLocaleString()}</AppText>
        <AppText variant="caption" color="tint">{all.data?.length ?? 0} live products</AppText>
      </GlassCard>
      <View style={styles.wrap}>
        {TABS.map((item) => (
          <GlassChip key={item.id} label={item.label} selected={tab === item.id} onPress={() => setTab(item.id)} />
        ))}
      </View>
      {(query.data ?? []).length === 0 ? (
        <EmptyState title="You haven't listed anything yet." subtitle="Start selling something today." actionLabel="Sell" onAction={() => router.push('/sell')} />
      ) : (
        query.data?.map((item) => (
          <View key={item.id} style={[styles.card, { backgroundColor: theme.backgroundElevated, borderColor: theme.border }]}>
            <View style={styles.badge}><AppText variant="caption" style={{ color: '#fff' }}>{item.status.toUpperCase()}</AppText></View>
            <View style={styles.row}>
              <Image source={{ uri: item.images[0] }} style={styles.image} />
              <View style={{ flex: 1, gap: 4 }}>
                <AppText variant="headline">{item.title}</AppText>
                <Price value={item.price} />
                <AppText variant="caption" color="tertiary">{item.views} views · {item.favoriteCount} saves · {item.messageCount} chats</AppText>
              </View>
            </View>
            <View style={styles.wrap}>
              <Pressable onPress={() => Alert.alert('Boost', 'Promotion is mocked.')}><AppText color="tint">Boost</AppText></Pressable>
              <Pressable onPress={() => router.push(`/product/${item.id}`)}><AppText color="tint">Edit</AppText></Pressable>
              <Pressable onPress={async () => { await listingService.markAsSold(item.id); await queryClient.invalidateQueries({ queryKey: ['listings'] }); }}><AppText color="tint">Mark Sold</AppText></Pressable>
            </View>
          </View>
        ))
      )}
      <GlassCard>
        <AppText variant="headline">Seller Performance</AppText>
        <AppText color="secondary">Earned +$1,240 · 99.2% no disputes · &lt;10m response</AppText>
      </GlassCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  card: { padding: 12, borderRadius: Radius.xl, borderWidth: StyleSheet.hairlineWidth, gap: 10 },
  image: { width: 72, height: 72, borderRadius: Radius.md },
  badge: { alignSelf: 'flex-start', backgroundColor: Palette.success, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
});
