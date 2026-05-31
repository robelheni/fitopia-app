import { useEffect} from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
// Add to your imports
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { colors } from '../../constants/colors';
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';


const { width, height } = Dimensions.get('window');

export default function Complete() {
  // Animation values
  const backgroundScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.3);
  const titleOpacity = useSharedValue(0);
  const titleY = useSharedValue(30);
  const subtitleOpacity = useSharedValue(0);
  const subtitleY = useSharedValue(20);
  const buttonOpacity = useSharedValue(0);
  const buttonY = useSharedValue(20);
  const ring1Scale = useSharedValue(0);
  const ring1Opacity = useSharedValue(0);
  const ring2Scale = useSharedValue(0);
  const ring2Opacity = useSharedValue(0);
  const iconRotate = useSharedValue(0);

  useEffect(() => {
    // Background circle expands
    backgroundScale.value = withSpring(1, {
      damping: 12,
      stiffness: 80,
    });

    // Rings pulse outward
    ring1Scale.value = withDelay(300, withSpring(1, { damping: 10, stiffness: 60 }));
    ring1Opacity.value = withDelay(300, withSequence(
      withTiming(0.3, { duration: 400 }),
      withTiming(0, { duration: 600 })
    ));

    ring2Scale.value = withDelay(500, withSpring(1.3, { damping: 10, stiffness: 50 }));
    ring2Opacity.value = withDelay(500, withSequence(
      withTiming(0.2, { duration: 400 }),
      withTiming(0, { duration: 700 })
    ));

    // Logo appears with bounce
    logoOpacity.value = withDelay(200, withTiming(1, { duration: 400 }));
    logoScale.value = withDelay(200, withSpring(1, {
      damping: 8,
      stiffness: 120,
    }));

    // Icon rotates in
    iconRotate.value = withDelay(400, withSpring(1, {
      damping: 10,
      stiffness: 100,
    }));

    // Title slides up
    titleOpacity.value = withDelay(600, withTiming(1, { duration: 500 }));
    titleY.value = withDelay(600, withSpring(0, { damping: 12, stiffness: 100 }));

    // Subtitle slides up
    subtitleOpacity.value = withDelay(800, withTiming(1, { duration: 500 }));
    subtitleY.value = withDelay(800, withSpring(0, { damping: 12, stiffness: 100 }));

    // Button appears
    buttonOpacity.value = withDelay(1000, withTiming(1, { duration: 500 }));
    buttonY.value = withDelay(1000, withSpring(0, { damping: 12, stiffness: 100 }));
  }, []);

  // Animated styles
  const bgStyle = useAnimatedStyle(() => ({
    transform: [{ scale: backgroundScale.value }],
  }));

  const ring1Style = useAnimatedStyle(() => ({
    transform: [{ scale: ring1Scale.value }],
    opacity: ring1Opacity.value,
  }));

  const ring2Style = useAnimatedStyle(() => ({
    transform: [{ scale: ring2Scale.value }],
    opacity: ring2Opacity.value,
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${iconRotate.value * 360}deg` },
      { scale: iconRotate.value },
    ],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleY.value }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleY.value }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ translateY: buttonY.value }],
  }));



  return (
    <View style={styles.container}>

      {/* Animated background circle */}
      <Animated.View style={[styles.backgroundCircle, bgStyle]} />

      {/* Pulsing rings */}
      <Animated.View style={[styles.ring, styles.ring1, ring1Style]} />
      <Animated.View style={[styles.ring, styles.ring2, ring2Style]} />

      {/* Center icon with rotation */}
      <Animated.View style={[styles.iconContainer, logoStyle]}>
        <Animated.View style={iconStyle}>
        <Feather name="award" size={64} color={colors.white} />
        </Animated.View>
      </Animated.View>

      {/* Content */}
      <View style={styles.content}>

        {/* Logo */}
        <Animated.View style={[styles.logoRow, logoStyle]}>
          <Text style={styles.logoFit}>Fit</Text>
          <Text style={styles.logoOpia}>opia</Text>
        </Animated.View>

        {/* Title */}
        <Animated.Text style={[styles.title, titleStyle]}>
          Your plan is ready.
        </Animated.Text>

        {/* Subtitle */}
        <Animated.Text style={[styles.subtitle, subtitleStyle]}>
          Welcome to Fitopia. Everything has been personalised for you. Let's get to work.
        </Animated.Text>

        {/* Stats row */}
        <Animated.View style={[styles.statsRow, subtitleStyle]}>
          <View style={styles.statItem}>
            <Feather name="activity" size={20} color={colors.white} />
            <Text style={styles.statText}>Custom plan</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Feather name="users" size={20} color={colors.white} />
            <Text style={styles.statText}>Community</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Feather name="zap" size={20} color={colors.white} />
            <Text style={styles.statText}>AI Coach</Text>
          </View>
        </Animated.View>

        {/* Button */}
        <Animated.View style={[styles.buttonContainer, buttonStyle]}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.replace('/(tabs)')}
          >
            <Text style={styles.buttonText}>See my plan</Text>
            <Feather name="arrow-right" size={18} color={colors.blue} />
          </TouchableOpacity>
        </Animated.View>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Large circle that expands on load
  backgroundCircle: {
    position: 'absolute',
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: width,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  // Pulsing rings
  ring: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },

  ring1: {
    width: 280,
    height: 280,
  },

  ring2: {
    width: 380,
    height: 380,
  },

  // Award icon container
  iconContainer: {
    position: 'absolute',
    top: height * 0.15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    paddingHorizontal: 32,
    alignItems: 'center',
    marginTop: 120,
  },

  logoRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },

  logoFit: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: -1,
  },

  logoOpia: {
    fontSize: 32,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: -1,
  },

  title: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: -1,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 42,
  },

  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '300',
    marginBottom: 40,
  },

  // Three stats in a row
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 48,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    width: '100%',
  },

  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },

  statText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },

  statDivider: {
    width: 0.5,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },

  buttonContainer: {
    alignItems: 'center',

  },

  // White button on blue background
  button: {
    backgroundColor: colors.white,
    paddingVertical: 22,
    paddingHorizontal: 48,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.blue,
  },
});