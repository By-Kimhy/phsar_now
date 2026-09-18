import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Avatar } from '@/components/ui/avatar';
import { useTheme } from '@/hooks/use-theme';
import { useAuthStore } from '@/store/auth-store';
import { DEFAULT_LOCATION } from '@/constants/app';

export function BrandHeader() {
  const theme = useTheme();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  return (
    <View style={styles.row}>
      <Image source={require('@/assets/images/phsarnow.jpg')} style={styles.logo} contentFit="contain" />
      <AppText variant="headline" style={{ color: theme.tint, flex: 1 }}>
        PhsarNow
      </AppText>
      <Pressable onPress={() => router.push('/settings')} style={styles.location} accessibilityLabel="Change location">
        <AppText variant="caption" color="tint">
          {user?.location.split(',')[0] ?? DEFAULT_LOCATION}
        </AppText>
        <Ionicons name="chevron-down" size={12} color={theme.tint} />
      </Pressable>
      <Pressable onPress={() => router.push('/notifications')} hitSlop={8} accessibilityLabel="Notifications">
        <Ionicons name="notifications-outline" size={22} color={theme.text} />
      </Pressable>
      <Pressable onPress={() => router.push('/profile')} accessibilityLabel="Profile">
        <Avatar uri={user?.avatar ?? ''} size={32} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logo: { width: 28, height: 28, borderRadius: 8 },
  location: { flexDirection: 'row', alignItems: 'center', gap: 4, marginRight: 4 },
});
