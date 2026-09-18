import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ListingCamera } from '@/components/forms/listing-camera';
import { ScreenHeader } from '@/components/navigation/screen-header';
import { AppText } from '@/components/ui/app-text';
import { GlassButton } from '@/components/ui/glass-button';
import { GlassChip } from '@/components/ui/glass-chip';
import { GlassModal } from '@/components/ui/glass-modal';
import { CATEGORIES, CONDITIONS } from '@/constants/app';
import { queryClient } from '@/api/query-client';
import { queryKeys } from '@/api/query-keys';
import { listingService } from '@/services';
import { useSellStore } from '@/store/sell-store';
import { useTheme } from '@/hooks/use-theme';
import { successHaptic } from '@/utils/haptics';
import { Palette, Radius, Spacing } from '@/theme';
import type { CategoryId, ProductCondition } from '@/types';

const STEPS = ['Photos', 'Details & Pricing', 'Preview', 'Publish'];

export default function SellScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { draft, update, step, setStep, reset } = useSellStore();
  const [success, setSuccess] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);

  const pickFromLibrary = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Photos needed', 'Allow photo library access to add listing images.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      update({ images: [...draft.images, ...result.assets.map((asset) => asset.uri)] });
    }
  };

  const suggest = async () => {
    setSuggesting(true);
    const suggestion = await listingService.generateListingSuggestions(draft.images);
    update({
      title: suggestion.title,
      category: suggestion.category,
      description: suggestion.description,
      brand: suggestion.brand ?? draft.brand,
    });
    setSuggesting(false);
  };

  const publish = async (status: 'draft' | 'active') => {
    const listing = await listingService.createListing({
      title: draft.title || 'Untitled listing',
      description: draft.description || 'No description yet.',
      images: draft.images.length
        ? draft.images
        : ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80'],
      priceAmount: Number(draft.price) || 0,
      currency: draft.currency,
      negotiable: draft.negotiable,
      condition: draft.condition,
      category: draft.category,
      brand: draft.brand,
      location: draft.location,
      tags: draft.title.split(' ').slice(0, 4),
      status,
    });
    await queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    await queryClient.invalidateQueries({ queryKey: queryKeys.listings.mine() });
    if (status === 'active') {
      await successHaptic();
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        reset();
        router.replace(`/product/${listing.id}`);
      }, 900);
    } else {
      reset();
      router.replace('/listings');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background, paddingTop: insets.top }}>
      <View style={{ paddingHorizontal: 20 }}>
        <ScreenHeader title="List New Item" onBack={() => (step === 0 ? router.back() : setStep(step - 1))} />
        <AppText variant="caption" color="secondary">
          Step {step + 1} of 4 · {STEPS[step]}
        </AppText>
        <View style={styles.progress}>
          <View style={[styles.progressFill, { width: `${((step + 1) / 4) * 100}%` }]} />
        </View>
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40, gap: 14 }}>
        {step === 0 ? (
          <>
            <AppText variant="title3">Photos ({draft.images.length}/8)</AppText>
            <View style={styles.row}>
              <GlassButton variant="secondary" onPress={() => setCameraOpen(true)} style={{ flex: 1 }}>
                Camera
              </GlassButton>
              <GlassButton variant="secondary" onPress={() => void pickFromLibrary()} style={{ flex: 1 }}>
                Library
              </GlassButton>
            </View>
            <View style={styles.wrap}>
              {draft.images.map((uri, index) => (
                <Pressable key={uri} onPress={() => update({ coverIndex: index })}>
                  <Image source={{ uri }} style={[styles.thumb, index === draft.coverIndex && styles.cover]} />
                  {index === draft.coverIndex ? (
                    <View style={styles.coverTag}>
                      <AppText variant="caption" style={{ color: '#fff' }}>COVER</AppText>
                    </View>
                  ) : null}
                </Pressable>
              ))}
            </View>
            <GlassButton loading={suggesting} variant="secondary" onPress={() => void suggest()}>
              AI Match Verified
            </GlassButton>
            <GlassButton disabled={draft.images.length === 0} onPress={() => setStep(1)}>
              Continue
            </GlassButton>
          </>
        ) : null}

        {step === 1 ? (
          <>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {draft.images.map((uri, index) => (
                <Image key={uri} source={{ uri }} style={[styles.thumb, index === draft.coverIndex && styles.cover]} />
              ))}
            </ScrollView>
            <Field label="Listing Title" value={draft.title} onChange={(title) => update({ title })} />
            <AppText variant="headline">Category</AppText>
            <View style={styles.wrap}>
              {CATEGORIES.filter((item) => item.id !== 'more').map((item) => (
                <GlassChip key={item.id} label={item.label} selected={draft.category === item.id} onPress={() => update({ category: item.id as CategoryId })} />
              ))}
            </View>
            <AppText variant="headline">Condition</AppText>
            <View style={styles.wrap}>
              {CONDITIONS.map((item) => (
                <GlassChip key={item.id} label={item.label} selected={draft.condition === item.id} onPress={() => update({ condition: item.id as ProductCondition })} />
              ))}
            </View>
            <Field label="Description" value={draft.description} onChange={(description) => update({ description })} multiline />
            <AppText variant="headline">Listing Price</AppText>
            <View style={styles.priceBox}>
              <AppText variant="title">$ {draft.price || '0'}</AppText>
              <TextInput
                value={draft.price}
                onChangeText={(price) => update({ price })}
                keyboardType="decimal-pad"
                placeholder="1850"
                placeholderTextColor={theme.textTertiary}
                style={[styles.input, { color: theme.text, borderColor: theme.border }]}
              />
            </View>
            <View style={styles.row}>
              <GlassChip label="USD" selected={draft.currency === 'USD'} onPress={() => update({ currency: 'USD' })} />
              <GlassChip label="KHR" selected={draft.currency === 'KHR'} onPress={() => update({ currency: 'KHR' })} />
            </View>
            <View style={[styles.toggle, { backgroundColor: theme.backgroundElevated }]}>
              <View style={{ flex: 1 }}>
                <AppText variant="headline">Allow Offers</AppText>
                <AppText variant="caption" color="secondary">Buyers can submit price bids</AppText>
              </View>
              <Switch value={draft.negotiable} onValueChange={(negotiable) => update({ negotiable })} />
            </View>
            <View style={[styles.hub, { backgroundColor: '#E8F8EE' }]}>
              <AppText variant="headline">Public Safe-Exchange Hub</AppText>
              <AppText variant="caption" color="secondary">Meet at verified safe zones like AEON Mall Sen Sok.</AppText>
            </View>
            <GlassButton onPress={() => setStep(2)}>Preview</GlassButton>
          </>
        ) : null}

        {step === 2 || step === 3 ? (
          <>
            <Image source={{ uri: draft.images[draft.coverIndex] }} style={styles.preview} />
            <AppText variant="title3">{draft.title}</AppText>
            <AppText variant="headline">
              {draft.currency} {draft.price} {draft.negotiable ? '· Offers on' : ''}
            </AppText>
            <AppText color="secondary">{draft.description}</AppText>
            <View style={styles.row}>
              <GlassButton variant="secondary" onPress={() => void publish('draft')} style={{ flex: 1 }}>
                Preview
              </GlassButton>
              <GlassButton onPress={() => void publish('active')} style={{ flex: 1 }}>
                Publish Listing
              </GlassButton>
            </View>
          </>
        ) : null}
      </ScrollView>
      <ListingCamera
        visible={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onCapture={(uri) => {
          update({ images: [...draft.images, uri] });
          setCameraOpen(false);
        }}
      />
      <GlassModal visible={success} onClose={() => setSuccess(false)}>
        <AppText variant="title3">Listing published</AppText>
        <AppText color="secondary">Your item is now live on PhsarNow.</AppText>
      </GlassModal>
    </View>
  );
}

