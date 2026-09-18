import { useRouter } from 'expo-router';
import { Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { type ReactNode } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EscrowBanner } from '@/components/marketplace/escrow-banner';
import { BrandHeader } from '@/components/navigation/brand-header';
import { ProductCard } from '@/components/product/product-card';
import { AppText } from '@/components/ui/app-text';
import { GlassChip } from '@/components/ui/glass-chip';
import { GlassSearchBar } from '@/components/ui/glass-search-bar';
import { ProductCardSkeleton } from '@/components/ui/states';
import { useProducts } from '@/hooks/use-products';
import { useTheme } from '@/hooks/use-theme';
import { useFilterStore } from '@/store/filter-store';
import { Palette, Radius, ScreenPadding, Spacing } from '@/theme';
import type { Product } from '@/types';

const DEAL_CHIPS = [
  { id: 'all', label: 'All Deals' },
  { id: 'electronics', label: 'Electronics' },
  { id: 'fashion', label: 'Fashion' },
] as const;

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const patch = useFilterStore((state) => state.patch);
  const category = useFilterStore((state) => state.filters.category);
  const nearby = useProducts({ sort: 'nearby', maxDistanceKm: 15 });
  const recommended = useProducts({ sort: 'recommended' });
  const refreshing = recommended.isRefetching;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{
        paddingTop: insets.top + 8,
        paddingBottom: 130,
        paddingHorizontal: ScreenPadding,
        gap: Spacing.four,
      }}
      refreshControl={
        <RefreshControl
          refreshing={Boolean(refreshing)}
          onRefresh={() => {
            void recommended.refetch();
            void nearby.refetch();
          }}
        />
      }
      showsVerticalScrollIndicator={false}>
      <BrandHeader />
      <View style={styles.greet}>
        <AppText variant="title3">Good {new Date().getHours() < 12 ? 'morning' : 'afternoon'}</AppText>
        <View style={styles.pills}>
          <View style={[styles.live, { backgroundColor: '#E8F8EE' }]}>
            <AppText variant="caption" style={{ color: Palette.success, fontWeight: '700' }}>
              BKK1 Active
            </AppText>
          </View>
          <AppText variant="caption" color="tint">
            1,420 Deals Near You
          </AppText>
        </View>
      </View>

      <Pressable onPress={() => router.push('/search')}>
        <View pointerEvents="none">
          <GlassSearchBar value="" onChangeText={() => undefined} />
        </View>
      </Pressable>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {DEAL_CHIPS.map((chip) => (
          <GlassChip
            key={chip.id}
            label={chip.label}
            selected={(category ?? 'all') === chip.id}
            onPress={() => {
              patch({ category: chip.id === 'all' ? 'all' : chip.id });
              if (chip.id !== 'all') router.push('/discover');
            }}
          />
        ))}
      </ScrollView>

      <Pressable onPress={() => router.push('/sell')} style={styles.bannerWrap}>
        <View style={[styles.banner, { backgroundColor: Palette.blue }]}>
          <View style={{ flex: 1, gap: 4 }}>
            <AppText variant="caption" style={{ color: '#C9D8FF', fontWeight: '700' }}>
              INSTANT CASHOUT
            </AppText>
            <AppText variant="headline" style={{ color: '#fff' }}>
              Got unused items in closet?
            </AppText>
            <AppText variant="caption" style={{ color: '#E4ECFF' }}>
              List in 30s. Verified local buyers ready in Phnom Penh.
            </AppText>
          </View>
          <View style={styles.sellNow}>
            <AppText variant="caption" style={{ color: Palette.blue, fontWeight: '700' }}>
              Sell Now
            </AppText>
          </View>
        </View>
      </Pressable>

      <Section title="Flash Nearby Drops" onSeeAll={() => router.push('/discover')}>
        <ProductRail loading={nearby.isLoading} products={nearby.data?.slice(0, 6) ?? []} />
      </Section>

      <Section title="Recommended For You" trailing="Sort: Best Match">
        <View style={styles.grid}>
          {(recommended.isLoading ? [] : recommended.data?.slice(0, 4) ?? []).map((product) => (
            <View key={product.id} style={styles.gridItem}>
              <ProductCard product={product} />
            </View>
          ))}
          {recommended.isLoading ? (
            <>
              <View style={styles.gridItem}>
                <ProductCardSkeleton />
              </View>
              <View style={styles.gridItem}>
                <ProductCardSkeleton />
              </View>
            </>
          ) : null}
        </View>
      </Section>

      <EscrowBanner />
    </ScrollView>
  );
}

function Section({
  title,
  children,
  onSeeAll,
  trailing,
}: {
  title: string;
  children: ReactNode;
  onSeeAll?: () => void;
  trailing?: string;
}) {
  return (
    <View style={{ gap: 12 }}>
      <View style={styles.sectionHead}>
        <AppText variant="title3">{title}</AppText>
        {onSeeAll ? (
          <Pressable onPress={onSeeAll}>
            <AppText variant="caption" color="tint">
              See all ›
            </AppText>
          </Pressable>
        ) : (
          <AppText variant="caption" color="secondary">
            {trailing}
          </AppText>
        )}
      </View>
      {children}
    </View>
  );
}

function ProductRail({ products, loading }: { products: Product[]; loading: boolean }) {
  if (loading) {
    return (
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ width: 168 }}>
          <ProductCardSkeleton />
        </View>
        <View style={{ width: 168 }}>
          <ProductCardSkeleton />
        </View>
      </View>
    );
  }
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
      {products.map((product) => (
        <View key={product.id} style={{ width: 168 }}>
          <ProductCard product={product} />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  greet: { gap: 8 },
  pills: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  live: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.pill },
  chips: { gap: 8 },
  bannerWrap: { borderRadius: Radius.xl, overflow: 'hidden' },
  banner: {
    borderRadius: Radius.xl,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sellNow: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: Radius.pill,
  },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: { width: '48%' },
});
