import Ionicons from '@expo/vector-icons/Ionicons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { queryClient } from '@/api/query-client';
import { queryKeys } from '@/api/query-keys';
import { ScreenHeader } from '@/components/navigation/screen-header';
import { AppText } from '@/components/ui/app-text';
import { Avatar } from '@/components/ui/avatar';
import { GlassButton } from '@/components/ui/glass-button';
import { GlassCard } from '@/components/ui/glass-card';
import { GlassChip } from '@/components/ui/glass-chip';
import { Price } from '@/components/ui/price';
import { orderService, productService, userService } from '@/services';
import { useTheme } from '@/hooks/use-theme';
import { Palette, Radius, ScreenPadding, Spacing } from '@/theme';

const TAGS = ['Pristine Condition', 'Lightning Fast Handover', 'Trustworthy Seller', 'Smooth Escrow Inspection'];

export default function OrderReviewScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [stars, setStars] = useState(5);
  const [text, setText] = useState('');
  const [selected, setSelected] = useState<string[]>(['Pristine Condition']);
  const [anon, setAnon] = useState(false);
  const order = useQuery({
    queryKey: queryKeys.orders.detail(orderId),
    queryFn: () => orderService.getOrderById(orderId),
  });
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
  const submit = useMutation({
    mutationFn: async () => {
      if (!order.data) return;
      return userService.submitReview({
        targetId: order.data.sellerId,
        productId: order.data.productId,
        rating: stars,
        text: text || selected.join(', '),
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.users.reviews(order.data?.sellerId ?? '') });
      router.back();
    },
  });

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{ paddingTop: insets.top, paddingHorizontal: ScreenPadding, paddingBottom: 40, gap: Spacing.four }}>
      <ScreenHeader title="Rate Your Experience" />
      {seller.data && product.data ? (
        <GlassCard>
          <View style={styles.row}>
            <Avatar uri={seller.data.avatar} size={44} />
            <View style={{ flex: 1 }}>
              <AppText variant="headline">{seller.data.name}</AppText>
              <AppText variant="caption" color="secondary">{product.data.title}</AppText>
            </View>
            <Price value={order.data?.price ?? product.data.price} size="sm" />
          </View>
        </GlassCard>
      ) : null}
      <AppText variant="headline" style={{ textAlign: 'center' }}>How was your overall experience?</AppText>
      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((value) => (
          <Pressable key={value} onPress={() => setStars(value)}>
            <Ionicons name={value <= stars ? 'star' : 'star-outline'} size={32} color={Palette.gold} />
          </Pressable>
        ))}
      </View>
      <AppText variant="caption" color="tint" style={{ textAlign: 'center' }}>
        {stars === 5 ? 'Exceptional experience' : `${stars} / 5`}
      </AppText>
      <View style={styles.wrap}>
        {TAGS.map((tag) => (
          <GlassChip
            key={tag}
            label={tag}
            selected={selected.includes(tag)}
            onPress={() =>
              setSelected((current) => (current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]))
            }
          />
        ))}
      </View>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Detailed feedback"
        placeholderTextColor={theme.textTertiary}
        multiline
        style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.backgroundElevated }]}
      />
      <View style={styles.row}>
        <AppText style={{ flex: 1 }}>Anonymous buyer mode</AppText>
        <Switch value={anon} onValueChange={setAnon} />
      </View>
      <GlassButton loading={submit.isPending} onPress={() => submit.mutate()}>
        Submit Review & Handover Rating
      </GlassButton>
      <GlassButton variant="ghost" onPress={() => router.back()}>Skip for now</GlassButton>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stars: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  input: {
    minHeight: 110,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 12,
    textAlignVertical: 'top',
  },
});
