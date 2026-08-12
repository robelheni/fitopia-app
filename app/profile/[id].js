import { useState, useCallback } from 'react';
import {
  View, Text, Image, ScrollView, StyleSheet,
  TouchableOpacity, ActivityIndicator
} from 'react-native';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { lightColors } from '../../constants/colors';
import { FadeUpItem } from '../../components/ScreenWrapper';
import { getUserProfile, toggleFollow, togglePostLike } from '../../services/api';
// Same muscle colour helper we use in liked.js and library.js
const MUSCLE_COLORS = {
  chest:      { color: '#2563EB', bg: '#EFF6FF' },
  back:       { color: '#7C3AED', bg: '#EDE9FE' },
  shoulders:  { color: '#D97706', bg: '#FEF3C7' },
  biceps:     { color: '#059669', bg: '#D1FAE5' },
  triceps:    { color: '#DC2626', bg: '#FEE2E2' },
  legs:       { color: '#0891B2', bg: '#CFFAFE' },
  core:       { color: '#DC2626', bg: '#FEE2E2' },
  cardio:     { color: '#059669', bg: '#D1FAE5' },
};

// Tag colours — computed inside component via getTagColors(colors, isDark)

// Converts ISO timestamp to "2h ago" format
// Same function we use in community.js
function timeAgo(isoString) {
  const now = new Date();
  const date = new Date(isoString);
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function UserProfileScreen() {
  const theme = useTheme();
  const isDark = theme ? theme.isDark : false;
  const colors = theme ? theme.colors : lightColors;

  const TAG_COLORS = {
    progress:   { color: colors.blue, bg: colors.blueLight },
    questions:  { color: isDark ? '#C4B5FD' : '#7C3AED', bg: isDark ? '#3B0764' : '#EDE9FE' },
    challenges: { color: isDark ? '#6EE7B7' : '#059669', bg: isDark ? '#052E16' : '#D1FAE5' },
    general:    { color: colors.grey, bg: colors.greyCard },
  };

  // useLocalSearchParams reads the URL params — { id, name } passed when navigating here
  // id is the user's database ID, name is passed for instant display before API responds
  const { id, name } = useLocalSearchParams();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [likedPosts, setLikedPosts] = useState({});

  // useFocusEffect re-fetches every time you navigate to this screen
  // This means if you follow someone, go back, and come back — it shows the updated count
  useFocusEffect(
    useCallback(() => {
      async function fetchProfile() {
        try {
          setLoading(true);
          const data = await getUserProfile(id);
          setProfile(data);
          // Set the follow state from what the backend tells us
          setFollowing(data.is_following);
        } catch (err) {
          console.log('Profile fetch error:', err.message);
        } finally {
          setLoading(false);
        }
      }
      fetchProfile();
    }, [id])
  );

  async function handleFollow() {
    try {
      setFollowLoading(true);
      const result = await toggleFollow(id);
      setFollowing(result.following);
      // Update the follower count locally without re-fetching the whole profile
      // This makes the UI feel instant
      setProfile(prev => ({
        ...prev,
        follower_count: result.following
          ? prev.follower_count + 1
          : prev.follower_count - 1,
      }));
    } catch (err) {
      console.log('Follow error:', err.message);
    } finally {
      setFollowLoading(false);
    }
  }

  // Get initials from name for the avatar
  // "Heni Bekele" → "HB", "Heni" → "HE"
  function getInitials(fullName) {
    if (!fullName) return '??';
    const parts = fullName.split(' ');
    if (parts.length === 1) return fullName.substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  // Avatar background colour based on gender
  // Same logic as community.js post cards
  function getAvatarColor(gender) {
    if (gender === 'female') return { bg: '#EDE9FE', color: '#7C3AED' };
    if (gender === 'male') return { bg: colors.blueLight, color: colors.blue };
    return { bg: colors.greyCard, color: colors.grey };
  }

  const styles = makeStyles(colors, isDark);

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {/* Show name immediately from params while profile loads */}
          {profile?.name || name || 'Profile'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.blue} />
        </View>
      ) : !profile ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>Profile not found</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >

          {/* Avatar and name */}
          <FadeUpItem delay={0}>
            <View style={styles.profileTop}>
              {profile.profile_picture ? (
                <Image source={{ uri: profile.profile_picture }} style={styles.avatar} />
              ) : (
                <View style={[
                  styles.avatar,
                  { backgroundColor: getAvatarColor(profile.gender).bg }
                ]}>
                  <Text style={[
                    styles.avatarText,
                    { color: getAvatarColor(profile.gender).color }
                  ]}>
                    {getInitials(profile.name)}
                  </Text>
                </View>
              )}

              <Text style={styles.profileName}>{profile.name}</Text>
              {profile.username && (
                <Text style={styles.profileUsername}>@{profile.username}</Text>
              )}

              {/* Only show follow button if viewing someone else's profile */}
              {!profile.is_own_profile && (
                <TouchableOpacity
                  style={[
                    styles.followButton,
                    following && styles.followButtonActive
                  ]}
                  onPress={handleFollow}
                  disabled={followLoading}
                >
                  <Text style={[
                    styles.followButtonText,
                    following && styles.followButtonTextActive
                  ]}>
                    {followLoading ? '...' : following ? 'Following' : 'Follow'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </FadeUpItem>

          {/* Stats row — posts, followers, following */}
          <FadeUpItem delay={100}>
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>{profile.post_count}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={styles.statNumber}>{profile.follower_count}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={styles.statNumber}>{profile.following_count}</Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
            </View>
          </FadeUpItem>

          {/* Posts section */}
          <FadeUpItem delay={200}>
            <Text style={styles.sectionTitle}>Posts</Text>

            {profile.posts.length === 0 ? (
              <View style={styles.emptyPosts}>
                <Feather name="edit-2" size={32} color={colors.greyLight} />
                <Text style={styles.emptyText}>No posts yet</Text>
              </View>
            ) : (
              profile.posts.map((post, index) => {
                const tag = TAG_COLORS[post.tag] || TAG_COLORS.general;
                return (
                  <FadeUpItem key={post.id} delay={200 + index * 60}>
                    <View style={styles.postCard}>

                      {/* Tag */}
                      <View style={[styles.postTag, { backgroundColor: tag.bg }]}>
                        <Text style={[styles.postTagText, { color: tag.color }]}>
                          {post.tag}
                        </Text>
                      </View>

                      {/* Post text */}
                      <Text style={styles.postText}>{post.text}</Text>

                      {post.image_url && (
                        <Image
                          source={{ uri: post.image_url }}
                          style={styles.postImage}
                          resizeMode="cover"
                        />
                      )}

                      {/* Post footer — time, likes, comments */}
                      <View style={styles.postFooter}>
                        <Text style={styles.postTime}>{timeAgo(post.created_at)}</Text>
                    <View style={styles.postActions}>
                    <TouchableOpacity
                        style={styles.postAction}
                        onPress={async () => {
                            try {
                            const result = await togglePostLike(post.id);
                            setLikedPosts(prev => ({ ...prev, [post.id]: result.liked }));
                            setProfile(prev => ({
                                ...prev,
                                posts: prev.posts.map(p =>
                                p.id === post.id
                                    ? { ...p, like_count: result.like_count }
                                    : p
                                ),
                            }));
                            } catch (err) {
                            console.log('Like error:', err.message);
                            }
                        }}
                        >
                        <Ionicons
                            name={likedPosts[post.id] ? "heart" : "heart-outline"}
                            size={14}
                            color={likedPosts[post.id] ? '#DC2626' : colors.greyLight}
                            />
                        <Text style={styles.postActionText}>{post.like_count}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.postAction}
                            onPress={() => router.push({
                            pathname: '/comments',
                            params: {
                                postId: post.id,
                                postText: post.text,
                                postName: profile.name,
                                postImage: post.image_url || '',
                                commentsDisabled: post.comments_disabled ? '1' : '0',
                            }
                            })}
                        >
                            <Feather name="message-circle" size={14} color={colors.greyLight} />
                            <Text style={styles.postActionText}>{post.comment_count}</Text>
                        </TouchableOpacity>
                        </View>
                        </View>

                        </View>
                    </FadeUpItem>
                    );
                })
                )}
            </FadeUpItem>

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

  headerTitle: {
    fontSize: 17, fontWeight: '600', color: colors.black,
  },

  centered: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
  },

  errorText: {
    fontSize: 15, color: colors.grey, fontWeight: '300',
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 120,
  },

  profileTop: {
    alignItems: 'center',
    marginBottom: 24,
    gap: 8,
  },

  avatar: {
    width: 80, height: 80, borderRadius: 40,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 8,
  },

  avatarText: {
    fontSize: 28, fontWeight: '700',
  },

  profileName: {
    fontSize: 22, fontWeight: '700',
    color: colors.black, letterSpacing: -0.5,
  },

  profileUsername: {
    fontSize: 14, color: colors.grey, fontWeight: '300',
  },

  followButton: {
    marginTop: 8,
    paddingHorizontal: 32,
    paddingVertical: 10,
    borderRadius: 100,
    borderWidth: 1.5,
    borderColor: colors.blue,
  },

  followButtonActive: {
    backgroundColor: colors.blue,
  },

  followButtonText: {
    fontSize: 14, fontWeight: '600', color: colors.blue,
  },

  followButtonTextActive: {
    color: '#FFFFFF',
  },

  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.greyCard,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },

  stat: { flex: 1, alignItems: 'center', gap: 4 },

  statNumber: {
    fontSize: 24, fontWeight: '700',
    color: colors.black, letterSpacing: -0.5,
  },

  statLabel: {
    fontSize: 12, color: colors.grey, fontWeight: '300',
  },

  statDivider: {
    width: 0.5, backgroundColor: colors.greyBorder,
  },

  sectionTitle: {
    fontSize: 18, fontWeight: '700',
    color: colors.black, letterSpacing: -0.5,
    marginBottom: 16,
  },

  emptyPosts: {
    alignItems: 'center', paddingVertical: 40, gap: 12,
  },

  emptyText: {
    fontSize: 14, color: colors.grey, fontWeight: '300',
  },

  postCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.greyBorder,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    gap: 10,
  },

  postTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },

  postTagText: {
    fontSize: 11, fontWeight: '600', textTransform: 'capitalize',
  },

  postText: {
    fontSize: 15, color: colors.black,
    lineHeight: 22, fontWeight: '300',
  },

  postImage: {
    width: '100%', aspectRatio: 1, borderRadius: 12,
    marginTop: -4, marginBottom: 4,
  },

  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  postTime: {
    fontSize: 12, color: colors.greyLight, fontWeight: '300',
  },

  postActions: {
    flexDirection: 'row', gap: 12,
  },

  postAction: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
  },

  postActionText: {
    fontSize: 12, color: colors.greyLight,
  },
}); }