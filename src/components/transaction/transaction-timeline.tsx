import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { GlassCard } from '@/components/ui/glass-card';
import { Palette, Radius } from '@/theme';
import { transactionService } from '@/services';
import type { TransactionStatus } from '@/types';

export function TransactionTimeline({ status }: { status: TransactionStatus }) {
  const steps = transactionService.timeline(status);

  return (
    <GlassCard>
      <AppText variant="headline">Transaction</AppText>
      <View style={styles.list}>
        {steps.map((step, index) => (
          <View key={step.key} style={styles.row}>
            <View style={styles.rail}>
              <View
                style={[
                  styles.dot,
                  { backgroundColor: step.done ? Palette.indigo : '#C9CCDA' },
                ]}
              />
              {index < steps.length - 1 ? (
                <View style={[styles.line, { backgroundColor: step.done ? Palette.indigo : '#E4E6F2' }]} />
              ) : null}
            </View>
            <AppText variant="subhead" color={step.done ? 'text' : 'tertiary'} style={styles.label}>
              {step.label}
            </AppText>
          </View>
        ))}
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  list: { marginTop: 12 },
  row: { flexDirection: 'row', minHeight: 36 },
  rail: { width: 18, alignItems: 'center' },
  dot: { width: 10, height: 10, borderRadius: Radius.pill },
  line: { width: 2, flex: 1, marginVertical: 2 },
  label: { paddingLeft: 8, marginTop: -2 },
});