function Field({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  const theme = useTheme();
  return (
    <View style={{ gap: 6 }}>
      <AppText variant="headline">{label}</AppText>
      <TextInput
        value={value}
        onChangeText={onChange}
        multiline={multiline}
        placeholder={label}
        placeholderTextColor={theme.textTertiary}
        style={[
          styles.input,
          multiline && { height: 120, textAlignVertical: 'top' },
          { color: theme.text, borderColor: theme.border, backgroundColor: theme.backgroundElevated },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  progress: { height: 6, backgroundColor: '#DCE6FF', borderRadius: 3, marginTop: 10, overflow: 'hidden' },
  progressFill: { height: 6, backgroundColor: Palette.blue, borderRadius: 3 },
  row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  thumb: { width: 88, height: 88, borderRadius: Radius.md, backgroundColor: '#ddd' },
  cover: { borderColor: Palette.blue, borderWidth: 2 },
  coverTag: { position: 'absolute', left: 6, top: 6, backgroundColor: Palette.blue, paddingHorizontal: 6, borderRadius: 8 },
  preview: { width: '100%', height: 220, borderRadius: Radius.xl },
  priceBox: { gap: 8 },
  toggle: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: Radius.lg },
  hub: { padding: 14, borderRadius: Radius.lg, gap: 4 },
  input: {
    minHeight: 48,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.three,
    backgroundColor: '#fff',
  },
});
