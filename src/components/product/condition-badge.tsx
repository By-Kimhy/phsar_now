import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Radius } from '@/theme';
import { conditionLabel } from '@/utils/format';

export function ConditionBadge({ condition }: { condition: string }) {
  const dark = condition === 'new' || condition === 'like-new';
  return (
    <View style={[styles.badge, { backgroundColor: dark ? 'rgba(15,24,48,0.72)' : 'rgba(255,255,255,0.92)' }]}>
      <AppText variant="caption" style={{ color: dark ? '#fff' : '#1E4FD7', fontWeight: '700' }}>
        {conditionLabel(condition)}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.pill,
    zIndex: 2,
  },
});
