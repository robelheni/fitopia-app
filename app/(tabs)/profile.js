import { useFocusEffect, router } from 'expo-router';
import { useCallback, useState, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Share, Clipboard } from 'react-native';
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

// Hardcoded user data — comes from backend later
const userData = {
  name: 'Heni',
  initials: 'HE',
  location: 'West Bromwich, UK',
  plan: 'Free',
  referralCode: 'HENI2024',
  joinedDate: 'May 2026',
};

// Hardcoded stats — comes from backend later
const stats = [
  { label: 'Workouts', value: '0', icon: 'activity' },
  { label: 'Streak', value: '0d', icon: 'zap' },
  { label: 'Minutes', value: '0', icon: 'clock' },
];

// Hardcoded posts — comes from backend later
const myPosts = [
  {
    id: 'p1',
    text: 'Just completed my first fasting day workout. Harder than expected but felt amazing after.',
    tag: 'progress',
    likes: 14,
    comments: 5,
    time: '3d ago',
  },
  {
    id: 'p2',
    text: 'Week 1 done. Feeling the difference already.',
    tag: 'progress',
    likes: 22,
    comments: 8,
    time: '1w ago',
  },
];

export default function ProfileScreen() {
  const [contentKey, setContentKey] = useState(0);
  const [codeCopied, setCodeCopied] = useState(false);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(8);
  const { setCollapsed } = useTabBar();
  const lastScrollY = useRef(0);
  const headerOpacity = useSharedValue(1);
  const headerTranslateY = useSharedValue(0);

  const headerAnimStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }],
  }));

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

  function handleScrollBegin(event) {
    const currentY = event.nativeEvent.contentOffset.y;
    if (currentY > lastScrollY.current) {
      setCollapsed(true);
      headerOpacity.value = withTiming(0, { duration: 200 });
      headerTranslateY.value = withTiming(-20, { duration: 200 });
    } else {
      setCollapsed(false);
      headerOpacity.value = withTiming(1, { duration: 200 });
      headerTranslateY.value = withTiming(0, { duration: 200 });
    }
    lastScrollY.current = currentY;
  }

  function copyReferralCode() {
    Clipboard.setString(userData.referralCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  }

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <BackgroundCircles variant="centered" />

      {/* Fixed header */}
      <Animated.View style={[styles.fixedHeader, headerAnimStyle]}>
        <Text style={styles.headerTitle}>Profile</Text>
        
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

          {/* Profile card */}
          <FadeUpItem delay={0}>
            <View style={styles.profileCard}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{userData.initials}</Text>
                </View>
                <TouchableOpacity style={styles.editAvatarButton}>
                  <Feather name="camera" size={12} color={colors.white} />
                </TouchableOpacity>
              </View>
              <Text style={styles.userName}>{userData.name}</Text>
              <View style={styles.locationRow}>
                <Feather name="map-pin" size={12} color={colors.grey} />
                <Text style={styles.userLocation}>{userData.location}</Text>
              </View>
              <Text style={styles.joinedDate}>Member since {userData.joinedDate}</Text>
            </View>
          </FadeUpItem>

          {/* Stats row */}
          <FadeUpItem delay={100}>
            <View style={styles.statsRow}>
              {stats.map((stat, index) => (
                <View key={index} style={styles.statItem}>
                  <Feather name={stat.icon} size={18} color={colors.blue} />
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </FadeUpItem>

          {/* Subscription card */}
          <FadeUpItem delay={150}>
            <View style={styles.subscriptionCard}>
              <View style={styles.subscriptionLeft}>
                <View style={styles.planBadge}>
                  <Text style={styles.planBadgeText}>{userData.plan}</Text>
                </View>
                <Text style={styles.subscriptionTitle}>
                  {userData.plan === 'Free' ? 'Upgrade to Pro' : 'Pro Member'}
                </Text>
                <Text style={styles.subscriptionSub}>
                  {userData.plan === 'Free'
                    ? 'Unlock AI coaching, full workout library and more'
                    : 'You have full access to all features'
                  }
                </Text>
              </View>
              {userData.plan === 'Free' && (
                <TouchableOpacity style={styles.upgradeButton}>
                  <Text style={styles.upgradeButtonText}>Upgrade</Text>
                </TouchableOpacity>
              )}
            </View>
          </FadeUpItem>

          {/* My posts */}
          <FadeUpItem delay={200}>
            <Text style={styles.sectionTitle}>My posts</Text>
            {myPosts.length === 0 ? (
              <View style={styles.emptyState}>
                <Feather name="edit-2" size={32} color={colors.greyLight} />
                <Text style={styles.emptyText}>No posts yet</Text>
                <Text style={styles.emptySub}>Share your progress with the community</Text>
              </View>
            ) : (
              <View style={styles.postsList}>
                {myPosts.map(post => (
                  <View key={post.id} style={styles.postCard}>
                    <View style={styles.postCardHeader}>
                      <View style={[
                        styles.postTag,
                        post.tag === 'progress' && styles.postTagProgress,
                      ]}>
                        <Text style={[
                          styles.postTagText,
                          post.tag === 'progress' && styles.postTagTextProgress,
                        ]}>
                          {post.tag}
                        </Text>
                      </View>
                      <Text style={styles.postTime}>{post.time}</Text>
                    </View>
                    <Text style={styles.postText}>{post.text}</Text>
                    <View style={styles.postStats}>
                      <View style={styles.postStat}>
                        <Feather name="heart" size={13} color={colors.greyLight} />
                        <Text style={styles.postStatText}>{post.likes}</Text>
                      </View>
                      <View style={styles.postStat}>
                        <Feather name="message-circle" size={13} color={colors.greyLight} />
                        <Text style={styles.postStatText}>{post.comments}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </FadeUpItem>

          {/* Settings section */}
          <FadeUpItem delay={250}>
            <Text style={styles.sectionTitle}>Settings</Text>
            <View style={styles.settingsCard}>

              <TouchableOpacity style={styles.settingsItem}>
                <View style={styles.settingsIconContainer}>
                  <Feather name="user" size={16} color={colors.blue} />
                </View>
                <Text style={styles.settingsItemText}>Edit profile</Text>
                <Feather name="chevron-right" size={16} color={colors.greyLight} />
              </TouchableOpacity>

              <View style={styles.settingsDivider} />

              <TouchableOpacity style={styles.settingsItem}>
                <View style={styles.settingsIconContainer}>
                  <Feather name="moon" size={16} color={colors.blue} />
                </View>
                <Text style={styles.settingsItemText}>Fasting schedule</Text>
                <Feather name="chevron-right" size={16} color={colors.greyLight} />
              </TouchableOpacity>

              <View style={styles.settingsDivider} />

              <TouchableOpacity style={styles.settingsItem}>
                <View style={styles.settingsIconContainer}>
                  <Feather name="bell" size={16} color={colors.blue} />
                </View>
                <Text style={styles.settingsItemText}>Notifications</Text>
                <Feather name="chevron-right" size={16} color={colors.greyLight} />
              </TouchableOpacity>

              <View style={styles.settingsDivider} />

              <TouchableOpacity style={styles.settingsItem}>
                <View style={styles.settingsIconContainer}>
                  <Feather name="globe" size={16} color={colors.blue} />
                </View>
                <Text style={styles.settingsItemText}>Language</Text>
                <View style={styles.settingsRight}>
                  <Text style={styles.settingsValue}>English</Text>
                  <Feather name="chevron-right" size={16} color={colors.greyLight} />
                </View>
              </TouchableOpacity>

            </View>
          </FadeUpItem>

          {/* Referral code */}
          <FadeUpItem delay={300}>
            <Text style={styles.sectionTitle}>Refer a friend</Text>
            <View style={styles.referralCard}>
              <Text style={styles.referralText}>
                Share Fitopia with your friends and family. Every person you bring to the community makes it stronger.
              </Text>
              <View style={styles.referralCodeRow}>
                <View style={styles.referralCode}>
                  <Text style={styles.referralCodeText}>{userData.referralCode}</Text>
                </View>
                <TouchableOpacity
                  style={[styles.copyButton, codeCopied && styles.copyButtonSuccess]}
                  onPress={copyReferralCode}
                >
                  <Feather
                    name={codeCopied ? 'check' : 'copy'}
                    size={16}
                    color={colors.white}
                  />
                  <Text style={styles.copyButtonText}>
                    {codeCopied ? 'Copied!' : 'Copy'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </FadeUpItem>

          {/* Account section */}
          <FadeUpItem delay={350}>
            <Text style={styles.sectionTitle}>Account</Text>
            <View style={styles.settingsCard}>

              <TouchableOpacity style={styles.settingsItem}>
                <View style={styles.settingsIconContainer}>
                  <Feather name="credit-card" size={16} color={colors.blue} />
                </View>
                <Text style={styles.settingsItemText}>Subscription</Text>
                <Feather name="chevron-right" size={16} color={colors.greyLight} />
              </TouchableOpacity>

              <View style={styles.settingsDivider} />

              <TouchableOpacity style={styles.settingsItem}>
                <View style={styles.settingsIconContainer}>
                  <Feather name="shield" size={16} color={colors.blue} />
                </View>
                <Text style={styles.settingsItemText}>Privacy policy</Text>
                <Feather name="chevron-right" size={16} color={colors.greyLight} />
              </TouchableOpacity>

              <View style={styles.settingsDivider} />

              <TouchableOpacity style={styles.settingsItem}>
                <View style={[styles.settingsIconContainer, { backgroundColor: '#FEE2E2' }]}>
                  <Feather name="log-out" size={16} color="#DC2626" />
                </View>
                <Text style={[styles.settingsItemText, { color: '#DC2626' }]}>Log out</Text>
              </TouchableOpacity>

            </View>
          </FadeUpItem>

          {/* Version */}
          <FadeUpItem delay={400}>
            <Text style={styles.version}>Fitopia v1.0.0</Text>
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

  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.black,
    letterSpacing: -1,
  },

  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.greyCard,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scroll: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 110,
    paddingBottom: 120,
  },

  // Profile card
  profileCard: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 8,
  },

  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.blue,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },

  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
  },

  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },

  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.black,
    letterSpacing: -0.5,
    marginBottom: 6,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },

  userLocation: {
    fontSize: 13,
    color: colors.grey,
    fontWeight: '300',
  },

  joinedDate: {
    fontSize: 12,
    color: colors.greyLight,
    fontWeight: '300',
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.greyBorder,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },

  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },

  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.black,
    letterSpacing: -0.5,
  },

  statLabel: {
    fontSize: 11,
    color: colors.grey,
    fontWeight: '300',
  },

  // Subscription
  subscriptionCard: {
    backgroundColor: colors.blue,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: colors.blue,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },

  subscriptionLeft: {
    flex: 1,
    gap: 4,
  },

  planBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },

  planBadgeText: {
    fontSize: 11,
    color: colors.white,
    fontWeight: '600',
  },

  subscriptionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: -0.3,
  },

  subscriptionSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '300',
    lineHeight: 18,
  },

  upgradeButton: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
    marginLeft: 12,
  },

  upgradeButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.blue,
  },

  // Section title
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.black,
    letterSpacing: -0.5,
    marginBottom: 12,
  },

  // Posts
  postsList: {
    gap: 10,
    marginBottom: 24,
  },

  postCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.greyBorder,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  postCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  postTag: {
    backgroundColor: colors.greyCard,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 100,
  },

  postTagProgress: {
    backgroundColor: colors.blueLight,
  },

  postTagText: {
    fontSize: 10,
    color: colors.grey,
    fontWeight: '500',
  },

  postTagTextProgress: {
    color: colors.blue,
  },

  postTime: {
    fontSize: 11,
    color: colors.greyLight,
  },

  postText: {
    fontSize: 14,
    color: colors.black,
    lineHeight: 20,
    fontWeight: '300',
    marginBottom: 10,
  },

  postStats: {
    flexDirection: 'row',
    gap: 16,
  },

  postStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  postStatText: {
    fontSize: 12,
    color: colors.greyLight,
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 8,
    marginBottom: 24,
  },

  emptyText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.grey,
  },

  emptySub: {
    fontSize: 13,
    color: colors.greyLight,
    fontWeight: '300',
  },

  // Settings
  settingsCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.greyBorder,
    marginBottom: 24,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },

  settingsIconContainer: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.blueLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  settingsItemText: {
    flex: 1,
    fontSize: 15,
    color: colors.black,
    fontWeight: '400',
  },

  settingsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  settingsValue: {
    fontSize: 13,
    color: colors.grey,
  },

  settingsDivider: {
    height: 0.5,
    backgroundColor: colors.greyBorder,
    marginHorizontal: 16,
  },

  // Referral
  referralCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.greyBorder,
    marginBottom: 24,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    gap: 12,
  },

  referralText: {
    fontSize: 13,
    color: colors.grey,
    lineHeight: 20,
    fontWeight: '300',
  },

  referralCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  referralCode: {
    flex: 1,
    backgroundColor: colors.greyCard,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.greyBorder,
    borderStyle: 'dashed',
  },

  referralCodeText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.black,
    letterSpacing: 2,
    textAlign: 'center',
  },

  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.blue,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: colors.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  copyButtonSuccess: {
    backgroundColor: '#059669',
  },

  copyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },

  version: {
    fontSize: 12,
    color: colors.greyLight,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '300',
  },
});