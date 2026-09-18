import { type ReactElement, type ComponentType } from 'react';
import { FlatList, StyleSheet, useWindowDimensions, View } from 'react-native';

import { ProductCard } from '@/components/product/product-card';
import { ProductCardSkeleton } from '@/components/ui/states';
import { Spacing } from '@/theme';
import type { Product } from '@/types';

type Props = {
  products: Product[];
  loading?: boolean;
  ListHeaderComponent?: ComponentType | ReactElement | null;
  onEndReached?: () => void;
  refreshing?: boolean;
  onRefresh?: () => void;
};

export function ProductGrid({
  products,
  loading,
  ListHeaderComponent,
  onEndReached,
  refreshing,
  onRefresh,
}: Props) {
  const { width } = useWindowDimensions();
  const cardWidth = (Math.min(width, 800) - 40 - 12) / 2;

  if (loading) {
    return (
      <View style={styles.row}>
        <View style={{ width: cardWidth }}>
          <ProductCardSkeleton />
        </View>
        <View style={{ width: cardWidth }}>
          <ProductCardSkeleton />
        </View>
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.row}
      renderItem={({ item }) => (
        <View style={{ width: cardWidth }}>
          <ProductCard product={item} />
        </View>
      )}
      ListHeaderComponent={ListHeaderComponent}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.4}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    gap: Spacing.three,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  content: {
    paddingBottom: 120,
    gap: 0,
  },
});
