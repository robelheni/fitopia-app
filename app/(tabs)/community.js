import FloatingCoachButton from '../../components/FloatingCoachButton';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { lightColors } from '../../constants/colors';
import { getTabTranslation } from '../../constants/tabTranslations';
import BackgroundCircles from '../../components/BackgroundCircles';
import { FadeUpItem } from '../../components/ScreenWrapper';
import { useTabBar } from '../../context/TabBarContext';
import { useState, useRef, useEffect } from 'react';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Share, RefreshControl } from 'react-native';
import { getCommunityPosts, togglePostLike, getCurrentUser, reportPost, getChallenges } from '../../services/api';




// Converts a raw timestamp like "2026-06-12T11:23:00" into "2h ago"
function timeAgo(isoString, isAmharic) {
  const now = new Date();
  const date = new Date(isoString);
  const seconds = Math.floor((now - date) / 1000);

  if (isAmharic) {
    if (seconds < 60) return 'አሁን';
    if (seconds < 3600) return `ከ${Math.floor(seconds / 60)} ደቂቃ በፊት`;
    if (seconds < 86400) return `ከ${Math.floor(seconds / 3600)} ሰዓት በፊት`;
    return `ከ${Math.floor(seconds / 86400)} ቀን በፊት`;
  }
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function CommunityScreen() {
  const theme = useTheme();
  const { language } = useLanguage();
  const isAmharic = language === 'Amharic';
  const t = getTabTranslation(language);
  const isDark = theme ? theme.isDark : false;
  const colors = theme ? theme.colors : lightColors;

  const [activeFilter, setActiveFilter] = useState('all');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const { setCollapsed } = useTabBar();
  const lastScrollY = useRef(0);
  const headerOpacity = useSharedValue(1);
  const headerTranslateY = useSharedValue(0);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [challenges, setChallenges] = useState([]);

  const filters = [
    { key: 'all', label: t.all },
    { key: 'general', label: t.general },
    { key: 'progress', label: t.progress },
    { key: 'questions', label: t.questions },
    { key: 'challenges', label: t.challenges },
  ];

  const filteredPosts = activeFilter === 'all'
    ? posts
    : posts.filter(p => p.tag === activeFilter);

  async function fetchPosts() {
    try {
      setLoading(true);
      setError(null);
      const data = await getCommunityPosts();
      setPosts(data);
      const challengesData = await getChallenges();
      setChallenges(challengesData);
      const user = await getCurrentUser();
      setCurrentUserId(user.id);
    } catch (err) {
      setError('load');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchPosts(); }, []);


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

  async function onRefresh() {
    setRefreshing(true);
    try {
      const data = await getCommunityPosts();
      setPosts(data);
      const challengesData = await getChallenges();
      setChallenges(challengesData);
      const user = await getCurrentUser();
      setCurrentUserId(user.id);
    } catch (err) {
      console.log('Community refresh error:', err.message);
    } finally {
      setRefreshing(false);
    }
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
        text: t.share,
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
        text: t.save,
        // Placeholder — does nothing yet, feature coming later
        onPress: () => {
          Alert.alert(t.comingSoon, t.savePostsMessage);
        },
      },
    ];
  
    // Only add Report if this isn't the user's own post
    if (!isOwnPost) {
      buttons.push({
        text: t.report,
        style: 'destructive',
        onPress: async () => {
          try {
            await reportPost(post.id);
            Alert.alert(t.reported, t.reportThanks);
          } catch (err) {
            Alert.alert(t.error, err.message);
          }
        },
      });
    }
  
    buttons.push({ text: t.cancel, style: 'cancel' });
  
    Alert.alert(t.postOptions, null, buttons);
  }
  const styles = makeStyles(colors, isDark);

  return (
    <View style={styles.container}>
      <BackgroundCircles variant="bottomRight" />

      <Animated.View style={[styles.fixedHeader, headerAnimStyle]}>
        <Text style={styles.title}>{t.community}</Text>
        <View style={styles.headerButtons}>
            <TouchableOpacity
            style={styles.trainersButton}
            onPress={() => router.push('/trainers')}
            >
            <Feather name="users" size={14} color={colors.blue} />
            <Text style={styles.trainersButtonText}>{t.trainers}</Text>
            </TouchableOpacity>
            <TouchableOpacity
            style={styles.composeButton}
            onPress={() => router.push('/compose')}
            >
            <Feather name="edit-2" size={16} color={'#FFFFFF'} />
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.blue} colors={[colors.blue]} />
        }
      >
        <View>

          {/* Show spinner while posts are loading */}
          {loading && (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color={colors.blue} />
            </View>
          )}

          {/* Show error message if fetch failed */}
          {error && (
            <View style={styles.centered}>
              <Text style={styles.errorText}>{error === 'load' ? t.couldNotLoadPosts : error}</Text>
            </View>
          )}

          {/* Active challenges */}
          <FadeUpItem delay={100}>
            <View style={styles.challengesSectionHeader}>
              <Text style={styles.sectionTitle}>{t.challenges}</Text>
              <TouchableOpacity onPress={() => router.push('/challenges')}>
                <Text style={styles.seeAllText}>{t.seeAll}</Text>
              </TouchableOpacity>
            </View>

            {challenges.length === 0 ? (
              <View style={styles.noChallengesCard}>
                <Text style={styles.noChallengesText}>{t.noChallenges}</Text>
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
                    <Text style={styles.challengeMembers}>{challenge.post_count} {t.posts}</Text>
                    <View style={styles.challengeFooter}>
                      <View style={styles.joinButton}>
                        <Text style={styles.joinButtonText}>{t.view}</Text>
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
                    <Text style={styles.postLocation}>{timeAgo(post.created_at, isAmharic)}</Text>
                  </View>

                  <View style={[styles.postTag, post.tag === 'questions' && styles.postTagQuestion, post.tag === 'challenges' && styles.postTagChallenge]}>
                    <Text style={[styles.postTagText, post.tag === 'questions' && styles.postTagTextQuestion, post.tag === 'challenges' && styles.postTagTextChallenge]}>
                      {post.tag === 'progress' ? t.progress : post.tag === 'questions' ? t.questions : post.tag === 'challenges' ? t.challenges : post.tag === 'general' ? t.general : post.tag}
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
                      postImage: post.image_url || '',
                      commentsDisabled: post.comments_disabled ? '1' : '0',
                    }
                  })}
                >
                  <Text style={styles.postText}>{post.text}</Text>
                  {post.image_url && (
                    <Image
                      source={{ uri: post.image_url }}
                      style={styles.postImage}
                      resizeMode="cover"
                    />
                  )}
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
                        postImage: post.image_url || '',
                        commentsDisabled: post.comments_disabled ? '1' : '0',
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
    </View>
  );
}

