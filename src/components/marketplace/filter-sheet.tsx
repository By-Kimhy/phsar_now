import { CATEGORIES, CONDITIONS } from '@/constants/app';
import { GlassBottomSheet } from '@/components/ui/glass-bottom-sheet';
import { GlassButton } from '@/components/ui/glass-button';
import { GlassChip } from '@/components/ui/glass-chip';
import { AppText } from '@/components/ui/app-text';
import { useFilterStore } from '@/store/filter-store';
import type { ProductCondition, ProductSort } from '@/types';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Spacing } from '@/theme';
import { useTheme } from '@/hooks/use-theme';

const SORTS: { id: ProductSort; label: string }[] = [
  { id: 'recommended', label: 'Recommended' },
  { id: 'newest', label: 'Newest' },
  { id: 'price-asc', label: 'Price low → high' },
  { id: 'price-desc', label: 'Price high → low' },
  { id: 'nearby', label: 'Nearby' },
];

export function FilterSheet({
  visible,
  onClose,
  onApply,
}: {
  visible: boolean;
  onClose: () => void;
  onApply: () => void;
}) {
  const theme = useTheme();
  const filters = useFilterStore((state) => state.filters);
  const patch = useFilterStore((state) => state.patch);
  const reset = useFilterStore((state) => state.reset);

  return (
    <GlassBottomSheet visible={visible} onClose={onClose}>
      <AppText variant="title3">Filters</AppText>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <AppText variant="headline" style={styles.section}>
          Sort
        </AppText>
        <View style={styles.wrap}>
          {SORTS.map((item) => (
            <GlassChip
              key={item.id}
              label={item.label}
              selected={filters.sort === item.id}
              onPress={() => patch({ sort: item.id })}
            />
          ))}
        </View>
        <AppText variant="headline" style={styles.section}>
          Category
        </AppText>
        <View style={styles.wrap}>
          <GlassChip label="All" selected={!filters.category || filters.category === 'all'} onPress={() => patch({ category: 'all' })} />
          {CATEGORIES.filter((item) => item.id !== 'more').map((item) => (
            <GlassChip
              key={item.id}
              label={item.label}
              selected={filters.category === item.id}
              onPress={() => patch({ category: item.id })}
            />
          ))}
        </View>
        <AppText variant="headline" style={styles.section}>
          Condition
        </AppText>
        <View style={styles.wrap}>
          <GlassChip label="Any" selected={!filters.condition || filters.condition === 'all'} onPress={() => patch({ condition: 'all' })} />
          {CONDITIONS.map((item) => (
            <GlassChip
              key={item.id}
              label={item.label}
              selected={filters.condition === item.id}
              onPress={() => patch({ condition: item.id as ProductCondition })}
            />
          ))}
        </View>
        <AppText variant="headline" style={styles.section}>
          Price
        </AppText>
        <View style={styles.priceRow}>
          <TextInput
            keyboardType="numeric"
            placeholder="Min"
            placeholderTextColor={theme.textTertiary}
            value={filters.minPrice?.toString() ?? ''}
            onChangeText={(text) => patch({ minPrice: text ? Number(text) : undefined })}
            style={[styles.input, { color: theme.text, borderColor: theme.border }]}
          />
          <TextInput
            keyboardType="numeric"
            placeholder="Max"
            placeholderTextColor={theme.textTertiary}
            value={filters.maxPrice?.toString() ?? ''}
            onChangeText={(text) => patch({ maxPrice: text ? Number(text) : undefined })}
            style={[styles.input, { color: theme.text, borderColor: theme.border }]}
          />
        </View>
        <AppText variant="headline" style={styles.section}>
          Distance
        </AppText>
        <View style={styles.wrap}>
          {[5, 15, 50].map((km) => (
            <GlassChip
              key={km}
              label={`${km} km`}
              selected={filters.maxDistanceKm === km}
              onPress={() => patch({ maxDistanceKm: km })}
            />
          ))}
          <GlassChip label="Any" selected={!filters.maxDistanceKm} onPress={() => patch({ maxDistanceKm: undefined })} />
        </View>
        <AppText variant="headline" style={styles.section}>
          Listed
        </AppText>
        <View style={styles.wrap}>
          {(['any', '24h', '7d', '30d'] as const).map((item) => (
            <GlassChip
              key={item}
              label={item === 'any' ? 'Any time' : item}
              selected={(filters.dateListed ?? 'any') === item}
              onPress={() => patch({ dateListed: item })}
            />
          ))}
        </View>
      </ScrollView>
      <View style={styles.actions}>
        <GlassButton variant="ghost" onPress={reset} style={{ flex: 1 }}>
          Reset
        </GlassButton>
        <GlassButton
          onPress={() => {
            onApply();
            onClose();
          }}
          style={{ flex: 1 }}>
          Apply
        </GlassButton>
      </View>
    </GlassBottomSheet>
  );
}

const styles = StyleSheet.create({
  scroll: { marginTop: Spacing.four },
  section: { marginTop: Spacing.four, marginBottom: Spacing.two },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  priceRow: { flexDirection: 'row', gap: Spacing.two },
  input: {
    flex: 1,
    minHeight: 44,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  actions: { flexDirection: 'row', gap: Spacing.two, marginTop: Spacing.four },
});
