import { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { FadeUpItem } from '../../components/ScreenWrapper';
import { getChallengeDetail, togglePostLike } from '../../services/api';

function timeAgo(isoString) {
  const now = new Date();
  const date = new Date(isoString);
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function ChallengeDetailScreen() {
  const { id, name } = useLocalSearchParams();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      async function fetchChallenge() {
        try {
          setLoading(true);
          const data = await getChallengeDetail(id);
          setChallenge(data);
        } catch (err) {
          console.log('Challenge detail fetch error:', err.message);
        } finally {
          setLoading(false);
        }
      }
      fetchChallenge();
    }, [id])
  );

  async function toggleLike(postId) {
    try {
      const result = await togglePostLike(postId);
      setChallenge(prev => ({
        ...prev,
        posts: prev.posts.map(post =>
          post.id === postId
            ? { ...post, like_count: result.like_count, liked_by_me: result.liked }
            : post
        ),
      }));
    } catch (err) {
      console.log('Like failed:', err.message);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{challenge?.name || name}</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.blue} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

          {/* Challenge banner */}
          <FadeUpItem delay={0}>
            <View style={[styles.banner, { backgroundColor: challenge?.color || colors.blue }]}>
              <Text style={styles.bannerName}>{challenge?.name}</Text>
              {challenge?.description && (
                <Text style={styles.bannerDescription}>{challenge.description}</Text>
              )}
              <View style={styles.bannerStat}>
                <Feather name="users" size={14} color="rgba(255,255,255,0.8)" />
                <Text style={styles.bannerStatText}>{challenge?.post_count} people posted</Text>
              </View>
            </View>
          </FadeUpItem>

          {/* Post to this challenge button */}
          <FadeUpItem delay={50}>
            <TouchableOpacity
              style={styles.postButton}
              onPress={() => router.push({
                pathname: '/compose',
                params: { challengeId: id, challengeName: challenge?.name }
              })}
            >
              <Feather name="edit-2" size={16} color={colors.blue} />
              <Text style={styles.postButtonText}>Post your attempt</Text>
            </TouchableOpacity>
          </FadeUpItem>

          {/* Posts feed */}
          <FadeUpItem delay={100}>
            {!challenge?.posts || challenge.posts.length === 0 ? (
              <View style={styles.emptyState}>
                <Feather name="zap" size={32} color={colors.greyLight} />
                <Text style={styles.emptyText}>No posts yet</Text>
                <Text style={styles.emptySub}>Be the first to take on this challenge</Text>
              </View>
            ) : (
              challenge.posts.map(post => (
                <View key={post.id} style={styles.postCard}>
                  <TouchableOpacity
                    onPress={() => router.push({
                      pathname: '/profile/[id]',
                      params: { id: post.user_id, name: post.name }
                    })}
                  >
                    <View style={styles.postHeader}>
                      <View style={[styles.avatar, {
                        backgroundColor: post.gender === 'female' ? '#EDE9FE' : post.gender === 'male' ? colors.blueLight : colors.greyCard
                      }]}>
                        <Feather
                          name="user"
                          size={16}
                          color={post.gender === 'female' ? '#7C3AED' : post.gender === 'male' ? colors.blue : colors.greyLight}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.postName}>{post.name}</Text>
                        <Text style={styles.postTime}>{timeAgo(post.created_at)}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                  <Text style={styles.postText}>{post.text}</Text>

                  <View style={styles.postActions}>
                    <TouchableOpacity style={styles.postAction} onPress={() => toggleLike(post.id)}>
                      <Ionicons
                        name={post.liked_by_me ? 'heart' : 'heart-outline'}
                        size={16}
                        color={post.liked_by_me ? '#DC2626' : colors.greyLight}
                      />
                      <Text style={styles.postActionText}>{post.like_count}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.postAction}
                      onPress={() => router.push({
                        pathname: '/comments',
                        params: { postId: post.id, postText: post.text, postName: post.name }
                      })}
                    >
                      <Feather name="message-circle" size={16} color={colors.greyLight} />
                      <Text style={styles.postActionText}>{post.comment_count}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </FadeUpItem>

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

  headerTitle: { fontSize: 17, fontWeight: '600', color: colors.black, flex: 1, textAlign: 'center', marginHorizontal: 8 },

  content: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 80 },

  banner: { borderRadius: 20, padding: 20, marginBottom: 16, gap: 8 },
  bannerName: { fontSize: 22, fontWeight: '700', color: colors.white, letterSpacing: -0.5 },
  bannerDescription: { fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 20, fontWeight: '300' },
  bannerStat: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  bannerStatText: { fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: '500' },

  postButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderWidth: 1.5, borderColor: colors.blue, borderRadius: 100,
    paddingVertical: 12, marginBottom: 20,
  },
  postButtonText: { fontSize: 14, fontWeight: '600', color: colors.blue },

  emptyState: { alignItems: 'center', paddingVertical: 50, gap: 10 },
  emptyText: { fontSize: 15, fontWeight: '600', color: colors.grey },
  emptySub: { fontSize: 13, color: colors.greyLight, fontWeight: '300' },

  postCard: {
    backgroundColor: colors.white, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: colors.greyBorder, marginBottom: 12,
    shadowColor: colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },

  postHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  avatar: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  postName: { fontSize: 13, fontWeight: '600', color: colors.black },
  postTime: { fontSize: 11, color: colors.greyLight, fontWeight: '300' },
  postText: { fontSize: 14, color: colors.black, lineHeight: 20, fontWeight: '300', marginBottom: 10 },

  postActions: { flexDirection: 'row', gap: 20 },
  postAction: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  postActionText: { fontSize: 13, color: colors.greyLight },
});