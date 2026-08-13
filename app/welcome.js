import { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { lightColors } from '../constants/colors';
import { Feather } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { getTabTranslation } from '../constants/tabTranslations';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const theme = useTheme();
  const colors = theme ? theme.colors : lightColors;
  const styles = makeStyles(colors);

  const { language } = useLanguage();
  const t = getTabTranslation(language);

  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.8);
  const taglineOpacity = useSharedValue(0);
  const taglineY = useSharedValue(20);
  const subtitleOpacity = useSharedValue(0);
  const subtitleY = useSharedValue(20);
  const buttonsOpacity = useSharedValue(0);
  const buttonsY = useSharedValue(30);
  const circle1Scale = useSharedValue(0);
  const circle2Scale = useSharedValue(0);
  const circle3Scale = useSharedValue(0);

  useEffect(() => {
    circle1Scale.value = withSpring(1, { damping: 20, stiffness: 60 });
    circle2Scale.value = withDelay(100, withSpring(1, { damping: 20, stiffness: 50 }));
    circle3Scale.value = withDelay(200, withSpring(1, { damping: 20, stiffness: 40 }));

    logoOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));
    logoScale.value = withDelay(200, withSpring(1, { damping: 12, stiffness: 100 }));

    taglineOpacity.value = withDelay(500, withTiming(1, { duration: 500 }));
    taglineY.value = withDelay(500, withSpring(0, { damping: 12, stiffness: 100 }));

    subtitleOpacity.value = withDelay(700, withTiming(1, { duration: 500 }));
    subtitleY.value = withDelay(700, withSpring(0, { damping: 12, stiffness: 100 }));

    buttonsOpacity.value = withDelay(900, withTiming(1, { duration: 500 }));
    buttonsY.value = withDelay(900, withSpring(0, { damping: 12, stiffness: 100 }));
  }, []);

  const circle1Style = useAnimatedStyle(() => ({ transform: [{ scale: circle1Scale.value }] }));
  const circle2Style = useAnimatedStyle(() => ({ transform: [{ scale: circle2Scale.value }] }));
  const circle3Style = useAnimatedStyle(() => ({ transform: [{ scale: circle3Scale.value }] }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [{ translateY: taglineY.value }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleY.value }],
  }));

  const buttonsStyle = useAnimatedStyle(() => ({
    opacity: buttonsOpacity.value,
    transform: [{ translateY: buttonsY.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.circle1, circle1Style]} />
      <Animated.View style={[styles.circle2, circle2Style]} />
      <Animated.View style={[styles.circle3, circle3Style]} />

      <View style={styles.center}>
        <Animated.View style={[styles.logoRow, logoStyle]}>
          <Text style={styles.logoFit}>Fit</Text>
          <Text style={styles.logoOpia}>opia</Text>
        </Animated.View>

        <Animated.Text style={[styles.tagline, taglineStyle]}>
          {t.nextLevel}
        </Animated.Text>

        <Animated.Text style={[styles.subtitle, subtitleStyle]}>
          {t.allInOne}
        </Animated.Text>
      </View>

      <Animated.View style={[styles.buttons, buttonsStyle]}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.navigate('/onboarding-intro')}
        >
          <Text style={styles.primaryButtonText}>{t.getStarted}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.navigate('/login')}
        >
          <Text style={styles.secondaryButtonText}>{t.alreadyAccount}</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

function makeStyles(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },

    circle1: {
      position: 'absolute',
      width: 400,
      height: 400,
      borderRadius: 200,
      backgroundColor: 'rgba(37,99,235,0.06)',
      top: -100,
      right: -100,
    },

    circle2: {
      position: 'absolute',
      width: 300,
      height: 300,
      borderRadius: 150,
      backgroundColor: 'rgba(37,99,235,0.04)',
      bottom: 100,
      left: -80,
    },

    circle3: {
      position: 'absolute',
      width: 150,
      height: 150,
      borderRadius: 75,
      backgroundColor: 'rgba(212,168,67,0.08)',
      top: height * 0.3,
      right: -30,
    },

    center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 32,
    },

    logoRow: {
      flexDirection: 'row',
      marginBottom: 32,
    },

    logoFit: {
      fontSize: 64,
      fontWeight: '700',
      color: colors.black,
      letterSpacing: -2,
    },

    logoOpia: {
      fontSize: 64,
      fontWeight: '700',
      color: colors.blueText,
      letterSpacing: -2,
    },

    tagline: {
      fontSize: 32,
      fontWeight: '700',
      color: colors.black,
      textAlign: 'center',
      letterSpacing: -1,
      lineHeight: 38,
      marginBottom: 16,
    },

    subtitle: {
      fontSize: 16,
      color: colors.grey,
      textAlign: 'center',
      lineHeight: 24,
      fontWeight: '300',
    },

    buttons: {
      paddingHorizontal: 24,
      paddingBottom: 48,
      gap: 12,
    },

    primaryButton: {
      backgroundColor: colors.blue,
      paddingVertical: 16,
      borderRadius: 100,
      alignItems: 'center',
      shadowColor: colors.blue,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 12,
      elevation: 8,
    },

    primaryButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
      letterSpacing: -0.3,
    },

    secondaryButton: {
      backgroundColor: colors.white,
      paddingVertical: 16,
      borderRadius: 100,
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: colors.greyBorder,
    },

    secondaryButtonText: {
      color: colors.black,
      fontSize: 16,
      fontWeight: '400',
    },
  });
}
