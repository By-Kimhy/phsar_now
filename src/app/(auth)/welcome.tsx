import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { GlassButton } from '@/components/ui/glass-button';
import { GlassCard } from '@/components/ui/glass-card';
import { Screen } from '@/components/ui/screen';
import { APP_NAME } from '@/constants/app';
import { useTheme } from '@/hooks/use-theme';
import { useAuthStore } from '@/store/auth-store';
import { Palette, Radius, Spacing } from '@/theme';

export default function WelcomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const login = useAuthStore((state) => state.login);
  const [phone, setPhone] = useState('12 345 678');
  const [lang, setLang] = useState<'en' | 'km'>('en');

  const continuePhone = () => {
    router.push({ pathname: '/(auth)/otp', params: { phone: `+855 ${phone}` } });
  };

  const demo = async () => {
    await login('sokha@phsarnow.app', 'password');
    router.replace('/home');
  };

  return (
    <Screen scroll style={{ gap: Spacing.four }}>
      <View style={styles.top}>
        <View style={styles.nbc}>
          <Ionicons name="shield-checkmark" size={12} color={Palette.success} />
          <AppText variant="caption" style={{ color: Palette.success }}>NBC Monitored Escrow</AppText>
        </View>
        <Pressable onPress={() => setLang(lang === 'en' ? 'km' : 'en')} style={styles.lang}>
          <AppText variant="caption">{lang === 'en' ? 'ខ្មែរ' : 'EN'}</AppText>
        </Pressable>
      </View>
      <View style={styles.center}>
        <Image source={require('@/assets/images/phsarnow.jpg')} style={styles.logo} contentFit="contain" />
        <AppText variant="title">{APP_NAME}</AppText>
        <AppText variant="subhead" color="secondary" style={{ textAlign: 'center' }}>
          Cambodia's Trusted C2C Escrow Marketplace
        </AppText>
      </View>
      <GlassCard>
        <Fact icon="lock-closed" title="100% Escrow Protection" hint="Funds locked in ABA Bank & Bakong until in-person inspection." />
      </GlassCard>
      <GlassCard>
        <Fact icon="location" title="Verified Safe Hubs" hint="AEON Mall designated drop points with on-site CCTV verification." />
      </GlassCard>
      <GlassCard>
        <Fact icon="swap-horizontal" title="Single Account, Dual Roles" hint="Buy authentic gear or sell pre-owned luxury without switching identity." />
      </GlassCard>
      <AppText variant="headline">Get Started</AppText>
      <AppText color="secondary">Enter your mobile number to receive a secure Bakong-verified OTP.</AppText>
      <View style={[styles.phone, { borderColor: theme.border, backgroundColor: theme.backgroundElevated }]}>
        <AppText>🇰🇭 +855</AppText>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholder="12 345 678"
          placeholderTextColor={theme.textTertiary}
          style={[styles.input, { color: theme.text }]}
        />
      </View>
      <GlassButton onPress={continuePhone}>Continue with Mobile Number</GlassButton>
      <AppText variant="caption" color="tertiary" style={{ textAlign: 'center' }}>OR CONNECT WITH</AppText>
      <GlassButton variant="secondary" onPress={demo}>Bakong KHQR Citizen ID</GlassButton>
      <GlassButton variant="secondary" onPress={demo}>Sign in with Apple</GlassButton>
      <GlassButton variant="secondary" onPress={demo}>Sign in with Google</GlassButton>
      <GlassButton variant="ghost" onPress={() => router.push('/(auth)/login')}>Log in with email</GlassButton>
      <AppText variant="caption" color="tertiary" style={{ textAlign: 'center' }}>
        By signing up, you agree to PhsarNow's Terms of Service, Privacy Notice, and Escrow Safeguard Policy.
      </AppText>
    </Screen>
  );
}

function Fact({ icon, title, hint }: { icon: keyof typeof Ionicons.glyphMap; title: string; hint: string }) {
  const theme = useTheme();
  return (
    <View style={{ flexDirection: 'row', gap: 10 }}>
      <Ionicons name={icon} size={18} color={theme.tint} />
      <View style={{ flex: 1 }}>
        <AppText variant="headline">{title}</AppText>
        <AppText variant="caption" color="secondary">{hint}</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  nbc: { flexDirection: 'row', gap: 6, alignItems: 'center', backgroundColor: '#E8F8EE', paddingHorizontal: 10, paddingVertical: 6, borderRadius: Radius.pill },
  lang: { backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.pill },
  center: { alignItems: 'center', gap: 6 },
  logo: { width: 84, height: 84, borderRadius: 20 },
  phone: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 54, borderRadius: Radius.pill, borderWidth: StyleSheet.hairlineWidth, paddingHorizontal: 16 },
  input: { flex: 1, fontSize: 16 },
});
