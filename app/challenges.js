import { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { getChallenges } from '../services/api';

export default function AllChallengesScreen() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      async function fetchChallenges() {
        try {
          setLoading(true);
          const data = await getChallenges();
          setChallenges(data);
        } catch (err) {
          console.log('Challenges fetch error:', err.message);
        } finally {
          setLoading(false);
        }
      }
      fetchChallenges();
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Challenges</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.blue} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {challenges.length === 0 ? (
            <View style={styles.emptyState}>
              <Feather name="zap" size={32} color={colors.greyLight} />
              <Text style={styles.emptyText}>No challenges yet</Text>
            </View>
          ) : (
            challenges.map(challenge => (
              <TouchableOpacity
                key={challenge.id}
                style={[styles.challengeCard, { backgroundColor: challenge.color || colors.blue }]}
                onPress={() => router.push({
                  pathname: '/challenge/[id]',
                  params: { id: challenge.id, name: challenge.name }
                })}
              >
                <Text style={styles.challengeName}>{challenge.name}</Text>
                {challenge.description && (
                  <Text style={styles.challengeDescription} numberOfLines={2}>
                    {challenge.description}
                  </Text>
                )}
                <View style={styles.challengeFooter}>
                  <Text style={styles.challengePostCount}>{challenge.post_count} posts</Text>
                  <Feather name="arrow-right" size={16} color="rgba(255,255,255,0.8)" />
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 24, paddingTop: 60, paddingBottom: 16,
    borderBottomWidth: 0.5, borderBottomColor: colors.greyBorder,
  },

  backButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.greyCard, alignItems: 'center', justifyContent: 'center',
  },

  headerTitle: { fontSize: 17, fontWeight: '600', color: colors.black },

  content: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 80, gap: 12 },

  emptyState: { alignItems: 'center', paddingVertical: 60, gap: 12 },
  emptyText: { fontSize: 15, color: colors.grey, fontWeight: '300' },

  challengeCard: {
    borderRadius: 20,
    padding: 20,
    gap: 6,
  },

  challengeName: {
    fontSize: 18, fontWeight: '700', color: colors.white, letterSpacing: -0.3,
  },

  challengeDescription: {
    fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: '300', lineHeight: 18,
  },

  challengeFooter: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: 8,
  },

  challengePostCount: {
    fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: '500',
  },
});