import { TabList, TabSlot, TabTrigger, Tabs } from 'expo-router/ui';
import { StyleSheet } from 'react-native';

import { GlassTabBar } from '@/components/navigation/glass-tab-bar';

export default function TabsLayout() {
  return (
    <Tabs>
      <TabSlot style={styles.slot} />
      <GlassTabBar />
      <TabList style={styles.hidden}>
        <TabTrigger name="home" href="/home" />
        <TabTrigger name="discover" href="/discover" />
        <TabTrigger name="messages" href="/messages" />
        <TabTrigger name="profile" href="/profile" />
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  slot: { flex: 1 },
  hidden: { display: 'none' },
});
