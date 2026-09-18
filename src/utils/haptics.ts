import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export async function selectionHaptic(): Promise<void> {
  if (Platform.OS === 'web') return;
  await Haptics.selectionAsync();
}

export async function impactHaptic(
  style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light,
): Promise<void> {
  if (Platform.OS === 'web') return;
  await Haptics.impactAsync(style);
}

export async function successHaptic(): Promise<void> {
  if (Platform.OS === 'web') return;
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}

export async function warningHaptic(): Promise<void> {
  if (Platform.OS === 'web') return;
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
}
