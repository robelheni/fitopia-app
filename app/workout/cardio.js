import { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring,
    withSequence,
    runOnJS,
} from 'react-native-reanimated';
import { completeWorkout } from '../../services/api';

export default function CardioScreen() {
    const { circuitData, workoutName } = useLocalSearchParams();
    const circuit = JSON.parse(circuitData);

    const [phase, setPhase] = useState('intro');
    const [bgColor, setBgColor] = useState('#DC2626');
    const [countdownValue, setCountdownValue] = useState(3);
    const [currentRound, setCurrentRound] = useState(1);
    const [exerciseIndex, setExerciseIndex] = useState(0);
    const [timer, setTimer] = useState(0);

    const timerInterval = useRef(null);
    const countdownInterval = useRef(null);

    const contentOpacity = useSharedValue(1);
    const countdownScale = useSharedValue(1);

    useEffect(() => {
        return () => {
            clearInterval(timerInterval.current);
            clearInterval(countdownInterval.current);
        };
    }, []);

    // Fade content out, run callback to update state, fade back in
    // Uses 0.05 minimum opacity so background always shows — prevents white flash
    function fadeTransition(newBg, callback) {
        contentOpacity.value = withTiming(0.05, { duration: 200 }, (finished) => {
            if (finished) {
                runOnJS(setBgColor)(newBg);
                runOnJS(callback)();
                contentOpacity.value = withTiming(1, { duration: 350 });
            }
        });
    }

    const contentStyle = useAnimatedStyle(() => ({
        opacity: contentOpacity.value,
        flex: 1,
    }));

    const countdownStyle = useAnimatedStyle(() => ({
        transform: [{ scale: countdownScale.value }],
    }));

    function startCountdown() {
        fadeTransition('#111827', () => {
            setPhase('countdown');
            setCountdownValue(3);
        });

        let count = 3;
        setTimeout(() => {
            countdownInterval.current = setInterval(() => {
                count -= 1;
                countdownScale.value = withSequence(
                    withSpring(1.5, { damping: 4, stiffness: 300 }),
                    withSpring(1, { damping: 8, stiffness: 200 })
                );
                if (count < 0) {
                    clearInterval(countdownInterval.current);
                    startWork();
                } else {
                    setCountdownValue(count);
                }
            }, 800);
        }, 350);
    }

    function startWork() {
        fadeTransition('#DC2626', () => {
            setPhase('work');
            setTimer(circuit.work_seconds);
        });

        let timeLeft = circuit.work_seconds;
        setTimeout(() => {
            timerInterval.current = setInterval(() => {
                timeLeft -= 1;
                setTimer(timeLeft);
                if (timeLeft <= 0) {
                    clearInterval(timerInterval.current);
                    startRest();
                }
            }, 1000);
        }, 350);
    }

    function startRest() {
        fadeTransition('#1D4ED8', () => {
            setPhase('rest');
            setTimer(circuit.rest_seconds);
        });

        let timeLeft = circuit.rest_seconds;
        setTimeout(() => {
            timerInterval.current = setInterval(() => {
                timeLeft -= 1;
                setTimer(timeLeft);
                if (timeLeft <= 0) {
                    clearInterval(timerInterval.current);
                    handleRestComplete();
                }
            }, 1000);
        }, 350);
    }

    function handleRestComplete() {
        const nextExerciseIndex = exerciseIndex + 1;

        if (nextExerciseIndex < circuit.exercises.length) {
            setExerciseIndex(nextExerciseIndex);
            startCountdown();
        } else {
            const nextRound = currentRound + 1;
            if (nextRound <= circuit.rounds) {
                fadeTransition('#059669', () => {
                    setPhase('round_complete');
                    setCurrentRound(nextRound);
                    setExerciseIndex(0);
                });
                setTimeout(() => startCountdown(), 2300);
            } else {
                handleFinish();
            }
        }
    }

    function handleSkip() {
        clearInterval(timerInterval.current);
        clearInterval(countdownInterval.current);

        if (phase === 'work') {
            startRest();
        } else if (phase === 'rest') {
            handleRestComplete();
        } else if (phase === 'countdown') {
            startWork();
        }
    }

    async function handleFinish() {
        try {
            await completeWorkout(workoutName || 'Workout');
        } catch (e) {
            console.log('Complete workout error:', e.message);
        }
        router.replace({
            pathname: '/workout/complete',
            params: { workoutName }
        });
    }

    const currentExercise = circuit.exercises[exerciseIndex];

    // ── INTRO SCREEN ──────────────────────────────────────────────
    if (phase === 'intro') {
        return (
            <View style={[styles.screen, { backgroundColor: '#DC2626' }]}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.exitBtn} onPress={() => router.back()}>
                        <Feather name="x" size={20} color={colors.white} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Cardio Circuit</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView contentContainerStyle={styles.introContent}>
                    <View style={styles.zapCircle}>
                        <Feather name="zap" size={36} color={colors.white} />
                    </View>

                    <Text style={styles.introTitle}>Strength done! 💪</Text>
                    <Text style={styles.introSubtitle}>Time for your cardio circuit</Text>
                    <Text style={styles.introMeta}>
                        {circuit.rounds} rounds · {circuit.exercises.length} exercises · {circuit.work_seconds}s work · {circuit.rest_seconds}s rest
                    </Text>

                    <View style={{ width: '100%', gap: 10, marginBottom: 48 }}>
                        {circuit.exercises.map((ex, i) => (
                            <View key={i} style={styles.introExerciseRow}>
                                <Text style={styles.introExerciseNum}>{i + 1}</Text>
                                <Text style={styles.introExerciseName}>{ex.name}</Text>
                                <Text style={styles.introExerciseDuration}>{circuit.work_seconds}s</Text>
                            </View>
                        ))}
                    </View>

                    <TouchableOpacity style={styles.startBtn} onPress={startCountdown}>
                        <Text style={styles.startBtnText}>Start cardio</Text>
                        <Feather name="arrow-right" size={18} color="#DC2626" />
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }

    // ── COUNTDOWN SCREEN ──────────────────────────────────────────
    if (phase === 'countdown') {
        return (
            <View style={[styles.screen, { backgroundColor: bgColor }]}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.exitBtn} onPress={() => router.back()}>
                        <Feather name="x" size={20} color={colors.white} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Cardio Circuit</Text>
                    <Text style={styles.headerRound}>Round {currentRound}/{circuit.rounds}</Text>
                </View>

                <Animated.View style={[styles.center, contentStyle]}>
                    <Text style={styles.upNextLabel}>Up next</Text>
                    <Text style={styles.upNextExercise}>{currentExercise.name}</Text>
                    <Animated.Text style={[styles.countdownNumber, countdownStyle]}>
                        {countdownValue === 0 ? 'GO!' : countdownValue}
                    </Animated.Text>
                    <Text style={styles.roundLabel}>Round {currentRound} of {circuit.rounds}</Text>
                    <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
                        <Text style={styles.skipBtnText}>Skip</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        );
    }

    // ── ROUND COMPLETE SCREEN ─────────────────────────────────────
    if (phase === 'round_complete') {
        return (
            <View style={[styles.screen, { backgroundColor: bgColor }]}>
                <Animated.View style={[styles.center, contentStyle]}>
                    <Text style={{ fontSize: 64, marginBottom: 16 }}>🔥</Text>
                    <Text style={styles.roundCompleteTitle}>Round {currentRound - 1} complete!</Text>
                    <Text style={styles.roundCompleteSubtitle}>
                        {circuit.rounds - currentRound + 1} round{circuit.rounds - currentRound + 1 !== 1 ? 's' : ''} to go
                    </Text>
                </Animated.View>
            </View>
        );
    }

    // ── WORK / REST SCREEN ────────────────────────────────────────
    return (
        <View style={[styles.screen, { backgroundColor: bgColor }]}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.exitBtn} onPress={() => router.back()}>
                    <Feather name="x" size={20} color={colors.white} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Cardio Circuit</Text>
                <Text style={styles.headerRound}>Round {currentRound}/{circuit.rounds}</Text>
            </View>

            <Animated.View style={[styles.center, contentStyle]}>
                <Text style={styles.phaseLabel}>
                    {phase === 'work' ? '🔥 Work' : '😮‍💨 Rest'}
                </Text>

                <Text style={styles.exerciseName}>
                    {phase === 'work' ? currentExercise.name : 'Rest'}
                </Text>

                <Text style={styles.exercisePosition}>
                    {phase === 'work'
                        ? `Exercise ${exerciseIndex + 1} of ${circuit.exercises.length}`
                        : 'Get ready for next exercise'
                    }
                </Text>

                <Text style={styles.timerNumber}>{timer}</Text>

                <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
                    <Text style={styles.skipBtnText}>
                        {phase === 'work' ? 'Done — skip' : 'Skip rest'}
                    </Text>
                </TouchableOpacity>

                <View style={styles.roundDots}>
                    {Array.from({ length: circuit.rounds }).map((_, i) => (
                        <View key={i} style={[
                            styles.roundDot,
                            { backgroundColor: i < currentRound ? colors.white : 'rgba(255,255,255,0.3)' }
                        ]} />
                    ))}
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 16 },
    exitBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 17, fontWeight: '600', color: colors.white },
    headerRound: { fontSize: 14, color: 'rgba(255,255,255,0.7)', fontWeight: '500' },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
    // Intro
    introContent: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, paddingBottom: 40 },
    zapCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
    introTitle: { fontSize: 32, fontWeight: '700', color: colors.white, textAlign: 'center', letterSpacing: -0.5, marginBottom: 12 },
    introSubtitle: { fontSize: 16, color: 'rgba(255,255,255,0.8)', textAlign: 'center', fontWeight: '300', marginBottom: 8 },
    introMeta: { fontSize: 13, color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginBottom: 32, fontWeight: '300' },
    introExerciseRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'rgba(255,255,255,0.15)', padding: 14, borderRadius: 12 },
    introExerciseNum: { color: colors.white, fontWeight: '700', width: 24, fontSize: 15 },
    introExerciseName: { color: colors.white, flex: 1, fontWeight: '500', fontSize: 15 },
    introExerciseDuration: { color: 'rgba(255,255,255,0.6)', fontSize: 13 },
    startBtn: { backgroundColor: colors.white, paddingHorizontal: 48, paddingVertical: 16, borderRadius: 100, flexDirection: 'row', alignItems: 'center', gap: 8, width: '100%', justifyContent: 'center' },
    startBtnText: { fontSize: 16, fontWeight: '700', color: '#DC2626' },
    // Countdown
    upNextLabel: { fontSize: 13, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 },
    upNextExercise: { fontSize: 22, fontWeight: '600', color: colors.white, textAlign: 'center', marginBottom: 32 },
    countdownNumber: { fontSize: 120, fontWeight: '700', color: colors.white, letterSpacing: -4, lineHeight: 130 },
    roundLabel: { fontSize: 14, color: 'rgba(255,255,255,0.5)', marginTop: 16, marginBottom: 32 },
    // Round complete
    roundCompleteTitle: { fontSize: 28, fontWeight: '700', color: colors.white, textAlign: 'center', marginBottom: 8 },
    roundCompleteSubtitle: { fontSize: 16, color: 'rgba(255,255,255,0.7)', textAlign: 'center', fontWeight: '300' },
    // Work / rest
    phaseLabel: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: 3, marginBottom: 16 },
    exerciseName: { fontSize: 28, fontWeight: '700', color: colors.white, textAlign: 'center', letterSpacing: -0.5, marginBottom: 8 },
    exercisePosition: { fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 48 },
    timerNumber: { fontSize: 96, fontWeight: '700', color: colors.white, letterSpacing: -4, marginBottom: 48 },
    skipBtn: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 40, paddingVertical: 14, borderRadius: 100 },
    skipBtnText: { fontSize: 15, fontWeight: '600', color: colors.white },
    roundDots: { flexDirection: 'row', gap: 8, marginTop: 40 },
    roundDot: { width: 8, height: 8, borderRadius: 4 },
});