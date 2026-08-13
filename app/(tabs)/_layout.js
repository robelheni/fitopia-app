import { Tabs } from 'expo-router';
import TabBar from '../../components/TabBar';
import { TabBarProvider } from '../../context/TabBarContext';
import { useLanguage } from '../../context/LanguageContext';
import { getTabTranslation } from '../../constants/tabTranslations';
import { useTheme } from '../../context/ThemeContext';
import { lightColors } from '../../constants/colors';


export default function TabLayout() {
  const { language } = useLanguage();
  const t = getTabTranslation(language);
  const theme = useTheme();
  const colors = theme ? theme.colors : lightColors;
  return (
    <TabBarProvider>
      <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: { display: 'none' },
            animation: 'fade',
            animationDuration: 200,
            sceneContainerStyle: { backgroundColor: colors.white },
          }}
          tabBar={(props) => <TabBar {...props} />}
        >
          <Tabs.Screen name="index" options={{ title: t.home }} />
          <Tabs.Screen name="workouts" options={{ title: t.workouts }} />
          <Tabs.Screen name="community" options={{ title: t.community }} />
          <Tabs.Screen name="notifications" options={{ title: 'Notifications' }} />
          <Tabs.Screen name="profile" options={{ title: language === 'Amharic' ? 'መገለጫ' : 'Profile' }} />
        </Tabs>
      </TabBarProvider>
  );
}