function makeStyles(c, dark) {
  const colors = c || lightColors;
  const isDark = dark || false;
  return StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scroll: {
    flex: 1,
    marginTop: 120,
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
    color: '#FFFFFF',
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
    color: '#FFFFFF',
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
    color: '#FFFFFF',
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
    color: '#FFFFFF',
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
    backgroundColor: isDark ? '#3B0764' : '#EDE9FE',
  },
  postTagChallenge: {
    backgroundColor: isDark ? '#052E16' : '#D1FAE5',
  },
  postTagText: {
    fontSize: 10,
    color: isDark ? '#A5B4FC' : colors.blue,
    fontWeight: '500',
  },
  postTagTextQuestion: {
    color: isDark ? '#C4B5FD' : '#7C3AED',
  },
  postTagTextChallenge: {
    color: isDark ? '#6EE7B7' : '#059669',
  },
  postText: {
    fontSize: 14,
    color: colors.black,
    lineHeight: 22,
    fontWeight: '300',
    marginBottom: 14,
  },

  postImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 14,
    marginTop: -4,
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
    backgroundColor: isDark ? 'rgba(15,15,15,0.95)' : 'rgba(255,255,255,0.95)',
    borderBottomWidth: 0.5,
    borderBottomColor: colors.greyBorder,
  },
  
  content: {
    paddingHorizontal: 24,
    paddingTop: 0,
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
    color: colors.blueText,
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
    fontSize: 14, color: colors.blueText, fontWeight: '500',
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
}); }
