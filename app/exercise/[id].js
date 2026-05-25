import { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { FadeUpItem } from '../../components/ScreenWrapper';

// Exercise database
const exerciseData = {
    e001: {
        name: 'Dumbbell Chest Press',
        muscle: 'Chest',
        equipment: 'Dumbbells',
        difficulty: 'Intermediate',
        sets: 4,
        reps: 12,
        rest: 60,
        isTimed: false,
        instructions: [
        'Lie flat on a bench or floor with a dumbbell in each hand',
        'Hold dumbbells at chest level with palms facing forward',
        'Press the dumbbells up until arms are fully extended',
        'Slowly lower back down to chest level',
        'Keep core tight throughout the movement',
        ],
    },
    e002: {
        name: 'Push Up',
        muscle: 'Chest',
        equipment: 'Bodyweight',
        difficulty: 'Beginner',
        sets: 3,
        reps: 15,
        rest: 45,
        isTimed: false,
        instructions: [
        'Start in a plank position with hands shoulder width apart',
        'Keep your body in a straight line from head to toe',
        'Lower your chest to the floor by bending your elbows',
        'Push back up to the starting position',
        'Keep core engaged throughout',
        ],
    },
    e003: {
        name: 'Dumbbell Chest Fly',
        muscle: 'Chest',
        equipment: 'Dumbbells',
        difficulty: 'Intermediate',
        sets: 3,
        reps: 12,
        rest: 60,
        isTimed: false,
        instructions: [
        'Lie flat with a dumbbell in each hand above your chest',
        'With a slight bend in your elbows open your arms wide',
        'Feel the stretch across your chest',
        'Bring the dumbbells back together above your chest',
        ],
    },
    e004: {
        name: 'Dumbbell Row',
        muscle: 'Back',
        equipment: 'Dumbbells',
        difficulty: 'Intermediate',
        sets: 4,
        reps: 10,
        rest: 60,
        isTimed: false,
        instructions: [
        'Place one knee and hand on a bench for support',
        'Hold a dumbbell in the other hand hanging down',
        'Pull the dumbbell up to your hip keeping elbow close',
        'Slowly lower back down',
        'Complete all reps then switch sides',
        ],
    },
    e005: {
        name: 'Pull Up',
        muscle: 'Back',
        equipment: 'Pull-up bar',
        difficulty: 'Advanced',
        sets: 3,
        reps: 8,
        rest: 90,
        isTimed: false,
        instructions: [
        'Hang from a pull up bar with hands shoulder width apart',
        'Pull your body up until chin is above the bar',
        'Slowly lower yourself back down',
        'Keep core tight and avoid swinging',
        ],
    },
    e006: {
        name: 'Shoulder Press',
        muscle: 'Shoulders',
        equipment: 'Dumbbells',
        difficulty: 'Intermediate',
        sets: 4,
        reps: 12,
        rest: 60,
        isTimed: false,
        instructions: [
        'Sit or stand with dumbbells at shoulder height',
        'Press the dumbbells straight up overhead',
        'Slowly lower back to shoulder height',
        'Keep core tight and back straight',
        ],
    },
    e007: {
        name: 'Dumbbell Squat',
        muscle: 'Legs',
        equipment: 'Dumbbells',
        difficulty: 'Intermediate',
        sets: 4,
        reps: 12,
        rest: 60,
        isTimed: false,
        instructions: [
        'Stand with feet shoulder width apart holding dumbbells',
        'Lower your body as if sitting in a chair',
        'Keep chest up and knees behind toes',
        'Push through heels to stand back up',
        ],
    },
    e008: {
        name: 'Bodyweight Squat',
        muscle: 'Legs',
        equipment: 'Bodyweight',
        difficulty: 'Beginner',
        sets: 3,
        reps: 15,
        rest: 45,
        isTimed: false,
        instructions: [
        'Stand with feet shoulder width apart',
        'Lower your body keeping chest up',
        'Go as low as comfortable',
        'Push through heels to stand back up',
        ],
    },
    e009: {
        name: 'Plank',
        muscle: 'Core',
        equipment: 'Bodyweight',
        difficulty: 'Beginner',
        sets: 3,
        reps: null,
        seconds: 30,
        rest: 30,
        isTimed: true,
        instructions: [
        'Start in a push up position on your forearms',
        'Keep body in a straight line from head to toe',
        'Hold the position for the target time',
        'Breathe steadily throughout',
        'Do not let hips sag or rise',
        ],
    },
    e010: {
        name: 'Bicycle Crunch',
        muscle: 'Core',
        equipment: 'Bodyweight',
        difficulty: 'Beginner',
        sets: 3,
        reps: null,
        seconds: 30,
        rest: 30,
        isTimed: true,
        instructions: [
        'Lie on your back with hands behind your head',
        'Bring one knee to your chest',
        'Rotate your opposite elbow toward that knee',
        'Alternate sides in a cycling motion',
        'Keep lower back pressed to the floor',
        ],
    },
    e011: {
        name: 'Bicep Curl',
        muscle: 'Arms',
        equipment: 'Dumbbells',
        difficulty: 'Beginner',
        sets: 3,
        reps: 12,
        rest: 45,
        isTimed: false,
        instructions: [
        'Stand holding dumbbells at your sides palms forward',
        'Curl the dumbbells up toward your shoulders',
        'Squeeze at the top',
        'Slowly lower back down',
        'Keep elbows close to your body',
        ],
    },
    e012: {
        name: 'Tricep Dips',
        muscle: 'Arms',
        equipment: 'Bodyweight',
        difficulty: 'Beginner',
        sets: 3,
        reps: 12,
        rest: 45,
        isTimed: false,
        instructions: [
        'Sit on the edge of a chair or bench',
        'Place hands on the edge fingers forward',
        'Slide off and lower your body by bending elbows',
        'Push back up to starting position',
        'Keep back close to the chair',
        ],
    },
    };

    export default function ExerciseDetailScreen() {
    const { id } = useLocalSearchParams();
    const exercise = exerciseData[id];

    // Timer state for timed exercises
    const [timerRunning, setTimerRunning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(exercise?.seconds || 30);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (timerRunning) {
        intervalRef.current = setInterval(() => {
            setTimeLeft(prev => {
            if (prev <= 1) {
                clearInterval(intervalRef.current);
                setTimerRunning(false);
                return exercise.seconds;
            }
            return prev - 1;
            });
        }, 1000);
        }
        return () => clearInterval(intervalRef.current);
    }, [timerRunning]);

    if (!exercise) {
        return (
        <View style={styles.container}>
            <Text>Exercise not found</Text>
        </View>
        );
    }

    return (
        <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
            <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            >
            <Feather name="arrow-left" size={20} color={colors.black} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Exercise</Text>
            <View style={{ width: 40 }} />
        </View>

        <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >

            {/* Video placeholder */}
            <FadeUpItem delay={0}>
            <View style={styles.videoPlaceholder}>
                <View style={styles.playButton}>
                <Feather name="play" size={32} color={colors.white} />
                </View>
                <Text style={styles.videoLabel}>Video demonstration</Text>
                <Text style={styles.videoSub}>Coming soon</Text>
            </View>
            </FadeUpItem>

            {/* Exercise name and tags */}
            <FadeUpItem delay={100}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <View style={styles.tags}>
                <View style={styles.tag}>
                <Feather name="target" size={12} color={colors.blue} />
                <Text style={styles.tagText}>{exercise.muscle}</Text>
                </View>
                <View style={styles.tag}>
                <Feather name="tool" size={12} color={colors.blue} />
                <Text style={styles.tagText}>{exercise.equipment}</Text>
                </View>
                <View style={styles.tag}>
                <Feather name="bar-chart-2" size={12} color={colors.blue} />
                <Text style={styles.tagText}>{exercise.difficulty}</Text>
                </View>
            </View>
            </FadeUpItem>

            {/* Sets reps or timer */}
            <FadeUpItem delay={200}>
            {exercise.isTimed ? (
                // Timer card
                <View style={styles.timerCard}>
                <Text style={styles.timerCardTitle}>
                    {exercise.sets} sets · {exercise.seconds} seconds each
                </Text>
                <Text style={styles.timerDisplay}>{timeLeft}s</Text>
                <TouchableOpacity
                    style={[styles.timerButton, timerRunning && styles.timerButtonStop]}
                    onPress={() => setTimerRunning(!timerRunning)}
                >
                    <Feather
                    name={timerRunning ? 'square' : 'play'}
                    size={18}
                    color={colors.white}
                    />
                    <Text style={styles.timerButtonText}>
                    {timerRunning ? 'Stop' : 'Start timer'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.timerReset}
                    onPress={() => {
                    setTimerRunning(false);
                    setTimeLeft(exercise.seconds);
                    }}
                >
                    <Text style={styles.timerResetText}>Reset</Text>
                </TouchableOpacity>
                </View>
            ) : (
                // Sets and reps card
                <View style={styles.setsCard}>
                <View style={styles.setsItem}>
                    <Text style={styles.setsNumber}>{exercise.sets}</Text>
                    <Text style={styles.setsLabel}>Sets</Text>
                </View>
                <View style={styles.setsDivider} />
                <View style={styles.setsItem}>
                    <Text style={styles.setsNumber}>{exercise.reps}</Text>
                    <Text style={styles.setsLabel}>Reps</Text>
                </View>
                <View style={styles.setsDivider} />
                <View style={styles.setsItem}>
                    <Text style={styles.setsNumber}>{exercise.rest}s</Text>
                    <Text style={styles.setsLabel}>Rest</Text>
                </View>
                </View>
            )}
            </FadeUpItem>

            {/* Instructions */}
            <FadeUpItem delay={300}>
            <Text style={styles.sectionTitle}>How to do it</Text>
            <View style={styles.instructionsList}>
                {exercise.instructions.map((instruction, index) => (
                <View key={index} style={styles.instructionItem}>
                    <View style={styles.instructionNumber}>
                    <Text style={styles.instructionNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.instructionText}>{instruction}</Text>
                </View>
                ))}
            </View>
            </FadeUpItem>

            {/* Replace exercise button */}
            <FadeUpItem delay={400}>
            <TouchableOpacity style={styles.replaceButton}>
                <Feather name="refresh-cw" size={16} color={colors.grey} />
                <Text style={styles.replaceButtonText}>Replace this exercise</Text>
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

    // Video placeholder
    videoPlaceholder: {
        height: 220,
        backgroundColor: colors.black,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        overflow: 'hidden',
    },

    playButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
    },

    videoLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.white,
        marginBottom: 4,
    },

    videoSub: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.5)',
    },

    exerciseName: {
        fontSize: 26,
        fontWeight: '700',
        color: colors.black,
        letterSpacing: -0.5,
        marginBottom: 12,
    },

    tags: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 24,
        flexWrap: 'wrap',
    },

    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: colors.blueLight,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 100,
    },

    tagText: {
        fontSize: 12,
        color: colors.blue,
        fontWeight: '500',
    },

    // Sets and reps card
    setsCard: {
        flexDirection: 'row',
        backgroundColor: colors.blue,
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
        shadowColor: colors.blue,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },

    setsItem: {
        flex: 1,
        alignItems: 'center',
    },

    setsNumber: {
        fontSize: 36,
        fontWeight: '700',
        color: colors.white,
        letterSpacing: -1,
        marginBottom: 4,
    },

    setsLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.7)',
        fontWeight: '400',
    },

    setsDivider: {
        width: 0.5,
        height: 50,
        backgroundColor: 'rgba(255,255,255,0.3)',
        alignSelf: 'center',
    },

    // Timer card
    timerCard: {
        backgroundColor: colors.blue,
        borderRadius: 20,
        padding: 24,
        marginBottom: 24,
        alignItems: 'center',
        shadowColor: colors.blue,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },

    timerCardTitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 12,
        fontWeight: '300',
    },

    timerDisplay: {
        fontSize: 72,
        fontWeight: '700',
        color: colors.white,
        letterSpacing: -3,
        marginBottom: 20,
    },

    timerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 100,
        marginBottom: 12,
    },

    timerButtonStop: {
        backgroundColor: 'rgba(220,38,38,0.4)',
    },

    timerButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.white,
    },

    timerReset: {
        paddingVertical: 8,
    },

    timerResetText: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.6)',
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.black,
        letterSpacing: -0.5,
        marginBottom: 12,
    },

    instructionsList: {
        gap: 12,
        marginBottom: 24,
    },

    instructionItem: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'flex-start',
    },

    instructionNumber: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: colors.blueLight,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        marginTop: 2,
    },

    instructionNumberText: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.blue,
    },

    instructionText: {
        fontSize: 15,
        color: colors.black,
        lineHeight: 22,
        flex: 1,
        fontWeight: '300',
    },

    replaceButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 16,
        borderRadius: 100,
        borderWidth: 1.5,
        borderColor: colors.greyBorder,
        marginBottom: 20,
    },

    replaceButtonText: {
        fontSize: 15,
        color: colors.grey,
        fontWeight: '400',
    },
});