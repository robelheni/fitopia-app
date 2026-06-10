import { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring,
    withDelay,
} from 'react-native-reanimated';

const quotes = [
    { text: "Every morning in Africa, a gazelle wakes up. It knows it must run faster than the fastest lion or it will be killed.", author: "African Proverb" },
    { text: "I have never felt that winning was everything. I have always felt that pushing yourself to the limit was the most important thing.", author: "Haile Gebrselassie" },
    { text: "The body does not want you to do this. As you run, it tells you to stop but the mind must be strong.", author: "Haile Gebrselassie" },
    { text: "We are what we repeatedly do. Excellence, then, is not an act but a habit.", author: "Aristotle" },
    { text: "It is not the mountain we conquer, but ourselves.", author: "Edmund Hillary" },
    { text: "Strength does not come from physical capacity. It comes from an indomitable will.", author: "Mahatma Gandhi" },
    { text: "I hated every minute of training, but I said do not quit. Suffer now and live the rest of your life as a champion.", author: "Muhammad Ali" },
    { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
    { text: "The pain you feel today will be the strength you feel tomorrow.", author: "Arnold Schwarzenegger" },
    { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
    { text: "The only bad workout is the one that didn't happen.", author: "Unknown" },
];

const celebrations = [
    "That's what we're talking about,",
    "Look at you go,",
    "Absolutely crushing it,",
    "This is how champions are made,",
    "The work never lies,",
    "One session closer to your goal,",
    "Consistency is your superpower,",
    "Your future self thanks you,",
    "This is the Fitopia way,",
    "Haile would be proud,",
];

export default function CompleteScreen() {
    const { workoutName } = useLocalSearchParams();

    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    const celebration = celebrations[Math.floor(Math.random() * celebrations.length)];

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
        <View style={styles.container}>

            {/* Background circles */}
            <Animated.View style={[styles.circle1, circle1Style]} />
            <Animated.View style={[styles.circle2, circle2Style]} />

            {/* Check icon */}
            <Animated.View style={[styles.iconContainer, iconStyle]}>
                <Feather name="check" size={40} color={colors.white} />
            </Animated.View>

            {/* Greeting */}
            <Animated.Text style={[styles.greeting, greetingStyle]}>
                {celebration}
            </Animated.Text>

            {/* Name */}
            <Animated.Text style={[styles.name, nameStyle]}>
                Heni! 💪
            </Animated.Text>

            {/* Stats */}
            <Animated.View style={[styles.stats, statsStyle]}>
                <View style={styles.stat}>
                    <Text style={styles.statValue}>🔥</Text>
                    <Text style={styles.statLabel}>Cardio done</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.stat}>
                    <Text style={styles.statValue}>{workoutName?.split(' ')[0] || 'Workout'}</Text>
                    <Text style={styles.statLabel}>Session</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.stat}>
                    <Text style={styles.statValue}>+1</Text>
                    <Text style={styles.statLabel}>Streak</Text>
                </View>
            </Animated.View>

            {/* Quote */}
            <Animated.View style={[styles.quoteCard, quoteStyle]}>
                <Feather name="message-circle" size={16} color="rgba(255,255,255,0.5)" />
                <Text style={styles.quoteText}>"{quote.text}"</Text>
                <Text style={styles.quoteAuthor}>— {quote.author}</Text>
            </Animated.View>

            {/* Button */}
            <Animated.View style={[{ width: '100%', alignItems: 'center', gap: 12 }, buttonStyle]}>
                <TouchableOpacity
                    style={styles.doneButton}
                    onPress={() => router.replace('/(tabs)')}
                >
                    <Text style={styles.doneText}>Back to home</Text>
                </TouchableOpacity>
                <Text style={styles.seeYou}>See you next time 🙏</Text>
            </Animated.View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.blue, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, overflow: 'hidden' },
    circle1: { position: 'absolute', width: 400, height: 400, borderRadius: 200, backgroundColor: 'rgba(255,255,255,0.06)', top: -100, right: -100 },
    circle2: { position: 'absolute', width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(255,255,255,0.04)', bottom: -50, left: -80 },
    iconContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 20, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)' },
    greeting: { fontSize: 18, color: 'rgba(255,255,255,0.8)', fontWeight: '300', textAlign: 'center' },
    name: { fontSize: 32, fontWeight: '700', color: colors.white, letterSpacing: -1, textAlign: 'center', marginBottom: 24 },
    stats: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: 16, marginBottom: 20, width: '100%' },
    stat: { flex: 1, alignItems: 'center', gap: 4 },
    statValue: { fontSize: 22, fontWeight: '700', color: colors.white, letterSpacing: -0.5 },
    statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: '300' },
    statDivider: { width: 0.5, height: 30, backgroundColor: 'rgba(255,255,255,0.3)', alignSelf: 'center' },
    quoteCard: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 16, marginBottom: 24, width: '100%', gap: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
    quoteText: { fontSize: 14, color: colors.white, lineHeight: 22, fontWeight: '300', fontStyle: 'italic' },
    quoteAuthor: { fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: '500', textAlign: 'right' },
    doneButton: { backgroundColor: colors.white, paddingVertical: 16, paddingHorizontal: 48, borderRadius: 100, width: '100%', alignItems: 'center', marginBottom: 12, shadowColor: colors.black, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 4 },
    doneText: { fontSize: 16, fontWeight: '600', color: colors.blue },
    seeYou: { fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: '300' },
});