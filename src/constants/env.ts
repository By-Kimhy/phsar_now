export const Env = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? '',
  imageUrl: process.env.EXPO_PUBLIC_IMAGE_URL ?? '',
  appEnv: process.env.EXPO_PUBLIC_APP_ENV ?? 'development',
  isMock: !process.env.EXPO_PUBLIC_API_URL,
} as const;
