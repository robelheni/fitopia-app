import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { Feather, Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { FadeUpItem } from '../../components/ScreenWrapper';
import { getLikedExercises, toggleLikeExercise } from '../../services/api';

const MUSCLE_COLORS = {
  chest:      { color: '#2563EB', bg: '#EFF6FF' },
  back:       { color: '#7C3AED', bg: '#EDE9FE' },
  shoulders:  { color: '#D97706', bg: '#FEF3C7' },
  biceps:     { color: '#059669', bg: '#D1FAE5' },
  triceps:    { color: '#DC2626', bg: '#FEE2E2' },
  legs:       { color: '#0891B2', bg: '#CFFAFE' },
  glutes:     { color: '#7C3AED', bg: '#EDE9FE' },
  hamstrings: { color: '#059669', bg: '#D1FAE5' },
  calves:     { color: '#D97706', bg: '#FEF3C7' },
  core:       { color: '#DC2626', bg: '#FEE2E2' },
  cardio:     { color: '#059669', bg: '#D1FAE5' },
};

function getMuscleColor(muscle) {
  return MUSCLE_COLORS[muscle] || { color: colors.blue, bg: colors.blueLight };
}

export default function LikedExercisesScreen() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  // useFocusEffect re-fetches every time you come back to this screen
  // So if you unlike something on the detail screen and come back, it updates
  useFocusEffect(
    useCallback(() => {
      async function fetchLiked() {
        try {
          setLoading(true);
          const data = await getLikedExercises();
          setExercises(data);
        } catch (err) {
          console.log('Failed to load liked exercises:', err.message);
        } finally {
          setLoading(false);
        }
      }
      fetchLiked();
    }, [])
  );

  async function handleUnlike(exerciseId) {
    try {
      await toggleLikeExercise(exerciseId);
      // Remove it from the list immediately without re-fetching
      setExercises(prev => prev.filter(ex => ex.id !== exerciseId));
    } catch (err) {
      console.log('Unlike failed:', err.message);
    }
  }

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.black} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Saved Exercises</Text>
          <Text style={styles.headerSub}>{exercises.length} saved</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.blue} />
        </View>
      ) : exercises.length === 0 ? (
        // Empty state — shown when no exercises have been liked yet
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="heart-outline" size={40} color={colors.greyLight} />
          </View>
          <Text style={styles.emptyTitle}>No saved exercises yet</Text>
          <Text style={styles.emptySub}>
            Tap the heart on any exercise to save it here
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => router.push({ pathname: '/workout/library', params: { category: 'all' } })}
          >
            <Text style={styles.browseButtonText}>Browse exercises</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        >
          {exercises.map((ex, index) => {
            const muscleColor = getMuscleColor(ex.muscle_group);
            const sets = ex.sets_range?.[0] || 3;
            const reps = ex.is_timed
              ? `${ex.seconds_range?.[0] || 30}s`
              : `${ex.reps_range?.[0] || 10} reps`;

            return (
              <FadeUpItem key={ex.id} delay={index * 40}>
                <TouchableOpacity
                  style={styles.exerciseCard}
                  onPress={() => router.push({
                    pathname: '/exercise/[id]',
                    params: {
                      id: ex.id,
                      exerciseData: JSON.stringify({
                        name: ex.name,
                        muscle: ex.muscle_group,
                        equipment: ex.equipment,
                        difficulty: ex.difficulty || 'intermediate',
                        sets: sets,
                        reps: ex.is_timed ? null : ex.reps_range?.[0] || 10,
                        rest: 60,
                        isTimed: ex.is_timed,
                        seconds: ex.seconds_range?.[0] || 30,
                        instructions: ex.instructions || [],
                      }),
                    }
                  })}
                >
                  {/* Muscle tag */}
                  <View style={[styles.muscleTag, { backgroundColor: muscleColor.bg }]}>
                    <Text style={[styles.muscleTagText, { color: muscleColor.color }]}>
                      {ex.muscle_group}
                    </Text>
                  </View>

                  {/* Exercise info */}
                  <View style={styles.exerciseInfo}>
                    <Text style={styles.exerciseName}>{ex.name}</Text>
                    <Text style={styles.exerciseMeta}>
                      {sets} sets · {reps} · {ex.equipment}
                    </Text>
                  </View>

                  {/* Unlike button */}
                  <TouchableOpacity
                    style={styles.unlikeButton}
                    onPress={() => handleUnlike(ex.id)}
                  >
                    <Ionicons name="heart" size={20} color="#DC2626" />
                  </TouchableOpacity>
                </TouchableOpacity>
              </FadeUpItem>
            );
          })}
        </ScrollView>
      )}
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

  centered: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
  },

  emptyState: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 40, gap: 12,
  },

  emptyIcon: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: colors.greyCard,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 8,
  },

  emptyTitle: {
    fontSize: 18, fontWeight: '700',
    color: colors.black, letterSpacing: -0.3,
  },

  emptySub: {
    fontSize: 14, color: colors.grey,
    fontWeight: '300', textAlign: 'center', lineHeight: 20,
  },

  browseButton: {
    marginTop: 8,
    backgroundColor: colors.blue,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 100,
  },

  browseButtonText: {
    fontSize: 15, fontWeight: '600', color: colors.white,
  },

  list: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 120,
  },

  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.greyBorder,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  muscleTag: {
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 8, minWidth: 70, alignItems: 'center',
  },

  muscleTagText: {
    fontSize: 11, fontWeight: '600', textTransform: 'capitalize',
  },

  exerciseInfo: { flex: 1 },

  exerciseName: {
    fontSize: 15, fontWeight: '600',
    color: colors.black, letterSpacing: -0.3, marginBottom: 3,
  },

  exerciseMeta: {
    fontSize: 12, color: colors.grey, fontWeight: '300',
  },

  unlikeButton: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#FEE2E2',
    alignItems: 'center', justifyContent: 'center',
  },
});