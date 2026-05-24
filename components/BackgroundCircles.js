import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withDelay,
  } from 'react-native-reanimated';
  import { useEffect } from 'react';
  import { StyleSheet, Dimensions } from 'react-native';
  
  const { width, height } = Dimensions.get('window');
  
  // Each variant has different circle positions
  // so every screen feels slightly different but consistent
  const variants = {
    default: [
      { width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(37,99,235,0.06)', top: -80, right: -80 },
      { width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(37,99,235,0.04)', bottom: 150, left: -60 },
      { width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(212,168,67,0.07)', top: height * 0.4, right: -20 },
    ],
    topLeft: [
      { width: 350, height: 350, borderRadius: 175, backgroundColor: 'rgba(37,99,235,0.05)', top: -100, left: -100 },
      { width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(37,99,235,0.04)', bottom: 200, right: -50 },
      { width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(212,168,67,0.06)', top: height * 0.5, left: -30 },
    ],
    bottomRight: [
      { width: 280, height: 280, borderRadius: 140, backgroundColor: 'rgba(37,99,235,0.06)', bottom: -80, right: -80 },
      { width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(37,99,235,0.04)', top: 100, left: -40 },
      { width: 130, height: 130, borderRadius: 65, backgroundColor: 'rgba(212,168,67,0.07)', bottom: height * 0.4, left: 20 },
    ],
    centered: [
      { width: 400, height: 400, borderRadius: 200, backgroundColor: 'rgba(37,99,235,0.04)', top: -150, right: -150 },
      { width: 250, height: 250, borderRadius: 125, backgroundColor: 'rgba(37,99,235,0.04)', bottom: 50, left: -80 },
      { width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(212,168,67,0.06)', top: height * 0.35, right: -30 },
    ],
  };
  
  export default function BackgroundCircles({ variant = 'default' }) {
    const circles = variants[variant];
  
    const scale1 = useSharedValue(0);
    const scale2 = useSharedValue(0);
    const scale3 = useSharedValue(0);
  
    useEffect(() => {
      scale1.value = withSpring(1, { damping: 20, stiffness: 60 });
      scale2.value = withDelay(100, withSpring(1, { damping: 20, stiffness: 50 }));
      scale3.value = withDelay(200, withSpring(1, { damping: 20, stiffness: 40 }));
    }, []);
  
    const style1 = useAnimatedStyle(() => ({ transform: [{ scale: scale1.value }] }));
    const style2 = useAnimatedStyle(() => ({ transform: [{ scale: scale2.value }] }));
    const style3 = useAnimatedStyle(() => ({ transform: [{ scale: scale3.value }] }));
  
    const animStyles = [style1, style2, style3];
  
    return (
      <>
        {circles.map((circle, index) => (
          <Animated.View
            key={index}
            style={[
              styles.circle,
              circle,
              animStyles[index],
            ]}
          />
        ))}
      </>
    );
  }
  
  const styles = StyleSheet.create({
    circle: {
      position: 'absolute',
    },
  });