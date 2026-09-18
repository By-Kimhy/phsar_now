import Ionicons from '@expo/vector-icons/Ionicons';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { queryKeys } from '@/api/query-keys';
import { ScreenHeader } from '@/components/navigation/screen-header';
import { AppText } from '@/components/ui/app-text';
import { Avatar } from '@/components/ui/avatar';
import { GlassButton } from '@/components/ui/glass-button';
import { GlassCard } from '@/components/ui/glass-card';
import { GlassChip } from '@/components/ui/glass-chip';
import { userService } from '@/services';
import { useTheme } from '@/hooks/use-theme';
import { Palette, Radius, ScreenPadding, Spacing } from '@/theme';
import { formatRelativeTime } from '@/utils/format';

export default function ReviewsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const seller = useQuery({ queryKey: queryKeys.users.detail(id), queryFn: () => userService.getUserById(id) });
  const reviews = useQuery({ queryKey: queryKeys.users.reviews(id), queryFn: () => userService.getReviews(id) });
  const authors = useQuery({
    queryKey: ['review-authors', id],
    queryFn: async () => {
      const rows = reviews.data ?? [];
      const people = await Promise.all(rows.map((row) => userService.getUserById(row.authorId)));
      return Object.fromEntries(rows.map((row, index) => [row.authorId, people[index]]));
    },
    enabled: Boolean(reviews.data?.length),
  });

  if (!seller.data) return null;
  const count = reviews.data?.length ?? 0;
  const fives = reviews.data?.filter((item) => item.rating === 5).length ?? 0;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{ paddingTop: insets.top, paddingHorizontal: ScreenPadding, paddingBottom: 40, gap: Spacing.four }}>
      <ScreenHeader title="Trust & Reviews" />
      <View style={styles.hero}>
        <AppText variant="title">{seller.data.rating.toFixed(1)}</AppText>
        <AppText style={{ color: Palette.gold }}>{'★★★★★'}</AppText>
        <AppText color="secondary">{seller.data.reviewCount} verified reviews</AppText>
      </View>
      <View style={styles.row}>
        <Pill label="100% Item as described" />
        <Pill label="99.8% On-time handover" />
        <Pill label={`<10 mins quick response`} />
        <Pill label={`${seller.data.soldCount} deals completed`} />
      </View>
      <View style={styles.row}>
        <GlassChip label={`All (${count})`} selected />
        <GlassChip label={`5★ (${fives})`} />
      </View>
      {(reviews.data ?? []).map((review) => {
        const author = authors.data?.[review.authorId];
        return (
          <GlassCard key={review.id}>
            <View style={styles.author}>
              <Avatar uri={author?.avatar ?? ''} size={36} />
              <View style={{ flex: 1 }}>
                <AppText variant="headline">{author?.name ?? 'Buyer'}</AppText>
                <AppText variant="caption" color="tertiary">{formatRelativeTime(review.createdAt)}</AppText>
              </View>
              <AppText variant="headline">{review.rating.toFixed(1)}</AppText>
            </View>
            <AppText>{review.text}</AppText>
            <View style={styles.tag}><AppText variant="caption" style={{ color: Palette.success }}>Verified escrow handover</AppText></View>
          </GlassCard>
        );
      })}
      <GlassCard>
        <AppText variant="headline">Escrow Guarantee</AppText>
        <AppText color="secondary">Your Bakong payment stays securely held until you inspect and approve the gadget.</AppText>
      </GlassCard>
      <GlassButton onPress={() => router.push(`/seller/${id}`)}>Active Items</GlassButton>
    </ScrollView>
  );
}

function Pill({ label }: { label: string }) {
  const theme = useTheme();
  return (
    <View style={[styles.pill, { backgroundColor: theme.backgroundElement }]}>
      <Ionicons name="checkmark-circle" size={14} color={Palette.success} />
      <AppText variant="caption">{label}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: 4 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: { flexDirection: 'row', gap: 4, alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: Radius.pill },
  author: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  tag: { alignSelf: 'flex-start', backgroundColor: '#E8F8EE', paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.pill, marginTop: 8 },
});
