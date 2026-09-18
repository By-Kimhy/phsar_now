import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, SectionList, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { queryKeys } from '@/api/query-keys';
import { BrandHeader } from '@/components/navigation/brand-header';
import { AppText } from '@/components/ui/app-text';
import { GlassButton } from '@/components/ui/glass-button';
import { GlassCard } from '@/components/ui/glass-card';
import { GlassChip } from '@/components/ui/glass-chip';
import { notificationService } from '@/services';
import { useTheme } from '@/hooks/use-theme';
import { formatDateGroup, formatRelativeTime } from '@/utils/format';
import { Palette, ScreenPadding } from '@/theme';
import type { AppNotification, NotificationType } from '@/types';

const FILTERS: { id: 'all' | NotificationType | 'offers' | 'orders' | 'system'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'offers', label: 'Offers & Bids' },
  { id: 'orders', label: 'Orders' },
  { id: 'system', label: 'System' },
];

export default function NotificationsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<(typeof FILTERS)[number]['id']>('all');
  const query = useQuery({
    queryKey: queryKeys.notifications,
    queryFn: () => notificationService.getNotifications(),
  });
  const unread = (query.data ?? []).filter((item) => !item.read).length;
  const filtered = (query.data ?? []).filter((item) => {
    if (tab === 'all') return true;
    if (tab === 'offers') return ['newOffer', 'offerAccepted', 'counterOffer'].includes(item.type);
    if (tab === 'orders') return ['transactionUpdate', 'productSold'].includes(item.type);
    if (tab === 'system') return ['savedSearch', 'listingActivity', 'priceDrop'].includes(item.type);
    return item.type === tab;
  });
  const grouped = Object.entries(
    filtered.reduce<Record<string, AppNotification[]>>((acc, item) => {
      const key = formatDateGroup(item.createdAt);
      acc[key] = [...(acc[key] ?? []), item];
      return acc;
    }, {}),
  ).map(([title, data]) => ({ title, data }));

  return (
    <View style={{ flex: 1, backgroundColor: theme.background, paddingTop: insets.top }}>
      <View style={{ paddingHorizontal: ScreenPadding, gap: 12 }}>
        <BrandHeader />
        <View style={styles.head}>
          <AppText variant="title">Notifications</AppText>
          {unread ? (
            <View style={styles.unread}>
              <AppText variant="caption" style={{ color: '#fff' }}>{unread} unread</AppText>
            </View>
          ) : null}
          <GlassButton variant="ghost" onPress={() => void notificationService.markAllRead().then(() => query.refetch())}>
            Mark all read
          </GlassButton>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {FILTERS.map((item) => (
            <GlassChip key={item.id} label={item.label} selected={tab === item.id} onPress={() => setTab(item.id)} />
          ))}
        </View>
      </View>
      <SectionList
        sections={grouped}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, gap: 8, paddingBottom: 120 }}
        renderSectionHeader={({ section }) => (
          <AppText variant="headline" style={{ marginTop: 12 }}>
            {section.title}
          </AppText>
        )}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              void notificationService.markRead(item.id);
              if (item.conversationId) router.push(`/chat/${item.conversationId}`);
              else if (item.orderId) router.push(`/orders/${item.orderId}`);
              else if (item.productId) router.push(`/product/${item.productId}`);
            }}>
            <GlassCard>
              <View style={styles.row}>
                {!item.read ? <View style={styles.dot} /> : null}
                <View style={{ flex: 1 }}>
                  <AppText variant="headline">{item.title}</AppText>
                  <AppText color="secondary">{item.body}</AppText>
                  <AppText variant="caption" color="tertiary">{formatRelativeTime(item.createdAt)}</AppText>
                </View>
              </View>
            </GlassCard>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  unread: { backgroundColor: Palette.blue, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  row: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Palette.blue, marginTop: 6 },
});
