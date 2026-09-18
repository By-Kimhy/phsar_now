import { Platform } from 'react-native';

export const Glass = {
  blurIntensity: Platform.select({ ios: 40, android: 28, default: 32 }) ?? 32,
  borderWidth: 0.75,
  androidFallbackOpacity: 0.88,
} as const;
