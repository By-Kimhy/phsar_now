import { type ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenPadding, Spacing, TabBarHeight } from '@/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  tabBar?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Screen({ children, scroll, padded = true, tabBar, style }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const padding = {
    paddingTop: insets.top + Spacing.two,
    paddingHorizontal: padded ? ScreenPadding : 0,
    paddingBottom: (tabBar ? TabBarHeight + insets.bottom : insets.bottom) + Spacing.four,
  };

  if (scroll) {
    return (
      <ScrollView
        style={[styles.flex, { backgroundColor: theme.background }]}
        contentContainerStyle={[padding, style]}
        showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    );
  }

  return (
    <View style={[styles.flex, { backgroundColor: theme.background }, padding, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
