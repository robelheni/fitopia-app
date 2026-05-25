import { useFocusEffect } from 'expo-router';

import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import BackgroundCircles from '../../components/BackgroundCircles';
import { FadeUpItem } from '../../components/ScreenWrapper';
import { useTabBar } from '../../context/TabBarContext';
import { useCallback, useState, useRef } from 'react';
import { router } from 'expo-router';

// Hardcoded posts for now — comes from backend later
const posts = [
  {
    id: '1',
    name: 'Abebu T.',
    initials: 'AT',
    location: 'London, UK',
    time: '2h ago',
    text: 'Completed week 3 of my plan. Feeling stronger every day. The fasting day workouts are a game changer.',
    likes: 24,
    comments: 8,
    tag: 'progress',
    avatarColor: colors.blue,
    hasPhoto: true,
  },
  {
    id: '2',
    name: 'Meron H.',
    initials: 'MH',
    location: 'Minnesota, US',
    time: '5h ago',
    text: 'First fasting day workout done. Never thought I could work out while fasting but the adapted plan really works.',
    likes: 41,
    comments: 15,
    tag: 'progress',
    avatarColor: '#D4A843',
  },
  {
    id: '3',
    name: 'Dawit K.',
    initials: 'DK',
    location: 'Stockholm, SE',
    time: '8h ago',
    text: 'Question — for someone doing Orthodox fasting twice a week, should I do the light workout on both days or just one?',
    likes: 12,
    comments: 23,
    tag: 'questions',
    avatarColor: '#7C3AED',
  },
  {
    id: '4',
    name: 'Sara M.',
    initials: 'SM',
    location: 'Toronto, CA',
    time: '1d ago',
    text: 'Just finished the 30 day challenge. Down 4kg and feeling amazing. This community kept me going on the hard days.',
    likes: 89,
    comments: 31,
    tag: 'progress',
    avatarColor: '#059669',
  },
  {
    id: '5',
    name: 'Yonas B.',
    initials: 'YB',
    location: 'Dubai, UAE',
    time: '1d ago',
    text: 'Who else is doing the upper body challenge this week? Day 3 done. Arms are destroyed but in a good way.',
    likes: 34,
    comments: 19,
    tag: 'challenges',
    avatarColor: '#DC2626',
    hasPhoto: true,
  },
];

const challenges = [
  {
    id: 'c1',
    name: '30 Day Strength',
    members: 142,
    daysLeft: 18,
    color: colors.blue,
  },
  {
    id: 'c2',
    name: 'Fasting Fitness',
    members: 89,
    daysLeft: 24,
    color: '#7C3AED',
  },
  {
    id: 'c3',
    name: 'Home Warrior',
    members: 203,
    daysLeft: 11,
    color: '#059669',
  },
];

export default function CommunityScreen() {
  const [contentKey, setContentKey] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all');
  const [likedPosts, setLikedPosts] = useState([]);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(8);
  const { setCollapsed } = useTabBar();
  const lastScrollY = useRef(0);
  const headerOpacity = useSharedValue(1);
const headerTranslateY = useSharedValue(0);

  const filters = [
    { key: 'all', label: 'All' },
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

  function toggleLike(postId) {
    setLikedPosts(prev =>
      prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  }

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <BackgroundCircles variant="bottomRight" />

      <Animated.View style={[styles.fixedHeader, headerAnimStyle]}>
        <Text style={styles.title}>Community</Text>
        <TouchableOpacity
        style={styles.composeButton}
        onPress={() => router.push('/compose')}
        >
        <Feather name="edit-2" size={16} color={colors.white} />
        </TouchableOpacity>
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

        

          {/* Active challenges */}
          <FadeUpItem delay={100}>
            <Text style={styles.sectionTitle}>Active challenges</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.challengesRow}
            >
              {challenges.map(challenge => (
                <TouchableOpacity
                  key={challenge.id}
                  style={[styles.challengeCard, { backgroundColor: challenge.color }]}
                >
                  <Text style={styles.challengeName}>{challenge.name}</Text>
                  <Text style={styles.challengeMembers}>{challenge.members} members</Text>
                  <View style={styles.challengeFooter}>
                    <Text style={styles.challengeDays}>{challenge.daysLeft} days left</Text>
                    <View style={styles.joinButton}>
                      <Text style={styles.joinButtonText}>Join</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
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
                    <View style={[styles.avatar, { backgroundColor: post.avatarColor }]}>
                      <Text style={styles.avatarText}>{post.initials}</Text>
                    </View>
                    <View style={styles.postMeta}>
                      <Text style={styles.postName}>{post.name}</Text>
                      <Text style={styles.postLocation}>{post.location} · {post.time}</Text>
                    </View>
                    <View style={[styles.postTag, post.tag === 'questions' && styles.postTagQuestion, post.tag === 'challenges' && styles.postTagChallenge]}>
                      <Text style={[styles.postTagText, post.tag === 'questions' && styles.postTagTextQuestion, post.tag === 'challenges' && styles.postTagTextChallenge]}>
                        {post.tag}
                      </Text>
                    </View>
                  </View>

                  {/* Post text */}
                  <Text style={styles.postText}>{post.text}</Text>

                    {/* Photo placeholder — shows on some posts */}
                    {post.hasPhoto && (
                    <View style={styles.postPhoto}>
                        <Feather name="image" size={24} color={colors.greyLight} />
                        <Text style={styles.postPhotoText}>Photo</Text>
                    </View>
                    )}

                  {/* Post actions */}
                  <View style={styles.postActions}>
                    <TouchableOpacity
                      style={styles.postAction}
                      onPress={() => toggleLike(post.id)}
                    >
                      <Feather
                        name="heart"
                        size={16}
                        color={likedPosts.includes(post.id) ? '#DC2626' : colors.greyLight}
                      />
                      <Text style={[
                        styles.postActionText,
                        likedPosts.includes(post.id) && styles.postActionTextLiked
                      ]}>
                        {likedPosts.includes(post.id) ? post.likes + 1 : post.likes}
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
                    <Text style={styles.postActionText}>{post.comments}</Text>
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
  content: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 120,
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
});