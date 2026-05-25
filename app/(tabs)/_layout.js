import { Tabs } from 'expo-router';
import { colors } from '../../constants/colors';
import TabBar from '../../components/TabBar';
import { TabBarProvider } from '../../context/TabBarContext';

export default function TabLayout() {
  return (
    <TabBarProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
          animation: 'fade',
          animationDuration: 200,
        }}
        tabBar={(props) => <TabBar {...props} />}
      >
        <Tabs.Screen name="index" options={{ title: 'Home' }} />
        <Tabs.Screen name="workouts" options={{ title: 'Workouts' }} />
        <Tabs.Screen name="community" options={{ title: 'Community' }} />
        <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      </Tabs>
    </TabBarProvider>
  );
}