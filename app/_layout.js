import { Stack } from 'expo-router';
import { OnboardingProvider } from '../context/OnboardingContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import TopBlur from '../components/TopBlur';

export default function Layout() {
  return (
    <SafeAreaProvider>
      <OnboardingProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'fade',
            animationDuration: 250,
            gestureEnabled: false,
          }}
        />
        <TopBlur />
      </OnboardingProvider>
    </SafeAreaProvider>
  );
}
