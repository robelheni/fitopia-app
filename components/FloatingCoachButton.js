import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  cancelAnimation,
  runOnJS,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

const AMBER       = '#F59E0B';
const AMBER_DARK  = '#D97706';
const AMBER_LIGHT = '#FEF3C7';
const CREAM       = '#FFFBEB';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const PANEL_WIDTH = SCREEN_WIDTH - 48;
const PANEL_HEIGHT = 380;

// Drag bounds for button's top-left corner
// top: clears status bar + any header nav (~120px)
// bottom: clears tab bar + safe area — button bottom lands ~160px above screen bottom
const CLAMP = {
  left:   24,
  right:  SCREEN_WIDTH - 80,
  top:    120,
  bottom: SCREEN_HEIGHT - 160,
};

const INITIAL_X = SCREEN_WIDTH - 80;
const INITIAL_Y = SCREEN_HEIGHT - 260;
const POS_KEY = '@coach_btn_pos';

const FEATURES = [
  { icon: 'activity',    label: 'Weekly workout analysis' },
  { icon: 'trending-up', label: 'Progressive overload tracking' },
  { icon: 'refresh-cw',  label: 'Smart plan adjustments' },
];

export default function FloatingCoachButton() {
  const [open, setOpen] = useState(false);

  // Panel animations
  const panelScale    = useSharedValue(0);
  const panelOpacity  = useSharedValue(0);
  const buttonOpacity = useSharedValue(1);

  // Drag position (top-left corner of button, relative to overlay origin)
  const posX   = useSharedValue(INITIAL_X);
  const posY   = useSharedValue(INITIAL_Y);
  const startX = useSharedValue(INITIAL_X);
  const startY = useSharedValue(INITIAL_Y);

  // Button feel
  const pulseScale = useSharedValue(1);
  const pressScale = useSharedValue(1);

  function startPulse() {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 1000 }),
        withTiming(1.0,  { duration: 1000 })
      ),
      -1,
      false
    );
  }

  useEffect(() => {
    // Restore saved position
    AsyncStorage.getItem(POS_KEY).then((raw) => {
      if (!raw) return;
      try {
        const { x, y } = JSON.parse(raw);
        posX.value = Math.max(CLAMP.left, Math.min(CLAMP.right,  x));
        posY.value = Math.max(CLAMP.top,  Math.min(CLAMP.bottom, y));
      } catch (_) {}
    });
    startPulse();
  }, []);

  function savePos(x, y) {
    AsyncStorage.setItem(POS_KEY, JSON.stringify({ x, y })).catch(() => {});
  }

  function openPanel() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setOpen(true);
    buttonOpacity.value = withTiming(0, { duration: 150 });
    panelScale.value    = withSpring(1, { damping: 18, stiffness: 200 });
    panelOpacity.value  = withTiming(1, { duration: 200 });
  }

  function closePanel() {
    buttonOpacity.value = withTiming(1, { duration: 200 });
    panelScale.value    = withSpring(0, { damping: 18, stiffness: 260 });
    panelOpacity.value  = withTiming(0, { duration: 150 });
    setTimeout(() => setOpen(false), 200);
  }

  // Tap: press-down → open panel
  const tapGesture = Gesture.Tap()
    .onBegin(() => {
      cancelAnimation(pulseScale);
      pressScale.value = withSpring(0.9, { damping: 10, stiffness: 400 });
    })
    .onEnd(() => {
      pressScale.value = withSpring(1.0, { damping: 12, stiffness: 300 });
      runOnJS(startPulse)();
      runOnJS(openPanel)();
    })
    .onFinalize(() => {
      // Gesture cancelled (e.g. pan took over) — reset scale
      pressScale.value = withSpring(1.0, { damping: 12, stiffness: 300 });
      runOnJS(startPulse)();
    });

  // Pan: drag anywhere, then snap to nearest edge on release
  const panGesture = Gesture.Pan()
    .onStart(() => {
      cancelAnimation(pulseScale);
      startX.value = posX.value;
      startY.value = posY.value;
    })
    .onUpdate((e) => {
      posX.value = Math.max(CLAMP.left, Math.min(CLAMP.right,  startX.value + e.translationX));
      posY.value = Math.max(CLAMP.top,  Math.min(CLAMP.bottom, startY.value + e.translationY));
    })
    .onEnd(() => {
      // Snap button center to whichever edge is closer
      const snapX = posX.value + 28 < SCREEN_WIDTH / 2 ? CLAMP.left : CLAMP.right;
      posX.value = withSpring(snapX, { damping: 22, stiffness: 280 });
      runOnJS(savePos)(snapX, posY.value);
      runOnJS(startPulse)();
    });

  // Race: first gesture to activate cancels the other.
  // Short press → tap wins. Drag → pan wins.
  const composed = Gesture.Race(tapGesture, panGesture);

  const buttonAnimStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [
      { translateX: posX.value },
      { translateY: posY.value },
      { scale: pulseScale.value * pressScale.value },
    ],
  }));

  const panelAnimStyle = useAnimatedStyle(() => ({
    opacity: panelOpacity.value,
    transform: [
      { scaleX: panelScale.value },
      { scaleY: panelScale.value },
    ],
  }));

  return (
    <View style={styles.overlay} pointerEvents="box-none">

      {/* Backdrop — dismiss panel on outside tap */}
      {open && (
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={closePanel}
        />
      )}

      {/* Expanding panel (fixed bottom-right anchor) */}
      <Animated.View style={[styles.panel, panelAnimStyle]} pointerEvents={open ? 'auto' : 'none'}>

        <View style={styles.panelHeader}>
          <Text style={styles.panelTitle}>AI Coach</Text>
          <TouchableOpacity style={styles.closeButton} onPress={closePanel} activeOpacity={0.7}>
            <Feather name="x" size={18} color={colors.black} />
          </TouchableOpacity>
        </View>

        <View style={styles.banner}>
          <View style={styles.bannerBadge}>
            <Text style={styles.bannerBadgeText}>Coming soon</Text>
          </View>
          <Text style={styles.bannerText}>Your personal AI fitness coach is almost here</Text>
        </View>

        <View style={styles.features}>
          {FEATURES.map((f) => (
            <View key={f.icon} style={styles.featureRow}>
              <View style={styles.featureIcon}>
                <Feather name={f.icon} size={16} color={AMBER_DARK} />
              </View>
              <Text style={styles.featureLabel}>{f.label}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.notifyButton}
          activeOpacity={0.85}
          onPress={() =>
            Alert.alert("You're on the list!", "We'll let you know as soon as AI coaching goes live.")
          }
        >
          <Text style={styles.notifyText}>Notify me when it's ready</Text>
        </TouchableOpacity>

      </Animated.View>

      {/* Draggable F button */}
      <Animated.View
        style={[styles.buttonWrap, buttonAnimStyle]}
        pointerEvents={open ? 'none' : 'auto'}
      >
        <GestureDetector gesture={composed}>
          <View style={styles.button}>
            <MaterialCommunityIcons name="dumbbell" size={26} color="#ffffff" />
          </View>
        </GestureDetector>
      </Animated.View>

    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0,
  },

  // Button is anchored at (0,0) and positioned via translateX/translateY
  buttonWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: AMBER,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: AMBER_DARK,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 12,
  },

  // Panel stays fixed at bottom-right
  panel: {
    position: 'absolute',
    bottom: 100,
    right: 24,
    width: PANEL_WIDTH,
    height: PANEL_HEIGHT,
    borderRadius: 24,
    backgroundColor: CREAM,
    padding: 20,
    shadowColor: AMBER_DARK,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 20,
    transformOrigin: 'bottom right',
  },

  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  panelTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.black,
    letterSpacing: -0.5,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.greyCard,
    alignItems: 'center',
    justifyContent: 'center',
  },

  banner: {
    backgroundColor: AMBER_LIGHT,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    gap: 6,
  },
  bannerBadge: {
    backgroundColor: AMBER,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 100,
  },
  bannerBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  bannerText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.black,
    letterSpacing: -0.2,
    lineHeight: 20,
  },

  features: {
    gap: 12,
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: AMBER_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.black,
    letterSpacing: -0.2,
  },

  notifyButton: {
    backgroundColor: AMBER_DARK,
    borderRadius: 100,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: AMBER_DARK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 6,
  },
  notifyText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
