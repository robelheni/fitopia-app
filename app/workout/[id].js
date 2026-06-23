import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { FadeUpItem } from '../../components/ScreenWrapper';
import BackgroundCircles from '../../components/BackgroundCircles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
// Hardcoded workout data
// Later this comes from the backend based on the ID
const workoutData = {
    'push-day': {
        name: 'Push Day',
        category: 'Gym',
        duration: '45 min',
        difficulty: 'Intermediate',
        description: 'Chest, shoulders and triceps. Classic push day workout.',
        exercises: [
        { id: 'e001', name: 'Dumbbell Chest Press', sets: 4, reps: 12, rest: '60s', muscle: 'Chest', equipment: 'Dumbbells', isTimed: false },
        { id: 'e003', name: 'Dumbbell Chest Fly', sets: 3, reps: 12, rest: '60s', muscle: 'Chest', equipment: 'Dumbbells', isTimed: false },
        { id: 'e006', name: 'Shoulder Press', sets: 4, reps: 12, rest: '60s', muscle: 'Shoulders', equipment: 'Dumbbells', isTimed: false },
        { id: 'e012', name: 'Tricep Dips', sets: 3, reps: 12, rest: '45s', muscle: 'Arms', equipment: 'Bodyweight', isTimed: false },
        { id: 'e002', name: 'Push Up', sets: 3, reps: 15, rest: '45s', muscle: 'Chest', equipment: 'Bodyweight', isTimed: false },
        ],
    },
    'pull-day': {
        name: 'Pull Day',
        category: 'Gym',
        duration: '45 min',
        difficulty: 'Intermediate',
        description: 'Back and biceps. Build a strong pulling foundation.',
        exercises: [
        { id: 'e005', name: 'Pull Up', sets: 3, reps: 8, rest: '90s', muscle: 'Back', equipment: 'Pull-up bar', isTimed: false },
        { id: 'e004', name: 'Dumbbell Row', sets: 4, reps: 10, rest: '60s', muscle: 'Back', equipment: 'Dumbbells', isTimed: false },
        { id: 'e011', name: 'Bicep Curl', sets: 3, reps: 12, rest: '45s', muscle: 'Arms', equipment: 'Dumbbells', isTimed: false },
        ],
    },
    'leg-day': {
        name: 'Leg Day',
        category: 'Gym',
        duration: '45 min',
        difficulty: 'Intermediate',
        description: 'Full leg and core session. Never skip leg day.',
        exercises: [
        { id: 'e007', name: 'Dumbbell Squat', sets: 4, reps: 12, rest: '60s', muscle: 'Legs', equipment: 'Dumbbells', isTimed: false },
        { id: 'e008', name: 'Bodyweight Squat', sets: 3, reps: 15, rest: '45s', muscle: 'Legs', equipment: 'Bodyweight', isTimed: false },
        { id: 'e009', name: 'Plank', sets: 3, reps: null, rest: '30s', muscle: 'Core', equipment: 'Bodyweight', isTimed: true, seconds: 30 },
        { id: 'e010', name: 'Bicycle Crunch', sets: 3, reps: null, rest: '30s', muscle: 'Core', equipment: 'Bodyweight', isTimed: true, seconds: 30 },
        ],
    },
    'full-body': {
        name: 'Full Body',
        category: 'Home',
        duration: '30 min',
        difficulty: 'Beginner',
        description: 'A complete full body workout using only bodyweight and light dumbbells.',
        exercises: [
        { id: 'e002', name: 'Push Up', sets: 3, reps: 15, rest: '45s', muscle: 'Chest', equipment: 'Bodyweight', isTimed: false },
        { id: 'e008', name: 'Bodyweight Squat', sets: 3, reps: 15, rest: '45s', muscle: 'Legs', equipment: 'Bodyweight', isTimed: false },
        { id: 'e004', name: 'Dumbbell Row', sets: 3, reps: 10, rest: '60s', muscle: 'Back', equipment: 'Dumbbells', isTimed: false },
        { id: 'e009', name: 'Plank', sets: 3, reps: null, rest: '30s', muscle: 'Core', equipment: 'Bodyweight', isTimed: true, seconds: 30 },
        { id: 'e011', name: 'Bicep Curl', sets: 3, reps: 12, rest: '45s', muscle: 'Arms', equipment: 'Dumbbells', isTimed: false },
        ],
    },
    'upper-body': {
        name: 'Upper Body',
        category: 'Home',
        duration: '35 min',
        difficulty: 'Intermediate',
        description: 'Upper body strength training with dumbbells at home.',
        exercises: [
        { id: 'e001', name: 'Dumbbell Chest Press', sets: 4, reps: 12, rest: '60s', muscle: 'Chest', equipment: 'Dumbbells', isTimed: false },
        { id: 'e006', name: 'Shoulder Press', sets: 4, reps: 12, rest: '60s', muscle: 'Shoulders', equipment: 'Dumbbells', isTimed: false },
        { id: 'e004', name: 'Dumbbell Row', sets: 4, reps: 10, rest: '60s', muscle: 'Back', equipment: 'Dumbbells', isTimed: false },
        { id: 'e011', name: 'Bicep Curl', sets: 3, reps: 12, rest: '45s', muscle: 'Arms', equipment: 'Dumbbells', isTimed: false },
        { id: 'e012', name: 'Tricep Dips', sets: 3, reps: 12, rest: '45s', muscle: 'Arms', equipment: 'Bodyweight', isTimed: false },
        ],
    },
    'lower-body': {
        name: 'Lower Body',
        category: 'Home',
        duration: '30 min',
        difficulty: 'Intermediate',
        description: 'Lower body and core workout you can do anywhere.',
        exercises: [
        { id: 'e007', name: 'Dumbbell Squat', sets: 4, reps: 12, rest: '60s', muscle: 'Legs', equipment: 'Dumbbells', isTimed: false },
        { id: 'e008', name: 'Bodyweight Squat', sets: 3, reps: 15, rest: '45s', muscle: 'Legs', equipment: 'Bodyweight', isTimed: false },
        { id: 'e009', name: 'Plank', sets: 3, reps: null, rest: '30s', muscle: 'Core', equipment: 'Bodyweight', isTimed: true, seconds: 30 },
        { id: 'e010', name: 'Bicycle Crunch', sets: 3, reps: null, rest: '30s', muscle: 'Core', equipment: 'Bodyweight', isTimed: true, seconds: 30 },
        ],
    },
    'light-full-body': {
        name: 'Light Full Body',
        category: 'Fasting',
        duration: '20 min',
        difficulty: 'Light',
        description: 'Low intensity bodyweight workout designed for fasting days.',
        exercises: [
        { id: 'e002', name: 'Push Up', sets: 2, reps: 10, rest: '60s', muscle: 'Chest', equipment: 'Bodyweight', isTimed: false },
        { id: 'e008', name: 'Bodyweight Squat', sets: 2, reps: 12, rest: '60s', muscle: 'Legs', equipment: 'Bodyweight', isTimed: false },
        { id: 'e009', name: 'Plank', sets: 2, reps: null, rest: '45s', muscle: 'Core', equipment: 'Bodyweight', isTimed: true, seconds: 20 },
        { id: 'e010', name: 'Bicycle Crunch', sets: 2, reps: null, rest: '45s', muscle: 'Core', equipment: 'Bodyweight', isTimed: true, seconds: 20 },
        ],
    },
    'mobility': {
        name: 'Mobility',
        category: 'Fasting',
        duration: '15 min',
        difficulty: 'Light',
        description: 'Gentle mobility and core work. Perfect for fasting days.',
        exercises: [
        { id: 'e009', name: 'Plank', sets: 3, reps: null, rest: '30s', muscle: 'Core', equipment: 'Bodyweight', isTimed: true, seconds: 20 },
        { id: 'e010', name: 'Bicycle Crunch', sets: 3, reps: null, rest: '30s', muscle: 'Core', equipment: 'Bodyweight', isTimed: true, seconds: 20 },
        ],
    },
    'core-and-balance': {
        name: 'Core and Balance',
        category: 'Fasting',
        duration: '20 min',
        difficulty: 'Light',
        description: 'Core stability and balance work for fasting days.',
        exercises: [
        { id: 'e009', name: 'Plank', sets: 3, reps: null, rest: '30s', muscle: 'Core', equipment: 'Bodyweight', isTimed: true, seconds: 30 },
        { id: 'e010', name: 'Bicycle Crunch', sets: 3, reps: null, rest: '30s', muscle: 'Core', equipment: 'Bodyweight', isTimed: true, seconds: 30 },
        ],
    },
    'low-intensity-cardio': {
        name: 'Low Intensity Cardio',
        category: 'Fasting',
        duration: '20 min',
        difficulty: 'Light',
        description: 'Light cardio movements to keep you active on fasting days without draining your energy.',
        exercises: [
        { id: 'e008', name: 'Bodyweight Squat', sets: 2, reps: 12, rest: '60s', muscle: 'Legs', equipment: 'Bodyweight', isTimed: false },
        { id: 'e002', name: 'Push Up', sets: 2, reps: 10, rest: '60s', muscle: 'Chest', equipment: 'Bodyweight', isTimed: false },
        { id: 'e009', name: 'Plank', sets: 2, reps: null, rest: '45s', muscle: 'Core', equipment: 'Bodyweight', isTimed: true, seconds: 20 },
        { id: 'e010', name: 'Bicycle Crunch', sets: 2, reps: null, rest: '45s', muscle: 'Core', equipment: 'Bodyweight', isTimed: true, seconds: 20 },
        ],
    },
    };

