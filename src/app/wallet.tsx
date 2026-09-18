import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/navigation/screen-header';
import { AppText } from '@/components/ui/app-text';
import { GlassButton } from '@/components/ui/glass-button';
import { GlassCard } from '@/components/ui/glass-card';
import { GlassChip } from '@/components/ui/glass-chip';
import { useTheme } from '@/hooks/use-theme';
import { Palette, Radius, ScreenPadding, Spacing } from '@/theme';

const PRESETS = [100, 250, 500] as const;

export default function WalletScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [amount, setAmount] = useState(1240);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{ paddingTop: insets.top, paddingHorizontal: ScreenPadding, paddingBottom: 40, gap: Spacing.four }}>
      <ScreenHeader title="Escrow Wallet" />
      <View style={styles.hero}>
        <AppText variant="caption" style={{ color: '#D7E3FF' }}>PROTECTED BY PHSARNOW ESCROW</AppText>
        <AppText variant="caption" style={{ color: '#D7E3FF' }}>Available Escrow Balance</AppText>
        <AppText variant="title" style={{ color: '#fff' }}>$1,240.00 USD</AppText>
        <AppText variant="caption" style={{ color: '#D7E3FF' }}>≈ 5,084,000 KHR</AppText>
      </View>
      <GlassCard>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <AppText variant="headline">ABA Bank PayWay</AppText>
            <AppText variant="caption" color="secondary">Account ···9802 · Instant Bakong rail</AppText>
          </View>
          <Ionicons name="card" size={22} color={Palette.blue} />
        </View>
      </GlassCard>
      <AppText variant="headline">Cashout Amount</AppText>
      <AppText variant="title2">${amount.toFixed(2)}</AppText>
      <View style={styles.row}>
        {PRESETS.map((value) => (
          <GlassChip key={value} label={`$${value}`} selected={amount === value} onPress={() => setAmount(value)} />
        ))}
        <GlassChip label="Max" selected={amount === 1240} onPress={() => setAmount(1240)} />
      </View>
      <GlassButton onPress={() => Alert.alert('Mock payout', 'Instant ABA payout is simulated. No real money is moved.')}>
        Instant Payout to ABA Bank (${amount.toFixed(0)}.00)
      </GlassButton>
      <AppText variant="title3">Escrow Settlements</AppText>
      <GlassCard>
        <AppText variant="headline">iPad Pro M2 11" 256GB</AppText>
        <AppText color="tint">+$580.00 · Cleared & Settled</AppText>
      </GlassCard>
      <GlassCard>
        <AppText variant="headline">iPhone 15 Pro 128GB</AppText>
        <AppText color="tint">+$700.00 · Cleared & Settled</AppText>
      </GlassCard>
      <Pressable onPress={() => router.push('/orders')}>
        <AppText color="tint">View all transactions</AppText>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hero: { backgroundColor: Palette.blue, borderRadius: Radius.xl, padding: 20, gap: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
});
