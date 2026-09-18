import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { queryClient } from '@/api/query-client';
import { useResolvedScheme } from '@/hooks/use-theme';
import { db } from '@/services/db';
import { useAuthStore } from '@/store/auth-store';
import { useFavoriteStore } from '@/store/favorite-store';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const hydrateAuth = useAuthStore((state) => state.hydrate);
  const hydrated = useAuthStore((state) => state.hydrated);
  const hydrateFavorites = useFavoriteStore((state) => state.hydrate);
  const scheme = useResolvedScheme();

  useEffect(() => {
    void (async () => {
      await db.hydrate();
      await hydrateAuth();
      await hydrateFavorites();
      await SplashScreen.hideAsync();
    })();
  }, [hydrateAuth, hydrateFavorites]);

  if (!hydrated) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
        <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
          <Stack.Screen name="sell" options={{ presentation: 'modal' }} />
          <Stack.Screen name="report" options={{ presentation: 'modal' }} />
          <Stack.Screen name="orders/confirm" options={{ presentation: 'modal' }} />
          <Stack.Screen name="orders/review" options={{ presentation: 'modal' }} />
          <Stack.Screen name="orders/dispute" options={{ presentation: 'modal' }} />
        </Stack>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
