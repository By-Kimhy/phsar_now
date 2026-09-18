import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';

import { Radius, Spacing } from '@/theme';
import { useTheme } from '@/hooks/use-theme';

import { AppText } from './app-text';
import { GlassButton } from './glass-button';

type EmptyProps = {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ icon = 'cube-outline', title, subtitle, actionLabel, onAction }: EmptyProps) {
  const theme = useTheme();

  return (
    <View style={styles.center}>
      <View style={[styles.iconWrap, { backgroundColor: theme.backgroundElement }]}>
        <Ionicons name={icon} size={28} color={theme.tint} />
      </View>
      <AppText variant="title3">{title}</AppText>
      <AppText variant="subhead" color="secondary" style={styles.subtitle}>
        {subtitle}
      </AppText>
      {actionLabel && onAction ? (
        <GlassButton onPress={onAction} style={styles.action}>
          {actionLabel}
        </GlassButton>
      ) : null}
    </View>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <EmptyState
      icon="warning-outline"
      title="Something went wrong"
      subtitle={message}
      actionLabel="Retry"
      onAction={onRetry}
    />
  );
}

export function SkeletonBlock({ height, width = '100%' }: { height: number; width?: number | `${number}%` }) {
  const theme = useTheme();
  return (
    <View style={{ height, width, borderRadius: Radius.md, backgroundColor: theme.skeleton }} />
  );
}

export function ProductCardSkeleton() {
  return (
    <View style={{ gap: Spacing.two, flex: 1 }}>
      <SkeletonBlock height={148} />
      <SkeletonBlock height={14} width="80%" />
      <SkeletonBlock height={16} width="40%" />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.seven,
    gap: Spacing.two,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.two,
  },
  subtitle: {
    textAlign: 'center',
    maxWidth: 280,
  },
  action: {
    marginTop: Spacing.three,
    minWidth: 160,
  },
});
