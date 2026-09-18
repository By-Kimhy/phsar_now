import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { GlassCard } from '@/components/ui/glass-card';
import { Price } from '@/components/ui/price';
import { Radius, Spacing } from '@/theme';
import type { Product } from '@/types';

export function ProductChatCard({ product }: { product: Product }) {
  return (
    <GlassCard padded={false} style={styles.card}>
      <Image source={{ uri: product.images[0] }} style={styles.image} />
      <View style={styles.meta}>
        <AppText variant="subhead" numberOfLines={1}>
          {product.title}
        </AppText>
        <Price value={product.price} size="sm" />
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: Radius.md,
    margin: Spacing.two,
  },
  meta: { flex: 1, paddingRight: Spacing.three, gap: 4 },
});
