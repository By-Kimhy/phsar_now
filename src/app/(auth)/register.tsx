import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';

import { ScreenHeader } from '@/components/navigation/screen-header';
import { AppText } from '@/components/ui/app-text';
import { GlassButton } from '@/components/ui/glass-button';
import { Screen } from '@/components/ui/screen';
import { useTheme } from '@/hooks/use-theme';
import { useAuthStore } from '@/store/auth-store';
import { Radius, Spacing } from '@/theme';

export default function RegisterScreen() {
  const theme = useTheme();
  const router = useRouter();
  const register = useAuthStore((state) => state.register);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+855 ');

  return (
    <Screen>
      <ScreenHeader title="Create account" />
      <AppText variant="subhead" color="secondary">
        One account for buying and selling.
      </AppText>
      {[
        { value: name, set: setName, placeholder: 'Full name' },
        { value: email, set: setEmail, placeholder: 'Email' },
        { value: phone, set: setPhone, placeholder: 'Phone' },
      ].map((field) => (
        <TextInput
          key={field.placeholder}
          value={field.value}
          onChangeText={field.set}
          placeholder={field.placeholder}
          placeholderTextColor={theme.textTertiary}
          style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.backgroundElevated }]}
        />
      ))}
      <GlassButton
        onPress={async () => {
          await register(name || 'New member', email || 'new@phsarnow.app', phone);
          router.push('/(auth)/otp?from=register');
        }}>
        Continue
      </GlassButton>
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
  },
});
