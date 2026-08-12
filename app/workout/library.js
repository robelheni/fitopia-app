import { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { lightColors } from '../../constants/colors';
import { FadeUpItem } from '../../components/ScreenWrapper';
import { getCategoryPlan, getExercises } from '../../services/api';

const CURATED_CATEGORIES = [
    'full-body-home', 'upper-body-home', 'lower-body-home',
    'core-home', 'biceps-home', 'triceps-home', 'cardio-home', 'intense-cardio-home',
    'chest-gym', 'back-gym', 'shoulders-gym', 'triceps-gym',
    'biceps-gym', 'legs-gym', 'core-gym', 'cardio-gym', 'intense-cardio-gym',
    'light-full-body',
];

const FASTING_CONFIG = {
    'core-and-balance':     { muscleGroup: 'core', movementPattern: 'stability,anti_rotation' },
    'low-intensity-cardio': { movementPattern: 'low_impact,low_impact_cardio,steady_state' },
};

const CATEGORY_META = {
  'full-body-home':       { title: 'Full Body',            subtitle: 'Home workout' },
  'upper-body-home':      { title: 'Upper Body',           subtitle: 'Home workout' },
  'lower-body-home':      { title: 'Lower Body',           subtitle: 'Home workout' },
  'core-home':            { title: 'Core',                 subtitle: 'Home workout' },
  'biceps-home':          { title: 'Biceps',               subtitle: 'Home workout' },
  'triceps-home':         { title: 'Triceps',              subtitle: 'Home workout' },
  'cardio-home':          { title: 'Cardio',               subtitle: 'Home workout' },
  'chest-gym':            { title: 'Chest',                subtitle: 'Gym workout' },
  'back-gym':             { title: 'Back',                 subtitle: 'Gym workout' },
  'shoulders-gym':        { title: 'Shoulders',            subtitle: 'Gym workout' },
  'triceps-gym':          { title: 'Triceps',              subtitle: 'Gym workout' },
  'biceps-gym':           { title: 'Biceps',               subtitle: 'Gym workout' },
  'legs-gym':             { title: 'Legs',                 subtitle: 'Gym workout' },
  'core-gym':             { title: 'Core',                 subtitle: 'Gym workout' },
  'cardio-gym':           { title: 'Cardio',               subtitle: 'Gym workout' },
  'light-full-body':      { title: 'Light Full Body',      subtitle: 'Fasting workout' },
  'mobility':             { title: 'Mobility',             subtitle: 'Fasting workout' },
  'core-and-balance':     { title: 'Core and Balance',     subtitle: 'Fasting workout' },
  'low-intensity-cardio': { title: 'Low Intensity Cardio', subtitle: 'Fasting workout' },
  'all':                  { title: 'Exercise Library',     subtitle: 'All exercises' },
  'intense-cardio-home':  { title: 'Intense Cardio',       subtitle: 'Home workout' },
  'intense-cardio-gym':   { title: 'Intense Cardio',       subtitle: 'Gym workout' },
};

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

function getMuscleColor(muscle, colors) {
  return MUSCLE_COLORS[muscle] || { color: colors.blue, bg: colors.blueLight };
}

function formatMeta(ex) {
  const sets = ex.sets || ex.sets_range?.[0] || 3;
  const reps = ex.is_timed
    ? `${ex.seconds || ex.seconds_range?.[0] || 30}s`
    : `${ex.reps || ex.reps_range?.[0] || 10} reps`;
  return `${sets} sets · ${reps}`;
}

export default function LibraryScreen() {
  const theme = useTheme();
  const isDark = theme ? theme.isDark : false;
  const colors = theme ? theme.colors : lightColors;

  const { category } = useLocalSearchParams();
  const meta = CATEGORY_META[category] || { title: 'Exercises', subtitle: '' };
  const isCurated = CURATED_CATEGORIES.includes(category);
  const isFasting = category in FASTING_CONFIG;

  const [exercises, setExercises] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const styles = makeStyles(colors, isDark);

  useEffect(() => {
    async function fetchExercises() {
      try {
        setLoading(true);
        let data = [];
        if (isCurated) {
          const result = await getCategoryPlan(category);
          data = result.exercises;
        } else if (isFasting) {
          data = await getExercises(FASTING_CONFIG[category]);
        } else {
          data = await getExercises({});
        }
        setExercises(data);
        setFiltered(data);
      } catch (err) {
        console.log('Failed to load exercises:', err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchExercises();
  }, [category]);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(exercises);
    } else {
      const q = search.toLowerCase();
      setFiltered(exercises.filter(ex =>
        ex.name.toLowerCase().includes(q) ||
        ex.muscle_group.toLowerCase().includes(q)
      ));
    }
  }, [search, exercises]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.black} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>{meta.title}</Text>
          <Text style={styles.headerSub}>{meta.subtitle}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {(!isCurated) && (
        <View style={styles.searchBar}>
          <Feather name="search" size={16} color={colors.greyLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search exercises..."
            placeholderTextColor={colors.greyLight}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Feather name="x" size={16} color={colors.greyLight} />
            </TouchableOpacity>
          )}
        </View>
      )}

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.blue} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {category !== 'all' && (
            <Text style={styles.countText}>
              {filtered.length} exercise{filtered.length !== 1 ? 's' : ''}
            </Text>
          )}
          {filtered.length === 0 ? (
            <View style={styles.emptyState}>
              <Feather name="search" size={40} color={colors.greyLight} />
              <Text style={styles.emptyText}>No exercises found</Text>
            </View>
          ) : (
            filtered.map((ex, index) => {
              const muscleColor = getMuscleColor(ex.muscle_group, colors);
              return (
                <FadeUpItem key={ex.id} delay={index * 30}>
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
                          sets: ex.sets || ex.sets_range?.[0] || 3,
                          reps: ex.is_timed ? null : (ex.reps || ex.reps_range?.[0] || 10),
                          rest: 60,
                          isTimed: ex.is_timed,
                          seconds: ex.seconds || ex.seconds_range?.[0] || 30,
                          instructions: ex.instructions || [],
                        }),
                      }
                    })}
                  >
                    <View style={[styles.muscleTag, { backgroundColor: muscleColor.bg }]}>
                      <Text style={[styles.muscleTagText, { color: muscleColor.color }]}>
                        {ex.muscle_group}
                      </Text>
                    </View>
                    <View style={styles.exerciseInfo}>
                      <Text style={styles.exerciseName}>{ex.name}</Text>
                      <Text style={styles.exerciseMeta}>{formatMeta(ex)} · {ex.equipment}</Text>
                    </View>
                    <Feather name="chevron-right" size={16} color={colors.greyLight} />
                  </TouchableOpacity>
                </FadeUpItem>
              );
            })
          )}
        </ScrollView>
      )}
    </View>
  );
}

