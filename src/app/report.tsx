import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/navigation/screen-header';
import { AppText } from '@/components/ui/app-text';
import { GlassButton } from '@/components/ui/glass-button';
import { GlassChip } from '@/components/ui/glass-chip';
import { safetyService, userService } from '@/services';
import { useTheme } from '@/hooks/use-theme';
import type { ReportReason } from '@/types';
import { ScreenPadding, Spacing } from '@/theme';

const REASONS: ReportReason[] = ['spam', 'scam', 'prohibited', 'offensive', 'counterfeit', 'other'];

export default function ReportScreen() {
  const { productId, userId } = useLocalSearchParams<{ productId?: string; userId?: string }>();
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [reason, setReason] = useState<ReportReason>('spam');
  const [details, setDetails] = useState('');

  return (
    <View style={{ flex: 1, backgroundColor: theme.background, paddingTop: insets.top, paddingHorizontal: ScreenPadding, gap: Spacing.four }}>
      <ScreenHeader title={productId ? 'Report listing' : 'Report user'} />
      <AppText color="secondary">Reports are reviewed by the trust and safety team. This version stores them locally.</AppText>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {REASONS.map((item) => (
          <GlassChip key={item} label={item} selected={reason === item} onPress={() => setReason(item)} />
        ))}
      </View>
      <TextInput
        value={details}
        onChangeText={setDetails}
        placeholder="Details"
        placeholderTextColor={theme.textTertiary}
        multiline
        style={[styles.input, { color: theme.text, borderColor: theme.border }]}
      />
      <GlassButton
        onPress={async () => {
          if (productId) await safetyService.reportListing(productId, reason, details);
          if (userId) await safetyService.reportUser(userId, reason);
          router.back();
        }}>
        Submit
      </GlassButton>
      {userId ? (
        <GlassButton variant="danger" onPress={async () => { await userService.blockUser(userId); router.back(); }}>
          Block user
        </GlassButton>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  input: { minHeight: 120, borderWidth: StyleSheet.hairlineWidth, borderRadius: 16, padding: 12, textAlignVertical: 'top' },
});
