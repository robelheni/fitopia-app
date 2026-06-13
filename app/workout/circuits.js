import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { FadeUpItem } from '../../components/ScreenWrapper';

// Named circuit workouts — each is a different combination of exercises
// work_seconds = how long each exercise lasts
// rest_seconds = rest between exercises
// rounds = how many times the circuit repeats
const HOME_CIRCUITS = [
  {
    name: 'Burn Circuit',
    description: 'Full body bodyweight burner',
    rounds: 4,
    work_seconds: 40,
    rest_seconds: 15,
    color: '#DC2626',
    bg: '#FEE2E2',
    icon: 'zap',
    exercises: [
      { name: 'Burpee',           is_timed: true, seconds_range: [40] },
      { name: 'Mountain Climber', is_timed: true, seconds_range: [40] },
      { name: 'Box Jump',         is_timed: true, seconds_range: [40] },
      { name: 'Plank Jacks',      is_timed: true, seconds_range: [40] },
    ],
  },
  {
    name: 'Dumbbell Destroyer',
    description: 'Dumbbell conditioning circuit',
    rounds: 4,
    work_seconds: 40,
    rest_seconds: 20,
    color: '#2563EB',
    bg: '#EFF6FF',
    icon: 'activity',
    exercises: [
      { name: 'Dumbbell Thruster',  is_timed: true, seconds_range: [40] },
      { name: 'Dumbbell Swing',     is_timed: true, seconds_range: [40] },
      { name: 'Dumbbell High Pull', is_timed: true, seconds_range: [40] },
      { name: 'Squat to Press',     is_timed: true, seconds_range: [40] },
    ],
  },
  {
    name: 'Bodyweight Blitz',
    description: 'No equipment needed',
    rounds: 5,
    work_seconds: 35,
    rest_seconds: 15,
    color: '#059669',
    bg: '#D1FAE5',
    icon: 'wind',
    exercises: [
      { name: 'Burpee',           is_timed: true, seconds_range: [35] },
      { name: 'Plank Jacks',      is_timed: true, seconds_range: [35] },
      { name: 'Mountain Climber', is_timed: true, seconds_range: [35] },
    ],
  },
  {
    name: 'Band Burner',
    description: 'Resistance band circuit',
    rounds: 4,
    work_seconds: 35,
    rest_seconds: 20,
    color: '#7C3AED',
    bg: '#EDE9FE',
    icon: 'circle',
    exercises: [
      { name: 'Band Squat Jump',      is_timed: true, seconds_range: [35] },
      { name: 'Band Mountain Climber',is_timed: true, seconds_range: [35] },
      { name: 'Plank Jacks',          is_timed: true, seconds_range: [35] },
    ],
  },
];

const GYM_CIRCUITS = [
  // Gym-specific circuits
  {
    name: 'Machine Mayhem',
    description: 'Gym cardio machine circuit',
    rounds: 5,
    work_seconds: 45,
    rest_seconds: 15,
    color: '#DC2626',
    bg: '#FEE2E2',
    icon: 'zap',
    exercises: [
      { name: 'Treadmill Sprint', is_timed: true, seconds_range: [45] },
      { name: 'Assault Bike',     is_timed: true, seconds_range: [45] },
      { name: 'Battle Ropes',     is_timed: true, seconds_range: [45] },
    ],
  },
  {
    name: 'Jump and Burn',
    description: 'High intensity gym circuit',
    rounds: 4,
    work_seconds: 40,
    rest_seconds: 20,
    color: '#D97706',
    bg: '#FEF3C7',
    icon: 'activity',
    exercises: [
      { name: 'Jump Rope',        is_timed: true, seconds_range: [40] },
      { name: 'Box Jump',         is_timed: true, seconds_range: [40] },
      { name: 'Battle Ropes',     is_timed: true, seconds_range: [40] },
    ],
  },
  // Home circuits also available at gym
  ...HOME_CIRCUITS,
];

