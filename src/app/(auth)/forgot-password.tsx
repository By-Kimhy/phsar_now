import { useRouter } from 'expo-router';

import { ScreenHeader } from '@/components/navigation/screen-header';
import { AppText } from '@/components/ui/app-text';
import { GlassButton } from '@/components/ui/glass-button';
import { Screen } from '@/components/ui/screen';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  return (
    <Screen>
      <ScreenHeader title="Forgot password" />
      <AppText variant="subhead" color="secondary">
        Password reset is mocked in this version. Use demo login or the OTP flow.
      </AppText>
      <GlassButton onPress={() => router.push('/(auth)/otp')}>Send reset code</GlassButton>
    </Screen>
  );
}
