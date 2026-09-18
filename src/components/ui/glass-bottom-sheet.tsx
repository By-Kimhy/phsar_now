import { type ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Radius, Spacing } from '@/theme';
import { useTheme } from '@/hooks/use-theme';

import { GlassSurface } from './glass-surface';

type Props = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  height?: number | `${number}%`;
};

export function GlassBottomSheet({ visible, onClose, children, height = '72%' }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <Pressable style={[styles.backdrop, { backgroundColor: theme.overlay }]} onPress={onClose} />
        <View style={[styles.sheet, { height, paddingBottom: insets.bottom + Spacing.four }]}>
          <GlassSurface style={styles.surface}>
            <View style={[styles.handle, { backgroundColor: theme.textTertiary }]} />
            {children}
          </GlassSurface>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFill },
  sheet: {
    width: '100%',
  },
  surface: {
    flex: 1,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
    padding: Spacing.five,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    marginBottom: Spacing.four,
  },
});
