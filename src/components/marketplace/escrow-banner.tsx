import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { GlassCard } from '@/components/ui/glass-card';
import { Palette, Spacing } from '@/theme';
import { useTheme } from '@/hooks/use-theme';

export function EscrowBanner({ compact }: { compact?: boolean }) {
  const theme = useTheme();
  return (
    <GlassCard>
      <View style={styles.head}>
        <View style={styles.icon}>
          <Ionicons name="shield-checkmark" size={18} color={Palette.blue} />
        </View>
        <View style={{ flex: 1 }}>
          <AppText variant="headline">PhsarNow Escrow Guard</AppText>
          <AppText variant="caption" color="secondary">
            {compact
              ? 'Funds stay locked until you meet the seller.'
              : 'Money is held safely until you meet and accept items in person. 100% scam-proof peer commerce across Cambodia.'}
          </AppText>
        </View>
      </View>
      {compact ? null : (
        <View style={styles.row}>
          <Fact icon="lock-closed" label="ABA Escrow" hint="Funds locked" />
          <Fact icon="qr-code" label="In-person QR" hint="Confirm & release" />
          <Fact icon="chatbubbles" label="Khmer Support" hint="24/7 hotline" />
        </View>
      )}
    </GlassCard>
  );
}

function Fact({ icon, label, hint }: { icon: keyof typeof Ionicons.glyphMap; label: string; hint: string }) {
  const theme = useTheme();
  return (
    <View style={styles.fact}>
      <Ionicons name={icon} size={16} color={theme.tint} />
      <AppText variant="caption">{label}</AppText>
      <AppText variant="caption" color="tertiary">
        {hint}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8EEFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', marginTop: Spacing.four, gap: 8 },
  fact: { flex: 1, alignItems: 'center', gap: 4 },
});
