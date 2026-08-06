import { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, StatusBar } from 'react-native';
import { router } from 'expo-router';

import { getCurrentUser } from '../services/api';

export default function SplashScreen() {
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const fitSlide  = useRef(new Animated.Value(-100)).current;
  const opiaSlide = useRef(new Animated.Value(100)).current;
  const navigated = useRef(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const user = await getCurrentUser();
        if (user) {
          navigated.current = true;
          router.replace('/(tabs)');
        }
      } catch (_) {
        // No token or invalid token -- fall through to language selection
      }
    }
    checkAuth();
  }, []);

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(fitSlide, {
          toValue: 0,
          friction: 6,
          tension: 50,
          useNativeDriver: true,
        }),
        Animated.spring(opiaSlide, {
          toValue: 0,
          friction: 6,
          tension: 50,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(800),
    ]).start(() => {
      if (!navigated.current) {
        router.replace('/language');
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.logoRow}>
        <Animated.Text
          style={[
            styles.logoFit,
            {
              opacity: fadeAnim,
              transform: [{ translateX: fitSlide }],
            },
          ]}
        >
          Fit
        </Animated.Text>
        <Animated.Text
          style={[
            styles.logoOpia,
            {
              opacity: fadeAnim,
              transform: [{ translateX: opiaSlide }],
            },
          ]}
        >
          opia
        </Animated.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoRow: {
    flexDirection: 'row',
  },
  logoFit: {
    fontSize: 64,
    fontWeight: '700',
    color: '#0a0a0a',
    letterSpacing: -2,
  },
  logoOpia: {
    fontSize: 64,
    fontWeight: '700',
    color: '#2563EB',
    letterSpacing: -2,
  },
});