function calculateSessionDuration(session) {
    let totalSeconds = 0;

    // Strength exercises — each set takes roughly 45s of work,
    // plus the rest period between sets (we default rest to 60s
    // since the actual rest value isn't stored on the session object yet)
    session.exercises.forEach(ex => {
        const sets = ex.sets_range ? ex.sets_range[0] : 3;
        const workSecondsPerSet = ex.is_timed
            ? (ex.seconds_range ? ex.seconds_range[0] : 30)
            : 45;
        const restSecondsPerSet = 60;

        // Last set doesn't need a rest after it, so we use (sets - 1) rests
        totalSeconds += (sets * workSecondsPerSet) + ((sets - 1) * restSecondsPerSet);
    });

    // Add warmup — flat 5 minute estimate if one exists
    if (session.warmup) {
        totalSeconds += 5 * 60;
    }

    // Add cardio circuit time if it exists
    if (session.cardio_circuit && session.cardio_circuit.exercises) {
        const { rounds, work_seconds, rest_seconds, exercises } = session.cardio_circuit;
        const exercisesPerRound = exercises.length;
        // Each round: every exercise gets work + rest time
        const secondsPerRound = exercisesPerRound * (work_seconds + rest_seconds);
        totalSeconds += rounds * secondsPerRound;
    }

    // Add finisher — flat 3 minute estimate if one exists
    if (session.finisher) {
        totalSeconds += 3 * 60;
    }

    const totalMinutes = Math.round(totalSeconds / 60);
    return totalMinutes;
}


    export default function WorkoutDetailScreen() {
        const { id, sessionData, workoutName } = useLocalSearchParams();
        

        const [savedSwaps, setSavedSwaps] = useState({});


    useFocusEffect(
        useCallback(() => {
            async function loadSwaps() {
                try {
                    // Load all AsyncStorage keys
                    const keys = await AsyncStorage.getAllKeys();
                    // Filter for workout swaps for this specific day
                    const swapKeys = keys.filter(k => k.startsWith(`workout_swap_${id}_`));
                    const swapMap = {};
                    for (const key of swapKeys) {
                        const val = await AsyncStorage.getItem(key);
                        if (val) {
                            const swap = JSON.parse(val);
                            // Map original exercise ID to replacement
                            swapMap[swap.original] = swap.replacement;
                        }
                    }
                    setSavedSwaps(swapMap);
                } catch (e) {
                    console.log('Load swaps error:', e.message);
                }
            }
            loadSwaps();
        }, [id])
    );

        let workout;
    
        if (sessionData) {
            try {
                const session = JSON.parse(sessionData);
        
                const sessionNames = {
                    push: 'Push Day', pull: 'Pull Day', legs: 'Leg Day',
                    upper: 'Upper Body', lower: 'Lower Body', full_body: 'Full Body',
                };
        
                workout = {
                    name: workoutName || sessionNames[session.session_type] || 'Workout',
                    category: 'Personal Plan',
                    duration: session.duration ? `${session.duration} min` : '45 min',
                    difficulty: 'Personalised',
                    description: `Your personalised ${workoutName} session built around your goals and equipment.`,
                    exercises: session.exercises.map(ex => ({
                        id: ex.id,
                        name: ex.name,
                        sets: ex.sets_range ? ex.sets_range[0] : 3,
                        reps: ex.reps_range
                            ? (ex.reps_range[0] === ex.reps_range[1]
                                ? `${ex.reps_range[0]}`
                                : `${ex.reps_range[0]}-${ex.reps_range[1]}`)
                            : null,
                        rest: '60s',
                        muscle: ex.muscle_group,
                        equipment: ex.equipment,
                        isTimed: ex.is_timed,
                        seconds: ex.seconds_range ? ex.seconds_range[0] : null,
                        instructions: ex.instructions,
                        coaching_cues: ex.coaching_cues,
                    })),
                    warmup: session.warmup,
                    finisher: session.finisher,
                    cardio_circuit: session.cardio_circuit,
                };
            } catch (e) {
                // If parse fails show the error on screen
                return (
                    <View style={{ flex: 1, padding: 40 }}>
                        <Text>Parse error: {e.message}</Text>
                        <Text>Session data type: {typeof sessionData}</Text>
                        <Text>First 100 chars: {String(sessionData).substring(0, 100)}</Text>
                    </View>
                );
            }
        } else {
            workout = workoutData[id];
        }
    
        if (!workout) {
            return (
                <View style={styles.container}>
                    <Text>id: {id}</Text>
                    <Text>hasSession: {sessionData ? 'YES' : 'NO'}</Text>
                    <Text>name: {workoutName}</Text>
                </View>
            );
        }

    return (
        <View style={styles.container}>
        <BackgroundCircles variant="default" />

        {/* Header */}
        <View style={styles.header}>
            <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            >
            <Feather name="arrow-left" size={20} color={colors.black} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{workout.name}</Text>
            <View style={{ width: 40 }} />
        </View>

        <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >

            {/* Workout info card */}
            <FadeUpItem delay={0}>
            <View style={styles.infoCard}>
                <Text style={styles.workoutName}>{workout.name}</Text>
                <Text style={styles.workoutDescription}>{workout.description}</Text>
                <View style={styles.statsRow}>
                <View style={styles.stat}>
                    <Feather name="clock" size={14} color={colors.blue} />
                    <Text style={styles.statText}>{workout.duration}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.stat}>
                    <Feather name="bar-chart-2" size={14} color={colors.blue} />
                    <Text style={styles.statText}>{workout.difficulty}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.stat}>
                    <Feather name="list" size={14} color={colors.blue} />
                    <Text style={styles.statText}>{workout.exercises.length} exercises</Text>
                </View>
                </View>
            </View>
            </FadeUpItem>

            {/* Exercise list */}
            <FadeUpItem delay={150}>
            <Text style={styles.sectionTitle}>Exercises</Text>
            <View style={styles.exerciseList}>
            {workout.exercises.map((exercise, index) => {
                // Check if this exercise has been swapped
                // If yes show the replacement instead of the original
                const displayExercise = savedSwaps[exercise.id] || exercise;

                // Build comma separated list of all session exercise IDs
                // Used by the swap screen to exclude duplicates
                const sessionExerciseIds = workout.exercises.map(e => e.id).join(',');

                return (
                    <TouchableOpacity
                        key={exercise.id}
                        style={styles.exerciseCard}
                        onPress={() => router.push({
                            pathname: `/exercise/${displayExercise.id}`,
                            params: {
                                exerciseData: JSON.stringify(displayExercise),
                                workoutId: id,
                                dayKey: id,
                                exerciseId: exercise.id,
                                sessionExercises: sessionExerciseIds,
                            }
                        })}
                    >
                        {/* Number */}
                        <View style={styles.exerciseNumber}>
                            <Text style={styles.exerciseNumberText}>{index + 1}</Text>
                        </View>

                        {/* Exercise info */}
                        <View style={styles.exerciseInfo}>
                            <Text style={styles.exerciseName}>{displayExercise.name}</Text>
                            <Text style={styles.exerciseMeta}>
                                {displayExercise.isTimed
                                ? `${displayExercise.sets} sets · ${displayExercise.seconds}s · Rest ${displayExercise.rest}`
                                : `${displayExercise.sets} sets · ${displayExercise.reps ?? '-'} reps · Rest ${displayExercise.rest}`
                                }
                            </Text>
                            <View style={styles.exerciseTags}>
                                <View style={styles.tag}>
                                <Text style={styles.tagText}>{exercise.muscle || exercise.muscle_group}</Text>
                                </View>
                                <View style={styles.tag}>
                                    <Text style={styles.tagText}>{displayExercise.equipment}</Text>
                                </View>
                                {/* Show swapped badge if this exercise was swapped */}
                                {savedSwaps[exercise.id] && (
                                    <View style={[styles.tag, { backgroundColor: colors.blueLight }]}>
                                        <Text style={[styles.tagText, { color: colors.blue }]}>Swapped</Text>
                                    </View>
                                )}
                            </View>
                        </View>

                        {/* Swap icon — tapping this opens the swap screen */}
                        <TouchableOpacity
                            style={styles.swapButton}
                            onPress={(e) => {
                                e.stopPropagation();
                                router.push({
                                    pathname: '/workout/swap',
                                    params: {
                                        exerciseId: exercise.id,
                                        sessionExercises: sessionExerciseIds,
                                        dayKey: id,
                                        exerciseName: exercise.name,
                                    }
                                });
                            }}
                        >
                            <Feather name="refresh-cw" size={14} color={colors.grey} />
                        </TouchableOpacity>
                    </TouchableOpacity>
                );
            })}
            
            </View>
            </FadeUpItem>

            {/* Cardio circuit — only shown for lose weight and improve fitness */}
            {workout.cardio_circuit && workout.cardio_circuit.exercises && (
                <FadeUpItem delay={200}>
                    <Text style={styles.sectionTitle}>Cardio Circuit</Text>
                    <View style={[styles.infoCard, { backgroundColor: '#DC2626', marginBottom: 16 }]}>
                        <Text style={{ color: 'white', fontWeight: '700', fontSize: 16, marginBottom: 4 }}>
                            {workout.cardio_circuit.rounds} rounds
                        </Text>
                        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginBottom: 12 }}>
                            {workout.cardio_circuit.work_seconds}s work · {workout.cardio_circuit.rest_seconds}s rest
                        </Text>
                    </View>
                    <View style={styles.exerciseList}>
                    {workout.cardio_circuit.exercises.map((exercise, index) => {
                    const sessionExerciseIds = workout.exercises.map(e => e.id).join(',');
                    return (
                        <TouchableOpacity
                            key={exercise.id}
                            style={styles.exerciseCard}
                            onPress={() => router.push({
                                pathname: `/exercise/${exercise.id}`,
                                params: {
                                    exerciseData: JSON.stringify({
                                        ...exercise,
                                        muscle: exercise.muscle_group,
                                        sets: workout.cardio_circuit.rounds,
                                        reps: null,
                                        rest: `${workout.cardio_circuit.rest_seconds}s`,
                                        isTimed: true,
                                        seconds: workout.cardio_circuit.work_seconds,
                                    }),
                                    workoutId: id,
                                    dayKey: id,
                                    exerciseId: exercise.id,
                                    sessionExercises: sessionExerciseIds,
                                }
                            })}
                        >
                            <View style={[styles.exerciseNumber, { backgroundColor: '#FEE2E2' }]}>
                                <Text style={[styles.exerciseNumberText, { color: '#DC2626' }]}>{index + 1}</Text>
                            </View>
                            <View style={styles.exerciseInfo}>
                                <Text style={styles.exerciseName}>{exercise.name}</Text>
                                <Text style={styles.exerciseMeta}>
                                    {`${workout.cardio_circuit.work_seconds}s work · ${workout.cardio_circuit.rest_seconds}s rest`}
                                </Text>
                                <View style={styles.exerciseTags}>
                                    <View style={[styles.tag, { backgroundColor: '#FEE2E2' }]}>
                                        <Text style={[styles.tagText, { color: '#DC2626' }]}>Cardio</Text>
                                    </View>
                                </View>
                            </View>
                            {/* Swap button for cardio exercises */}
                            <TouchableOpacity
                                style={styles.swapButton}
                                onPress={(e) => {
                                    e.stopPropagation();
                                    router.push({
                                        pathname: '/workout/swap',
                                        params: {
                                            exerciseId: exercise.id,
                                            sessionExercises: sessionExerciseIds,
                                            dayKey: id,
                                            exerciseName: exercise.name,
                                        }
                                    });
                                }}
                            >
                                <Feather name="refresh-cw" size={14} color={colors.grey} />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    );
                })}
                    </View>
                </FadeUpItem>
            )}

            {/* Start workout button */}
            <FadeUpItem delay={300}>
            <TouchableOpacity
                    style={styles.startButton}
                    onPress={() => {
                        if (sessionData) {
                            // Pass real session data to active screen
                            router.push({
                                pathname: '/workout/active',
                                params: {
                                    sessionData: sessionData,
                                    workoutName: workout.name,
                                }
                            });
                        } else {
                            // Old hardcoded route for library workouts
                            router.push(`/workout/active?id=${id}`);
                        }
                    }}
                >
                <Text style={styles.startButtonText}>Start workout</Text>
                <Feather name="arrow-right" size={18} color={colors.white} />
            </TouchableOpacity>
            </FadeUpItem>

        </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 16,
    },

    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.greyCard,
        alignItems: 'center',
        justifyContent: 'center',
    },

    headerTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: colors.black,
    },

    content: {
        paddingHorizontal: 24,
        paddingBottom: 120,
    },

    infoCard: {
        backgroundColor: colors.blue,
        borderRadius: 24,
        padding: 24,
        marginBottom: 24,
        shadowColor: colors.blue,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },

    workoutName: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.white,
        letterSpacing: -0.5,
        marginBottom: 8,
    },

    workoutDescription: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        fontWeight: '300',
        lineHeight: 20,
        marginBottom: 20,
    },

    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 12,
        padding: 12,
    },

    stat: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },

    statText: {
        fontSize: 13,
        color: colors.white,
        fontWeight: '500',
    },

    statDivider: {
        width: 0.5,
        height: 20,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.black,
        letterSpacing: -0.5,
        marginBottom: 12,
    },

    exerciseList: {
        gap: 10,
        marginBottom: 24,
    },

    exerciseCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.greyBorder,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
        gap: 12,
    },

    exerciseNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.blueLight,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },

    exerciseNumberText: {
        fontSize: 13,
        fontWeight: '700',
        color: colors.blue,
    },

    exerciseInfo: {
        flex: 1,
    },

    exerciseName: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.black,
        marginBottom: 4,
        letterSpacing: -0.3,
    },

    exerciseMeta: {
        fontSize: 12,
        color: colors.grey,
        fontWeight: '300',
        marginBottom: 8,
    },

    exerciseTags: {
        flexDirection: 'row',
        gap: 6,
        flexWrap: 'wrap',
    },

    tag: {
        backgroundColor: colors.greyCard,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 100,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },

    tagTimed: {
        backgroundColor: colors.blueLight,
    },

    tagText: {
        fontSize: 10,
        color: colors.grey,
        fontWeight: '500',
    },

    startButton: {
        backgroundColor: colors.blue,
        paddingVertical: 16,
        borderRadius: 100,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: colors.blue,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 8,
    },

    startButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.white,
    },
    swapButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.greyCard,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
});