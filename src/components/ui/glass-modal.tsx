import { type ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { Radius, Spacing } from '@/theme';
import { useTheme } from '@/hooks/use-theme';

import { GlassSurface } from './glass-surface';

type Props = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function GlassModal({ visible, onClose, children }: Props) {
  const theme = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={[styles.backdrop, { backgroundColor: theme.overlay }]} onPress={onClose}>
        <Pressable onPress={() => undefined} style={styles.center}>
          <GlassSurface style={styles.card}>{children}</GlassSurface>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.six,
  },
  center: {
    width: '100%',
    maxWidth: 400,
  },
  card: {
    padding: Spacing.six,
    borderRadius: Radius.xxl,
  },
});
