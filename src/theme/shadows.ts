import { Platform, type ViewStyle } from 'react-native';

export const Shadows = {
  card: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#17183F',
      shadowOpacity: 0.08,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 8 },
    },
    android: { elevation: 3 },
    default: {},
  }),
  floating: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#17183F',
      shadowOpacity: 0.16,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 12 },
    },
    android: { elevation: 8 },
    default: {},
  }),
  soft: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#17183F',
      shadowOpacity: 0.06,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
    },
    android: { elevation: 1 },
    default: {},
  }),
} as const;
