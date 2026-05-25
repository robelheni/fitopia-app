import { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { exerciseData } from '../../data/exercises';

// Same workout data as workout detail screen
const workoutData = {
    'push-day': {
        name: 'Push Day',
        exercises: [
        { id: 'e001', name: 'Dumbbell Chest Press', sets: 4, reps: 12, rest: 60, isTimed: false },
        { id: 'e003', name: 'Dumbbell Chest Fly', sets: 3, reps: 12, rest: 60, isTimed: false },
        { id: 'e006', name: 'Shoulder Press', sets: 4, reps: 12, rest: 60, isTimed: false },
        { id: 'e012', name: 'Tricep Dips', sets: 3, reps: 12, rest: 45, isTimed: false },
        { id: 'e002', name: 'Push Up', sets: 3, reps: 15, rest: 45, isTimed: false },
        ],
    },
    'pull-day': {
        name: 'Pull Day',
        exercises: [
        { id: 'e005', name: 'Pull Up', sets: 3, reps: 8, rest: 90, isTimed: false },
        { id: 'e004', name: 'Dumbbell Row', sets: 4, reps: 10, rest: 60, isTimed: false },
        { id: 'e011', name: 'Bicep Curl', sets: 3, reps: 12, rest: 45, isTimed: false },
        ],
    },
    'leg-day': {
        name: 'Leg Day',
        exercises: [
        { id: 'e007', name: 'Dumbbell Squat', sets: 4, reps: 12, rest: 60, isTimed: false },
        { id: 'e008', name: 'Bodyweight Squat', sets: 3, reps: 15, rest: 45, isTimed: false },
        { id: 'e009', name: 'Plank', sets: 3, reps: null, rest: 30, isTimed: true, seconds: 30 },
        { id: 'e010', name: 'Bicycle Crunch', sets: 3, reps: null, rest: 30, isTimed: true, seconds: 30 },
        ],
    },
    'full-body': {
        name: 'Full Body',
        exercises: [
        { id: 'e002', name: 'Push Up', sets: 3, reps: 15, rest: 45, isTimed: false },
        { id: 'e008', name: 'Bodyweight Squat', sets: 3, reps: 15, rest: 45, isTimed: false },
        { id: 'e004', name: 'Dumbbell Row', sets: 3, reps: 10, rest: 60, isTimed: false },
        { id: 'e009', name: 'Plank', sets: 3, reps: null, rest: 30, isTimed: true, seconds: 30 },
        { id: 'e011', name: 'Bicep Curl', sets: 3, reps: 12, rest: 45, isTimed: false },
        ],
    },
    'upper-body': {
        name: 'Upper Body',
        exercises: [
        { id: 'e001', name: 'Dumbbell Chest Press', sets: 4, reps: 12, rest: 60, isTimed: false },
        { id: 'e006', name: 'Shoulder Press', sets: 4, reps: 12, rest: 60, isTimed: false },
        { id: 'e004', name: 'Dumbbell Row', sets: 4, reps: 10, rest: 60, isTimed: false },
        { id: 'e011', name: 'Bicep Curl', sets: 3, reps: 12, rest: 45, isTimed: false },
        { id: 'e012', name: 'Tricep Dips', sets: 3, reps: 12, rest: 45, isTimed: false },
        ],
    },
    'lower-body': {
        name: 'Lower Body',
        exercises: [
        { id: 'e007', name: 'Dumbbell Squat', sets: 4, reps: 12, rest: 60, isTimed: false },
        { id: 'e008', name: 'Bodyweight Squat', sets: 3, reps: 15, rest: 45, isTimed: false },
        { id: 'e009', name: 'Plank', sets: 3, reps: null, rest: 30, isTimed: true, seconds: 30 },
        { id: 'e010', name: 'Bicycle Crunch', sets: 3, reps: null, rest: 30, isTimed: true, seconds: 30 },
        ],
    },
    'light-full-body': {
        name: 'Light Full Body',
        exercises: [
        { id: 'e002', name: 'Push Up', sets: 2, reps: 10, rest: 60, isTimed: false },
        { id: 'e008', name: 'Bodyweight Squat', sets: 2, reps: 12, rest: 60, isTimed: false },
        { id: 'e009', name: 'Plank', sets: 2, reps: null, rest: 45, isTimed: true, seconds: 20 },
        { id: 'e010', name: 'Bicycle Crunch', sets: 2, reps: null, rest: 45, isTimed: true, seconds: 20 },
        ],
    },
    'mobility': {
        name: 'Mobility',
        exercises: [
        { id: 'e009', name: 'Plank', sets: 3, reps: null, rest: 30, isTimed: true, seconds: 20 },
        { id: 'e010', name: 'Bicycle Crunch', sets: 3, reps: null, rest: 30, isTimed: true, seconds: 20 },
        ],
    },
    'core-and-balance': {
        name: 'Core and Balance',
        exercises: [
        { id: 'e009', name: 'Plank', sets: 3, reps: null, rest: 30, isTimed: true, seconds: 30 },
        { id: 'e010', name: 'Bicycle Crunch', sets: 3, reps: null, rest: 30, isTimed: true, seconds: 30 },
        ],
    },
    'low-intensity-cardio': {
        name: 'Low Intensity Cardio',
        exercises: [
        { id: 'e008', name: 'Bodyweight Squat', sets: 2, reps: 12, rest: 60, isTimed: false },
        { id: 'e002', name: 'Push Up', sets: 2, reps: 10, rest: 60, isTimed: false },
        { id: 'e009', name: 'Plank', sets: 2, reps: null, rest: 45, isTimed: true, seconds: 20 },
        { id: 'e010', name: 'Bicycle Crunch', sets: 2, reps: null, rest: 45, isTimed: true, seconds: 20 },
        ],
    },
    };

    export default function ActiveWorkoutScreen() {
    const { id } = useLocalSearchParams();
    const workout = workoutData[id];
    const [selectedExercise, setSelectedExercise] = useState(null);

    // Current exercise index
    const [currentIndex, setCurrentIndex] = useState(0);

    // Track which sets are completed for current exercise
    const [completedSets, setCompletedSets] = useState([]);

    // Rest timer
    const [resting, setResting] = useState(false);
    const [restTime, setRestTime] = useState(0);
    const restInterval = useRef(null);

    // Workout complete
    const [workoutDone, setWorkoutDone] = useState(false);

    const currentExercise = workout?.exercises[currentIndex];
    const totalExercises = workout?.exercises.length;
    const allSetsComplete = completedSets.length === currentExercise?.sets;

    // Progress bar animation
    const progress = useSharedValue(0);
    const progressStyle = useAnimatedStyle(() => ({
        width: `${progress.value}%`,
    }));

    useEffect(() => {
        if (workout) {
        progress.value = withTiming(
            ((currentIndex) / totalExercises) * 100,
            { duration: 500 }
        );
        }
    }, [currentIndex]);

    // Rest timer countdown
    useEffect(() => {
        if (resting && restTime > 0) {
        restInterval.current = setInterval(() => {
            setRestTime(prev => {
            if (prev <= 1) {
                clearInterval(restInterval.current);
                setResting(false);
                return 0;
            }
            return prev - 1;
            });
        }, 1000);
        }
        return () => clearInterval(restInterval.current);
    }, [resting, restTime]);

    function handleSetComplete(setIndex) {
        if (completedSets.includes(setIndex)) return;

        const newCompleted = [...completedSets, setIndex];
        setCompletedSets(newCompleted);

        // Start rest timer after each set
        setRestTime(currentExercise.rest);
        setResting(true);
    }

    function handleNextExercise() {
        if (currentIndex + 1 >= totalExercises) {
        // Workout complete
        progress.value = withTiming(100, { duration: 500 });
        setWorkoutDone(true);
        } else {
        setCurrentIndex(prev => prev + 1);
        setCompletedSets([]);
        setResting(false);
        setRestTime(0);
        }
    }

    if (!workout) {
        return (
        <View style={styles.container}>
            <Text>Workout not found</Text>
        </View>
        );
    }

    // Workout complete screen
    if (workoutDone) {
        return (
        <View style={styles.completeContainer}>
            <View style={styles.completeIcon}>
            <Feather name="check-circle" size={64} color={colors.white} />
            </View>
            <Text style={styles.completeTitle}>Workout done!</Text>
            <Text style={styles.completeSub}>
            You completed {totalExercises} exercises. Great work.
            </Text>
            <TouchableOpacity
            style={styles.completeDoneButton}
            onPress={() => router.replace('/(tabs)')}
            >
            <Text style={styles.completeDoneText}>Back to home</Text>
            </TouchableOpacity>
        </View>
        );
    }

    return (
        <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
            <TouchableOpacity
            style={styles.exitButton}
            onPress={() => router.back()}
            >
            <Feather name="x" size={20} color={colors.black} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{workout.name}</Text>
            <Text style={styles.headerProgress}>
            {currentIndex + 1}/{totalExercises}
            </Text>
        </View>

        {/* Progress bar */}
        <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, progressStyle]} />
        </View>

        <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >

            {/* Exercise name and info */}
            <View style={styles.exerciseHeader}>
            <Text style={styles.exerciseCount}>
                Exercise {currentIndex + 1} of {totalExercises}
            </Text>
            <TouchableOpacity onPress={() => setSelectedExercise(currentExercise)}>
            <View style={styles.exerciseNameRow}>
                <Text style={styles.exerciseName}>{currentExercise.name}</Text>
                <Feather name="info" size={18} color={colors.blue} />
            </View>
            </TouchableOpacity>
            <Text style={styles.exerciseMeta}>
                {currentExercise.isTimed
                ? `${currentExercise.sets} sets · ${currentExercise.seconds} seconds`
                : `${currentExercise.sets} sets · ${currentExercise.reps} reps`
                }
            </Text>
            </View>

            {/* Rest timer */}
            {resting && (
            <View style={styles.restCard}>
                <Feather name="clock" size={20} color={colors.blue} />
                <Text style={styles.restTitle}>Rest</Text>
                <Text style={styles.restTime}>{restTime}s</Text>
                <TouchableOpacity
                style={styles.skipRest}
                onPress={() => {
                    clearInterval(restInterval.current);
                    setResting(false);
                }}
                >
                <Text style={styles.skipRestText}>Skip rest</Text>
                </TouchableOpacity>
            </View>
            )}

            {/* Sets */}
            <Text style={styles.setsTitle}>Sets</Text>
            <View style={styles.setsGrid}>
            {Array.from({ length: currentExercise.sets }).map((_, i) => {
                const isComplete = completedSets.includes(i);
                return (
                <TouchableOpacity
                    key={i}
                    style={[styles.setButton, isComplete && styles.setButtonComplete]}
                    onPress={() => handleSetComplete(i)}
                    disabled={isComplete}
                >
                    {isComplete ? (
                    <Feather name="check" size={22} color={colors.white} />
                    ) : (
                    <Text style={styles.setButtonText}>Set {i + 1}</Text>
                    )}
                </TouchableOpacity>
                );
            })}
            </View>

            {/* Exercise list overview */}
            <Text style={styles.overviewTitle}>Workout overview</Text>
            <View style={styles.overviewList}>
            {workout.exercises.map((ex, i) => (
                <TouchableOpacity
                key={i}
                style={[
                    styles.overviewItem,
                    i === currentIndex && styles.overviewItemActive,
                    i < currentIndex && styles.overviewItemDone,
                ]}
                onPress={() => setSelectedExercise(workout.exercises[i])}
                >
                <View style={[
                    styles.overviewDot,
                    i === currentIndex && styles.overviewDotActive,
                    i < currentIndex && styles.overviewDotDone,
                ]}>
                    {i < currentIndex && (
                    <Feather name="check" size={10} color={colors.white} />
                    )}
                </View>
                <Text style={[
                    styles.overviewText,
                    i === currentIndex && styles.overviewTextActive,
                    i < currentIndex && styles.overviewTextDone,
                ]}>
                    {ex.name}
                </Text>
                <Text style={styles.overviewMeta}>
                    {ex.isTimed ? `${ex.sets}×${ex.seconds}s` : `${ex.sets}×${ex.reps}`}
                </Text>
                </TouchableOpacity>
            ))}
            </View>

        </ScrollView>

        {/* Next button — appears when all sets done */}
        {allSetsComplete && !resting && (
            <View style={styles.nextButtonContainer}>
            <TouchableOpacity
                style={styles.nextButton}
                onPress={handleNextExercise}
            >
                <Text style={styles.nextButtonText}>
                {currentIndex + 1 >= totalExercises ? 'Finish workout' : 'Next exercise'}
                </Text>
                <Feather name="arrow-right" size={18} color={colors.white} />
            </TouchableOpacity>
            </View>
        )}
        {/* Exercise detail modal */}
            <Modal
            visible={selectedExercise !== null}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={() => setSelectedExercise(null)}
            >
                
            {selectedExercise && (
                <View style={styles.modalContainer}>
                <View style={styles.modalHandle} />
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{selectedExercise.name}</Text>
                    <TouchableOpacity
                    style={styles.modalClose}
                    onPress={() => setSelectedExercise(null)}
                    >
                    <Feather name="x" size={20} color={colors.black} />
                    </TouchableOpacity>
                </View>
                <ScrollView
                    contentContainerStyle={styles.modalContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.modalVideo}>
                    <View style={styles.modalPlayButton}>
                        <Feather name="play" size={28} color={colors.white} />
                    </View>
                    <Text style={styles.modalVideoLabel}>Video demonstration</Text>
                    <Text style={styles.modalVideoSub}>Coming soon</Text>
                    </View>
                    <View style={styles.modalStats}>
                    <View style={styles.modalStat}>
                        <Text style={styles.modalStatNumber}>{selectedExercise.sets}</Text>
                        <Text style={styles.modalStatLabel}>Sets</Text>
                    </View>
                    <View style={styles.modalStatDivider} />
                    <View style={styles.modalStat}>
                        <Text style={styles.modalStatNumber}>
                        {selectedExercise.isTimed ? `${selectedExercise.seconds}s` : selectedExercise.reps}
                        </Text>
                        <Text style={styles.modalStatLabel}>
                        {selectedExercise.isTimed ? 'Seconds' : 'Reps'}
                        </Text>
                    </View>
                    <View style={styles.modalStatDivider} />
                    <View style={styles.modalStat}>
                        <Text style={styles.modalStatNumber}>{selectedExercise.rest}s</Text>
                        <Text style={styles.modalStatLabel}>Rest</Text>
                    </View>
                    </View>
                    <Text style={styles.modalSectionTitle}>How to do it</Text>
                    <View style={styles.modalInstructions}>
                    {exerciseData[selectedExercise.id]?.instructions.map((instruction, i) => (
                        <View key={i} style={styles.modalInstructionItem}>
                        <View style={styles.modalInstructionNumber}>
                            <Text style={styles.modalInstructionNumberText}>{i + 1}</Text>
                        </View>
                        <Text style={styles.modalInstructionText}>{instruction}</Text>
                        </View>
                    ))}
                    </View>
                </ScrollView>
                </View>
            )}
            </Modal>

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

    exitButton: {
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

    headerProgress: {
        fontSize: 15,
        fontWeight: '500',
        color: colors.grey,
    },

    // Progress bar
    progressTrack: {
        height: 4,
        backgroundColor: colors.greyBorder,
        marginHorizontal: 24,
        borderRadius: 2,
        marginBottom: 8,
    },

    progressFill: {
        height: 4,
        backgroundColor: colors.blue,
        borderRadius: 2,
    },

    content: {
        paddingHorizontal: 24,
        paddingBottom: 120,
        paddingTop: 8,
    },

    exerciseHeader: {
        marginBottom: 24,
        paddingTop: 16,
    },

    exerciseCount: {
        fontSize: 13,
        color: colors.grey,
        fontWeight: '300',
        marginBottom: 8,
    },

    exerciseName: {
        fontSize: 28,
        fontWeight: '700',
        color: colors.black,
        letterSpacing: -0.5,
        marginBottom: 8,
    },

    exerciseMeta: {
        fontSize: 15,
        color: colors.grey,
        fontWeight: '300',
    },

    // Rest timer card
    restCard: {
        backgroundColor: colors.blueLight,
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(37,99,235,0.15)',
        gap: 8,
    },

    restTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.blue,
    },

    restTime: {
        fontSize: 48,
        fontWeight: '700',
        color: colors.blue,
        letterSpacing: -2,
    },

    skipRest: {
        paddingVertical: 6,
        paddingHorizontal: 16,
    },

    skipRestText: {
        fontSize: 13,
        color: colors.grey,
    },

    setsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.black,
        marginBottom: 12,
    },

    // Sets grid
    setsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 32,
    },

    setButton: {
        width: '47%',
        paddingVertical: 20,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: colors.greyBorder,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },

    setButtonComplete: {
        backgroundColor: colors.blue,
        borderColor: colors.blue,
        shadowColor: colors.blue,
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },

    setButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.black,
    },

    // Workout overview
    overviewTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.black,
        marginBottom: 12,
    },

    overviewList: {
        gap: 8,
    },

    overviewItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        borderRadius: 12,
        backgroundColor: colors.greyCard,
    },

    overviewItemActive: {
        backgroundColor: colors.blueLight,
        borderWidth: 1,
        borderColor: 'rgba(37,99,235,0.2)',
    },

    overviewItemDone: {
        opacity: 0.5,
    },

    overviewDot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: colors.greyBorder,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },

    overviewDotActive: {
        backgroundColor: colors.blue,
    },

    overviewDotDone: {
        backgroundColor: colors.blue,
    },

    overviewText: {
        fontSize: 14,
        color: colors.grey,
        flex: 1,
        fontWeight: '300',
    },

    overviewTextActive: {
        color: colors.blue,
        fontWeight: '600',
    },

    overviewTextDone: {
        color: colors.grey,
        textDecorationLine: 'line-through',
    },

    overviewMeta: {
        fontSize: 12,
        color: colors.greyLight,
    },

    // Next button
    nextButtonContainer: {
        position: 'absolute',
        bottom: 40,
        left: 24,
        right: 24,
    },

    nextButton: {
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

    nextButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.white,
    },

    // Complete screen
    completeContainer: {
        flex: 1,
        backgroundColor: colors.blue,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
    },

    completeIcon: {
        marginBottom: 24,
    },

    completeTitle: {
        fontSize: 36,
        fontWeight: '700',
        color: colors.white,
        letterSpacing: -1,
        marginBottom: 12,
    },

    completeSub: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
        lineHeight: 24,
        fontWeight: '300',
        marginBottom: 48,
    },

    completeDoneButton: {
        backgroundColor: colors.white,
        paddingVertical: 16,
        paddingHorizontal: 48,
        borderRadius: 100,
        width: '100%',
        alignItems: 'center',
    },

    completeDoneText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.blue,
    },
    exerciseNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 8,
    },
    modalContainer: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: 12,
    },
    modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.greyBorder,
    alignSelf: 'center',
    marginBottom: 16,
    },
    modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 20,
    },
    modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.black,
    letterSpacing: -0.5,
    },
    modalClose: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.greyCard,
    alignItems: 'center',
    justifyContent: 'center',
    },
    modalContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    },
    modalVideo: {
    height: 200,
    backgroundColor: colors.black,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    },
    modalPlayButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    },
    modalVideoLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.white,
    marginBottom: 4,
    },
    modalVideoSub: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    },
    modalStats: {
    flexDirection: 'row',
    backgroundColor: colors.blue,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    },
    modalStat: {
    flex: 1,
    alignItems: 'center',
    },
    modalStatNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: -1,
    marginBottom: 4,
    },
    modalStatLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    },
    modalStatDivider: {
    width: 0.5,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignSelf: 'center',
    },
    modalSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 12,
    },
    modalInstructions: {
    gap: 12,
    },
    modalInstructionItem: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    },
    modalInstructionNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.blueLight,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 2,
    },
    modalInstructionNumberText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.blue,
    },
    modalInstructionText: {
    fontSize: 14,
    color: colors.black,
    lineHeight: 22,
    flex: 1,
    fontWeight: '300',
    },
});