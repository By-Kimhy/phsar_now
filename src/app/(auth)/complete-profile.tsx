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

export default function CompleteProfileScreen() {
  const theme = useTheme();
  const router = useRouter();
  const completeProfile = useAuthStore((state) => state.completeProfile);
  const user = useAuthStore((state) => state.user);
  const [name, setName] = useState(user?.name ?? '');
  const [location, setLocation] = useState(user?.location ?? 'Phnom Penh');

  return (
    <Screen>
      <ScreenHeader title="Complete profile" />
      <AppText variant="subhead" color="secondary">
        This helps neighbors trust you when you buy or sell.
      </AppText>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Name"
        placeholderTextColor={theme.textTertiary}
        style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.backgroundElevated }]}
      />
      <TextInput
        value={location}
        onChangeText={setLocation}
        placeholder="Location"
        placeholderTextColor={theme.textTertiary}
        style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.backgroundElevated }]}
      />
      <GlassButton
        onPress={async () => {
          await completeProfile({ name, location });
          router.replace('/home');
        }}>
        Enter marketplace
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
