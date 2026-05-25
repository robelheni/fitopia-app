import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { FadeUpItem } from '../../components/ScreenWrapper';
import BackgroundCircles from '../../components/BackgroundCircles';

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

    export default function WorkoutDetailScreen() {
    const { id } = useLocalSearchParams();
    const workout = workoutData[id];

    if (!workout) {
        return (
        <View style={styles.container}>
            <Text>Workout not found</Text>
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
                {workout.exercises.map((exercise, index) => (
                <TouchableOpacity
                    key={exercise.id}
                    style={styles.exerciseCard}
                    onPress={() => router.push(`/exercise/${exercise.id}?workoutId=${id}`)}
                >
                    {/* Number */}
                    <View style={styles.exerciseNumber}>
                    <Text style={styles.exerciseNumberText}>{index + 1}</Text>
                    </View>

                    {/* Exercise info */}
                    <View style={styles.exerciseInfo}>
                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                    <Text style={styles.exerciseMeta}>
                        {exercise.isTimed
                        ? `${exercise.sets} sets · ${exercise.seconds}s · Rest ${exercise.rest}`
                        : `${exercise.sets} sets · ${exercise.reps} reps · Rest ${exercise.rest}`
                        }
                    </Text>
                    <View style={styles.exerciseTags}>
                        <View style={styles.tag}>
                        <Text style={styles.tagText}>{exercise.muscle}</Text>
                        </View>
                        <View style={styles.tag}>
                        <Text style={styles.tagText}>{exercise.equipment}</Text>
                        </View>
                        {exercise.isTimed && (
                        <View style={[styles.tag, styles.tagTimed]}>
                            <Feather name="clock" size={10} color={colors.blue} />
                            <Text style={[styles.tagText, { color: colors.blue }]}>Timed</Text>
                        </View>
                        )}
                    </View>
                    </View>

                    <Feather name="chevron-right" size={16} color={colors.greyLight} />
                </TouchableOpacity>
                ))}
            </View>
            </FadeUpItem>

            {/* Start workout button */}
            <FadeUpItem delay={300}>
            <TouchableOpacity style={styles.startButton}>
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
});