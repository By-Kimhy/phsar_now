import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { queryKeys } from '@/api/query-keys';
import { BrandHeader } from '@/components/navigation/brand-header';
import { AppText } from '@/components/ui/app-text';
import { Avatar } from '@/components/ui/avatar';
import { EmptyState } from '@/components/ui/states';
import { GlassChip } from '@/components/ui/glass-chip';
import { Price } from '@/components/ui/price';
import { CURRENT_USER_ID } from '@/mock/users';
import { messageService, offerService, productService, userService } from '@/services';
import { Radius, ScreenPadding, Spacing } from '@/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatRelativeTime } from '@/utils/format';

export default function MessagesScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<'all' | 'offers' | 'selling'>('all');
  const query = useQuery({
    queryKey: queryKeys.messages.conversations,
    queryFn: () => messageService.getConversations(),
  });
  const offers = useQuery({ queryKey: queryKeys.offers.all, queryFn: () => offerService.getOffers() });
  const conversations = (query.data ?? []).filter((item) => {
    if (tab === 'selling') return item.sellerId === CURRENT_USER_ID;
    if (tab === 'offers') return offers.data?.some((offer) => offer.conversationId === item.id);
    return true;
  });

  return (
    <View style={{ flex: 1, backgroundColor: theme.background, paddingTop: insets.top + 8 }}>
      <View style={{ paddingHorizontal: ScreenPadding, gap: 12 }}>
        <BrandHeader />
        <AppText variant="title">Messages</AppText>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <GlassChip label="All Messages" selected={tab === 'all'} onPress={() => setTab('all')} />
          <GlassChip label={`Active Offers ${offers.data?.length ?? 0}`} selected={tab === 'offers'} onPress={() => setTab('offers')} />
          <GlassChip label="Selling" selected={tab === 'selling'} onPress={() => setTab('selling')} />
        </View>
      </View>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: ScreenPadding, paddingBottom: 130, paddingTop: 8 }}
        ListEmptyComponent={
          query.isLoading ? null : (
            <EmptyState icon="chatbubble-ellipses-outline" title="No messages yet" subtitle="Chat a seller when you find something you like." />
          )
        }
        renderItem={({ item }) => (
          <ConversationRow
            conversationId={item.id}
            productId={item.productId}
            otherId={item.buyerId === CURRENT_USER_ID ? item.sellerId : item.buyerId}
            lastMessage={item.lastMessage}
            time={item.lastMessageAt}
            unread={item.unreadCount}
            onPress={() => router.push(`/chat/${item.id}`)}
          />
        )}
      />
    </View>
  );
}

function ConversationRow({
  conversationId,
  productId,
  otherId,
  lastMessage,
  time,
  unread,
  onPress,
}: {
  conversationId: string;
  productId: string;
  otherId: string;
  lastMessage: string;
  time: string;
  unread: number;
  onPress: () => void;
}) {
  const theme = useTheme();
  const user = useQuery({ queryKey: queryKeys.users.detail(otherId), queryFn: () => userService.getUserById(otherId) });
  const product = useQuery({
    queryKey: queryKeys.products.detail(productId),
    queryFn: () => productService.getProductById(productId),
  });

  return (
    <Pressable onPress={onPress} style={[styles.card, { backgroundColor: theme.backgroundElevated, borderColor: theme.border }]}>
      <Avatar uri={user.data?.avatar ?? ''} size={48} />
      <View style={{ flex: 1, gap: 2 }}>
        <View style={styles.top}>
          <AppText variant="headline">{user.data?.name ?? 'Seller'}</AppText>
          <AppText variant="caption" color="tertiary">{formatRelativeTime(time)}</AppText>
        </View>
        {product.data ? <Price value={product.data.price} size="sm" /> : null}
        <AppText variant="caption" color="secondary" numberOfLines={1}>{product.data?.title}</AppText>
        <AppText variant="subhead" color={unread ? 'text' : 'secondary'} numberOfLines={1}>{lastMessage}</AppText>
      </View>
      <Image source={{ uri: product.data?.images[0] }} style={styles.thumb} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: Spacing.three,
  },
  top: { flexDirection: 'row', justifyContent: 'space-between' },
  thumb: { width: 52, height: 52, borderRadius: Radius.md, backgroundColor: '#ddd' },
});
