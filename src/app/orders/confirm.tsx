import Ionicons from '@expo/vector-icons/Ionicons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { queryClient } from '@/api/query-client';
import { queryKeys } from '@/api/query-keys';
import { ScreenHeader } from '@/components/navigation/screen-header';
import { AppText } from '@/components/ui/app-text';
import { Avatar } from '@/components/ui/avatar';
import { GlassButton } from '@/components/ui/glass-button';
import { GlassCard } from '@/components/ui/glass-card';
import { Price } from '@/components/ui/price';
import { orderService, paymentService, productService, userService } from '@/services';
import { useTheme } from '@/hooks/use-theme';
import type { FulfillmentMethod, Order } from '@/types';
import { Palette, Radius, ScreenPadding, Spacing } from '@/theme';
import { convertMoney } from '@/utils/money';
import { successHaptic } from '@/utils/haptics';

export default function OrderConfirmScreen() {
  const { productId, offerId } = useLocalSearchParams<{ productId: string; offerId?: string }>();
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [fulfillment, setFulfillment] = useState<FulfillmentMethod>('meetup');
  const [payment, setPayment] = useState<Order['paymentMethod']>('bank-transfer');
  const product = useQuery({
    queryKey: queryKeys.products.detail(productId),
    queryFn: () => productService.getProductById(productId),
  });
  const seller = useQuery({
    queryKey: queryKeys.users.detail(product.data?.sellerId ?? ''),
    queryFn: () => userService.getUserById(product.data?.sellerId ?? ''),
    enabled: Boolean(product.data?.sellerId),
  });
  const checkout = useMutation({
    mutationFn: async () => {
      await paymentService.chargeMock();
      return orderService.createOrder({
        productId,
        offerId,
        fulfillment,
        paymentMethod: payment,
        meetupLocation: fulfillment === 'meetup' ? 'AEON Mall BKK1 · Station 04' : undefined,
      });
    },
    onSuccess: async (order) => {
      await successHaptic();
      await queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      router.replace(`/orders/${order.id}`);
    },
  });

  if (!product.data) return null;
  const khr = convertMoney(product.data.price, 'KHR');

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top,
          paddingHorizontal: ScreenPadding,
          paddingBottom: 140,
          gap: Spacing.four,
        }}>
        <ScreenHeader title="Item Details" />
        <View style={styles.step}>
          <Ionicons name="shield-checkmark" size={16} color={Palette.blue} />
          <AppText variant="caption" color="tint">Escrow Lock & Authorization · Step 1 of 2</AppText>
        </View>
        <GlassCard>
          <View style={styles.row}>
            <Image source={{ uri: product.data.images[0] }} style={styles.thumb} />
            <View style={{ flex: 1, gap: 4 }}>
              <AppText variant="headline">{product.data.title}</AppText>
              <Price value={product.data.price} />
              <AppText variant="caption" color="tertiary">≈ {khr.amount.toLocaleString()} KHR</AppText>
            </View>
          </View>
          {seller.data ? (
            <Pressable onPress={() => router.push(`/seller/${seller.data?.id}`)} style={[styles.row, { marginTop: 12 }]}>
              <Avatar uri={seller.data.avatar} size={36} />
              <View style={{ flex: 1 }}>
                <AppText variant="subhead">{seller.data.name}</AppText>
                <AppText variant="caption" color="secondary">Tier 3 Verified · {seller.data.soldCount} Safe Deals</AppText>
              </View>
            </Pressable>
          ) : null}
        </GlassCard>
        <AppText variant="headline">Handover & Testing Method</AppText>
        <Pressable onPress={() => setFulfillment('meetup')} style={[styles.option, fulfillment === 'meetup' && styles.optionOn]}>
          <AppText variant="headline">Safe Exchange Hub · FREE</AppText>
          <AppText color="secondary">AEON Mall BKK1 Station #04 · CCTV booth · diagnostic toolkit</AppText>
        </Pressable>
        <Pressable onPress={() => setFulfillment('delivery')} style={[styles.option, fulfillment === 'delivery' && styles.optionOn]}>
          <AppText variant="headline">PhsarNow Express Courier · +$2.50</AppText>
          <AppText color="secondary">Doorstep delivery · Phnom Penh metro</AppText>
        </Pressable>
        <GlassCard>
          <AppText variant="headline">PhsarNow Escrow Safeguard</AppText>
          <AppText color="secondary">
            Your {product.data.price.amount.toFixed(2)} USD is locked into ABA PayWay escrow until you inspect in person.
          </AppText>
        </GlassCard>
        <AppText variant="headline">Payment Method</AppText>
        <Pressable onPress={() => setPayment('bank-transfer')} style={[styles.option, payment === 'bank-transfer' && styles.optionOn]}>
          <AppText variant="headline">ABA PayWay Instant</AppText>
          <AppText color="secondary">Savings account ···8821</AppText>
        </Pressable>
        <Pressable onPress={() => setPayment('cash')} style={[styles.option, payment === 'cash' && styles.optionOn]}>
          <AppText variant="headline">Bakong KHQR</AppText>
          <AppText color="secondary">Any banking app</AppText>
        </Pressable>
        <Pressable onPress={() => setPayment('card')} style={[styles.option, payment === 'card' && styles.optionOn]}>
          <AppText variant="headline">Visa / Mastercard</AppText>
          <AppText color="secondary">Intl / local cards · mocked</AppText>
        </Pressable>
        <GlassCard>
          <AppText variant="headline">Cost Breakdown</AppText>
          <Row label="Item subtotal" value={<Price value={product.data.price} size="sm" />} />
          <Row label="Escrow protection" value={<AppText color="tint">FREE PROMO</AppText>} />
          <Row label="Safe Hub booth" value={<AppText color="tint">FREE</AppText>} />
          <Row label="Total escrow amount" value={<Price value={product.data.price} />} />
        </GlassCard>
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12, backgroundColor: theme.background }]}>
        <GlassButton loading={checkout.isPending} onPress={() => checkout.mutate()}>
          Lock Funds in Escrow (${product.data.price.amount.toFixed(0)}.00)
        </GlassButton>
        <AppText variant="caption" color="tertiary" style={{ textAlign: 'center' }}>
          Payments are mocked. No real charges are made.
        </AppText>
      </View>
    </View>
  );
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <View style={styles.cost}>
      <AppText color="secondary">{label}</AppText>
      {value}
    </View>
  );
}

const styles = StyleSheet.create({
  step: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  thumb: { width: 72, height: 72, borderRadius: Radius.md },
  option: {
    padding: 14,
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    borderColor: 'rgba(18, 48, 107, 0.08)',
    backgroundColor: '#fff',
    gap: 4,
  },
  optionOn: { borderColor: Palette.blue, backgroundColor: '#EEF3FF' },
  cost: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: ScreenPadding, gap: 8 },
});
