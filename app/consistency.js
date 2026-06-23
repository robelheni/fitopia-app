import { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { FadeUpItem } from '../components/ScreenWrapper';
import YearHeatmap from '../components/YearHeatmap';
import { getConsistencyStats, getCurrentUser } from '../services/api';

// Returns encouraging, honest copy based on the user's completion percentage.
// Tiers are designed to never shame — even the lowest tier focuses on
// today being a fresh start rather than dwelling on missed days.
function getConsistencyMessage(percentage) {
  if (percentage >= 80) {
    return {
      title: "You're in elite territory",
      message: "This is what real results are built on. Most people don't sustain this level of consistency — you're doing it.",
      color: '#059669',
      bg: '#D1FAE5',
    };
  }
  if (percentage >= 60) {
    return {
      title: "You're building something real",
      message: "You're showing up far more than you're not — that's the foundation. A few more consistent weeks and this becomes second nature.",
      color: colors.blue,
      bg: colors.blueLight,
    };
  }
  if (percentage >= 35) {
    return {
      title: "You're finding your rhythm",
      message: "Consistency is a skill, not a switch. Every week you stick with it, it gets a little easier to keep going.",
      color: '#D97706',
      bg: '#FEF3C7',
    };
  }
  return {
    title: "Today is what counts",
    message: "However your journey has looked so far, the only day that matters for your next streak is today. Show up once, then again tomorrow.",
    color: '#7C3AED',
    bg: '#EDE9FE',
  };
}

export default function ConsistencyScreen() {
  const [stats, setStats] = useState(null);
  const [accountCreatedAt, setAccountCreatedAt] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        try {
          setLoading(true);
          const [consistencyData, userData] = await Promise.all([
            getConsistencyStats(),
            getCurrentUser(),
          ]);
          setStats(consistencyData);
          setAccountCreatedAt(userData?.created_at);
        } catch (err) {
          console.log('Consistency fetch error:', err.message);
        } finally {
          setLoading(false);
        }
      }
      fetchData();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.blue} />
      </View>
    );
  }

  const consistencyMessage = stats ? getConsistencyMessage(stats.completion_percentage) : null;

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Consistency</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Heatmap */}
        <FadeUpItem delay={0}>
          <Text style={styles.sectionTitle}>Activity</Text>
          <YearHeatmap accountCreatedAt={accountCreatedAt} />
        </FadeUpItem>

        {/* Stats row */}
        <FadeUpItem delay={100}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats?.current_streak || 0}</Text>
              <Text style={styles.statLabel}>Current streak</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats?.longest_streak || 0}</Text>
              <Text style={styles.statLabel}>Longest streak</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats?.total_workouts || 0}</Text>
              <Text style={styles.statLabel}>Total workouts</Text>
            </View>
          </View>
        </FadeUpItem>

        {/* Completion percentage + message */}
        <FadeUpItem delay={200}>
          <View style={[styles.messageCard, { backgroundColor: consistencyMessage?.bg }]}>
            <View style={styles.percentageRow}>
              <Text style={[styles.percentageValue, { color: consistencyMessage?.color }]}>
                {stats?.completion_percentage || 0}%
              </Text>
              <Text style={styles.percentageLabel}>of scheduled workouts completed</Text>
            </View>

            <Text style={[styles.messageTitle, { color: consistencyMessage?.color }]}>
              {consistencyMessage?.title}
            </Text>
            <Text style={styles.messageText}>
              {consistencyMessage?.message}
            </Text>
          </View>
        </FadeUpItem>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },

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

  headerTitle: { fontSize: 17, fontWeight: '600', color: colors.black },

  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 80,
  },

  sectionTitle: {
    fontSize: 18, fontWeight: '700', color: colors.black,
    letterSpacing: -0.5, marginBottom: 12,
  },

  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.greyBorder,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },

  statItem: { flex: 1, alignItems: 'center', gap: 6 },
  statValue: { fontSize: 24, fontWeight: '700', color: colors.black, letterSpacing: -0.5 },
  statLabel: { fontSize: 11, color: colors.grey, fontWeight: '300', textAlign: 'center' },
  statDivider: { width: 0.5, backgroundColor: colors.greyBorder },

  messageCard: {
    borderRadius: 20,
    padding: 24,
    gap: 12,
  },

  percentageRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 4,
  },

  percentageValue: {
    fontSize: 40,
    fontWeight: '700',
    letterSpacing: -1,
  },

  percentageLabel: {
    fontSize: 13,
    color: colors.grey,
    fontWeight: '300',
    flex: 1,
  },

  messageTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },

  messageText: {
    fontSize: 14,
    color: colors.black,
    lineHeight: 21,
    fontWeight: '300',
  },
});