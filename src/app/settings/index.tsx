import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/navigation/screen-header';
import { AppText } from '@/components/ui/app-text';
import { Avatar } from '@/components/ui/avatar';
import { GlassButton } from '@/components/ui/glass-button';
import { GlassCard } from '@/components/ui/glass-card';
import { GlassChip } from '@/components/ui/glass-chip';
import { useTheme } from '@/hooks/use-theme';
import { useAuthStore } from '@/store/auth-store';
import { useThemeStore } from '@/store/theme-store';
import { ScreenPadding, Spacing } from '@/theme';
import type { ThemePreference } from '@/types';

export default function SettingsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const preference = useThemeStore((state) => state.preference);
  const setPreference = useThemeStore((state) => state.setPreference);
  const [face, setFace] = useState(true);
  const [twofa, setTwofa] = useState(true);
  const [push, setPush] = useState(true);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background }} contentContainerStyle={{ paddingTop: insets.top, paddingHorizontal: ScreenPadding, paddingBottom: 40, gap: Spacing.four }}>
      <ScreenHeader
        title="Settings"
        right={
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <AppText color="tint">Done</AppText>
          </Pressable>
        }
      />
      <GlassCard>
        <View style={styles.row}>
          <Avatar uri={user?.avatar ?? ''} size={52} />
          <View style={{ flex: 1 }}>
            <AppText variant="headline">{user?.name}</AppText>
            <AppText variant="caption" color="secondary">{user?.email}</AppText>
            <AppText variant="caption" color="tint">ABA Instant Payout Enabled</AppText>
          </View>
        </View>
      </GlassCard>
      <AppText variant="caption" color="tertiary">APPEARANCE</AppText>
      <View style={styles.row}>
        {(['system', 'light', 'dark'] as ThemePreference[]).map((item) => (
          <GlassChip key={item} label={item} selected={preference === item} onPress={() => setPreference(item)} />
        ))}
      </View>
      <AppText variant="caption" color="tertiary">ACCOUNT & SECURITY</AppText>
      <GlassCard>
        <ToggleRow icon="person" label="Personal information & ID" hint="Used for escrow confirmations" value={true} onValueChange={() => undefined} />
        <ToggleRow icon="scan" label="Face ID & Biometrics" hint="Required to release confirmations" value={face} onValueChange={setFace} />
        <ToggleRow icon="card" label="Escrow / ABA Bank" hint="PayWay linked" value={true} onValueChange={() => undefined} />
        <ToggleRow icon="key" label="Two-Factor Authentication" hint="Authenticator App" value={twofa} onValueChange={setTwofa} />
      </GlassCard>
      <AppText variant="caption" color="tertiary">BUYING & SELLING</AppText>
      <GlassCard>
        <AppText variant="headline">Preferred Currency</AppText>
        <View style={[styles.row, { marginTop: 8 }]}>
          <GlassChip label="USD" selected />
          <GlassChip label="KHR" />
        </View>
        <AppText variant="headline" style={{ marginTop: 12 }}>Safe Exchange Zones</AppText>
        <AppText variant="caption" color="secondary">AEON Mall BKK1 · Chip Mong 271</AppText>
      </GlassCard>
      <AppText variant="caption" color="tertiary">NOTIFICATIONS</AppText>
      <GlassCard>
        <ToggleRow icon="notifications" label="Push Notifications" hint="Offers, bids & escrow requests" value={push} onValueChange={setPush} />
      </GlassCard>
      <AppText variant="caption" color="tertiary">TRUST, PRIVACY & LEGAL</AppText>
      <GlassCard>
        <AppText>PhsarNow Safeguard & Escrow Policy</AppText>
        <AppText color="secondary">Terms of Service & Community Guidelines</AppText>
      </GlassCard>
      <GlassButton variant="danger" onPress={async () => { await logout(); router.replace('/(auth)/welcome'); }}>
        Log Out
      </GlassButton>
    </ScrollView>
  );
}

function ToggleRow({
  icon,
  label,
  hint,
  value,
  onValueChange,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  hint: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  const theme = useTheme();
  return (
    <View style={styles.toggle}>
      <Ionicons name={icon} size={18} color={theme.tint} />
      <View style={{ flex: 1 }}>
        <AppText variant="subhead">{label}</AppText>
        <AppText variant="caption" color="tertiary">{hint}</AppText>
      </View>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  toggle: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
});
