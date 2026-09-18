import Ionicons from '@expo/vector-icons/Ionicons';
import * as Sharing from 'expo-sharing';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/api/query-keys';
import { EscrowBanner } from '@/components/marketplace/escrow-banner';
import { ImageCarousel, ImageViewer } from '@/components/product/image-carousel';
import { AppText } from '@/components/ui/app-text';
import { Avatar } from '@/components/ui/avatar';
import { GlassButton } from '@/components/ui/glass-button';
import { GlassCard } from '@/components/ui/glass-card';
import { IconButton } from '@/components/ui/icon-button';
import { Price } from '@/components/ui/price';
import { ErrorState, SkeletonBlock } from '@/components/ui/states';
import { useProduct } from '@/hooks/use-products';
import { useToggleFavorite } from '@/hooks/use-toggle-favorite';
import { useTheme } from '@/hooks/use-theme';
import { messageService, userService } from '@/services';
import { Palette, Radius, Spacing } from '@/theme';
import { formatRelativeTime, neighborhood } from '@/utils/format';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const productQuery = useProduct(id);
  const product = productQuery.data;
  const sellerQuery = useQuery({
    queryKey: queryKeys.users.detail(product?.sellerId ?? ''),
    queryFn: () => userService.getUserById(product?.sellerId ?? ''),
    enabled: Boolean(product?.sellerId),
  });
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const favorite = useToggleFavorite();
  const [viewer, setViewer] = useState<number | null>(null);

  if (productQuery.isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.background, padding: 20, gap: 12 }}>
        <SkeletonBlock height={360} />
        <SkeletonBlock height={28} width="70%" />
      </View>
    );
  }
  if (!product) {
    return <ErrorState message="This listing is unavailable." onRetry={() => router.back()} />;
  }

  const specs = Object.entries(product.specs);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        <ImageCarousel images={product.images} onOpen={setViewer} />
        <View style={[styles.floatingNav, { top: insets.top + 8 }]}>
          <IconButton name="chevron-back" accessibilityLabel="Back" onPress={() => router.back()} />
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <IconButton name="share-outline" accessibilityLabel="Share" onPress={async () => {
              if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(product.images[0]);
            }} />
            <IconButton
              name={product.isFavorite ? 'heart' : 'heart-outline'}
              accessibilityLabel="Favorite"
              onPress={() => favorite.mutate(product.id)}
            />
          </View>
        </View>
        <View style={{ padding: 20, gap: 12 }}>
          <View style={styles.row}>
            <View style={styles.verified}>
              <Ionicons name="shield-checkmark" size={14} color={Palette.success} />
              <AppText variant="caption" style={{ color: Palette.success }}>Authentic Check Passed</AppText>
            </View>
            <AppText variant="caption" color="secondary">
              {neighborhood(product.location)} · {formatRelativeTime(product.createdAt)}
            </AppText>
          </View>
          <AppText variant="title2">{product.title}</AppText>
          <View style={styles.row}>
            <Price value={product.price} size="lg" />
            {product.negotiable ? (
              <View style={styles.tag}>
                <AppText variant="caption" color="tint">Negotiable</AppText>
              </View>
            ) : null}
            <View style={[styles.tag, { backgroundColor: '#E8F8EE' }]}>
              <AppText variant="caption" style={{ color: Palette.success }}>Free Handover</AppText>
            </View>
          </View>
          <AppText variant="caption" color="tertiary">DEVICE SPECIFICATIONS</AppText>
          <View style={styles.specGrid}>
            {specs.map(([key, value]) => (
              <View key={key} style={[styles.spec, { backgroundColor: theme.backgroundElevated, borderColor: theme.border }]}>
                <AppText variant="caption" color="secondary">{key}</AppText>
                <AppText variant="headline">{value}</AppText>
              </View>
            ))}
          </View>
          <AppText variant="headline">Description</AppText>
          <AppText color="secondary">{product.description}</AppText>
          <EscrowBanner compact />
          {sellerQuery.data ? (
            <Pressable onPress={() => router.push(`/seller/${product.sellerId}`)}>
              <GlassCard>
                <View style={styles.seller}>
                  <Avatar uri={sellerQuery.data.avatar} size={52} />
                  <View style={{ flex: 1 }}>
                    <AppText variant="headline">{sellerQuery.data.name}</AppText>
                    <AppText variant="caption" color="secondary">
                      {sellerQuery.data.rating.toFixed(1)} · {sellerQuery.data.reviewCount} reviews
                    </AppText>
                    <AppText variant="caption" color="tertiary">
                      {sellerQuery.data.soldCount} items sold · Replies &lt; 15 mins
                    </AppText>
                  </View>
                  <AppText variant="caption" color="tint">View Profile</AppText>
                </View>
              </GlassCard>
            </Pressable>
          ) : null}
          <GlassCard>
            <AppText variant="headline">Recommended Safe Handover</AppText>
            <AppText variant="caption" color="secondary">
              Seller agrees to in-person inspection at high-traffic verified cafes.
            </AppText>
            <AppText variant="subhead" style={{ marginTop: 8 }}>Brown Coffee Roastery (BKK1)</AppText>
            <AppText variant="caption" color="tertiary">1.8 km · Safe Exchange Zone</AppText>
          </GlassCard>
        </View>
      </ScrollView>
      <View style={[styles.actionWrap, { paddingBottom: insets.bottom + 10, backgroundColor: theme.backgroundElevated }]}>
        <GlassButton variant="secondary" style={{ flex: 1 }} onPress={async () => {
          const result = await messageService.sendMessage({
            productId: product.id,
            recipientId: product.sellerId,
            text: 'Hi, is this still available?',
          });
          router.push(`/chat/${result.conversation.id}`);
        }}>
          Chat
        </GlassButton>
        <GlassButton variant="secondary" style={{ flex: 1 }} onPress={() => router.push({ pathname: '/offers', params: { productId: product.id, make: '1' } })}>
          Make Offer
        </GlassButton>
        <GlassButton style={{ flex: 1.1 }} onPress={() => router.push({ pathname: '/orders/confirm', params: { productId: product.id } })}>
          Buy Now
        </GlassButton>
      </View>
      <ImageViewer images={product.images} index={viewer ?? 0} visible={viewer !== null} onClose={() => setViewer(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  floatingNav: { position: 'absolute', left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  verified: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#E8F8EE', paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.pill },
  tag: { backgroundColor: '#E8EEFB', paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.pill },
  specGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  spec: { width: '48%', padding: 12, borderRadius: Radius.lg, borderWidth: StyleSheet.hairlineWidth, gap: 4 },
  seller: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  actionWrap: { position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', gap: Spacing.two, padding: 12 },
});
