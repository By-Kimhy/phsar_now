import Ionicons from '@expo/vector-icons/Ionicons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { queryClient } from '@/api/query-client';
import { queryKeys } from '@/api/query-keys';
import { FakeQr } from '@/components/marketplace/fake-qr';
import { ScreenHeader } from '@/components/navigation/screen-header';
import { TransactionTimeline } from '@/components/transaction/transaction-timeline';
import { AppText } from '@/components/ui/app-text';
import { Avatar } from '@/components/ui/avatar';
import { GlassButton } from '@/components/ui/glass-button';
import { GlassCard } from '@/components/ui/glass-card';
import { Price } from '@/components/ui/price';
import { CURRENT_USER_ID } from '@/mock/users';
import { orderService, productService, userService } from '@/services';
import { useTheme } from '@/hooks/use-theme';
import { Palette, Radius, ScreenPadding, Spacing } from '@/theme';
import { convertMoney } from '@/utils/money';

const CHECKS = [
  'Cosmetic condition & glass finish',
  'Serial & IMEI match listing',
  'iCloud & Apple ID signed out',
  'Device boots & buttons respond',
];

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [checked, setChecked] = useState([true, true, true, false]);
  const order = useQuery({ queryKey: queryKeys.orders.detail(id), queryFn: () => orderService.getOrderById(id) });
  const product = useQuery({
    queryKey: queryKeys.products.detail(order.data?.productId ?? ''),
    queryFn: () => productService.getProductById(order.data?.productId ?? ''),
    enabled: Boolean(order.data?.productId),
  });
  const seller = useQuery({
    queryKey: queryKeys.users.detail(order.data?.sellerId ?? ''),
    queryFn: () => userService.getUserById(order.data?.sellerId ?? ''),
    enabled: Boolean(order.data?.sellerId),
  });
  const advance = useMutation({
    mutationFn: async () => {
      if (!order.data) return;
      const next = order.data.status === 'delivery' ? 'completed' : 'delivery';
      return orderService.updateStatus(id, next);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(id) });
    },
  });

  if (!order.data) return null;
  const current = order.data;
  const mine = current.buyerId === CURRENT_USER_ID;
  const done = current.status === 'completed';
  const handover = current.status === 'delivery';
  const khr = convertMoney(current.price, 'KHR');
  const sellerId = current.sellerId;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{ paddingTop: insets.top, paddingHorizontal: ScreenPadding, paddingBottom: 40, gap: Spacing.four }}>
      <ScreenHeader title={done ? 'Transaction Receipt' : handover ? 'Escrow in Progress' : 'Checkout Flow'} />
      {done ? (
        <View style={styles.badge}><AppText variant="caption" style={{ color: Palette.success }}>Settled & Released</AppText></View>
      ) : (
        <View style={styles.live}><AppText variant="caption" style={{ color: Palette.blue }}>Escrow vault protected</AppText></View>
      )}
      <GlassCard>
        <AppText variant="caption" color="secondary">ORDER REFERENCE</AppText>
        <AppText variant="title3">#{current.id.replace('ord_', 'PN-').toUpperCase()}</AppText>
        {product.data ? (
          <View style={styles.row}>
            <Image source={{ uri: product.data.images[0] }} style={styles.thumb} />
            <View style={{ flex: 1 }}>
              <AppText variant="headline">{product.data.title}</AppText>
              <Price value={current.price} />
              <AppText variant="caption" color="tertiary">≈ {khr.amount.toLocaleString()} KHR</AppText>
            </View>
          </View>
        ) : null}
      </GlassCard>
      {seller.data ? (
        <Pressable onPress={() => router.push(`/seller/${seller.data?.id}`)} style={styles.row}>
          <Avatar uri={seller.data.avatar} size={40} />
          <View>
            <AppText variant="subhead">{seller.data.name}</AppText>
            <AppText variant="caption" color="secondary">{mine ? 'Seller' : 'Buyer'} · {current.meetupLocation ?? 'Safe hub'}</AppText>
          </View>
        </Pressable>
      ) : null}
      <TransactionTimeline status={current.status} />
      {handover ? (
        <>
          <GlassCard>
            <AppText variant="headline">Escrow QR Handshake</AppText>
            <AppText variant="caption" color="secondary">Present this cryptographic code after inspection.</AppText>
            <FakeQr seed={current.id} caption="Agent may override with this token if camera fails" />
            <AppText variant="title3" style={{ textAlign: 'center' }}>849  281</AppText>
          </GlassCard>
          <GlassCard>
            <AppText variant="headline">Inspection Checklist</AppText>
            {CHECKS.map((item, index) => (
              <Pressable key={item} onPress={() => setChecked((current) => current.map((value, i) => (i === index ? !value : value)))} style={styles.check}>
                <Ionicons name={checked[index] ? 'checkbox' : 'square-outline'} size={20} color={checked[index] ? Palette.success : theme.textTertiary} />
                <AppText style={{ flex: 1 }}>{item}</AppText>
              </Pressable>
            ))}
          </GlassCard>
        </>
      ) : null}
      {done ? (
        <GlassCard>
          <AppText variant="headline">Settlement Ledger</AppText>
          <AppText>Agreed item price · ${current.price.amount.toFixed(2)}</AppText>
          <AppText color="tint">NBC Bakong Rail Clearing · Free</AppText>
          <AppText color="tint">PhsarNow SafeGuard · Waived</AppText>
          <Price value={current.price} size="lg" />
        </GlassCard>
      ) : null}
      {!done && current.status !== 'cancelled' ? (
        <GlassButton loading={advance.isPending} onPress={() => advance.mutate()}>
          {handover ? `Confirm Inspection & Release $${current.price.amount.toFixed(0)}` : 'Open QR Handshake Code'}
        </GlassButton>
      ) : null}
      {handover ? (
        <GlassButton variant="ghost" onPress={() => router.push({ pathname: '/orders/dispute', params: { orderId: id } })}>
          Report Issue / Call Station Agent
        </GlassButton>
      ) : null}
      {done ? (
        <>
          <GlassButton onPress={() => router.push({ pathname: '/orders/review', params: { orderId: id } })}>
            Leave Review & Rating
          </GlassButton>
          <GlassButton variant="ghost" onPress={() => router.push(`/reviews/${sellerId}`)}>
            View seller reviews
          </GlassButton>
        </>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  badge: { alignSelf: 'flex-start', backgroundColor: '#E8F8EE', paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.pill },
  live: { alignSelf: 'flex-start', backgroundColor: '#E8EEFB', paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.pill },
  row: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  thumb: { width: 64, height: 64, borderRadius: Radius.md },
  check: { flexDirection: 'row', gap: 10, alignItems: 'center', paddingVertical: 8 },
});
