import Ionicons from '@expo/vector-icons/Ionicons';
import { TabTrigger, type TabTriggerSlotProps } from 'expo-router/ui';
import { useRouter } from 'expo-router';
import { type Ref } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/use-theme';
import { Palette, Radius, Shadows, Spacing, Typography } from '@/theme';
import { selectionHaptic } from '@/utils/haptics';

type IoniconName = keyof typeof Ionicons.glyphMap;

type TabButtonProps = Omit<TabTriggerSlotProps, 'style'> & {
  icon: IoniconName;
  focusedIcon: IoniconName;
  label: string;
  ref?: Ref<View>;
};

function TabButton({ icon, focusedIcon, label, isFocused, ref, ...props }: TabButtonProps) {
  const theme = useTheme();
  const color = isFocused ? theme.tabActive : theme.tabInactive;

  return (
    <Pressable
      {...props}
      ref={ref}
      style={styles.tab}
      onPress={(event) => {
        void selectionHaptic();
        props.onPress?.(event);
      }}
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected: Boolean(isFocused) }}>
      <Ionicons name={isFocused ? focusedIcon : icon} size={22} color={color} />
      <Text style={[Typography.caption, { color, fontWeight: '600' }]}>{label}</Text>
    </Pressable>
  );
}

export function GlassTabBar() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const router = useRouter();

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { bottom: Math.max(insets.bottom, 8) }]}>
      <View style={[styles.bar, Shadows.floating, { backgroundColor: theme.backgroundElevated, borderColor: theme.border }]}>
        <TabTrigger name="home" asChild>
          <TabButton icon="home-outline" focusedIcon="home" label="Home" />
        </TabTrigger>
        <TabTrigger name="discover" asChild>
          <TabButton icon="compass-outline" focusedIcon="compass" label="Discover" />
        </TabTrigger>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Sell"
          onPress={() => {
            void selectionHaptic();
            router.push('/sell');
          }}
          style={styles.sellWrap}>
          <View style={styles.sellButton}>
            <Ionicons name="add" size={30} color="#fff" />
          </View>
        </Pressable>
        <TabTrigger name="messages" asChild>
          <TabButton icon="chatbubble-ellipses-outline" focusedIcon="chatbubble-ellipses" label="Inbox" />
        </TabTrigger>
        <TabTrigger name="profile" asChild>
          <TabButton icon="person-outline" focusedIcon="person" label="Profile" />
        </TabTrigger>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 16,
    right: 16,
  },
  bar: {
    borderRadius: Radius.xxl,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.one,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    minHeight: 52,
  },
  sellWrap: {
    alignItems: 'center',
    width: 64,
    marginTop: -22,
  },
  sellButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: Palette.blue,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.floating,
  },
});
