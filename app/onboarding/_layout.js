import { Stack } from 'expo-router';
import { OnboardingProvider } from '../../context/OnboardingContext';

// Wraps all onboarding steps with the provider
// Every step can now access answers and updateAnswer
export default function OnboardingLayout() {
  return (
    <OnboardingProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </OnboardingProvider>
  );
}