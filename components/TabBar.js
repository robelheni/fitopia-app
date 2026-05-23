import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { colors } from '../constants/colors';

const { width } = Dimensions.get('window');
const TAB_BAR_WIDTH = width - 48;
const TAB_WIDTH = TAB_BAR_WIDTH / 4;

const tabs = [
  { name: 'index', icon: 'home' },
  { name: 'workouts', icon: 'activity' },
  { name: 'community', icon: 'users' },
  { name: 'profile', icon: 'user' },
];

export default function TabBar({ state, navigation }) {
  const bubbleX = useSharedValue(state.index * TAB_WIDTH);
  const bubbleWidth = useSharedValue(TAB_WIDTH - 16);
  const containerBounce = useSharedValue(1);

  const pressScale0 = useSharedValue(1);
  const pressScale1 = useSharedValue(1);
  const pressScale2 = useSharedValue(1);
  const pressScale3 = useSharedValue(1);
  const pressScales = [pressScale0, pressScale1, pressScale2, pressScale3];

  function handlePress(index, routeName) {
    const currentX = bubbleX.value;
    const targetX = index * TAB_WIDTH;
    const distance = Math.abs(targetX - currentX);

    // Whole pill bounces on tap
    containerBounce.value = withSpring(1.06, {
      damping: 3,
      stiffness: 200,
      mass: 0.5,
      overshootClamping: false,
    }, () => {
      containerBounce.value = withSpring(1, {
        damping: 4,
        stiffness: 100,
        mass: 0.5,
        overshootClamping: false,
      });
    });

    // Bubble stretches based on distance
    bubbleWidth.value = withSpring(
      TAB_WIDTH - 16 + distance * 0.12,
      { damping: 8, stiffness: 120 }
    );

    // Bubble slides to new position
    bubbleX.value = withSpring(targetX, {
      damping: 18,
      stiffness: 180,
      mass: 0.6,
    }, () => {
      bubbleWidth.value = withSpring(TAB_WIDTH - 16, {
        damping: 12,
        stiffness: 200,
      });
    });

    // Icon bounces on tap
    pressScales[index].value = withSpring(1.3, {
        damping: 12,
        stiffness: 350,
        mass: 0.4,
        overshootClamping: true,
      }, () => {
        pressScales[index].value = withSpring(1, {
          damping: 14,
          stiffness: 350,
          mass: 0.4,
          overshootClamping: true,
        });
      });

    navigation.navigate(routeName);
  }

  const wrapperBounceStyle = useAnimatedStyle(() => ({
    transform: [{ scale: containerBounce.value }],
  }));

  const bubbleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: bubbleX.value + 8 }],
    width: bubbleWidth.value,
  }));

  const iconStyle0 = useAnimatedStyle(() => ({ transform: [{ scale: pressScales[0].value }] }));
  const iconStyle1 = useAnimatedStyle(() => ({ transform: [{ scale: pressScales[1].value }] }));
  const iconStyle2 = useAnimatedStyle(() => ({ transform: [{ scale: pressScales[2].value }] }));
  const iconStyle3 = useAnimatedStyle(() => ({ transform: [{ scale: pressScales[3].value }] }));
  const iconStyles = [iconStyle0, iconStyle1, iconStyle2, iconStyle3];

  return (
    <Animated.View style={[styles.wrapper, wrapperBounceStyle]}>
      <View style={styles.container}>

        <View style={styles.innerContainer}>
          <BlurView
            intensity={10}
            tint="light"
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.glassOverlay} />
          <View style={styles.topHighlight} />
          <Animated.View style={[styles.bubble, bubbleStyle]} />
        </View>

        {tabs.map((tab, index) => {
          const isFocused = state.index === index;
          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tab}
              onPress={() => handlePress(index, tab.name)}
              activeOpacity={1}
            >
              <Animated.View style={iconStyles[index]}>
                <Feather
                  name={tab.icon}
                  size={22}
                  color={isFocused ? colors.blue : 'rgba(150,150,160,0.7)'}
                />
              </Animated.View>
            </TouchableOpacity>
          );
        })}

      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 28,
    left: 24,
    right: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 28,
    elevation: 20,
  },

  container: {
    flexDirection: 'row',
    width: TAB_BAR_WIDTH,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
  },

  innerContainer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 32,
    overflow: 'hidden',
  },

  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 32,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.7)',
  },

  topHighlight: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 1,
  },

  bubble: {
    position: 'absolute',
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(37,99,235,0.12)',
    top: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(37,99,235,0.2)',
  },

  tab: {
    width: TAB_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    zIndex: 1,
  },
});