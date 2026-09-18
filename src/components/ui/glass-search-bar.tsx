import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Radius, Spacing, Shadows, Typography } from '@/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
  onFocus?: () => void;
  onFilter?: () => void;
  autoFocus?: boolean;
};

export function GlassSearchBar({
  value,
  onChangeText,
  placeholder = 'Search products, brands, or...',
  onSubmit,
  onFocus,
  onFilter,
  autoFocus,
}: Props) {
  const theme = useTheme();

  return (
    <View style={[styles.wrap, Shadows.soft, { backgroundColor: theme.backgroundElevated, borderColor: theme.border }]}>
      <Ionicons name="search" size={18} color={theme.textSecondary} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textTertiary}
        style={[styles.input, { color: theme.text }]}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
        onFocus={onFocus}
        autoFocus={autoFocus}
        accessibilityLabel="Search"
      />
      <Ionicons name="mic-outline" size={18} color={theme.textTertiary} />
      <Pressable onPress={onFilter} hitSlop={8} accessibilityLabel="Filters">
        <Ionicons name="options-outline" size={18} color={theme.tint} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
    minHeight: 48,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
  input: {
    flex: 1,
    ...Typography.body,
    paddingVertical: Spacing.two,
  },
});
