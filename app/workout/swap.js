import { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { FadeUpItem } from '../../components/ScreenWrapper';
import { getSwapOptions } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function WorkoutSwapScreen() {
    // exerciseId — the exercise being replaced
    // sessionExercises — comma separated IDs of all exercises in the session
    // dayKey — which day this workout is for e.g. 'wed'
    // exerciseName — display name of the exercise being replaced
    const { exerciseId, sessionExercises, dayKey, exerciseName } = useLocalSearchParams();

    const [swaps, setSwaps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        async function fetchSwaps() {
            try {
                // Call the backend swap endpoint
                // It returns exercises with the same movement pattern
                // excluding exercises already in the session
                const data = await getSwapOptions(exerciseId, sessionExercises);
                setSwaps(data || []);
            } catch (error) {
                console.log('Swap fetch error:', error.message);
            } finally {
                setLoading(false);
            }
        }
        fetchSwaps();
    }, []);

    async function confirmSwap() {
        if (!selected) return;

        // Save the swap to AsyncStorage
        // Key pattern: workout_swap_{dayKey}_{exerciseId}
        // This tells [id].js to show the swapped exercise instead of the original
        const swapKey = `workout_swap_${dayKey}_${exerciseId}`;
        await AsyncStorage.setItem(
            swapKey,
            JSON.stringify({
                original: exerciseId,
                replacement: selected,
                dayKey: dayKey,
            })
        );

        // Go back to the workout detail screen
        router.back();
        // Go back again to get past the exercise detail screen if we came from there
        router.back();
    }

    return (
        <View style={styles.container}>

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Feather name="arrow-left" size={20} color={colors.black} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Swap exercise</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <FadeUpItem delay={0}>
                    <Text style={styles.subtitle}>
                        Replacing <Text style={styles.subtitleBold}>{exerciseName}</Text>. Choose an alternative with the same movement pattern.
                    </Text>
                </FadeUpItem>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.blue} />
                        <Text style={styles.loadingText}>Finding alternatives...</Text>
                    </View>
                ) : swaps.length === 0 ? (
                    <View style={styles.loadingContainer}>
                        <Text style={styles.loadingText}>
                            No alternatives available for this exercise.
                        </Text>
                    </View>
                ) : (
                    <FadeUpItem delay={100}>
                        <View style={styles.swapList}>
                            {swaps.map((exercise, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.swapCard,
                                        selected?.id === exercise.id && styles.swapCardSelected
                                    ]}
                                    onPress={() => setSelected(
                                        selected?.id === exercise.id ? null : exercise
                                    )}
                                >
                                    {/* Exercise icon */}
                                    <View style={styles.exerciseIcon}>
                                        <Feather name="activity" size={22} color={colors.greyLight} />
                                    </View>

                                    {/* Exercise info */}
                                    <View style={styles.exerciseInfo}>
                                        <Text style={styles.exerciseName}>{exercise.name}</Text>
                                        <Text style={styles.exerciseMeta}>
                                            {exercise.sets_range ? `${exercise.sets_range[0]}-${exercise.sets_range[1]} sets` : '3-4 sets'}
                                            {' · '}
                                            {exercise.reps_range ? `${exercise.reps_range[0]}-${exercise.reps_range[1]} reps` : 'timed'}
                                        </Text>
                                        <View style={styles.exerciseTags}>
                                            <View style={styles.tag}>
                                                <Text style={styles.tagText}>{exercise.muscle_group}</Text>
                                            </View>
                                            <View style={styles.tag}>
                                                <Text style={styles.tagText}>{exercise.equipment}</Text>
                                            </View>
                                        </View>
                                    </View>

                                    {/* Check circle */}
                                    <View style={[
                                        styles.checkCircle,
                                        selected?.id === exercise.id && styles.checkCircleSelected
                                    ]}>
                                        {selected?.id === exercise.id && (
                                            <Feather name="check" size={14} color={colors.white} />
                                        )}
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </FadeUpItem>
                )}

                {/* Confirm button — only shows when something is selected */}
                {selected && (
                    <FadeUpItem delay={0}>
                        <TouchableOpacity
                            style={styles.confirmButton}
                            onPress={confirmSwap}
                        >
                            <Feather name="check" size={16} color={colors.white} />
                            <Text style={styles.confirmText}>
                                Swap to {selected.name}
                            </Text>
                        </TouchableOpacity>
                    </FadeUpItem>
                )}
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
        borderBottomWidth: 0.5,
        borderBottomColor: colors.greyBorder,
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
        paddingTop: 20,
        paddingBottom: 120,
    },
    subtitle: {
        fontSize: 14,
        color: colors.grey,
        fontWeight: '300',
        marginBottom: 20,
        lineHeight: 20,
    },
    subtitleBold: {
        fontWeight: '600',
        color: colors.black,
    },
    loadingContainer: {
        paddingTop: 60,
        alignItems: 'center',
        gap: 12,
    },
    loadingText: {
        fontSize: 14,
        color: colors.grey,
        fontWeight: '300',
    },
    swapList: {
        gap: 12,
        marginBottom: 20,
    },
    swapCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 12,
        borderWidth: 1.5,
        borderColor: colors.greyBorder,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
        gap: 12,
    },
    swapCardSelected: {
        borderColor: colors.blue,
        backgroundColor: colors.blueLight,
    },
    exerciseIcon: {
        width: 56,
        height: 56,
        borderRadius: 12,
        backgroundColor: colors.greyCard,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    exerciseInfo: {
        flex: 1,
        gap: 4,
    },
    exerciseName: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.black,
        letterSpacing: -0.3,
    },
    exerciseMeta: {
        fontSize: 12,
        color: colors.grey,
        fontWeight: '300',
    },
    exerciseTags: {
        flexDirection: 'row',
        gap: 6,
        flexWrap: 'wrap',
        marginTop: 2,
    },
    tag: {
        backgroundColor: colors.greyCard,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 100,
    },
    tagText: {
        fontSize: 10,
        color: colors.grey,
        fontWeight: '500',
    },
    checkCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: colors.greyBorder,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        marginTop: 4,
    },
    checkCircleSelected: {
        backgroundColor: colors.blue,
        borderColor: colors.blue,
    },
    confirmButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: colors.blue,
        paddingVertical: 16,
        borderRadius: 100,
        shadowColor: colors.blue,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    confirmText: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.white,
    },
});