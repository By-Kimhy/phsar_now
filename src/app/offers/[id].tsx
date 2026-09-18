import { useMutation, useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { queryClient } from '@/api/query-client';
import { queryKeys } from '@/api/query-keys';
import { OfferMessage } from '@/components/chat/offer-message';
import { ScreenHeader } from '@/components/navigation/screen-header';
import { AppText } from '@/components/ui/app-text';
import { GlassButton } from '@/components/ui/glass-button';
import { offerService } from '@/services';
import { useTheme } from '@/hooks/use-theme';
import { ScreenPadding } from '@/theme';
import { money } from '@/utils/money';

export default function OfferDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [amount, setAmount] = useState('');
  const offer = useQuery({ queryKey: queryKeys.offers.detail(id), queryFn: () => offerService.getOfferById(id) });
  const counter = useMutation({
    mutationFn: () => offerService.counterOffer(id, money(Number(amount) || 0, offer.data?.amount.currency ?? 'USD')),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.offers.all });
      router.back();
    },
  });

  if (!offer.data) return null;

  return (
    <View style={{ flex: 1, backgroundColor: theme.background, paddingTop: insets.top, paddingHorizontal: ScreenPadding, gap: 12 }}>
      <ScreenHeader title="Counter offer" />
      <OfferMessage offer={offer.data} />
      <AppText variant="headline">Your counter</AppText>
      <TextInput
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
        placeholder="Amount"
        placeholderTextColor={theme.textTertiary}
        style={[styles.input, { color: theme.text, borderColor: theme.border }]}
      />
      <GlassButton loading={counter.isPending} onPress={() => counter.mutate()}>
        Send counter
      </GlassButton>
    </View>
  );
}

const styles = StyleSheet.create({
  input: { minHeight: 48, borderWidth: StyleSheet.hairlineWidth, borderRadius: 14, paddingHorizontal: 12 },
});
