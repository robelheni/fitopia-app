import { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring,
    withDelay,
} from 'react-native-reanimated';

// Shared completion screen used after both a normal workout (active.js)
// and a cardio circuit (cardio.js) finish. Extracted into its own file
// so both flows show the exact same polished celebration screen instead
// of each screen needing to duplicate this logic or navigate to a
// separate broken route.
export default function WorkoutCompletionScreen({ quote, celebration, totalExercises, workoutName, userName }) {
    const iconScale = useSharedValue(0);
    const greetingOpacity = useSharedValue(0);
    const greetingY = useSharedValue(30);
    const nameOpacity = useSharedValue(0);
    const nameScale = useSharedValue(0.5);
    const statsOpacity = useSharedValue(0);
    const statsY = useSharedValue(30);
    const quoteOpacity = useSharedValue(0);
    const quoteY = useSharedValue(30);
    const buttonOpacity = useSharedValue(0);
    const buttonY = useSharedValue(30);
    const circle1Scale = useSharedValue(0);
    const circle2Scale = useSharedValue(0);

    useEffect(() => {
        circle1Scale.value = withSpring(1, { damping: 12, stiffness: 60 });
        circle2Scale.value = withDelay(200, withSpring(1, { damping: 12, stiffness: 50 }));
        iconScale.value = withDelay(200, withSpring(1, { damping: 6, stiffness: 200, mass: 0.5 }));
        greetingOpacity.value = withDelay(500, withTiming(1, { duration: 400 }));
        greetingY.value = withDelay(500, withSpring(0, { damping: 12, stiffness: 120 }));
        nameOpacity.value = withDelay(700, withTiming(1, { duration: 300 }));
        nameScale.value = withDelay(700, withSpring(1, { damping: 5, stiffness: 200, mass: 0.8 }));
        statsOpacity.value = withDelay(1000, withTiming(1, { duration: 300 }));
        statsY.value = withDelay(1000, withSpring(0, { damping: 8, stiffness: 180 }));
        quoteOpacity.value = withDelay(1300, withTiming(1, { duration: 500 }));
        quoteY.value = withDelay(1300, withSpring(0, { damping: 12, stiffness: 100 }));
        buttonOpacity.value = withDelay(1600, withTiming(1, { duration: 400 }));
        buttonY.value = withDelay(1600, withSpring(0, { damping: 12, stiffness: 100 }));
    }, []);

    const circle1Style = useAnimatedStyle(() => ({ transform: [{ scale: circle1Scale.value }] }));
    const circle2Style = useAnimatedStyle(() => ({ transform: [{ scale: circle2Scale.value }] }));
    const iconStyle = useAnimatedStyle(() => ({ transform: [{ scale: iconScale.value }] }));
    const greetingStyle = useAnimatedStyle(() => ({ opacity: greetingOpacity.value, transform: [{ translateY: greetingY.value }] }));
    const nameStyle = useAnimatedStyle(() => ({ opacity: nameOpacity.value, transform: [{ scale: nameScale.value }] }));
    const statsStyle = useAnimatedStyle(() => ({ opacity: statsOpacity.value, transform: [{ translateY: statsY.value }] }));
    const quoteStyle = useAnimatedStyle(() => ({ opacity: quoteOpacity.value, transform: [{ translateY: quoteY.value }] }));
    const buttonStyle = useAnimatedStyle(() => ({ opacity: buttonOpacity.value, transform: [{ translateY: buttonY.value }] }));

    return (
        <View style={styles.completeContainer}>
            <Animated.View style={[styles.celebrationCircle1, circle1Style]} />
            <Animated.View style={[styles.celebrationCircle2, circle2Style]} />
            <Animated.View style={[styles.completeIconContainer, iconStyle]}>
                <Feather name="check" size={40} color={colors.white} />
            </Animated.View>
            <Animated.Text style={[styles.completeGreeting, greetingStyle]}>{celebration}</Animated.Text>
            <Animated.Text style={[styles.completeName, nameStyle]}>
                {userName ? `${userName}!` : 'Well done!'}
            </Animated.Text>
            <Animated.View style={[styles.completeStats, statsStyle]}>
                <View style={styles.completeStat}>
                    <Text style={styles.completeStatValue}>{totalExercises}</Text>
                    <Text style={styles.completeStatLabel}>Exercises</Text>
                </View>
                <View style={styles.completeStatDivider} />
                <View style={styles.completeStat}>
                    <Text style={styles.completeStatValue}>{workoutName ? workoutName.split(' ')[0] : 'Workout'}</Text>
                    <Text style={styles.completeStatLabel}>Workout</Text>
                </View>
                <View style={styles.completeStatDivider} />
                <View style={styles.completeStat}>
                    <Text style={styles.completeStatValue}>+1</Text>
                    <Text style={styles.completeStatLabel}>Streak</Text>
                </View>
            </Animated.View>
            <Animated.View style={[styles.quoteCard, quoteStyle]}>
                <Feather name="message-circle" size={16} color="rgba(255,255,255,0.5)" />
                <Text style={styles.quoteText}>"{quote.text}"</Text>
                <Text style={styles.quoteAuthor}>— {quote.author}</Text>
            </Animated.View>
            <Animated.View style={[{ width: '100%', alignItems: 'center', gap: 12 }, buttonStyle]}>
                <TouchableOpacity style={styles.completeDoneButton} onPress={() => router.replace('/(tabs)')}>
                    <Text style={styles.completeDoneText}>Back to home</Text>
                </TouchableOpacity>
                <Text style={styles.seeYouText}>See you next time 🙏</Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    completeContainer: { flex: 1, backgroundColor: colors.blue, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, overflow: 'hidden' },
    celebrationCircle1: { position: 'absolute', width: 400, height: 400, borderRadius: 200, backgroundColor: 'rgba(255,255,255,0.06)', top: -100, right: -100 },
    celebrationCircle2: { position: 'absolute', width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(255,255,255,0.04)', bottom: -50, left: -80 },
    completeIconContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 20, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)' },
    completeGreeting: { fontSize: 18, color: 'rgba(255,255,255,0.8)', fontWeight: '300', textAlign: 'center' },
    completeName: { fontSize: 32, fontWeight: '700', color: colors.white, letterSpacing: -1, textAlign: 'center', marginBottom: 24 },
    completeStats: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: 16, marginBottom: 20, width: '100%' },
    completeStat: { flex: 1, alignItems: 'center', gap: 4 },
    completeStatValue: { fontSize: 22, fontWeight: '700', color: colors.white, letterSpacing: -0.5 },
    completeStatLabel: { fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: '300' },
    completeStatDivider: { width: 0.5, height: 30, backgroundColor: 'rgba(255,255,255,0.3)', alignSelf: 'center' },
    quoteCard: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 16, marginBottom: 24, width: '100%', gap: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
    quoteText: { fontSize: 14, color: colors.white, lineHeight: 22, fontWeight: '300', fontStyle: 'italic' },
    quoteAuthor: { fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: '500', textAlign: 'right' },
    completeDoneButton: { backgroundColor: colors.white, paddingVertical: 16, paddingHorizontal: 48, borderRadius: 100, width: '100%', alignItems: 'center', marginBottom: 12, shadowColor: colors.black, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 4 },
    completeDoneText: { fontSize: 16, fontWeight: '600', color: colors.blue },
    seeYouText: { fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: '300' },
});