import { Image } from 'expo-image';
import { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/app-text';
import { IconButton } from '@/components/ui/icon-button';
import { Radius } from '@/theme';

const { width } = Dimensions.get('window');

export function ImageCarousel({ images, onOpen }: { images: string[]; onOpen?: (index: number) => void }) {
  const [index, setIndex] = useState(0);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(event.nativeEvent.contentOffset.x / width);
    setIndex(next);
  };

  return (
    <View>
      <FlatList
        data={images}
        horizontal
        pagingEnabled
        keyExtractor={(item) => item}
        renderItem={({ item, index: imageIndex }) => (
          <Pressable onPress={() => onOpen?.(imageIndex)}>
            <Image source={{ uri: item }} style={styles.image} contentFit="cover" transition={200} />
          </Pressable>
        )}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
      />
      <View style={styles.counter}>
        <AppText variant="caption" style={{ color: '#fff' }}>
          {index + 1}/{images.length}
        </AppText>
      </View>
    </View>
  );
}

export function ImageViewer({
  images,
  index,
  visible,
  onClose,
}: {
  images: string[];
  index: number;
  visible: boolean;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={[styles.viewer, { paddingTop: insets.top }]}>
        <IconButton name="close" accessibilityLabel="Close gallery" onPress={onClose} />
        <FlatList
          data={images}
          horizontal
          pagingEnabled
          initialScrollIndex={index}
          getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.full} contentFit="contain" />
          )}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  image: {
    width,
    height: 360,
    backgroundColor: '#111',
  },
  counter: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.pill,
  },
  viewer: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 12,
  },
  full: {
    width,
    height: '100%',
  },
});
