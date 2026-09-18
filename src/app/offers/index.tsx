import { useMutation, useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { queryClient } from '@/api/query-client';
import { queryKeys } from '@/api/query-keys';
import { OfferMessage } from '@/components/chat/offer-message';
import { ScreenHeader } from '@/components/navigation/screen-header';
import { AppText } from '@/components/ui/app-text';
import { EmptyState } from '@/components/ui/states';
import { GlassBottomSheet } from '@/components/ui/glass-bottom-sheet';
import { GlassButton } from '@/components/ui/glass-button';
import { CURRENT_USER_ID } from '@/mock/users';
import { offerService, productService } from '@/services';
import { useTheme } from '@/hooks/use-theme';
import { ScreenPadding } from '@/theme';
import { money } from '@/utils/money';

export default function OffersScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ productId?: string; make?: string }>();
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(params.make === '1');
  const offers = useQuery({ queryKey: queryKeys.offers.all, queryFn: () => offerService.getOffers() });
  const product = useQuery({
    queryKey: queryKeys.products.detail(params.productId ?? ''),
    queryFn: () => productService.getProductById(params.productId ?? ''),
    enabled: Boolean(params.productId),
  });
  const create = useMutation({
    mutationFn: () =>
      offerService.createOffer({
        productId: params.productId ?? '',
        amount: money(Number(amount) || 0, product.data?.price.currency ?? 'USD'),
        message,
      }),
    onSuccess: async () => {
      setOpen(false);
      await queryClient.invalidateQueries({ queryKey: queryKeys.offers.all });
    },
  });

  return (
    <View style={{ flex: 1, backgroundColor: theme.background, paddingTop: insets.top }}>
      <View style={{ paddingHorizontal: ScreenPadding }}>
        <ScreenHeader title="Offers" />
      </View>
      <FlatList
        data={offers.data ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, gap: 12 }}
        ListEmptyComponent={
          <EmptyState title="No offers yet" subtitle="Make an offer from a product page to start negotiating." />
        }
        renderItem={({ item }) => (
          <OfferMessage
            offer={item}
            canRespond={item.sellerId === CURRENT_USER_ID && (item.status === 'pending' || item.status === 'countered')}
            onAccept={() =>
              void offerService.acceptOffer(item.id).then(() => queryClient.invalidateQueries({ queryKey: queryKeys.offers.all }))
            }
            onDecline={() =>
              void offerService.declineOffer(item.id).then(() => queryClient.invalidateQueries({ queryKey: queryKeys.offers.all }))
            }
            onCounter={() => router.push(`/offers/${item.id}`)}
          />
        )}
      />
      <GlassBottomSheet visible={open} onClose={() => setOpen(false)} height="50%">
        <AppText variant="title3">Make offer</AppText>
        <AppText color="secondary">{product.data?.title}</AppText>
        <TextInput
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          placeholder="Amount"
          placeholderTextColor={theme.textTertiary}
          style={[styles.input, { color: theme.text, borderColor: theme.border }]}
        />
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Optional message"
          placeholderTextColor={theme.textTertiary}
          style={[styles.input, { color: theme.text, borderColor: theme.border }]}
        />
        <GlassButton loading={create.isPending} onPress={() => create.mutate()}>
          Send offer
        </GlassButton>
      </GlassBottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: 48,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 14,
    paddingHorizontal: 12,
    marginTop: 12,
  },
});
