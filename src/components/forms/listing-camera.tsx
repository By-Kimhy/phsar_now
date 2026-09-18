import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/app-text';
import { GlassButton } from '@/components/ui/glass-button';

type Props = {
  visible: boolean;
  onClose: () => void;
  onCapture: (uri: string) => void;
};

export function ListingCamera({ visible, onClose, onCapture }: Props) {
  const insets = useSafeAreaInsets();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.fill}>
        {!permission?.granted ? (
          <View style={[styles.center, { paddingTop: insets.top }]}>
            <AppText variant="title3">Camera access</AppText>
            <AppText color="secondary">PhsarNow needs the camera to photograph items.</AppText>
            <GlassButton onPress={() => void requestPermission()}>Allow camera</GlassButton>
            <GlassButton variant="ghost" onPress={onClose}>
              Close
            </GlassButton>
          </View>
        ) : (
          <>
            <CameraView ref={cameraRef} style={styles.fill} facing="back" />
            <View style={[styles.controls, { paddingBottom: insets.bottom + 20 }]}>
              <Pressable
                accessibilityLabel="Take photo"
                onPress={async () => {
                  const photo = await cameraRef.current?.takePictureAsync({ quality: 0.8 });
                  if (photo?.uri) onCapture(photo.uri);
                }}
                style={styles.shutter}
              />
              <GlassButton variant="glass" onPress={onClose}>
                Cancel
              </GlassButton>
            </View>
          </>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24, backgroundColor: '#111' },
  controls: { position: 'absolute', bottom: 0, left: 0, right: 0, alignItems: 'center', gap: 16 },
  shutter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#fff',
    borderWidth: 6,
    borderColor: 'rgba(255,255,255,0.4)',
  },
});
