import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrandHeader } from '@/components/navigation/brand-header';
import { AppText } from '@/components/ui/app-text';
import { EmptyState } from '@/components/ui/states';
import { GlassButton } from '@/components/ui/glass-button';
import { GlassCard } from '@/components/ui/glass-card';
import { GlassChip } from '@/components/ui/glass-chip';
import { Price } from '@/components/ui/price';
import { favoriteService, productService } from '@/services';
import { useFavoriteStore } from '@/store/favorite-store';
import { useFilterStore } from '@/store/filter-store';
import { useTheme } from '@/hooks/use-theme';
import { Palette, Radius, ScreenPadding, Spacing } from '@/theme';
import { formatDistance, neighborhood } from '@/utils/format';

export default function FavoritesScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const ids = useFavoriteStore((state) => state.ids);
  const collections = useFavoriteStore((state) => state.collections);
  const saved = useFavoriteStore((state) => state.savedSearches);
  const patch = useFilterStore((state) => state.patch);
  const [tab, setTab] = useState<'items' | 'collections' | 'searches'>('items');
  const [alerts, setAlerts] = useState<Record<string, boolean>>({});
  const hydrate = useFavoriteStore((state) => state.hydrate);
  const products = useQuery({ queryKey: ['products'], queryFn: () => productService.getProducts({ sort: 'newest' }) });
  const favoriteProducts = (products.data ?? []).filter((item) => ids.includes(item.id));

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background }} contentContainerStyle={{ paddingTop: insets.top, paddingHorizontal: ScreenPadding, paddingBottom: 40, gap: Spacing.four }}>
      <BrandHeader />
      <AppText variant="title">Favorites & Saved</AppText>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <GlassChip label={`All Items (${favoriteProducts.length})`} selected={tab === 'items'} onPress={() => setTab('items')} />
        <GlassChip label={`Collections (${collections.length})`} selected={tab === 'collections'} onPress={() => setTab('collections')} />
        <GlassChip label={`Searches (${saved.length})`} selected={tab === 'searches'} onPress={() => setTab('searches')} />
      </View>
      {tab === 'items' ? (
        favoriteProducts.length ? (
          <>
            <View style={styles.alert}>
              <AppText variant="headline" style={{ color: Palette.danger }}>Price alert</AppText>
              <AppText variant="caption">2 saved items dropped in price. Save up to $120.</AppText>
            </View>
            {favoriteProducts.map((item) => (
              <Pressable key={item.id} onPress={() => router.push(`/product/${item.id}`)} style={[styles.rowCard, { backgroundColor: theme.backgroundElevated, borderColor: theme.border }]}>
                <Image source={{ uri: item.images[0] }} style={styles.image} />
                <View style={{ flex: 1, gap: 4 }}>
                  <AppText variant="headline" numberOfLines={1}>{item.title}</AppText>
                  <Price value={item.price} />
                  <AppText variant="caption" color="tertiary">{formatDistance(item.distanceKm)} · {neighborhood(item.location)}</AppText>
                  <View style={styles.row}>
                    <GlassButton variant="secondary" onPress={() => router.push({ pathname: '/offers', params: { productId: item.id, make: '1' } })}>Quick Offer</GlassButton>
                    <GlassButton onPress={() => router.push({ pathname: '/orders/confirm', params: { productId: item.id } })}>Buy with Escrow</GlassButton>
                  </View>
                </View>
              </Pressable>
            ))}
          </>
        ) : (
          <EmptyState icon="heart-outline" title="No saved items yet" subtitle="Save products you like and find them here later." actionLabel="Discover" onAction={() => router.push('/discover')} />
        )
      ) : null}
      {tab === 'collections' ? collections.map((collection) => (
        <GlassCard key={collection.id}>
          <AppText variant="headline">{collection.name}</AppText>
          <AppText color="secondary">{collection.productIds.length} items</AppText>
        </GlassCard>
      )) : null}
      {tab === 'searches' ? (
        <>
          {saved.map((item) => (
            <GlassCard key={item.id}>
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <AppText variant="headline">{item.query}</AppText>
                  <AppText variant="caption" color="secondary">Live alerts on</AppText>
                </View>
                <Switch
                  value={alerts[item.id] ?? true}
                  onValueChange={(next) => setAlerts((current) => ({ ...current, [item.id]: next }))}
                />
              </View>
              <GlassButton variant="secondary" onPress={() => { patch(item.filters); router.push('/search'); }}>Open search</GlassButton>
            </GlassCard>
          ))}
          <GlassButton
            variant="ghost"
            onPress={async () => {
              await favoriteService.saveSearch('MacBook nearby', { query: 'MacBook', sort: 'nearby' });
              await hydrate();
            }}>
            Save MacBook search
          </GlassButton>
        </>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  alert: { backgroundColor: '#FFE8EC', padding: 14, borderRadius: Radius.xl, gap: 4 },
  rowCard: { flexDirection: 'row', gap: 12, padding: 12, borderRadius: Radius.xl, borderWidth: StyleSheet.hairlineWidth },
  image: { width: 88, height: 88, borderRadius: Radius.md },
  row: { flexDirection: 'row', gap: 8, alignItems: 'center', flexWrap: 'wrap' },
});
