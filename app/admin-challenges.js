import { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { lightColors } from '../constants/colors';
import { getAdminChallenges, reorderChallenge, deleteChallenge } from '../services/api';

export default function AdminChallengesScreen() {
  const theme = useTheme();
  const colors = theme ? theme.colors : lightColors;
  const styles = makeStyles(colors);

  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchChallenges();
    }, [])
  );

  async function fetchChallenges() {
    try {
      setLoading(true);
      const data = await getAdminChallenges();
      setChallenges(data);
    } catch (err) {
      console.log('Admin challenges fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleReorder(challengeId, direction) {
    try {
      await reorderChallenge(challengeId, direction);
      fetchChallenges();
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  }

  function handleDelete(challengeId, name) {
    Alert.alert(
      `Delete "${name}"?`,
      'Posts already made for this challenge will remain in the community feed, but the challenge itself will be removed.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteChallenge(challengeId);
              setChallenges(prev => prev.filter(c => c.id !== challengeId));
            } catch (err) {
              Alert.alert('Error', err.message);
            }
          },
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Challenges</Text>
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
            challenges.map((challenge, index) => (
              <View key={challenge.id} style={styles.challengeRow}>
                <View style={[styles.colorDot, { backgroundColor: challenge.color || colors.blue }]} />

                <View style={styles.challengeInfo}>
                  <Text style={styles.challengeName}>{challenge.name}</Text>
                  <Text style={styles.challengePostCount}>{challenge.post_count} posts</Text>
                </View>

                <View style={styles.reorderButtons}>
                  <TouchableOpacity
                    style={[styles.reorderButton, index === 0 && styles.reorderButtonDisabled]}
                    onPress={() => handleReorder(challenge.id, 'up')}
                    disabled={index === 0}
                  >
                    <Feather name="chevron-up" size={16} color={index === 0 ? colors.greyLight : colors.black} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.reorderButton, index === challenges.length - 1 && styles.reorderButtonDisabled]}
                    onPress={() => handleReorder(challenge.id, 'down')}
                    disabled={index === challenges.length - 1}
                  >
                    <Feather name="chevron-down" size={16} color={index === challenges.length - 1 ? colors.greyLight : colors.black} />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(challenge.id, challenge.name)}
                >
                  <Feather name="trash-2" size={16} color="#DC2626" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

function makeStyles(colors) {
  return StyleSheet.create({
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

    content: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 80, gap: 10 },

    emptyState: { alignItems: 'center', paddingVertical: 60, gap: 12 },
    emptyText: { fontSize: 15, color: colors.grey, fontWeight: '300' },

    challengeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: colors.white,
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.greyBorder,
    },

    colorDot: { width: 14, height: 14, borderRadius: 7, flexShrink: 0 },

    challengeInfo: { flex: 1 },
    challengeName: { fontSize: 14, fontWeight: '600', color: colors.black },
    challengePostCount: { fontSize: 12, color: colors.grey, fontWeight: '300', marginTop: 2 },

    reorderButtons: { gap: 2 },

    reorderButton: {
      width: 28, height: 22, borderRadius: 6,
      backgroundColor: colors.greyCard, alignItems: 'center', justifyContent: 'center',
    },

    reorderButtonDisabled: { opacity: 0.4 },

    deleteButton: {
      width: 36, height: 36, borderRadius: 18,
      backgroundColor: '#FEE2E2', alignItems: 'center', justifyContent: 'center',
    },
  });
}