export default function CircuitsScreen() {
  const { type } = useLocalSearchParams();
  const isGym = type === 'gym';
  const circuits = isGym ? GYM_CIRCUITS : HOME_CIRCUITS;
  const subtitle = isGym ? 'Gym circuits' : 'Home circuits';

  function startCircuit(circuit) {
    // Build the circuitData shape that cardio.js expects
    const circuitData = {
      exercises: circuit.exercises,
      rounds: circuit.rounds,
      work_seconds: circuit.work_seconds,
      rest_seconds: circuit.rest_seconds,
    };

    router.push({
      pathname: '/workout/cardio',
      params: {
        circuitData: JSON.stringify(circuitData),
        workoutName: circuit.name,
      },
    });
  }

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.black} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Intense Cardio</Text>
          <Text style={styles.headerSub}>{subtitle}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.intro}>
          Pick a circuit. Each round hits every exercise back to back with minimal rest.
        </Text>

        {circuits.map((circuit, index) => (
          <FadeUpItem key={index} delay={index * 80}>
            <View style={styles.circuitCard}>

              {/* Card header */}
              <View style={styles.circuitTop}>
                <View style={[styles.circuitIcon, { backgroundColor: circuit.bg }]}>
                  <Feather name={circuit.icon} size={22} color={circuit.color} />
                </View>
                <View style={styles.circuitMeta}>
                  <Text style={styles.circuitName}>{circuit.name}</Text>
                  <Text style={styles.circuitDesc}>{circuit.description}</Text>
                </View>
              </View>

              {/* Round and timing info */}
              <View style={styles.circuitStats}>
                <View style={styles.circuitStat}>
                  <Text style={styles.circuitStatNumber}>{circuit.rounds}</Text>
                  <Text style={styles.circuitStatLabel}>rounds</Text>
                </View>
                <View style={styles.circuitStatDivider} />
                <View style={styles.circuitStat}>
                  <Text style={styles.circuitStatNumber}>{circuit.work_seconds}s</Text>
                  <Text style={styles.circuitStatLabel}>work</Text>
                </View>
                <View style={styles.circuitStatDivider} />
                <View style={styles.circuitStat}>
                  <Text style={styles.circuitStatNumber}>{circuit.rest_seconds}s</Text>
                  <Text style={styles.circuitStatLabel}>rest</Text>
                </View>
                <View style={styles.circuitStatDivider} />
                <View style={styles.circuitStat}>
                  <Text style={styles.circuitStatNumber}>{circuit.exercises.length}</Text>
                  <Text style={styles.circuitStatLabel}>exercises</Text>
                </View>
              </View>

              {/* Exercise list */}
              <View style={styles.exerciseList}>
                {circuit.exercises.map((ex, i) => (
                  <View key={i} style={styles.exerciseRow}>
                    <View style={[styles.exerciseDot, { backgroundColor: circuit.color }]} />
                    <Text style={styles.exerciseName}>{ex.name}</Text>
                    <Text style={styles.exerciseTime}>{circuit.work_seconds}s</Text>
                  </View>
                ))}
              </View>

              {/* Start button */}
              <TouchableOpacity
                style={[styles.startButton, { backgroundColor: circuit.color }]}
                onPress={() => startCircuit(circuit)}
              >
                <Feather name="play" size={16} color={colors.white} />
                <Text style={styles.startButtonText}>Start circuit</Text>
              </TouchableOpacity>

            </View>
          </FadeUpItem>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },

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
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.greyCard,
    alignItems: 'center', justifyContent: 'center',
  },

  headerText: { alignItems: 'center' },

  headerTitle: {
    fontSize: 17, fontWeight: '600', color: colors.black,
  },

  headerSub: {
    fontSize: 12, color: colors.grey, fontWeight: '300', marginTop: 2,
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 120,
  },

  intro: {
    fontSize: 14,
    color: colors.grey,
    fontWeight: '300',
    lineHeight: 20,
    marginBottom: 20,
  },

  circuitCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.greyBorder,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },

  circuitTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },

  circuitIcon: {
    width: 48, height: 48, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },

  circuitMeta: { flex: 1 },

  circuitName: {
    fontSize: 17, fontWeight: '700',
    color: colors.black, letterSpacing: -0.3,
  },

  circuitDesc: {
    fontSize: 13, color: colors.grey,
    fontWeight: '300', marginTop: 2,
  },

  circuitStats: {
    flexDirection: 'row',
    backgroundColor: colors.greyCard,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    alignItems: 'center',
  },

  circuitStat: {
    flex: 1, alignItems: 'center',
  },

  circuitStatNumber: {
    fontSize: 18, fontWeight: '700',
    color: colors.black, letterSpacing: -0.5,
  },

  circuitStatLabel: {
    fontSize: 11, color: colors.grey,
    fontWeight: '300', marginTop: 2,
  },

  circuitStatDivider: {
    width: 1, height: 30,
    backgroundColor: colors.greyBorder,
  },

  exerciseList: {
    gap: 8,
    marginBottom: 16,
  },

  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  exerciseDot: {
    width: 6, height: 6, borderRadius: 3,
  },

  exerciseName: {
    flex: 1,
    fontSize: 14, color: colors.black, fontWeight: '400',
  },

  exerciseTime: {
    fontSize: 13, color: colors.grey, fontWeight: '300',
  },

  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 100,
  },

  startButtonText: {
    fontSize: 15, fontWeight: '600', color: colors.white,
  },
});