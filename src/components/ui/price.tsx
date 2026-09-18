import { Text, type TextProps } from 'react-native';

import { Typography } from '@/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Money } from '@/types';
import { formatMoney } from '@/utils/money';

type Props = TextProps & {
  value: Money;
  size?: 'sm' | 'md' | 'lg';
};

export function Price({ value, size = 'md', style, ...rest }: Props) {
  const theme = useTheme();
  const variant = size === 'lg' ? Typography.title2 : size === 'sm' ? Typography.subhead : Typography.headline;

  return (
    <Text style={[variant, { color: theme.tint }, style]} accessibilityLabel={formatMoney(value)} {...rest}>
      {formatMoney(value)}
    </Text>
  );
}
