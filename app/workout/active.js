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
    withDelay,
    withSequence,
    withRepeat,
  } from 'react-native-reanimated';

import { exerciseData } from '../../data/exercises';
import { completeWorkout } from '../../services/api';

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
    "No one can take this from you,",
    "You showed up and delivered,",
    "Every rep counts and you proved it,",
    "The discipline is real,",
    "This is what separates you,",
    "Haile would be proud,",
  ];

const quotes = [
    // Ethiopian legends
    {
      text: "Every morning in Africa, a gazelle wakes up. It knows it must run faster than the fastest lion or it will be killed. Every morning a lion wakes up. It knows it must outrun the slowest gazelle or it will starve. It doesn't matter whether you are a lion or a gazelle — when the sun comes up, you'd better be running.",
      author: "African Proverb"
    },
    {
      text: "I have never felt that winning was everything. I have always felt that pushing yourself to the limit was the most important thing.",
      author: "Haile Gebrselassie"
    },
    {
      text: "The body does not want you to do this. As you run, it tells you to stop but the mind must be strong. You always go too far for your body. You must handle the pain with strategy.",
      author: "Haile Gebrselassie"
    },
    {
      text: "When you run the marathon, you run against the distance, not against the other runners and not against the time.",
      author: "Haile Gebrselassie"
    },
    {
      text: "I was determined to be the best I could be. That determination never left me.",
      author: "Tirunesh Dibaba"
    },
    // Philosophers
    {
      text: "We are what we repeatedly do. Excellence, then, is not an act but a habit.",
      author: "Aristotle"
    },
    {
      text: "It is not the mountain we conquer, but ourselves.",
      author: "Edmund Hillary"
    },
    {
      text: "The secret of getting ahead is getting started.",
      author: "Mark Twain"
    },
    {
      text: "Strength does not come from physical capacity. It comes from an indomitable will.",
      author: "Mahatma Gandhi"
    },
    // Athletes
    {
      text: "Float like a butterfly, sting like a bee. The hands can't hit what the eyes can't see.",
      author: "Muhammad Ali"
    },
    {
      text: "I hated every minute of training, but I said do not quit. Suffer now and live the rest of your life as a champion.",
      author: "Muhammad Ali"
    },
    {
      text: "The difference between the impossible and the possible lies in a person's determination.",
      author: "Tommy Lasorda"
    },
    {
      text: "You have to expect things of yourself before you can do them.",
      author: "Michael Jordan"
    },
    {
      text: "Hard work beats talent when talent doesn't work hard.",
      author: "Tim Notke"
    },
    {
      text: "Success is no accident. It is hard work, perseverance, learning, studying, sacrifice and most of all, love of what you are doing.",
      author: "Pelé"
    },
    // General
    {
      text: "The pain you feel today will be the strength you feel tomorrow.",
      author: "Arnold Schwarzenegger"
    },
    {
      text: "Take care of your body. It is the only place you have to live.",
      author: "Jim Rohn"
    },
    {
      text: "A feeble body weakens the mind.",
      author: "Jean-Jacques Rousseau"
    },
    {
      text: "Discipline is the bridge between goals and accomplishment.",
      author: "Jim Rohn"
    },
    {
      text: "The only bad workout is the one that didn't happen.",
      author: "Unknown"
    },
  ];

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

    function CompletionScreen({ quote, celebration, totalExercises, workout }) {
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
          // Circles expand
          circle1Scale.value = withSpring(1, { damping: 12, stiffness: 60 });
          circle2Scale.value = withDelay(200, withSpring(1, { damping: 12, stiffness: 50 }));
      
          // Icon bounces in
          iconScale.value = withDelay(200, withSpring(1, {
            damping: 6,
            stiffness: 200,
            mass: 0.5,
          }));
      
          // Greeting slides up
          greetingOpacity.value = withDelay(500, withTiming(1, { duration: 400 }));
          greetingY.value = withDelay(500, withSpring(0, { damping: 12, stiffness: 120 }));
      
          // Name bounces in big
          nameOpacity.value = withDelay(700, withTiming(1, { duration: 300 }));
          nameScale.value = withDelay(700, withSpring(1, {
            damping: 5,
            stiffness: 200,
            mass: 0.8,
          }));
      
          // Stats slam in
          statsOpacity.value = withDelay(1000, withTiming(1, { duration: 300 }));
          statsY.value = withDelay(1000, withSpring(0, {
            damping: 8,
            stiffness: 180,
          }));
      
          // Quote fades in
          quoteOpacity.value = withDelay(1300, withTiming(1, { duration: 500 }));
          quoteY.value = withDelay(1300, withSpring(0, { damping: 12, stiffness: 100 }));
      
          // Button slides up last
          buttonOpacity.value = withDelay(1600, withTiming(1, { duration: 400 }));
          buttonY.value = withDelay(1600, withSpring(0, { damping: 12, stiffness: 100 }));
        }, []);
      
        const circle1Style = useAnimatedStyle(() => ({
          transform: [{ scale: circle1Scale.value }],
        }));
      
        const circle2Style = useAnimatedStyle(() => ({
          transform: [{ scale: circle2Scale.value }],
        }));
      
        const iconStyle = useAnimatedStyle(() => ({
          transform: [{ scale: iconScale.value }],
        }));
      
        const greetingStyle = useAnimatedStyle(() => ({
          opacity: greetingOpacity.value,
          transform: [{ translateY: greetingY.value }],
        }));
      
        const nameStyle = useAnimatedStyle(() => ({
          opacity: nameOpacity.value,
          transform: [{ scale: nameScale.value }],
        }));
      
        const statsStyle = useAnimatedStyle(() => ({
          opacity: statsOpacity.value,
          transform: [{ translateY: statsY.value }],
        }));
      
        const quoteStyle = useAnimatedStyle(() => ({
          opacity: quoteOpacity.value,
          transform: [{ translateY: quoteY.value }],
        }));
      
        const buttonStyle = useAnimatedStyle(() => ({
          opacity: buttonOpacity.value,
          transform: [{ translateY: buttonY.value }],
        }));
      
        return (
          <View style={styles.completeContainer}>
      
            {/* Background circles */}
            <Animated.View style={[styles.celebrationCircle1, circle1Style]} />
            <Animated.View style={[styles.celebrationCircle2, circle2Style]} />
      
            {/* Check icon bounces in */}
            <Animated.View style={[styles.completeIconContainer, iconStyle]}>
              <Feather name="check" size={40} color={colors.white} />
            </Animated.View>
      
            {/* Greeting slides up */}
            <Animated.Text style={[styles.completeGreeting, greetingStyle]}>
              {celebration}
            </Animated.Text>
      
            {/* Name bounces in */}
            <Animated.Text style={[styles.completeName, nameStyle]}>
              Heni! 💪
            </Animated.Text>
      
            {/* Stats slam in */}
            <Animated.View style={[styles.completeStats, statsStyle]}>
              <View style={styles.completeStat}>
                <Text style={styles.completeStatValue}>{totalExercises}</Text>
                <Text style={styles.completeStatLabel}>Exercises</Text>
              </View>
              <View style={styles.completeStatDivider} />
              <View style={styles.completeStat}>
                <Text style={styles.completeStatValue}>{workout.name.split(' ')[0]}</Text>
                <Text style={styles.completeStatLabel}>Workout</Text>
              </View>
              <View style={styles.completeStatDivider} />
              <View style={styles.completeStat}>
                <Text style={styles.completeStatValue}>+1</Text>
                <Text style={styles.completeStatLabel}>Streak</Text>
              </View>
            </Animated.View>
      
            {/* Quote fades in */}
            <Animated.View style={[styles.quoteCard, quoteStyle]}>
              <Feather name="message-circle" size={16} color="rgba(255,255,255,0.5)" />
              <Text style={styles.quoteText}>"{quote.text}"</Text>
              <Text style={styles.quoteAuthor}>— {quote.author}</Text>
            </Animated.View>
      
            {/* Button slides up */}
            <Animated.View style={[{ width: '100%', alignItems: 'center', gap: 12 }, buttonStyle]}>
              <TouchableOpacity
                style={styles.completeDoneButton}
                onPress={() => router.replace('/(tabs)')}
              >
                <Text style={styles.completeDoneText}>Back to home</Text>
              </TouchableOpacity>
              <Text style={styles.seeYouText}>See you next time 🙏</Text>
            </Animated.View>
      
          </View>
        );
      }

      export default function ActiveWorkoutScreen() {
        const { id, sessionData, workoutName } = useLocalSearchParams();
    
        let workout;
    
        if (sessionData) {
          const session = JSON.parse(sessionData);
      
          workout = {
              name: workoutName || 'Today\'s Workout',
              exercises: session.exercises.map(ex => ({
                  id: ex.id,
                  name: ex.name,
                  sets: ex.sets_range ? ex.sets_range[0] : 3,
                  reps: ex.reps_range ? ex.reps_range[0] : null,
                  rest: 60,
                  isTimed: ex.is_timed,
                  seconds: ex.seconds_range ? ex.seconds_range[0] : null,
                  instructions: ex.instructions,
                  coaching_cues: ex.coaching_cues,
              })),
          };
      } else {
          workout = workoutData[id];
      }
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

    async function handleNextExercise() {
      if (currentIndex + 1 >= totalExercises) {
          progress.value = withTiming(100, { duration: 500 });
          try {
              await completeWorkout(workout.name);
          } catch (e) {
              console.log('Complete workout error:', e.message);
          }
          setWorkoutDone(true);
        } else {
        setCurrentIndex(prev => prev + 1);
        setCompletedSets([]);
        setResting(false);
        setRestTime(0);
        }
    }

    if (workoutDone) {
        const quote = quotes[Math.floor(Math.random() * quotes.length)];
        const celebration = celebrations[Math.floor(Math.random() * celebrations.length)];
      
        return <CompletionScreen
          quote={quote}
          celebration={celebration}
          totalExercises={totalExercises}
          workout={workout}
        />;
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
                    {(selectedExercise.instructions || exerciseData[selectedExercise.id]?.instructions || []).map((instruction, i) => (
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

    completeContainer: {
        flex: 1,
        backgroundColor: colors.blue,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        overflow: 'hidden',
      },
      
      celebrationCircle1: {
        position: 'absolute',
        width: 400,
        height: 400,
        borderRadius: 200,
        backgroundColor: 'rgba(255,255,255,0.06)',
        top: -100,
        right: -100,
      },
      
      celebrationCircle2: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: 'rgba(255,255,255,0.04)',
        bottom: -50,
        left: -80,
      },
      
      completeIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
      },
      
      completeGreeting: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '300',
        textAlign: 'center',
      },
      
      completeName: {
        fontSize: 32,
        fontWeight: '700',
        color: colors.white,
        letterSpacing: -1,
        textAlign: 'center',
        marginBottom: 24,
      },
      
      completeStats: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        width: '100%',
      },
      
      completeStat: {
        flex: 1,
        alignItems: 'center',
        gap: 4,
      },
      
      completeStatValue: {
        fontSize: 22,
        fontWeight: '700',
        color: colors.white,
        letterSpacing: -0.5,
      },
      
      completeStatLabel: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.6)',
        fontWeight: '300',
      },
      
      completeStatDivider: {
        width: 0.5,
        height: 30,
        backgroundColor: 'rgba(255,255,255,0.3)',
        alignSelf: 'center',
      },
      
      quoteCard: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        width: '100%',
        gap: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
      },
      
      quoteText: {
        fontSize: 14,
        color: colors.white,
        lineHeight: 22,
        fontWeight: '300',
        fontStyle: 'italic',
      },
      
      quoteAuthor: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.6)',
        fontWeight: '500',
        textAlign: 'right',
      },
      
      completeDoneButton: {
        backgroundColor: colors.white,
        paddingVertical: 16,
        paddingHorizontal: 48,
        borderRadius: 100,
        width: '100%',
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
      },
      
      completeDoneText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.blue,
      },
      
      seeYouText: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.5)',
        fontWeight: '300',
      },
});