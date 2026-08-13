import { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { lightColors } from '../../constants/colors';
import { FadeUpItem } from '../../components/ScreenWrapper';
import { exerciseData } from '../../data/exercises';
import { Ionicons } from '@expo/vector-icons';
import { toggleLikeExercise, getLikeStatus } from '../../services/api';


export default function ExerciseDetailScreen() {
    const { id, exerciseData: exerciseParam, dayKey, exerciseId, sessionExercises } = useLocalSearchParams();

    const theme = useTheme();
    const isDark = theme ? theme.isDark : false;
    const colors = theme ? theme.colors : lightColors;

    // If real exercise data was passed as a param use it
    // Otherwise fall back to local hardcoded data for library exercises
    const exercise = exerciseParam ? JSON.parse(exerciseParam) : exerciseData[id];

    const [liked, setLiked] = useState(false);
    const [likeLoading, setLikeLoading] = useState(false);


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

    const styles = makeStyles(colors, isDark);

    if (!exercise) {
        return (
        <View style={styles.container}>
            <Text>Exercise not found</Text>
        </View>
        );
    }

    // Fetch like status when screen loads
    // We use the exercise id to check if user has already liked it
    useEffect(() => {
        async function fetchLikeStatus() {
        try {
            const result = await getLikeStatus(id);
            setLiked(result.liked);
        } catch (err) {
            console.log('Failed to get like status:', err.message);
        }
        }
        if (id) fetchLikeStatus();
    }, [id]);
    
    async function handleLike() {
        try {
        setLikeLoading(true);
        const result = await toggleLikeExercise(id);
        setLiked(result.liked);
        } catch (err) {
        console.log('Like failed:', err.message);
        } finally {
        setLikeLoading(false);
        }
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
            <TouchableOpacity
                style={styles.likeButton}
                onPress={handleLike}
                disabled={likeLoading}
                >
                <Ionicons
                    name={liked ? "heart" : "heart-outline"}
                    size={22}
                    color={liked ? '#DC2626' : colors.grey}
                />
            </TouchableOpacity>
        </View>

        <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >

            {/* Video placeholder */}
            <FadeUpItem delay={0}>
            <View style={styles.videoPlaceholder}>
                <View style={styles.playButton}>
                <Feather name="play" size={32} color={'#FFFFFF'} />
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
                    color={'#FFFFFF'}
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
                {(exercise.instructions || []).map((instruction, index) => (
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
            <TouchableOpacity 
                style={styles.replaceButton}
                onPress={() => router.push({
                    pathname: '/workout/swap',
                    params: {
                        exerciseId: exerciseId || id,
                        sessionExercises: sessionExercises || '',
                        dayKey: dayKey || '',
                        exerciseName: exercise.name,
                    }
                })}
            >
                <Feather name="refresh-cw" size={16} color={colors.grey} />
                <Text style={styles.replaceButtonText}>Replace this exercise</Text>
            </TouchableOpacity>
            </FadeUpItem>

        </ScrollView>
        </View>
    );
    }

function makeStyles(c, dark) {
  const colors = c || lightColors;
  const isDark = dark || false;
  return StyleSheet.create({
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
        backgroundColor: '#0A0A0A',
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
        color: '#FFFFFF',
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
        color: colors.blueText,
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
        color: '#FFFFFF',
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
        color: '#FFFFFF',
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
        color: '#FFFFFF',
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
        color: colors.blueText,
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
    likeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.greyCard,
        alignItems: 'center',
        justifyContent: 'center',
      },
}); }