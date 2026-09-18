import { Text, type TextProps } from 'react-native';

import { Typography } from '@/theme';
import { useTheme } from '@/hooks/use-theme';

type Variant = keyof typeof Typography;

type Props = TextProps & {
  variant?: Variant;
  color?: 'text' | 'secondary' | 'tertiary' | 'tint' | 'accent' | 'danger';
};

export function AppText({ variant = 'body', color = 'text', style, ...rest }: Props) {
  const theme = useTheme();
  const colorMap = {
    text: theme.text,
    secondary: theme.textSecondary,
    tertiary: theme.textTertiary,
    tint: theme.tint,
    accent: theme.accent,
    danger: theme.danger,
  } as const;

  return <Text style={[Typography[variant], { color: colorMap[color] }, style]} {...rest} />;
}
