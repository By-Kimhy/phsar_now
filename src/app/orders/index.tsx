import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { FlatList, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { queryKeys } from '@/api/query-keys';
import { ScreenHeader } from '@/components/navigation/screen-header';
import { AppText } from '@/components/ui/app-text';
import { EmptyState } from '@/components/ui/states';
import { GlassCard } from '@/components/ui/glass-card';
import { Price } from '@/components/ui/price';
import { orderService, productService } from '@/services';
import { useTheme } from '@/hooks/use-theme';
import { Palette, ScreenPadding } from '@/theme';
import type { TransactionStatus } from '@/types';

function statusLabel(status: TransactionStatus): string {
  switch (status) {
    case 'completed':
      return 'Settled & released';
    case 'delivery':
      return 'Escrow in progress';
    case 'cancelled':
      return 'Cancelled';
    default:
      return 'Funds locked in escrow';
  }
}

export default function OrdersScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const orders = useQuery({ queryKey: queryKeys.orders.all, queryFn: () => orderService.getOrders() });

  return (
    <View style={{ flex: 1, backgroundColor: theme.background, paddingTop: insets.top }}>
      <View style={{ paddingHorizontal: ScreenPadding }}>
        <ScreenHeader title="Orders & Escrow" />
      </View>
      <FlatList
        data={orders.data ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, gap: 12 }}
        ListEmptyComponent={<EmptyState title="No transactions yet" subtitle="Buy or sell something to see it here." />}
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push(`/orders/${item.id}`)}>
            <OrderPreview productId={item.productId} status={item.status} price={item.price} orderId={item.id} />
          </Pressable>
        )}
      />
    </View>
  );
}

function OrderPreview({
  orderId,
  productId,
  status,
  price,
}: {
  orderId: string;
  productId: string;
  status: TransactionStatus;
  price: { amount: number; currency: 'USD' | 'KHR' };
}) {
  const product = useQuery({
    queryKey: queryKeys.products.detail(productId),
    queryFn: () => productService.getProductById(productId),
  });
  return (
    <GlassCard>
      <AppText variant="caption" color="tint">#{orderId.replace('ord_', 'PN-').toUpperCase()}</AppText>
      <AppText variant="headline">{product.data?.title ?? 'Order'}</AppText>
      <Price value={price} size="sm" />
      <AppText variant="caption" style={{ color: status === 'completed' ? Palette.success : Palette.blue }}>
        {statusLabel(status)}
      </AppText>
    </GlassCard>
  );
}
