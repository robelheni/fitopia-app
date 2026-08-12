import { useFocusEffect, router } from 'expo-router';
import { useCallback, useState, useRef } from 'react';
import FloatingCoachButton from '../../components/FloatingCoachButton';
import {
  View, Text, Image, ScrollView, StyleSheet, TouchableOpacity,
  Clipboard, Modal, TextInput, KeyboardAvoidingView,
  Platform, ActivityIndicator, Alert, Share, Switch
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { lightColors } from '../../constants/colors';
import BackgroundCircles from '../../components/BackgroundCircles';
import { FadeUpItem } from '../../components/ScreenWrapper';
import { useTabBar } from '../../context/TabBarContext';
import YearHeatmap from '../../components/YearHeatmap';
import { getCurrentUser, getUserProfile, updateProfile, logout, deletePost, reportPost, uploadProfilePicture, togglePostPrivacy, togglePostComments } from '../../services/api';function getInitials(name) {
  if (!name) return '??';
  const parts = name.split(' ');
  if (parts.length === 1) return name.substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function timeAgo(isoString) {
  const now = new Date();
  const date = new Date(isoString);
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}


export default function ProfileScreen() {
  const { isDark, toggleTheme, colors } = useTheme();
  const [contentKey, setContentKey] = useState(0);
  const [codeCopied, setCodeCopied] = useState(false);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(8);
  const { setCollapsed } = useTabBar();
  const lastScrollY = useRef(0);
  const headerOpacity = useSharedValue(1);
  const headerTranslateY = useSharedValue(0);

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profilePicture, setProfilePicture] = useState(null);

  // Edit profile modal
  const [postsTab, setPostsTab] = useState('public');
  const [editVisible, setEditVisible] = useState(false);
  const [editName, setEditName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editBio, setEditBio] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Settings modal
  const [settingsVisible, setSettingsVisible] = useState(false);
  const returningFromLanguage = useRef(false);

  const headerAnimStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }],
  }));

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));
  function handlePostOptions(post) {
    Alert.alert('Post options', null, [
      {
        text: 'Share',
        onPress: async () => {
          try {
            await Share.share({ message: `"${post.text}" — shared from Fitopia` });
          } catch (err) {
            console.log('Share error:', err.message);
          }
        },
      },
      {
        text: post.is_private ? 'Make public' : 'Make private',
        onPress: async () => {
          try {
            const result = await togglePostPrivacy(post.id);
            setProfile(prev => ({
              ...prev,
              posts: prev.posts.map(p =>
                p.id === post.id ? { ...p, is_private: result.is_private } : p
              ),
            }));
          } catch (err) {
            Alert.alert('Error', err.message);
          }
        },
      },
      {
        text: post.comments_disabled ? 'Turn on commenting' : 'Turn off commenting',
        onPress: async () => {
          try {
            const result = await togglePostComments(post.id);
            setProfile(prev => ({
              ...prev,
              posts: prev.posts.map(p =>
                p.id === post.id ? { ...p, comments_disabled: result.comments_disabled } : p
              ),
            }));
          } catch (err) {
            Alert.alert('Error', err.message);
          }
        },
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => Alert.alert(
          'Delete post?',
          'This cannot be undone.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: async () => {
                try {
                  await deletePost(post.id);
                  setProfile(prev => ({
                    ...prev,
                    posts: prev.posts.filter(p => p.id !== post.id),
                    post_count: prev.post_count - 1,
                  }));
                } catch (err) {
                  Alert.alert('Error', err.message);
                }
              },
            },
          ]
        ),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }
  useFocusEffect(
    useCallback(() => {
      if (returningFromLanguage.current) {
        returningFromLanguage.current = false;
        setSettingsVisible(true);
        return;
      }

      setContentKey(prev => prev + 1);
      opacity.value = 0;
      translateY.value = 8;
      requestAnimationFrame(() => {
        opacity.value = withTiming(1, { duration: 300 });
        translateY.value = withTiming(0, { duration: 300 });
      });

      async function fetchProfile() {
        try {
          setLoading(true);
          const userData = await getCurrentUser();
          setUser(userData);
          if (userData.profile_picture) setProfilePicture(userData.profile_picture);
          const profileData = await getUserProfile(userData.id);
          setProfile(profileData);
        } catch (err) {
          console.log('Profile fetch error:', err.message);
        } finally {
          setLoading(false);
        }
      }

      fetchProfile();
    }, [])
  );

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
    Clipboard.setString(user?.referral_code || '');
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  }

  function openEditModal() {
    setEditName(user?.name || '');
    setEditUsername(user?.username || '');
    setEditBio(user?.bio || '');
    setSaveError('');
    setEditVisible(true);
  }

  async function handleAvatarPress() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow access to your photo library.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      try {
        const data = await uploadProfilePicture(result.assets[0].uri);
        setProfilePicture(data.profile_picture);
      } catch (err) {
        Alert.alert('Upload failed', err.message);
      }
    }
  }

  async function handleSave() {
    try {
      setSaving(true);
      setSaveError('');
      const updated = await updateProfile({
        name: editName,
        username: editUsername,
        bio: editBio,
      });
      setUser(updated);
      setEditVisible(false);
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await logout();
    router.replace('/welcome');
  }

  const styles = makeStyles(colors, isDark);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.blue} />
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <BackgroundCircles variant="centered" />

      {/* Fixed header */}
      <Animated.View style={[styles.fixedHeader, headerAnimStyle]}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity
          style={styles.gearButton}
          onPress={() => setSettingsVisible(true)}
        >
          <Feather name="settings" size={18} color={colors.grey} />
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

          {/* Profile card */}
          <FadeUpItem delay={0}>
            <View style={styles.profileCard}>
              <View style={{ position: 'relative', marginBottom: 8 }}>
                <TouchableOpacity onPress={handleAvatarPress} activeOpacity={0.85}>
                  {profilePicture ? (
                    <Image source={{ uri: profilePicture }} style={styles.avatar} />
                  ) : (
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>{getInitials(user?.name)}</Text>
                    </View>
                  )}
                </TouchableOpacity>
                <View style={styles.avatarEditBadge}>
                  <Feather name="camera" size={12} color={colors.white} />
                </View>
              </View>
              <Text style={styles.userName}>{user?.name}</Text>
              {user?.username && (
                <Text style={styles.userUsername}>@{user.username}</Text>
              )}
              {user?.bio ? (
                <Text style={styles.userBio}>{user.bio}</Text>
              ) : (
                <TouchableOpacity onPress={openEditModal}>
                  <Text style={styles.addBio}>+ Add a bio</Text>
                </TouchableOpacity>
              )}
              <Text style={styles.joinedDate}>
                Member since {new Date(user?.created_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
              </Text>

              {/* Edit profile button under bio */}
              <TouchableOpacity style={styles.editProfileButton} onPress={openEditModal}>
                <Feather name="edit-2" size={13} color={colors.blue} />
                <Text style={styles.editProfileButtonText}>Edit profile</Text>
              </TouchableOpacity>
            </View>
          </FadeUpItem>

          {/* Followers / Following / Posts stats */}
          <FadeUpItem delay={100}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{profile?.post_count || 0}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{profile?.follower_count || 0}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{profile?.following_count || 0}</Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
            </View>
          </FadeUpItem>

          {/* Workout activity heatmap */}
          <FadeUpItem delay={120}>
            
            <Text style={styles.sectionTitle}>Activity</Text>
            <YearHeatmap accountCreatedAt={user?.created_at} colors={colors} />
          </FadeUpItem>

          {/* Subscription card */}
          <FadeUpItem delay={150}>
            <View style={styles.subscriptionCard}>
              <View style={styles.subscriptionLeft}>
                <View style={styles.planBadge}>
                  <Text style={styles.planBadgeText}>
                    {user?.is_pro ? 'Pro' : 'Free'}
                  </Text>
                </View>
                <Text style={styles.subscriptionTitle}>
                  {user?.is_pro ? 'Pro Member' : 'Upgrade to Pro'}
                </Text>
                <Text style={styles.subscriptionSub}>
                  {user?.is_pro
                    ? 'You have full access to all features'
                    : 'Unlock AI coaching, full workout library and more'
                  }
                </Text>
              </View>
              {!user?.is_pro && (
                <TouchableOpacity style={styles.upgradeButton}>
                  <Text style={styles.upgradeButtonText}>Upgrade</Text>
                </TouchableOpacity>
              )}
            </View>
          </FadeUpItem>

          {/* My posts */}
          <FadeUpItem delay={200}>
            <View style={styles.postTabsHeader}>
              <Text style={styles.sectionTitle}>My posts</Text>
              <View style={styles.postTabs}>
                <TouchableOpacity
                  style={[styles.postTab, postsTab === 'public' && styles.postTabActive]}
                  onPress={() => setPostsTab('public')}
                >
                  <Feather name="globe" size={13} color={postsTab === 'public' ? colors.blue : colors.greyLight} />
                  <Text style={[styles.postTabText, postsTab === 'public' && styles.postTabTextActive]}>Public</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.postTab, postsTab === 'private' && styles.postTabActive]}
                  onPress={() => setPostsTab('private')}
                >
                  <Feather name="lock" size={13} color={postsTab === 'private' ? colors.blue : colors.greyLight} />
                  <Text style={[styles.postTabText, postsTab === 'private' && styles.postTabTextActive]}>Private</Text>
                </TouchableOpacity>
              </View>
            </View>

            {(() => {
              const filtered = (profile?.posts || []).filter(p =>
                postsTab === 'private' ? p.is_private : !p.is_private
              );
              if (filtered.length === 0) {
                return (
                  <View style={styles.emptyState}>
                    <Feather
                      name={postsTab === 'private' ? 'lock' : 'edit-2'}
                      size={32}
                      color={colors.greyLight}
                    />
                    <Text style={styles.emptyText}>
                      {postsTab === 'private' ? 'No private posts' : 'No posts yet'}
                    </Text>
                    <Text style={styles.emptySub}>
                      {postsTab === 'private'
                        ? 'Posts you make private will appear here'
                        : 'Share your progress with the community'}
                    </Text>
                  </View>
                );
              }
              return (
                <View style={styles.postsList}>
                  {filtered.map(post => (
                    <View key={post.id} style={styles.postCard}>
                      <View style={styles.postCardHeader}>
                        <View style={[
                          styles.postTag,
                          post.tag === 'progress' && styles.postTagProgress,
                          post.tag === 'questions' && styles.postTagQuestion,
                          post.tag === 'challenges' && styles.postTagChallenge,
                        ]}>
                          <Text style={[
                            styles.postTagText,
                            post.tag === 'progress' && styles.postTagTextProgress,
                          ]}>
                            {post.tag}
                          </Text>
                        </View>
                        <Text style={styles.postTime}>{timeAgo(post.created_at)}</Text>
                        <TouchableOpacity
                          style={styles.postOptionsButton}
                          onPress={() => handlePostOptions(post)}
                        >
                          <Feather name="more-horizontal" size={18} color={colors.greyLight} />
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.postText}>{post.text}</Text>
                      {post.image_url && (
                        <Image
                          source={{ uri: post.image_url }}
                          style={styles.postImage}
                          resizeMode="cover"
                        />
                      )}
                      <View style={styles.postStats}>
                        <View style={styles.postStat}>
                          <Feather name="heart" size={13} color={colors.greyLight} />
                          <Text style={styles.postStatText}>{post.like_count}</Text>
                        </View>
                        <View style={styles.postStat}>
                          <Feather name="message-circle" size={13} color={colors.greyLight} />
                          <Text style={styles.postStatText}>{post.comment_count}</Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              );
            })()}
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
                  <Text style={styles.referralCodeText}>{user?.referral_code}</Text>
                </View>
                <TouchableOpacity
                  style={[styles.copyButton, codeCopied && styles.copyButtonSuccess]}
                  onPress={copyReferralCode}
                >
                  <Feather name={codeCopied ? 'check' : 'copy'} size={16} color={colors.white} />
                  <Text style={styles.copyButtonText}>{codeCopied ? 'Copied!' : 'Copy'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </FadeUpItem>

          <FadeUpItem delay={400}>
            <Text style={styles.version}>Fitopia v1.0.0</Text>
          </FadeUpItem>

        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={editVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setEditVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalHandle} />
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setEditVisible(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={handleSave} disabled={saving}>
              <Text style={[styles.modalSave, saving && { opacity: 0.5 }]}>
                {saving ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalContent}>
            {saveError ? (
              <View style={styles.errorBanner}>
                <Feather name="alert-circle" size={14} color="#DC2626" />
                <Text style={styles.errorBannerText}>{saveError}</Text>
              </View>
            ) : null}

            <Text style={styles.fieldLabel}>Name</Text>
            <TextInput
              style={styles.fieldInput}
              value={editName}
              onChangeText={setEditName}
              placeholder="Your full name"
              placeholderTextColor={colors.greyLight}
              autoCapitalize="words"
            />

            <Text style={styles.fieldLabel}>Username</Text>
            <View style={styles.usernameRow}>
              <Text style={styles.usernameAt}>@</Text>
              <TextInput
                style={styles.usernameInput}
                value={editUsername}
                onChangeText={t => setEditUsername(t.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                placeholder="username"
                placeholderTextColor={colors.greyLight}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <Text style={styles.fieldLabel}>Bio</Text>
            <TextInput
              style={[styles.fieldInput, styles.bioInput]}
              value={editBio}
              onChangeText={setEditBio}
              placeholder="Tell the community about yourself..."
              placeholderTextColor={colors.greyLight}
              multiline
              maxLength={200}
            />
            <Text style={styles.charCount}>{editBio.length}/200</Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

      {/* Settings Modal */}
      <Modal
        visible={settingsVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSettingsVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHandle} />
          <View style={styles.modalHeader}>
            <View style={{ width: 60 }} />
            <Text style={styles.modalTitle}>Settings</Text>
            <TouchableOpacity onPress={() => setSettingsVisible(false)}>
              <Text style={styles.modalCancel}>Done</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalContent}>

            <Text style={styles.fieldLabel}>Account</Text>
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
                  <Feather name="bell" size={16} color={colors.blue} />
                </View>
                <Text style={styles.settingsItemText}>Notifications</Text>
                <Feather name="chevron-right" size={16} color={colors.greyLight} />
              </TouchableOpacity>

              <View style={styles.settingsDivider} />

              <View style={styles.settingsItem}>
                <View style={styles.settingsIconContainer}>
                  <Feather name={isDark ? 'moon' : 'sun'} size={16} color={colors.blue} />
                </View>
                <Text style={styles.settingsItemText}>Dark mode</Text>
                <Switch
                  value={isDark}
                  onValueChange={toggleTheme}
                  trackColor={{ false: colors.greyBorder, true: colors.blue }}
                  thumbColor={colors.white}
                />
              </View>

              <View style={styles.settingsDivider} />

              <TouchableOpacity
                style={styles.settingsItem}
                onPress={() => {
                  setSettingsVisible(false);
                  returningFromLanguage.current = true;
                  setTimeout(() => router.push('/language?context=settings'), 300);
                }}
              >
                <View style={styles.settingsIconContainer}>
                  <Feather name="globe" size={16} color={colors.blue} />
                </View>
                <Text style={styles.settingsItemText}>Language</Text>
                <View style={styles.settingsRight}>
                  <Text style={styles.settingsValue}>English</Text>
                  <Feather name="chevron-right" size={16} color={colors.greyLight} />
                </View>
              </TouchableOpacity>

              <View style={styles.settingsDivider} />

              <TouchableOpacity
                style={styles.settingsItem}
                onPress={() => {
                  setSettingsVisible(false);
                  setTimeout(handleLogout, 300);
                }}
              >
                <View style={[styles.settingsIconContainer, { backgroundColor: '#FEE2E2' }]}>
                  <Feather name="log-out" size={16} color="#DC2626" />
                </View>
                <Text style={[styles.settingsItemText, { color: '#DC2626' }]}>Log out</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </View>
      </Modal>

      <FloatingCoachButton />
    </Animated.View>
  );
}

function makeStyles(c, dark) { const colors = c || lightColors; const isDark = dark || false; return StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 110, paddingBottom: 120 },

  fixedHeader: {
    position: 'absolute', top: 0, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingTop: 52, paddingBottom: 16,
    zIndex: 10, backgroundColor: isDark ? 'rgba(15,15,15,0.95)' : 'rgba(255,255,255,0.95)',
    borderBottomWidth: 0.5, borderBottomColor: colors.greyBorder,
  },

  headerTitle: { fontSize: 28, fontWeight: '700', color: colors.black, letterSpacing: -1 },

  gearButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.greyCard,
    alignItems: 'center', justifyContent: 'center',
  },

  profileCard: { alignItems: 'center', marginBottom: 24, paddingVertical: 8, gap: 6 },

  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: colors.blue,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.blue,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },

  avatarEditBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },

  avatarText: { fontSize: 28, fontWeight: '700', color: colors.white },
  userName: { fontSize: 24, fontWeight: '700', color: colors.black, letterSpacing: -0.5 },
  userUsername: { fontSize: 14, color: colors.grey, fontWeight: '300' },

  userBio: {
    fontSize: 14, color: colors.grey, fontWeight: '300',
    textAlign: 'center', lineHeight: 20, paddingHorizontal: 24,
  },

  addBio: { fontSize: 14, color: colors.blue, fontWeight: '500' },
  joinedDate: { fontSize: 12, color: colors.greyLight, fontWeight: '300' },

  editProfileButton: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 100, borderWidth: 1.5, borderColor: colors.blue, marginTop: 4,
  },

  editProfileButtonText: { fontSize: 13, fontWeight: '600', color: colors.blue },

  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.white, borderRadius: 20, padding: 20, marginBottom: 16,
    borderWidth: 1, borderColor: colors.greyBorder,
    shadowColor: colors.black, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06, shadowRadius: 12, elevation: 3,
  },

  statItem: { flex: 1, alignItems: 'center', gap: 6 },
  statValue: { fontSize: 24, fontWeight: '700', color: colors.black, letterSpacing: -0.5 },
  statLabel: { fontSize: 11, color: colors.grey, fontWeight: '300' },
  statDivider: { width: 0.5, backgroundColor: colors.greyBorder },

  subscriptionCard: {
    backgroundColor: colors.blue, borderRadius: 20, padding: 20,
    flexDirection: 'row', alignItems: 'center', marginBottom: 24,
    shadowColor: colors.blue, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },

  subscriptionLeft: { flex: 1, gap: 4 },

  planBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10,
    paddingVertical: 4, borderRadius: 100, alignSelf: 'flex-start', marginBottom: 4,
  },

  planBadgeText: { fontSize: 11, color: '#FFFFFF', fontWeight: '600' },
  subscriptionTitle: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', letterSpacing: -0.3 },
  subscriptionSub: { fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: '300', lineHeight: 18 },

  upgradeButton: {
    backgroundColor: '#FFFFFF', paddingHorizontal: 16,
    paddingVertical: 10, borderRadius: 100, marginLeft: 12,
  },

  upgradeButtonText: { fontSize: 13, fontWeight: '600', color: colors.blue },

  sectionTitle: {
    fontSize: 18, fontWeight: '700', color: colors.black,
    letterSpacing: -0.5, marginBottom: 12,
  },

  postTabsHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 12,
  },
  postTabs: {
    flexDirection: 'row', gap: 6,
  },
  postTab: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 100, borderWidth: 1.5, borderColor: colors.greyBorder,
  },
  postTabActive: {
    borderColor: colors.blue, backgroundColor: colors.blueLight,
  },
  postTabText: { fontSize: 12, fontWeight: '500', color: colors.greyLight },
  postTabTextActive: { color: colors.blue },

  postsList: { gap: 10, marginBottom: 24 },

  postCard: {
    backgroundColor: colors.white, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: colors.greyBorder,
    shadowColor: colors.black, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },

  postCardHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 8,
  },

  postTag: { backgroundColor: colors.greyCard, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 100 },
  postTagProgress: { backgroundColor: colors.blueLight },
  postTagQuestion: { backgroundColor: isDark ? '#3B0764' : '#EDE9FE' },
  postTagChallenge: { backgroundColor: isDark ? '#052E16' : '#D1FAE5' },
  postTagText: { fontSize: 10, color: isDark ? colors.black : colors.grey, fontWeight: '500' },
  postTagTextProgress: { color: colors.blue },
  postTime: { fontSize: 11, color: colors.greyLight },
  postText: { fontSize: 14, color: colors.black, lineHeight: 20, fontWeight: '300', marginBottom: 10 },
  postImage: { width: '100%', aspectRatio: 1, borderRadius: 12, marginBottom: 10, marginTop: -4 },
  postStats: { flexDirection: 'row', gap: 16 },
  postStat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  postStatText: { fontSize: 12, color: colors.greyLight },

  emptyState: { alignItems: 'center', paddingVertical: 32, gap: 8, marginBottom: 24 },
  emptyText: { fontSize: 15, fontWeight: '600', color: colors.grey },
  emptySub: { fontSize: 13, color: colors.greyLight, fontWeight: '300' },

  settingsCard: {
    backgroundColor: colors.white, borderRadius: 16,
    borderWidth: 1, borderColor: colors.greyBorder, marginBottom: 24,
    shadowColor: colors.black, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },

  settingsItem: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },

  settingsIconContainer: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: colors.blueLight, alignItems: 'center', justifyContent: 'center',
  },

  settingsItemText: { flex: 1, fontSize: 15, color: colors.black, fontWeight: '400' },
  settingsRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  settingsValue: { fontSize: 13, color: colors.grey },
  settingsDivider: { height: 0.5, backgroundColor: colors.greyBorder, marginHorizontal: 16 },

  referralCard: {
    backgroundColor: colors.white, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: colors.greyBorder, marginBottom: 24,
    shadowColor: colors.black, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2, gap: 12,
  },

  referralText: { fontSize: 13, color: colors.grey, lineHeight: 20, fontWeight: '300' },
  referralCodeRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },

  referralCode: {
    flex: 1, backgroundColor: colors.greyCard, borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: colors.greyBorder, borderStyle: 'dashed',
  },

  referralCodeText: { fontSize: 18, fontWeight: '700', color: colors.black, letterSpacing: 2, textAlign: 'center' },

  copyButton: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.blue, paddingHorizontal: 16, paddingVertical: 12,
    borderRadius: 12, shadowColor: colors.blue, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },

  copyButtonSuccess: { backgroundColor: '#059669' },
  copyButtonText: { fontSize: 14, fontWeight: '600', color: colors.white },
  version: { fontSize: 12, color: colors.greyLight, textAlign: 'center', marginBottom: 20, fontWeight: '300' },

  modalContainer: { flex: 1, backgroundColor: colors.white, paddingTop: 12 },
  modalHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: colors.greyBorder, alignSelf: 'center', marginBottom: 8 },

  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingVertical: 16,
    borderBottomWidth: 0.5, borderBottomColor: colors.greyBorder,
  },

  modalCancel: { fontSize: 16, color: colors.grey },
  modalTitle: { fontSize: 17, fontWeight: '600', color: colors.black },
  modalSave: { fontSize: 16, fontWeight: '600', color: colors.blue },
  modalContent: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 60 },

  errorBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#FEE2E2', borderRadius: 12, padding: 12, marginBottom: 16,
  },

  errorBannerText: { fontSize: 13, color: '#DC2626', flex: 1 },

  fieldLabel: { fontSize: 13, fontWeight: '600', color: colors.grey, marginBottom: 8, marginTop: 16 },

  fieldInput: {
    borderWidth: 1.5, borderColor: colors.greyBorder, borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: colors.black,
  },

  bioInput: { minHeight: 100, textAlignVertical: 'top' },
  charCount: { fontSize: 11, color: colors.greyLight, textAlign: 'right', marginTop: 4 },

  usernameRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: colors.greyBorder,
    borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14,
  },

  usernameAt: { fontSize: 15, color: colors.blue, fontWeight: '600', marginRight: 4 },
  usernameInput: { flex: 1, fontSize: 15, color: colors.black },
  postOptionsButton: {
    marginLeft: 8,
    padding: 4,
  },
}); }