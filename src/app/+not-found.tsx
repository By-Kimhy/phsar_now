import { Link, Stack } from 'expo-router';

import { AppText } from '@/components/ui/app-text';
import { GlassButton } from '@/components/ui/glass-button';
import { Screen } from '@/components/ui/screen';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Screen style={{ alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <AppText variant="title2">Page not found</AppText>
        <AppText color="secondary">That screen is not in PhsarNow.</AppText>
        <Link href="/home" asChild>
          <GlassButton>Go home</GlassButton>
        </Link>
      </Screen>
    </>
  );
}
