import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { GlassButton } from '@/components/ui/glass-button';
import { Screen } from '@/components/ui/screen';
import { ScreenHeader } from '@/components/navigation/screen-header';
import { useTheme } from '@/hooks/use-theme';
import { useAuthStore } from '@/store/auth-store';
import { Radius, Spacing } from '@/theme';

export default function LoginScreen() {
  const theme = useTheme();
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const [email, setEmail] = useState('sokha@phsarnow.app');
  const [password, setPassword] = useState('password');

  return (
    <Screen>
      <ScreenHeader title="Log in" />
      <AppText variant="subhead" color="secondary">
        Use any password. This version uses mock authentication.
      </AppText>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="Email"
        placeholderTextColor={theme.textTertiary}
        style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.backgroundElevated }]}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Password"
        placeholderTextColor={theme.textTertiary}
        style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.backgroundElevated }]}
      />
      <GlassButton
        loading={loading}
        onPress={async () => {
          await login(email, password);
          router.replace('/home');
        }}>
        Continue
      </GlassButton>
      <View style={{ gap: 8 }}>
        <GlassButton variant="ghost" onPress={() => router.push('/(auth)/forgot-password')}>
          Forgot password
        </GlassButton>
        <GlassButton variant="ghost" onPress={() => router.push('/(auth)/register')}>
          Create an account
        </GlassButton>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: 52,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.four,
    marginTop: Spacing.three,
    marginBottom: Spacing.two,
  },
});
