import { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { lightColors } from '../constants/colors';
import { getCurrentUser } from '../services/api';

export default function SplashScreen() {
  const theme = useTheme();
  const colors = theme ? theme.colors : lightColors;

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
    <View style={[styles.container, { backgroundColor: colors.white }]}>
      <StatusBar barStyle={theme?.isDark ? 'light-content' : 'dark-content'} />
      <View style={styles.logoRow}>
        <Animated.Text
          style={[
            styles.logoFit,
            { color: colors.black, opacity: fadeAnim, transform: [{ translateX: fitSlide }] },
          ]}
        >
          Fit
        </Animated.Text>
        <Animated.Text
          style={[
            styles.logoOpia,
            { color: colors.blueText, opacity: fadeAnim, transform: [{ translateX: opiaSlide }] },
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoRow: {
    flexDirection: 'row',
  },
  logoFit: {
    fontSize: 64,
    fontWeight: '700',
    letterSpacing: -2,
  },
  logoOpia: {
    fontSize: 64,
    fontWeight: '700',
    letterSpacing: -2,
  },
});