function makeStyles(c, dark) {
  const colors = c || lightColors;
  const isDark = dark || false;
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.white },
    header: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: 24, paddingTop: 60, paddingBottom: 16,
      borderBottomWidth: 0.5, borderBottomColor: colors.greyBorder,
    },
    backButton: {
      width: 40, height: 40, borderRadius: 20,
      backgroundColor: colors.greyCard, alignItems: 'center', justifyContent: 'center',
    },
    headerText: { alignItems: 'center' },
    headerTitle: { fontSize: 17, fontWeight: '600', color: colors.black },
    headerSub: { fontSize: 12, color: colors.grey, fontWeight: '300', marginTop: 2 },
    searchBar: {
      flexDirection: 'row', alignItems: 'center', gap: 10,
      marginHorizontal: 24, marginVertical: 16,
      backgroundColor: colors.greyCard, borderRadius: 12,
      paddingHorizontal: 14, paddingVertical: 12,
      borderWidth: 1, borderColor: colors.greyBorder,
    },
    searchInput: { flex: 1, fontSize: 15, color: colors.black },
    centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    list: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 120 },
    countText: { fontSize: 13, color: colors.grey, fontWeight: '300', marginBottom: 12 },
    exerciseCard: {
      flexDirection: 'row', alignItems: 'center', gap: 12,
      backgroundColor: colors.white, borderRadius: 16, padding: 16, marginBottom: 10,
      borderWidth: 1, borderColor: colors.greyBorder,
      shadowColor: colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
    },
    muscleTag: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, minWidth: 70, alignItems: 'center' },
    muscleTagText: { fontSize: 11, fontWeight: '600', textTransform: 'capitalize' },
    exerciseInfo: { flex: 1 },
    exerciseName: { fontSize: 15, fontWeight: '600', color: colors.black, letterSpacing: -0.3, marginBottom: 3 },
    exerciseMeta: { fontSize: 12, color: colors.grey, fontWeight: '300' },
    emptyState: { alignItems: 'center', paddingVertical: 60, gap: 12 },
    emptyText: { fontSize: 15, color: colors.grey, fontWeight: '300' },
  });
}
