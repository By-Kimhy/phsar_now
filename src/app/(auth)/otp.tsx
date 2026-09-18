import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ScreenHeader } from '@/components/navigation/screen-header';
import { AppText } from '@/components/ui/app-text';
import { GlassButton } from '@/components/ui/glass-button';
import { Screen } from '@/components/ui/screen';
import { OTP_CODE } from '@/constants/app';
import { authService } from '@/services';
import { useAuthStore } from '@/store/auth-store';
import { useTheme } from '@/hooks/use-theme';
import { Palette, Radius, Spacing } from '@/theme';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'] as const;

export default function OtpScreen() {
  const theme = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ phone?: string; from?: string }>();
  const login = useAuthStore((state) => state.login);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const pushDigit = (digit: string) => {
    setError('');
    if (digit === 'del') {
      setCode((current) => current.slice(0, -1));
      return;
    }
    if (!digit || code.length >= 6) return;
    setCode((current) => current + digit);
  };

  return (
    <Screen>
      <ScreenHeader title="" />
      <View style={styles.secure}>
        <AppText variant="caption" style={{ color: Palette.success }}>PHSARNOW SECURE</AppText>
      </View>
      <AppText variant="title2" style={{ textAlign: 'center' }}>Verify Mobile Number</AppText>
      <AppText variant="subhead" color="secondary" style={{ textAlign: 'center' }}>
        We sent a 6-digit verification code to {params.phone ?? '+855'} via SMS. Demo code is {OTP_CODE}.
      </AppText>
      <View style={styles.boxes}>
        {Array.from({ length: 6 }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.box,
              {
                borderColor: code.length === index ? Palette.blue : theme.border,
                backgroundColor: theme.backgroundElevated,
              },
            ]}>
            <AppText variant="title2">{code[index] ?? ''}</AppText>
          </View>
        ))}
      </View>
      {error ? <AppText color="danger" style={{ textAlign: 'center' }}>{error}</AppText> : null}
      <GlassButton
        onPress={async () => {
          const ok = await authService.verifyOtp(code || OTP_CODE);
          if (!ok) {
            setError('Invalid code');
            return;
          }
          if (params.from === 'register') {
            router.push('/(auth)/complete-profile');
            return;
          }
          await login('sokha@phsarnow.app', 'password');
          router.replace('/home');
        }}>
        Verify & Continue
      </GlassButton>
      <View style={styles.keys}>
        {KEYS.map((key) => (
          <Pressable key={key || 'blank'} onPress={() => pushDigit(key)} style={styles.key} disabled={!key}>
            <AppText variant="title2">{key === 'del' ? '⌫' : key}</AppText>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  secure: { alignSelf: 'center', backgroundColor: '#E8F8EE', paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.pill },
  boxes: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginVertical: Spacing.four },
  box: {
    width: 46,
    height: 56,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keys: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: Spacing.four },
  key: { width: '30%', minHeight: 52, alignItems: 'center', justifyContent: 'center' },
});
