import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, StatusBar } from 'react-native';
import { router } from 'expo-router';

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const fitSlide = useRef(new Animated.Value(-100)).current;
  const opiaSlide = useRef(new Animated.Value(100)).current;

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
      router.replace('/(tabs)');
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