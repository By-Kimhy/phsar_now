import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/navigation/screen-header';
import { AppText } from '@/components/ui/app-text';
import { GlassButton } from '@/components/ui/glass-button';
import { GlassCard } from '@/components/ui/glass-card';
import { useTheme } from '@/hooks/use-theme';
import { Palette, ScreenPadding, Spacing } from '@/theme';

const ISSUES = [
  { id: 'condition', title: 'Item Condition Mismatch', hint: 'Scratch, battery, or cosmetics differ from listing.' },
  { id: 'imei', title: 'IMEI / Serial Does Not Match', hint: 'Hardware serial does not correlate with listing.' },
  { id: 'accessories', title: 'Missing Original Accessories', hint: 'Branded cable, box, or extras missing at station.' },
  { id: 'noshow', title: 'Seller Did Not Show Up', hint: '15-minute grace period elapsed at station.' },
] as const;

export default function DisputeScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [issue, setIssue] = useState<(typeof ISSUES)[number]['id']>('condition');

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{ paddingTop: insets.top, paddingHorizontal: ScreenPadding, paddingBottom: 40, gap: Spacing.four }}>
      <ScreenHeader title="Escrow Frozen & Protected" />
      <GlassCard>
        <AppText variant="caption" color="tint">Order #{orderId?.replace('ord_', 'PN-').toUpperCase()}</AppText>
        <AppText variant="headline">100% Protection Active</AppText>
        <AppText color="secondary">Funds stay locked in ABA PayWay escrow until this dispute is mediated or verified.</AppText>
      </GlassCard>
      <AppText variant="headline">Dispute Classification</AppText>
      {ISSUES.map((item) => (
        <Pressable key={item.id} onPress={() => setIssue(item.id)}>
          <GlassCard style={issue === item.id ? { borderColor: Palette.blue, borderWidth: 1.5 } : undefined}>
            <AppText variant="headline">{item.title}</AppText>
            <AppText variant="caption" color="secondary">{item.hint}</AppText>
          </GlassCard>
        </Pressable>
      ))}
      <GlassCard>
        <AppText variant="headline">Authorized Resolution Pathways</AppText>
        <AppText>Counter-offer at station · recommended</AppText>
        <AppText color="secondary">Compensate for condition difference and settle at a discounted rate.</AppText>
      </GlassCard>
      <GlassButton onPress={() => Alert.alert('Mock settlement', 'Adjusted settlement is simulated.')}>
        Propose $640 Adjusted Settlement
      </GlassButton>
      <GlassButton
        variant="danger"
        onPress={() => {
          Alert.alert('Mock refund', 'Instant 100% escrow refund is simulated.');
          router.back();
        }}>
        Execute Instant 100% Escrow Refund
      </GlassButton>
    </ScrollView>
  );
}
