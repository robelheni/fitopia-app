import { Stack } from 'expo-router';
import { OnboardingProvider } from '../../context/OnboardingContext';

export default function OnboardingLayout() {
  return (
    <OnboardingProvider>
      <Stack
        screenOptions={{
          headerShown: false,

          // Smooth premium transition
          animation: 'fade_from_bottom',

          // Faster + cleaner feeling
          animationDuration: 300,

          // Enables swipe gestures
          gestureEnabled: true,

          // Makes transition feel more natural
          fullScreenGestureEnabled: true,

          // Better for onboarding flow
          presentation: 'card',
        }}
      />
    </OnboardingProvider>
  );
}