import { Stack } from 'expo-router';

export default function Layout() {
  return (
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
  );
}