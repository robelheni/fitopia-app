import { Stack } from 'expo-router';
import { OnboardingProvider } from '../context/OnboardingContext';


export default function Layout() {
  return (
    <OnboardingProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          // Smooth fade transition for all screens
          animation: 'fade',
          animationDuration: 250,
          // Removes the harsh slide
          gestureEnabled: false,
        }}
      />
    </OnboardingProvider>
  );
}