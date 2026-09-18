import { Image } from 'expo-image';

import { useTheme } from '@/hooks/use-theme';

type Props = {
  uri: string;
  size?: number;
};

export function Avatar({ uri, size = 40 }: Props) {
  const theme = useTheme();

  return (
    <Image
      source={{ uri }}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: theme.backgroundElement,
      }}
      contentFit="cover"
      transition={200}
    />
  );
}
