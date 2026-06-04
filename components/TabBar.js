import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  useDerivedValue,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { useTabBar } from '../context/TabBarContext';
import { useEffect } from 'react';

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
  const { collapsed } = useTabBar();

  const bubbleX = useSharedValue(state.index * TAB_WIDTH);
  const bubbleWidth = useSharedValue(TAB_WIDTH - 16);
  const containerBounce = useSharedValue(1);
  const containerWidth = useSharedValue(TAB_BAR_WIDTH);
  const bubbleOpacity = useSharedValue(1);
  const highlightX = useSharedValue(state.index * TAB_WIDTH);

  const pressScale0 = useSharedValue(1);
  const pressScale1 = useSharedValue(1);
  const pressScale2 = useSharedValue(1);
  const pressScale3 = useSharedValue(1);
  const pressScales = [pressScale0, pressScale1, pressScale2, pressScale3];

  useEffect(() => {
    if (collapsed) {
      containerWidth.value = withSpring(96, { damping: 18, stiffness: 180 });
      bubbleOpacity.value = withTiming(0, { duration: 200 });
    } else {
      containerWidth.value = withSpring(TAB_BAR_WIDTH, { damping: 18, stiffness: 180 });
      bubbleX.value = withSpring(state.index * TAB_WIDTH, { damping: 18, stiffness: 180 });
      highlightX.value = withSpring(state.index * TAB_WIDTH, { damping: 20, stiffness: 160 });
      bubbleOpacity.value = withTiming(1, { duration: 200 });
    }
  }, [collapsed, state.index]);

  function handlePress(index, routeName) {
    const currentX = bubbleX.value;
    const targetX = index * TAB_WIDTH;
    const distance = Math.abs(targetX - currentX);

    containerBounce.value = withSpring(1.03, {
      damping: 3, stiffness: 200, mass: 0.5,
    }, () => {
      containerBounce.value = withSpring(1, {
        damping: 4, stiffness: 100, mass: 0.5,
      });
    });

    // Bubble stretches toward target
    bubbleWidth.value = withSpring(
      TAB_WIDTH - 16 + distance * 0.12,
      { damping: 8, stiffness: 120 }
    );

    bubbleX.value = withSpring(targetX, {
      damping: 18, stiffness: 180, mass: 0.6,
    }, () => {
      bubbleWidth.value = withSpring(TAB_WIDTH - 16, {
        damping: 12, stiffness: 200,
      });
    });

    // Specular highlight moves slightly behind bubble — depth illusion
    highlightX.value = withSpring(targetX, {
      damping: 22, stiffness: 160, mass: 0.7,
    });

    pressScales[index].value = withSpring(1.22, {
      damping: 12, stiffness: 350, mass: 0.4, overshootClamping: true,
    }, () => {
      pressScales[index].value = withSpring(1, {
        damping: 14, stiffness: 350, mass: 0.4, overshootClamping: true,
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
    opacity: bubbleOpacity.value,
  }));

  const highlightStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: highlightX.value + 16 }],
    opacity: bubbleOpacity.value,
  }));

  const containerStyle = useAnimatedStyle(() => ({
    width: containerWidth.value,
  }));

  const iconStyle0 = useAnimatedStyle(() => ({ transform: [{ scale: pressScales[0].value }] }));
  const iconStyle1 = useAnimatedStyle(() => ({ transform: [{ scale: pressScales[1].value }] }));
  const iconStyle2 = useAnimatedStyle(() => ({ transform: [{ scale: pressScales[2].value }] }));
  const iconStyle3 = useAnimatedStyle(() => ({ transform: [{ scale: pressScales[3].value }] }));
  const iconStyles = [iconStyle0, iconStyle1, iconStyle2, iconStyle3];

  return (
    <Animated.View style={[styles.wrapper, wrapperBounceStyle]}>
      <Animated.View style={[styles.container, containerStyle]}>

        {/* Layer 1 — Real background blur, strong */}
        <BlurView
          intensity={140}
          tint="light"
          style={StyleSheet.absoluteFill}
        />

        {/* Layer 2 — Gradient gives depth, not flat white */}
        <LinearGradient
          colors={[
            'rgba(255,255,255,0.20)',
            'rgba(255,255,255,0.06)',
            'rgba(255,255,255,0.12)',
          ]}
          locations={[0, 0.5, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Layer 3 — Very subtle mid glass tint */}
        <View style={styles.glassMid} />

        {/* Layer 4 — Glass edge border */}
        <View style={styles.glassBorder} />

        {/* Layer 5 — Top shine edge */}
        <View style={styles.topShine} />

        {/* Layer 6 — Bottom depth */}
        <View style={styles.bottomDepth} />

        {/* Moving specular highlight — trails slightly behind bubble */}
        <Animated.View style={[styles.specularHighlight, highlightStyle]} />

        {/* Active pill — glass not blue */}
        <Animated.View style={[styles.bubble, bubbleStyle]}>
          <LinearGradient
            colors={[
              'rgba(255,255,255,0.55)',
              'rgba(255,255,255,0.25)',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        {/* Tabs */}
        {tabs.map((tab, index) => {
          const isFocused = state.index === index;
          if (collapsed && !isFocused) return null;
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
                  color={isFocused ? colors.blue : 'rgba(90,90,100,0.5)'}
                />
              </Animated.View>
            </TouchableOpacity>
          );
        })}

      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    // Layered shadow — Apple style
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 30,
    elevation: 20,
  },

  container: {
    flexDirection: 'row',
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.3)',
  },

  // Very subtle mid tint — keeps it from looking milky
  glassMid: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 32,
  },

  // Glass edge
  glassBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 32,
    borderWidth: 0.8,
    borderColor: 'rgba(255,255,255,0.75)',
  },

  // Light catching top edge
  topShine: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 1,
    backgroundColor: 'rgba(255,255,255,1)',
    borderRadius: 1,
    zIndex: 3,
  },

  // Depth at bottom
  bottomDepth: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 1,
    zIndex: 3,
  },

  // Moving specular highlight — floats behind active tab
  specularHighlight: {
    position: 'absolute',
    top: 6,
    width: TAB_WIDTH - 32,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.22)',
    zIndex: 1,
  },

  // Active tab pill — glass not blue
  bubble: {
    position: 'absolute',
    height: 44,
    borderRadius: 22,
    top: 10,
    zIndex: 2,
    overflow: 'hidden',
    borderWidth: 0.8,
    borderColor: 'rgba(255,255,255,0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },

  tab: {
    width: TAB_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    zIndex: 4,
  },
});