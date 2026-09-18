import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { ConditionBadge } from '@/components/product/condition-badge';
import { AppText } from '@/components/ui/app-text';
import { Price } from '@/components/ui/price';
import { useToggleFavorite } from '@/hooks/use-toggle-favorite';
import { useFavoriteStore } from '@/store/favorite-store';
import { Radius, Shadows, Spacing } from '@/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Product } from '@/types';
import { formatDistance, neighborhood } from '@/utils/format';

type Props = {
  product: Product;
};

function ProductCardComponent({ product }: Props) {
  const theme = useTheme();
  const router = useRouter();
  const favorite = useFavoriteStore((state) => state.ids.includes(product.id));
  const toggleFavorite = useToggleFavorite();
  const scale = useSharedValue(1);
  const heart = useSharedValue(favorite ? 1 : 0);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const heartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 0.85 + heart.value * 0.2 }],
  }));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${product.title}, ${product.price.amount} ${product.price.currency}`}
      onPressIn={() => {
        scale.value = withSpring(0.98, { damping: 18, stiffness: 220 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 16, stiffness: 180 });
      }}
      onPress={() => router.push(`/product/${product.id}`)}>
      <Animated.View
        style={[
          styles.card,
          Shadows.card,
          { backgroundColor: theme.backgroundElevated, borderColor: theme.border },
          cardStyle,
        ]}>
        <View>
          <Image
            source={{ uri: product.images[0] }}
            style={styles.image}
            contentFit="cover"
            placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
            transition={180}
          />
          <ConditionBadge condition={product.condition} />
          <Pressable
            accessibilityLabel={favorite ? 'Remove from favorites' : 'Save to favorites'}
            hitSlop={8}
            onPress={() => {
              heart.value = withSpring(favorite ? 0 : 1);
              toggleFavorite.mutate(product.id);
            }}
            style={styles.heart}>
            <Animated.View style={heartStyle}>
              <Ionicons name={favorite ? 'heart' : 'heart-outline'} size={16} color={favorite ? '#E11D48' : '#5B6B86'} />
            </Animated.View>
          </Pressable>
        </View>
        <View style={styles.body}>
          <Price value={product.price} size="md" />
          <AppText variant="subhead" numberOfLines={2}>
            {product.title}
          </AppText>
          <View style={styles.meta}>
            <Ionicons name="location-outline" size={12} color={theme.textTertiary} />
            <AppText variant="caption" color="tertiary" numberOfLines={1}>
              {formatDistance(product.distanceKm)} · {neighborhood(product.location)}
            </AppText>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

export const ProductCard = memo(ProductCardComponent);

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: Spacing.three,
  },
  image: {
    width: '100%',
    aspectRatio: 1.05,
    backgroundColor: '#DDE0EE',
  },
  heart: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  body: {
    padding: Spacing.three,
    gap: 4,
  },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});
