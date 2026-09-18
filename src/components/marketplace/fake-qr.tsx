import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Radius } from '@/theme';

export function FakeQr({ seed, caption }: { seed: string; caption?: string }) {
  const cells = Array.from({ length: 169 }, (_, index) => {
    const code = seed.charCodeAt(index % seed.length) + index * 17;
    return code % 3 !== 0;
  });

  return (
    <View style={styles.wrap}>
      <View style={styles.grid}>
        {cells.map((filled, index) => (
          <View key={index} style={[styles.cell, filled && styles.filled]} />
        ))}
      </View>
      {caption ? (
        <AppText variant="caption" color="tertiary" style={{ textAlign: 'center' }}>
          {caption}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 8 },
  grid: {
    width: 188,
    height: 188,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: Radius.md,
  },
  cell: { width: 12.9, height: 12.9, backgroundColor: '#fff' },
  filled: { backgroundColor: '#12203A' },
});
