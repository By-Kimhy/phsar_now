import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { queryKeys } from '@/api/query-keys';
import { ScreenHeader } from '@/components/navigation/screen-header';
import { ProductGrid } from '@/components/product/product-grid';
import { AppText } from '@/components/ui/app-text';
import { GlassButton } from '@/components/ui/glass-button';
import { GlassCard } from '@/components/ui/glass-card';
import { GlassChip } from '@/components/ui/glass-chip';
import { GlassSearchBar } from '@/components/ui/glass-search-bar';
import { EmptyState } from '@/components/ui/states';
import { CONDITIONS, TRENDING_SEARCHES } from '@/constants/app';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useTheme } from '@/hooks/use-theme';
import { favoriteService, productService } from '@/services';
import { useFilterStore } from '@/store/filter-store';
import { Radius, ScreenPadding, Spacing } from '@/theme';
import type { ProductCondition, ProductSort } from '@/types';

const SORTS: { id: ProductSort; label: string }[] = [
  { id: 'recommended', label: 'Best Match' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'nearby', label: 'Nearby' },
];

export default function SearchScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ q?: string }>();
  const filters = useFilterStore((state) => state.filters);
  const patch = useFilterStore((state) => state.patch);
  const reset = useFilterStore((state) => state.reset);
  const [query, setQuery] = useState(params.q ?? filters.query ?? '');
  const [showResults, setShowResults] = useState(Boolean(params.q));
  const [safeZone, setSafeZone] = useState(true);
  const [escrow, setEscrow] = useState(true);
  const [verified, setVerified] = useState(true);
  const [min, setMin] = useState(String(filters.minPrice ?? 50));
  const [max, setMax] = useState(String(filters.maxPrice ?? 2000));
  const [grades, setGrades] = useState<ProductCondition[]>(
    filters.conditions ?? (filters.condition && filters.condition !== 'all' ? [filters.condition] : []),
  );
  const debounced = useDebouncedValue(query, 280);

  const recent = useQuery({ queryKey: ['recent-searches'], queryFn: () => favoriteService.getRecentSearches() });
  const results = useQuery({
    queryKey: queryKeys.products.search(debounced, { ...filters, conditions: grades }),
    queryFn: async () => {
      if (debounced) await favoriteService.addRecentSearch(debounced);
      return productService.searchProducts(debounced, {
        ...filters,
        query: debounced,
        minPrice: Number(min) || undefined,
        maxPrice: Number(max) || undefined,
        conditions: grades,
        condition: grades.length === 1 ? grades[0] : 'all',
      });
    },
  });

  const toggleGrade = (id: ProductCondition) => {
    setGrades((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  const apply = () => {
    patch({
      query: debounced,
      minPrice: Number(min) || undefined,
      maxPrice: Number(max) || undefined,
      conditions: grades,
      condition: grades.length === 1 ? grades[0] : 'all',
    });
    setShowResults(true);
    void results.refetch();
  };

  const header = useMemo(
    () => (
      <View style={{ gap: 14, paddingBottom: 12 }}>
        <View style={styles.wrap}>
          {SORTS.map((item) => (
            <GlassChip
              key={item.id}
              label={item.label}
              selected={(filters.sort ?? 'recommended') === item.id}
              onPress={() => patch({ sort: item.id })}
            />
          ))}
        </View>
        <GlassCard>
          <AppText variant="headline">Budget Range</AppText>
          <View style={styles.row}>
            <TextInput
              keyboardType="numeric"
              value={min}
              onChangeText={setMin}
              placeholder="Min"
              placeholderTextColor={theme.textTertiary}
              style={[styles.input, { color: theme.text, borderColor: theme.border }]}
            />
            <TextInput
              keyboardType="numeric"
              value={max}
              onChangeText={setMax}
              placeholder="Max"
              placeholderTextColor={theme.textTertiary}
              style={[styles.input, { color: theme.text, borderColor: theme.border }]}
            />
          </View>
          <AppText variant="caption" color="tint" style={{ marginTop: 8 }}>
            Phnom Penh market avg $420 – $850
          </AppText>
        </GlassCard>
        <GlassCard>
          <AppText variant="headline">Condition Grade</AppText>
          <View style={[styles.wrap, { marginTop: 8 }]}>
            {CONDITIONS.map((item) => (
              <GlassChip
                key={item.id}
                label={item.label}
                selected={grades.includes(item.id)}
                onPress={() => toggleGrade(item.id)}
              />
            ))}
          </View>
        </GlassCard>
        <GlassCard>
          <AppText variant="headline">Buyer Protection</AppText>
          <Toggle label="Verified SafeZones only" value={safeZone} onValueChange={setSafeZone} />
          <Toggle label="Escrow Guarantee Guard" value={escrow} onValueChange={setEscrow} />
          <Toggle label="Tier 2+ ID verified sellers" value={verified} onValueChange={setVerified} />
        </GlassCard>
        <GlassCard>
          <AppText variant="headline">Location & Perimeter</AppText>
          <AppText variant="caption" color="secondary">BKK1, Chamkarmon</AppText>
          <View style={[styles.wrap, { marginTop: 8 }]}>
            {[1, 5, 15, 50].map((km) => (
              <GlassChip
                key={km}
                label={km === 50 ? 'All Phnom Penh' : `${km} km`}
                selected={filters.maxDistanceKm === km}
                onPress={() => patch({ maxDistanceKm: km })}
              />
            ))}
          </View>
        </GlassCard>
        <AppText variant="headline">Recent Searches</AppText>
        <View style={styles.wrap}>
          {(recent.data ?? []).map((item) => (
            <GlassChip key={item} label={item} onPress={() => setQuery(item)} />
          ))}
        </View>
        <AppText variant="headline">Trending in Electronics</AppText>
        <View style={styles.wrap}>
          {TRENDING_SEARCHES.map((item) => (
            <GlassChip key={item} label={`# ${item}`} onPress={() => setQuery(item)} />
          ))}
        </View>
        {showResults ? <AppText variant="headline">{results.data?.length ?? 0} results</AppText> : null}
      </View>
    ),
    [filters.maxDistanceKm, filters.sort, grades, max, min, recent.data, results.data?.length, safeZone, escrow, verified, showResults, theme.border, theme.text, theme.textTertiary],
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.background, paddingTop: insets.top }}>
      <View style={{ paddingHorizontal: ScreenPadding }}>
        <ScreenHeader title="Search" />
        <GlassSearchBar value={query} onChangeText={setQuery} autoFocus onSubmit={apply} />
      </View>
      {showResults && (results.data?.length ?? 0) === 0 && !results.isLoading ? (
        <EmptyState title="No matches" subtitle="Try another keyword or loosen the filters." />
      ) : showResults ? (
        <ProductGrid products={results.data ?? []} loading={results.isLoading} ListHeaderComponent={header} />
      ) : (
        <ScrollView contentContainerStyle={{ padding: ScreenPadding, paddingBottom: 120, gap: 14 }}>{header}</ScrollView>
      )}
      <View style={[styles.footer, { backgroundColor: theme.background, paddingBottom: insets.bottom + 12 }]}>
        <Pressable onPress={() => { reset(); setGrades([]); setMin('50'); setMax('2000'); setShowResults(false); }}>
          <AppText color="tint">Reset</AppText>
        </Pressable>
        <GlassButton onPress={apply} style={{ flex: 1 }}>
          Show {results.data?.length ?? 0} Results
        </GlassButton>
      </View>
    </View>
  );
}

function Toggle({ label, value, onValueChange }: { label: string; value: boolean; onValueChange: (value: boolean) => void }) {
  return (
    <View style={styles.toggle}>
      <AppText variant="subhead" style={{ flex: 1 }}>{label}</AppText>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  row: { flexDirection: 'row', gap: 8, marginTop: 8 },
  input: {
    flex: 1,
    minHeight: 48,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.lg,
    paddingHorizontal: 12,
    backgroundColor: '#F8FAFF',
  },
  toggle: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: ScreenPadding,
    paddingTop: 10,
  },
});
