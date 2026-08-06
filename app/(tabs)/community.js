import { useFocusEffect } from 'expo-router';
import FloatingCoachButton from '../../components/FloatingCoachButton';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Feather, Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import BackgroundCircles from '../../components/BackgroundCircles';
import { FadeUpItem } from '../../components/ScreenWrapper';
import { useTabBar } from '../../context/TabBarContext';
import { useCallback, useState, useRef } from 'react';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Share } from 'react-native';
import { getCommunityPosts, togglePostLike, getCurrentUser, reportPost, getChallenges } from '../../services/api';




// Converts a raw timestamp like "2026-06-12T11:23:00" into "2h ago"
function timeAgo(isoString) {
  const now = new Date();
  const date = new Date(isoString);
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function CommunityScreen() {
  const [contentKey, setContentKey] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(8);
  const { setCollapsed } = useTabBar();
  const lastScrollY = useRef(0);
  const headerOpacity = useSharedValue(1);
  const headerTranslateY = useSharedValue(0);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [challenges, setChallenges] = useState([]);

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'general', label: 'General' },
    { key: 'progress', label: 'Progress' },
    { key: 'questions', label: 'Questions' },
    { key: 'challenges', label: 'Challenges' },
  ];

  const filteredPosts = activeFilter === 'all'
    ? posts
    : posts.filter(p => p.tag === activeFilter);

  useFocusEffect(
    useCallback(() => {
      setContentKey(prev => prev + 1);
      opacity.value = 0;
      translateY.value = 8;
      requestAnimationFrame(() => {
        opacity.value = withTiming(1, { duration: 300 });
        translateY.value = withTiming(0, { duration: 300 });
      });

      //fetch real posts from the backend every time his scren comes into focus
      async function fetchPosts(){
        try {
          setLoading(true);
          setError(null);
          const data = await getCommunityPosts();
          setPosts(data);
          const challengesData = await getChallenges();
          setChallenges(challengesData);
    
          // We need to know who the logged-in user is so we can decide
          // whether to show "Delete" (own post) or "Report" (someone else's)
          const user = await getCurrentUser();
          setCurrentUserId(user.id);
    
        } catch(err){
          setError('could not load posts');
        } finally {
          setLoading(false);
        }
    }
      fetchPosts();
    }, [])
  );

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));
  const headerAnimStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }],
  }));

  function handleScrollBegin(event) {
    const currentY = event.nativeEvent.contentOffset.y;
    if (currentY > lastScrollY.current) {
      // Scrolling down — hide header and collapse tab
      setCollapsed(true);
      headerOpacity.value = withTiming(0, { duration: 200 });
      headerTranslateY.value = withTiming(-20, { duration: 200 });
    } else {
      // Scrolling up — show header and expand tab
      setCollapsed(false);
      headerOpacity.value = withTiming(1, { duration: 200 });
      headerTranslateY.value = withTiming(0, { duration: 200 });
    }
    lastScrollY.current = currentY;
  }

  async function toggleLike(postId) {
    try {
      const result = await togglePostLike(postId);
      // Update just the one post that was liked — don't re-fetch the whole list
      setPosts(prev => prev.map(post =>
        post.id === postId
          ? { ...post, like_count: result.like_count, liked_by_me: result.liked }
          : post
      ));
    } catch (err) {
      console.log('Like failed:', err.message);
    }
  }
  function handlePostOptions(post) {
    const isOwnPost = post.user_id === currentUserId;
  
    // Build the buttons array dynamically — Report only shows on posts
    // that aren't your own, since reporting yourself makes no sense
    const buttons = [
      {
        text: 'Share',
        onPress: async () => {
          try {
            await Share.share({
              message: `${post.name} on Fitopia: "${post.text}"`,
            });
          } catch (err) {
            console.log('Share error:', err.message);
          }
        },
      },
      {
        text: 'Save',
        // Placeholder — does nothing yet, feature coming later
        onPress: () => {
          Alert.alert('Coming soon', 'Saving posts will be available in a future update.');
        },
      },
    ];
  
    // Only add Report if this isn't the user's own post
    if (!isOwnPost) {
      buttons.push({
        text: 'Report',
        style: 'destructive',
        onPress: async () => {
          try {
            await reportPost(post.id);
            Alert.alert('Reported', 'Thanks — we\'ll review this post.');
          } catch (err) {
            Alert.alert('Error', err.message);
          }
        },
      });
    }
  
    buttons.push({ text: 'Cancel', style: 'cancel' });
  
    Alert.alert('Post options', null, buttons);
  }
  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <BackgroundCircles variant="bottomRight" />

      <Animated.View style={[styles.fixedHeader, headerAnimStyle]}>
        <Text style={styles.title}>Community</Text>
        <View style={styles.headerButtons}>
            <TouchableOpacity
            style={styles.trainersButton}
            onPress={() => router.push('/trainers')}
            >
            <Feather name="users" size={14} color={colors.blue} />
            <Text style={styles.trainersButtonText}>Trainers</Text>
            </TouchableOpacity>
            <TouchableOpacity
            style={styles.composeButton}
            onPress={() => router.push('/compose')}
            >
            <Feather name="edit-2" size={16} color={colors.white} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => router.push('/search')}
            >
              <Feather name="search" size={18} color={colors.grey} />
            </TouchableOpacity>
        </View>
        </Animated.View>
                
      <ScrollView
        onScrollBeginDrag={handleScrollBegin}
        onMomentumScrollBegin={handleScrollBegin}
        scrollEventThrottle={16}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View key={contentKey}>

          {/* Show spinner while posts are loading */}
          {loading && (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color={colors.blue} />
            </View>
          )}

          {/* Show error message if fetch failed */}
          {error && (
            <View style={styles.centered}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Active challenges */}
          <FadeUpItem delay={100}>
            <View style={styles.challengesSectionHeader}>
              <Text style={styles.sectionTitle}>Challenges</Text>
              <TouchableOpacity onPress={() => router.push('/challenges')}>
                <Text style={styles.seeAllText}>See all</Text>
              </TouchableOpacity>
            </View>

            {challenges.length === 0 ? (
              <View style={styles.noChallengesCard}>
                <Text style={styles.noChallengesText}>No challenges yet</Text>
              </View>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.challengesRow}
              >
                {challenges.slice(0, 5).map(challenge => (
                  <TouchableOpacity
                    key={challenge.id}
                    style={[styles.challengeCard, { backgroundColor: challenge.color || colors.blue }]}
                    onPress={() => router.push({
                      pathname: '/challenge/[id]',
                      params: { id: challenge.id, name: challenge.name }
                    })}
                  >
                    <Text style={styles.challengeName}>{challenge.name}</Text>
                    <Text style={styles.challengeMembers}>{challenge.post_count} posts</Text>
                    <View style={styles.challengeFooter}>
                      <View style={styles.joinButton}>
                        <Text style={styles.joinButtonText}>View</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </FadeUpItem>

          {/* Filter tabs */}
          <FadeUpItem delay={200}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtersContainer}
            >
              {filters.map(filter => (
                <TouchableOpacity
                  key={filter.key}
                  style={[styles.filterTab, activeFilter === filter.key && styles.filterTabActive]}
                  onPress={() => setActiveFilter(filter.key)}
                >
                  <Text style={[styles.filterText, activeFilter === filter.key && styles.filterTextActive]}>
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </FadeUpItem>

          {/* Posts */}
          <FadeUpItem delay={300}>
            <View style={styles.posts}>
            {filteredPosts.map(post => (
              <View key={post.id} style={styles.postCard}>

                {/* Post header */}
                <View style={styles.postHeader}>
                  <TouchableOpacity
                    onPress={() => router.push({
                      pathname: '/profile/[id]',
                      params: { id: post.user_id, name: post.name }
                    })}
                  >
                    {post.profile_picture ? (
                      <Image source={{ uri: post.profile_picture }} style={styles.avatar} />
                    ) : (
                      <View style={[styles.avatar, {
                        backgroundColor: post.gender === 'female' ? '#EDE9FE' : post.gender === 'male' ? colors.blueLight : colors.greyCard,
                        borderWidth: 1,
                        borderColor: colors.greyBorder,
                      }]}>
                        <Feather
                          name="user"
                          size={20}
                          color={post.gender === 'female' ? '#7C3AED' : post.gender === 'male' ? colors.blue : colors.greyLight}
                        />
                      </View>
                    )}
                  </TouchableOpacity>

                  <View style={styles.postMeta}>
                    <TouchableOpacity
                      onPress={() => router.push({
                        pathname: '/profile/[id]',
                        params: { id: post.user_id, name: post.name }
                      })}
                    >
                      <Text style={styles.postName}>{post.name}</Text>
                    </TouchableOpacity>
                    <Text style={styles.postLocation}>{timeAgo(post.created_at)}</Text>
                  </View>

                  <View style={[styles.postTag, post.tag === 'questions' && styles.postTagQuestion, post.tag === 'challenges' && styles.postTagChallenge]}>
                    <Text style={[styles.postTagText, post.tag === 'questions' && styles.postTagTextQuestion, post.tag === 'challenges' && styles.postTagTextChallenge]}>
                      {post.tag}
                    </Text>
                  </View>

                  {/* Options button — now correctly inside postHeader's row */}
                  <TouchableOpacity
                    style={styles.optionsButton}
                    onPress={() => handlePostOptions(post)}
                  >
                    <Feather name="more-horizontal" size={18} color={colors.greyLight} />
                  </TouchableOpacity>
                </View>

                {/* Post body — tapping opens comments */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => router.push({
                    pathname: '/comments',
                    params: {
                      postId: post.id,
                      postText: post.text,
                      postName: post.name,
                    }
                  })}
                >
                  <Text style={styles.postText}>{post.text}</Text>
                </TouchableOpacity>

                {/* Post actions */}
                <View style={styles.postActions}>
                  <TouchableOpacity
                    style={styles.postAction}
                    onPress={() => toggleLike(post.id)}
                  >
                    <Ionicons
                      name={post.liked_by_me ? "heart" : "heart-outline"}
                      size={16}
                      color={post.liked_by_me ? '#DC2626' : colors.greyLight}
                    />
                    <Text style={[styles.postActionText, post.liked_by_me && styles.postActionTextLiked]}>
                      {post.like_count}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.postAction}
                    onPress={() => router.push({
                      pathname: '/comments',
                      params: {
                        postId: post.id,
                        postText: post.text,
                        postName: post.name,
                      }
                    })}
                  >
                    <Feather name="message-circle" size={16} color={colors.greyLight} />
                    <Text style={styles.postActionText}>{post.comment_count}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.postAction}>
                    <Feather name="share-2" size={16} color={colors.greyLight} />
                  </TouchableOpacity>
                </View>

              </View>
            ))}           
            </View>
          </FadeUpItem>

        </View>
      </ScrollView>
      <FloatingCoachButton />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scroll: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.black,
    letterSpacing: -1,
  },
  composeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.black,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  challengesRow: {
    gap: 12,
    paddingBottom: 20,
    paddingRight: 24,
  },
  challengeCard: {
    width: 160,
    borderRadius: 20,
    padding: 16,
  },
  challengeName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  challengeMembers: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 16,
    fontWeight: '300',
  },
  challengeFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  challengeDays: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
  },
  joinButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 100,
  },
  joinButtonText: {
    fontSize: 11,
    color: colors.white,
    fontWeight: '600',
  },
  filtersContainer: {
    gap: 8,
    paddingBottom: 16,
    paddingRight: 24,
  },
  filterTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 100,
    backgroundColor: colors.greyCard,
    borderWidth: 1,
    borderColor: colors.greyBorder,
  },
  filterTabActive: {
    backgroundColor: colors.blue,
    borderColor: colors.blue,
    shadowColor: colors.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.grey,
  },
  filterTextActive: {
    color: colors.white,
  },
  posts: {
    gap: 12,
  },
  postCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.greyBorder,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.white,
  },
  postMeta: {
    flex: 1,
  },
  postName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 2,
  },
  postLocation: {
    fontSize: 12,
    color: colors.grey,
    fontWeight: '300',
  },
  postTag: {
    backgroundColor: colors.blueLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
  postTagQuestion: {
    backgroundColor: '#EDE9FE',
  },
  postTagChallenge: {
    backgroundColor: '#D1FAE5',
  },
  postTagText: {
    fontSize: 10,
    color: colors.blue,
    fontWeight: '500',
  },
  postTagTextQuestion: {
    color: '#7C3AED',
  },
  postTagTextChallenge: {
    color: '#059669',
  },
  postText: {
    fontSize: 14,
    color: colors.black,
    lineHeight: 22,
    fontWeight: '300',
    marginBottom: 14,
  },
  postActions: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
  postAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  postActionText: {
    fontSize: 13,
    color: colors.greyLight,
    fontWeight: '400',
  },
  postActionTextLiked: {
    color: '#DC2626',
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 52,
    paddingBottom: 16,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderBottomWidth: 0.5,
    borderBottomColor: colors.greyBorder,
  },
  
  content: {
    paddingHorizontal: 24,
    paddingTop: 120,
    paddingBottom: 120,
  },
  postPhoto: {
    height: 180,
    borderRadius: 12,
    backgroundColor: colors.greyCard,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.greyBorder,
  },
  
  postPhotoText: {
    fontSize: 12,
    color: colors.greyLight,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  
  trainersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.blueLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 100,
  },
  
  trainersButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.blue,
  },
  centered: {
    paddingVertical: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 14,
    color: colors.grey,
    fontWeight: '300',
  },
  searchButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.greyCard,
    alignItems: 'center', justifyContent: 'center',
  },
  optionsButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  challengesSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  seeAllText: {
    fontSize: 14, color: colors.blue, fontWeight: '500',
  },
  
  noChallengesCard: {
    paddingVertical: 24,
    alignItems: 'center',
    backgroundColor: colors.greyCard,
    borderRadius: 16,
    marginBottom: 20,
  },
  
  noChallengesText: {
    fontSize: 13, color: colors.greyLight, fontWeight: '300',
  },
});