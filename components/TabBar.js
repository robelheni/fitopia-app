import { View, TouchableOpacity, StyleSheet, Dimensions, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { lightColors } from '../constants/colors';
import { useTheme } from '../context/ThemeContext';
import { useTabBar } from '../context/TabBarContext';
import { useNotifications } from '../context/NotificationContext';
import { useEffect } from 'react';

const { width } = Dimensions.get('window');
const TAB_BAR_WIDTH = width - 48;
const NUM_TABS = 5;
const TAB_WIDTH = TAB_BAR_WIDTH / NUM_TABS;

const tabs = [
  { name: 'index',         icon: 'home'      },
  { name: 'workouts',      icon: 'activity'  },
  { name: 'community',     icon: 'users'     },
  { name: 'notifications', icon: 'bell'      },
  { name: 'profile',       icon: 'user'      },
];

export default function TabBar({ state, navigation }) {
  const theme = useTheme();
  const isDark = theme ? theme.isDark : false;
  const colors = theme ? theme.colors : lightColors;
  const { collapsed } = useTabBar();
  const { unreadCount, refreshUnreadCount } = useNotifications();

  const bubbleX = useSharedValue(state.index * TAB_WIDTH);
  const bubbleWidth = useSharedValue(TAB_WIDTH - 16);
  const containerBounce = useSharedValue(1);
  const containerWidth = useSharedValue(TAB_BAR_WIDTH);
  const bubbleOpacity = useSharedValue(1);

  const pressScale0 = useSharedValue(1);
  const pressScale1 = useSharedValue(1);
  const pressScale2 = useSharedValue(1);
  const pressScale3 = useSharedValue(1);
  const pressScale4 = useSharedValue(1);
  const pressScales = [pressScale0, pressScale1, pressScale2, pressScale3, pressScale4];

  // Poll unread count every 30 seconds while the tab bar is mounted
  useEffect(() => {
    refreshUnreadCount();
    const interval = setInterval(refreshUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (collapsed) {
      containerWidth.value = withSpring(96, { damping: 18, stiffness: 180 });
      bubbleOpacity.value = withTiming(0, { duration: 200 });
    } else {
      containerWidth.value = withSpring(TAB_BAR_WIDTH, { damping: 18, stiffness: 180 });
      bubbleX.value = withSpring(state.index * TAB_WIDTH, { damping: 18, stiffness: 180 });
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

  const containerStyle = useAnimatedStyle(() => ({
    width: containerWidth.value,
  }));

  const iconStyle0 = useAnimatedStyle(() => ({ transform: [{ scale: pressScales[0].value }] }));
  const iconStyle1 = useAnimatedStyle(() => ({ transform: [{ scale: pressScales[1].value }] }));
  const iconStyle2 = useAnimatedStyle(() => ({ transform: [{ scale: pressScales[2].value }] }));
  const iconStyle3 = useAnimatedStyle(() => ({ transform: [{ scale: pressScales[3].value }] }));
  const iconStyle4 = useAnimatedStyle(() => ({ transform: [{ scale: pressScales[4].value }] }));
  const iconStyles = [iconStyle0, iconStyle1, iconStyle2, iconStyle3, iconStyle4];

  const badgeCount = Math.min(unreadCount, 99);

  return (
    <Animated.View style={[styles.wrapper, wrapperBounceStyle]}>
      <Animated.View style={[
        styles.container,
        containerStyle,
        { backgroundColor: isDark ? 'rgba(20,20,22,0.85)' : 'rgba(255,255,255,0.3)' },
      ]}>

        {/* Layer 1 — Real background blur, strong */}
        <BlurView
          intensity={140}
          tint={isDark ? 'dark' : 'light'}
          style={StyleSheet.absoluteFill}
        />

        {/* Layer 2 — Gradient gives depth, not flat white */}
        <LinearGradient
          colors={isDark ? [
            'rgba(255,255,255,0.05)',
            'rgba(255,255,255,0.01)',
            'rgba(255,255,255,0.03)',
          ] : [
            'rgba(255,255,255,0.20)',
            'rgba(255,255,255,0.06)',
            'rgba(255,255,255,0.12)',
          ]}
          locations={[0, 0.5, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.glassMid} />
        <View style={styles.glassBorder} />
        <View style={styles.topShine} />
        <View style={styles.bottomDepth} />

        {/* Active pill */}
        <Animated.View style={[styles.bubble, bubbleStyle, isDark && styles.bubbleDark]}>
          <LinearGradient
            colors={isDark ? [
              'rgba(255,255,255,0.12)',
              'rgba(255,255,255,0.05)',
            ] : [
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
          const isNotification = tab.name === 'notifications';
          if (collapsed && !isFocused) return null;
          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tab}
              onPress={() => handlePress(index, tab.name)}
              activeOpacity={1}
            >
              <Animated.View style={[iconStyles[index], styles.iconWrap]}>
                <Feather
                  name={tab.icon}
                  size={22}
                  color={isFocused ? colors.blue : isDark ? 'rgba(180,180,190,0.55)' : 'rgba(90,90,100,0.5)'}
                />
                {/* Red badge on bell icon */}
                {isNotification && badgeCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{badgeCount}</Text>
                  </View>
                )}
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

  glassMid: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 32,
  },

  glassBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 32,
    borderWidth: 0.8,
    borderColor: 'rgba(255,255,255,0.75)',
  },

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

  iconWrap: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },

  badge: {
    position: 'absolute',
    top: -6,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.9)',
  },

  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
    lineHeight: 11,
  },

  bubbleDark: {
    borderColor: 'rgba(255,255,255,0.15)',
    shadowOpacity: 0.3,
  },
});
