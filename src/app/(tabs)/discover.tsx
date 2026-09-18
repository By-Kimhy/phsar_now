import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FilterSheet } from '@/components/marketplace/filter-sheet';
import { BrandHeader } from '@/components/navigation/brand-header';
import { ProductGrid } from '@/components/product/product-grid';
import { AppText } from '@/components/ui/app-text';
import { EmptyState, ErrorState } from '@/components/ui/states';
import { GlassChip } from '@/components/ui/glass-chip';
import { GlassSearchBar } from '@/components/ui/glass-search-bar';
import { CATEGORIES, TRENDING_SEARCHES } from '@/constants/app';
import { useProducts } from '@/hooks/use-products';
import { useTheme } from '@/hooks/use-theme';
import { useFilterStore } from '@/store/filter-store';
import { Palette, Radius, ScreenPadding, Spacing } from '@/theme';

const TABS = [
  { id: 'recommended', label: 'Trending' },
  { id: 'newest', label: 'New Drops' },
  { id: 'nearby', label: 'Nearby <3km' },
] as const;

export default function DiscoverScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const filters = useFilterStore((state) => state.filters);
  const patch = useFilterStore((state) => state.patch);
  const [sheet, setSheet] = useState(false);
  const query = useProducts({
    ...filters,
    maxDistanceKm: filters.sort === 'nearby' ? 3 : filters.maxDistanceKm,
  });

  const header = useMemo(
    () => (
      <View style={{ gap: Spacing.four, paddingTop: insets.top + 8, paddingBottom: 12, paddingHorizontal: ScreenPadding }}>
        <BrandHeader />
        <Pressable onPress={() => router.push('/search')}>
          <View pointerEvents="none">
            <GlassSearchBar value={filters.query ?? ''} onChangeText={() => undefined} placeholder="Search 1,420 items nearby" />
          </View>
        </Pressable>
        <AppText variant="caption" color="secondary">
          1,420 verified items live in Phnom Penh
        </AppText>
        <View style={styles.wrap}>
          <GlassChip label="TRENDING" selected />
          {TRENDING_SEARCHES.slice(0, 3).map((term) => (
            <GlassChip
              key={term}
              label={term}
              onPress={() => {
                patch({ query: term });
                router.push('/search');
              }}
            />
          ))}
        </View>
        <View style={[styles.safezone, { backgroundColor: Palette.blue }]}>
          <AppText variant="headline" style={{ color: '#fff' }}>
            PhsarNow SafeZone  OFFICIAL
          </AppText>
          <AppText variant="caption" style={{ color: '#D7E3FF' }}>
            AEON 1 & Chip Mong BKK Hubs. Protected meetup booths with escrow cash-lock.
          </AppText>
        </View>
        <View style={styles.row}>
          <AppText variant="title3">Explore Categories</AppText>
          <AppText variant="caption" color="tint">
            See all
          </AppText>
        </View>
        <View style={styles.cats}>
          {CATEGORIES.filter((item) => item.id !== 'more').slice(0, 6).map((item) => (
            <Pressable
              key={item.id}
              style={[styles.cat, { backgroundColor: theme.backgroundElevated, borderColor: theme.border }]}
              onPress={() => patch({ category: item.id })}>
              <Ionicons name={item.icon} size={22} color={theme.tint} />
              <AppText variant="caption">{item.label}</AppText>
            </Pressable>
          ))}
        </View>
        <View style={styles.row}>
          {TABS.map((tab) => (
            <Pressable key={tab.id} onPress={() => patch({ sort: tab.id })}>
              <AppText variant="headline" color={(filters.sort ?? 'recommended') === tab.id ? 'tint' : 'secondary'}>
                {tab.label}
              </AppText>
            </Pressable>
          ))}
        </View>
      </View>
    ),
    [filters.query, filters.sort, insets.top, patch, router, theme.backgroundElevated, theme.border, theme.tint],
  );

  if (query.isError) {
    return <ErrorState message="Couldn't load listings." onRetry={() => void query.refetch()} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ProductGrid
        products={query.data ?? []}
        loading={query.isLoading}
        ListHeaderComponent={header}
        refreshing={query.isRefetching}
        onRefresh={() => void query.refetch()}
      />
      {!query.isLoading && (query.data?.length ?? 0) === 0 ? (
        <EmptyState title="No products found" subtitle="Try a different filter or search." />
      ) : null}
      <FilterSheet visible={sheet} onClose={() => setSheet(false)} onApply={() => void query.refetch()} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  safezone: { borderRadius: Radius.xl, padding: 16, gap: 6 },
  cats: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 },
  cat: {
    width: '31%',
    minHeight: 88,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
