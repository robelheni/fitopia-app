import { useFocusEffect } from 'expo-router';
import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import BackgroundCircles from '../../components/BackgroundCircles';
import FloatingCoachButton from '../../components/FloatingCoachButton';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { lightColors } from '../../constants/colors';
import { getTabTranslation } from '../../constants/tabTranslations';
import { FadeUpItem } from '../../components/ScreenWrapper';
import { useTabBar } from '../../context/TabBarContext';
import { useCallback, useRef } from 'react';
import { router } from 'expo-router';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getNutrition, getWeeklyMeals, getStreak, getWorkoutPlan, getCommunityPosts, getCurrentUser } from '../../services/api';

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const refreshRef = useRef(null);
  const { setCollapsed } = useTabBar();
  const [trainingDays, setTrainingDays] = useState([]);
  const lastScrollY = useRef(0);
  const [userName, setUserName] = useState('');
  const [streak, setStreak] = useState(0);
  const [completedDays, setCompletedDays] = useState([]);
  const [todaySession, setTodaySession] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [accountCreatedAt, setAccountCreatedAt] = useState(null);

  const theme = useTheme();
  const { language } = useLanguage();
  const t = getTabTranslation(language);
  const isDark = theme ? theme.isDark : false;
  const colors = theme ? theme.colors : lightColors;

  const [nutritionTargets, setNutritionTargets] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    goal: '',
    explanation: 'Loading your personalised plan...',
  });
  const [todaysMeals, setTodaysMeals] = useState([]);

  useFocusEffect(
    useCallback(() => {
      async function fetchPlan() {
        try {
          const nutritionData = await getNutrition();
          const _todayIndex = new Date().getDay();
          const _reorderedIndex = _todayIndex === 0 ? 6 : _todayIndex - 1;
          const _dayKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
          const _todayKey = _dayKeys[_reorderedIndex];
          const userData = await getCurrentUser();
          setAccountCreatedAt(userData.created_at);

          const posts = await getCommunityPosts();
          setRecentPosts(posts.slice(0, 2));

          const plan = await getWorkoutPlan();
          if (plan && plan[_todayKey]) {
            setTodaySession(plan[_todayKey]);
          }

          setUserName(nutritionData.user.name);
          const rawDays = nutritionData.user.training_days;
          const days = Array.isArray(rawDays)
            ? rawDays.map(d => String(d).trim().toLowerCase())
            : (rawDays ? rawDays.split(',').map(d => d.trim().toLowerCase()) : ['mon', 'wed', 'fri']);
          setTrainingDays(days);

          const streakData = await getStreak();
          setStreak(streakData.streak);
          setCompletedDays(streakData.completed_days || []);

          setNutritionTargets({
            calories: nutritionData.nutrition.calories,
            protein: nutritionData.nutrition.protein,
            carbs: nutritionData.nutrition.carbs,
            fats: nutritionData.nutrition.fats,
            goal: nutritionData.user.goal,
            explanation: nutritionData.nutrition.explanation,
          });

          const cached = await AsyncStorage.getItem('todays_meals');
          if (cached) {
            setTodaysMeals(JSON.parse(cached));
          } else {
            const weeklyData = await getWeeklyMeals();
            const dayMap = { 0:'mon', 1:'tue', 2:'wed', 3:'thu', 4:'fri', 5:'sat', 6:'sun' };
            const todayKey = dayMap[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
            const todayMeals = weeklyData.week[todayKey];
            await AsyncStorage.setItem('todays_meals', JSON.stringify(todayMeals));
            setTodaysMeals(todayMeals);
          }
        } catch (error) {
          console.log('Home fetch error:', error.message);
        }
      }

      refreshRef.current = fetchPlan;
      fetchPlan();
    }, [])
  );

  async function onRefresh() {
    setRefreshing(true);
    try {
      if (refreshRef.current) await refreshRef.current();
    } finally {
      setRefreshing(false);
    }
  }

  function getMealTime(mealType) {
    switch (mealType) {
      case 'breakfast': return '7:00 - 9:00 AM';
      case 'lunch': return '12:00 - 2:00 PM';
      case 'snack': return '3:00 - 5:00 PM';
      case 'dinner': return '6:00 - 8:00 PM';
      default: return '';
    }
  }


  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return t.goodMorning;
    if (hour < 17) return t.goodAfternoon;
    return t.goodEvening;
  }

  const headerOpacity = useSharedValue(1);
  const headerTranslateY = useSharedValue(0);

  const headerAnimStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }],
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

  const DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  const DAY_NAMES = [t.monday, t.tuesday, t.wednesday, t.thursday, t.friday, t.saturday, t.sunday];
  const todayIndex = new Date().getDay();
  const reorderedIndex = todayIndex === 0 ? 6 : todayIndex - 1;
  const todayKey = DAY_KEYS[reorderedIndex];
  const isTrainingDay = trainingDays.includes(todayKey);

  // This is the key flag that drives the whole new card design —
  // true only when the streak data confirms a real workout was logged today
  const isCompletedToday = completedDays.includes(todayKey);

  const nextTrainingDay = (() => {
    for (let i = 1; i <= 7; i++) {
      const nextIndex = (reorderedIndex + i) % 7;
      if (trainingDays.includes(DAY_KEYS[nextIndex])) {
        return DAY_NAMES[nextIndex];
      }
    }
    return t.soon;
  })();

  const styles = makeStyles(colors, isDark);

  return (
    <View style={styles.container}>
      <BackgroundCircles variant="default" />

      <Animated.View style={[styles.fixedHeader, headerAnimStyle]}>
        <View>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.name}>{userName ? `${t.welcomeBack}, ${userName.split(' ')[0]}` : t.welcomeBack}</Text>
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

          <FadeUpItem delay={200}>
          <TouchableOpacity style={styles.streakCard} onPress={() => router.push('/consistency')} activeOpacity={0.9}>
              <View style={styles.streakLeft}>
                <Text style={styles.streakNumber}>{streak}</Text>
                <Text style={styles.streakLabel}>{t.dayStreak}</Text>
              </View>
              <View style={styles.streakDivider} />
              <View style={styles.streakRight}>
                <Text style={styles.streakWeekLabel}>{t.thisWeek}</Text>
                <View style={styles.streakDots}>
                {DAY_KEYS.map((day, index) => {
                  const isTrainingDayDot = trainingDays.includes(day);
                  const isCompleted = completedDays.includes(day);
                  const isToday = day === todayKey;
                  const isPast = index < DAY_KEYS.indexOf(todayKey);

                  // Figure out the actual calendar date for this dot —
                  // we need this to compare against accountCreatedAt
                  const todayDate = new Date();
                  const dayOffset = index - reorderedIndex;
                  const dotDate = new Date(todayDate);
                  dotDate.setDate(todayDate.getDate() + dayOffset);
                  dotDate.setHours(0, 0, 0, 0);

                  const isBeforeAccount = accountCreatedAt && dotDate < new Date(new Date(accountCreatedAt).setHours(0, 0, 0, 0));

                  let dotStyle = styles.streakDotRest;
                  if (isBeforeAccount) dotStyle = styles.streakDotRest; // always neutral, never red
                  else if (isCompleted) dotStyle = styles.streakDotCompleted;
                  else if (isToday && isTrainingDayDot && !isCompleted) dotStyle = styles.streakDotActive;
                  else if (isPast && isTrainingDayDot && !isCompleted) dotStyle = styles.streakDotMissed;
                  else if (isTrainingDayDot) dotStyle = styles.streakDotPending;
                  
                    const labels = [t.mon, t.tue, t.wed, t.thu, t.fri, t.sat, t.sun];

                    return (
                      <View key={index} style={styles.streakDayContainer}>
                        <View style={[styles.streakDot, dotStyle, isToday && styles.streakDotToday]} />
                        <Text style={styles.streakDayLabel}>{labels[index]}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </TouchableOpacity>
          </FadeUpItem>

          <FadeUpItem delay={300}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t.todaysWorkout}</Text>
              <TouchableOpacity onPress={() => router.navigate('/(tabs)/workouts')}>
                <Text style={styles.sectionLink}>{t.seeAll}</Text>
              </TouchableOpacity>
            </View>

            {isTrainingDay ? (
              // Training day: completed or not-yet-started
              <TouchableOpacity
                style={[styles.workoutCard, isCompletedToday && styles.workoutCardCompleted]}
                activeOpacity={0.85}
                onPress={() => {
                  if (todaySession) {
                    router.push({
                      pathname: '/workout/[id]',
                      params: {
                        id: todayKey,
                        sessionData: JSON.stringify(todaySession),
                        workoutName: todaySession?.session_type || "Today's Workout",
                      }
                    });
                  } else {
                    router.navigate('/(tabs)/workouts');
                  }
                }}
              >
                {isCompletedToday ? (
                  // ── COMPLETED STATE ──────────────────────────────
                  <>
                    <View style={styles.completedTopRow}>
                      <View style={styles.completedIconCircle}>
                        <Feather name="check" size={20} color={'#FFFFFF'} />
                      </View>
                      <View style={styles.completedTextBlock}>
                        <Text style={styles.completedTitle}>{t.workoutComplete}</Text>
                        <Text style={styles.completedSubtitle}>
                          {todaySession?.session_type || t.todaysSession} · {todaySession?.exercises?.length || 0} {t.exercises}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.completedMessage}>
                      {t.completedMessage}
                    </Text>
                    <View style={styles.viewWorkoutButton}>
                      <Text style={styles.viewWorkoutText}>{t.viewWorkout}</Text>
                      <Feather name="arrow-right" size={14} color="#059669" />
                    </View>
                  </>
                ) : (
                  // ── NOT STARTED STATE ────────────────────────────
                  <View style={styles.workoutFooter}>
                    <View style={styles.workoutStat}>
                      <Feather name="clock" size={12} color={colors.grey} />
                      <Text style={styles.workoutStatText}>
                        {todaySession ? `${todaySession.exercises?.length || 0} ${t.exercises}` : t.loading}
                      </Text>
                    </View>
                    <View style={styles.workoutStat}>
                      <Feather name="activity" size={12} color={colors.grey} />
                      <Text style={styles.workoutStatText}>
                        {todaySession?.session_type || t.yourWorkout}
                      </Text>
                    </View>
                    <View style={styles.startButton}>
                      <Text style={styles.startButtonText}>{t.startWorkout}</Text>
                      <Feather name="arrow-right" size={14} color={'#FFFFFF'} />
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            ) : (
              // ── REST DAY (not a training day, nothing completed) ─────────
              <View style={styles.restDayCard}>
                <View style={styles.restDayIcon}>
                  <Feather name="moon" size={24} color={colors.blue} />
                </View>
                <View style={styles.restDayContent}>
                  <Text style={styles.restDayTitle}>{t.restDay}</Text>
                  <Text style={styles.restDaySub}>
                    {t.recoveryMessage} {nextTrainingDay}.
                  </Text>
                </View>
              </View>
            )}
          </FadeUpItem>

          <FadeUpItem delay={400}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t.nutritionMeals}</Text>
              <TouchableOpacity onPress={() => router.push('/nutrition/details')}>
                <Text style={styles.sectionLink}>{t.details}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.nutritionCard}>
              <View style={styles.nutritionExplanation}>
                <Feather name="info" size={14} color={colors.blue} />
                <Text style={styles.nutritionExplanationText}>
                  {nutritionTargets.explanation}
                </Text>
              </View>
              <View style={styles.nutritionGrid}>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{nutritionTargets.calories}</Text>
                  <Text style={styles.nutritionLabel}>{t.calories}</Text>
                  <View style={[styles.nutritionBar, { backgroundColor: '#FEF3C7' }]}>
                    <View style={[styles.nutritionBarFill, { backgroundColor: '#D97706', width: '60%' }]} />
                  </View>
                </View>
                <View style={styles.nutritionDivider} />
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{nutritionTargets.protein}g</Text>
                  <Text style={styles.nutritionLabel}>{t.protein}</Text>
                  <View style={[styles.nutritionBar, { backgroundColor: colors.blueLight }]}>
                    <View style={[styles.nutritionBarFill, { backgroundColor: colors.blue, width: '40%' }]} />
                  </View>
                </View>
                <View style={styles.nutritionDivider} />
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{nutritionTargets.carbs}g</Text>
                  <Text style={styles.nutritionLabel}>{t.carbs}</Text>
                  <View style={[styles.nutritionBar, { backgroundColor: '#D1FAE5' }]}>
                    <View style={[styles.nutritionBarFill, { backgroundColor: '#059669', width: '70%' }]} />
                  </View>
                </View>
                <View style={styles.nutritionDivider} />
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{nutritionTargets.fats}g</Text>
                  <Text style={styles.nutritionLabel}>{t.fats}</Text>
                  <View style={[styles.nutritionBar, { backgroundColor: '#FEE2E2' }]}>
                    <View style={[styles.nutritionBarFill, { backgroundColor: '#DC2626', width: '30%' }]} />
                  </View>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.mealPlanCard}
              onPress={() => router.push({
                pathname: '/meals/weekly',
                params: { startDay: todayKey }
              })}
              activeOpacity={0.85}
            >
              <View style={styles.mealPlanIcon}>
                <MaterialCommunityIcons name="noodles" size={20} color={colors.blue} />
              </View>
              <View style={styles.mealPlanText}>
                <Text style={styles.mealPlanTitle}>{t.mealPlan}</Text>
                <Text style={styles.mealPlanSub}>{t.todaysMeals}</Text>
              </View>
              <View style={styles.mealPlanArrow}>
                <Feather name="arrow-right" size={16} color={colors.blue} />
              </View>
            </TouchableOpacity>
          </FadeUpItem>

          <FadeUpItem delay={500}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t.community}</Text>
              <TouchableOpacity onPress={() => router.navigate('/(tabs)/community')}>
                <Text style={styles.sectionLink}>{t.seeAll}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.communityCard}>
              {recentPosts.length === 0 ? (
                <View style={styles.communityEmpty}>
                  <Text style={styles.communityEmptyText}>{t.noPosts}</Text>
                </View>
              ) : (
                recentPosts.map((post, index) => (
                  <View key={post.id}>
                    <View style={styles.communityPost}>
                      <View style={[styles.communityAvatar, {
                        backgroundColor: post.gender === 'female' ? '#EDE9FE' : post.gender === 'male' ? colors.blueLight : colors.greyCard
                      }]}>
                        <Text style={[styles.communityAvatarText, {
                          color: post.gender === 'female' ? '#7C3AED' : post.gender === 'male' ? colors.blue : colors.grey
                        }]}>
                          {post.name ? post.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '??'}
                        </Text>
                      </View>
                      <View style={styles.communityPostContent}>
                        <Text style={styles.communityPostName}>{post.name}</Text>
                        <Text style={styles.communityPostText} numberOfLines={2}>{post.text}</Text>
                      </View>
                    </View>
                    {index < recentPosts.length - 1 && (
                      <View style={styles.communityDivider} />
                    )}
                  </View>
                ))
              )}
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
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { flex: 1, marginTop: 120 },
  content: { paddingHorizontal: 24, paddingTop: 0, paddingBottom: 120 },
  greeting: { fontSize: 14, color: colors.grey, fontWeight: '300', marginBottom: 4 },
  name: { fontSize: 24, fontWeight: '700', color: colors.black, letterSpacing: -0.5 },
  fixedHeader: {
    position: 'absolute', top: 0, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingTop: 52, paddingBottom: 16,
    zIndex: 10, backgroundColor: isDark ? 'rgba(15,15,15,0.95)' : 'rgba(255,255,255,0.95)',
    borderBottomWidth: 0.5, borderBottomColor: colors.greyBorder,
  },
  streakCard: {
    backgroundColor: colors.blue, borderRadius: 20, padding: 20,
    flexDirection: 'row', alignItems: 'center', marginBottom: 20,
    shadowColor: colors.blue, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8,
  },
  streakLeft: { alignItems: 'center', paddingRight: 20 },
  streakNumber: { fontSize: 48, fontWeight: '700', color: '#FFFFFF', letterSpacing: -2, lineHeight: 52 },
  streakLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: '400' },
  streakDivider: { width: 0.5, height: 60, backgroundColor: 'rgba(255,255,255,0.3)', marginRight: 20 },
  streakRight: { flex: 1 },
  streakWeekLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 10, fontWeight: '400' },
  streakDots: { flexDirection: 'row', justifyContent: 'space-between' },
  streakDayContainer: { alignItems: 'center', gap: 4 },
  streakDot: { width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.2)' },
  streakDotCompleted: { backgroundColor: '#22C55E' },
  streakDotActive: { backgroundColor: '#FFFFFF' },
  streakDotPending: { backgroundColor: '#EAB308' },
  streakDotRest: { backgroundColor: 'rgba(255,255,255,0.2)' },
  streakDotMissed: { backgroundColor: '#EF4444' },
  streakDotToday: { borderWidth: 2.5, borderColor: '#FFFFFF' },
  streakDayLabel: { fontSize: 10, color: 'rgba(255,255,255,0.6)', fontWeight: '500' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.black, letterSpacing: -0.5 },
  sectionLink: { fontSize: 14, color: colors.blueText, fontWeight: '500' },

  workoutCard: {
    backgroundColor: colors.white, borderRadius: 20, padding: 20, marginBottom: 20,
    borderWidth: 1, borderColor: colors.greyBorder,
    shadowColor: colors.black, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3,
  },

  // Completed state swaps the card to a soft green theme —
  // visually distinct at a glance from the "not started" white card
  workoutCardCompleted: {
    backgroundColor: isDark ? '#022C22' : '#F0FDF4',
    borderColor: isDark ? '#064E3B' : '#BBF7D0',
  },

  workoutFooter: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  workoutStat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  workoutStatText: { fontSize: 12, color: colors.grey },
  startButton: {
    marginLeft: 'auto', backgroundColor: colors.blue, paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 100, flexDirection: 'row', alignItems: 'center', gap: 6,
    shadowColor: colors.blue, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  startButtonText: { fontSize: 13, color: '#FFFFFF', fontWeight: '600' },

  // ── Completed card internals ──────────────────────────────
  completedTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  completedIconCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#22C55E',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  completedTextBlock: { flex: 1 },
  completedTitle: {
    fontSize: 17, fontWeight: '700', color: isDark ? '#4ADE80' : '#166534', letterSpacing: -0.3,
  },
  completedSubtitle: {
    fontSize: 12, color: isDark ? '#86EFAC' : '#15803D', fontWeight: '400', marginTop: 2,
  },
  completedMessage: {
    fontSize: 13, color: isDark ? '#4ADE80' : '#166534', fontWeight: '300', lineHeight: 19, marginBottom: 16,
  },
  viewWorkoutButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#DCFCE7',
    paddingVertical: 10,
    borderRadius: 100,
  },
  viewWorkoutText: {
    fontSize: 13, fontWeight: '600', color: isDark ? '#4ADE80' : '#059669',
  },

  restDayCard: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    backgroundColor: colors.blueLight, borderRadius: 20, padding: 20, marginBottom: 20,
    borderWidth: 1, borderColor: 'rgba(37,99,235,0.15)',
  },
  restDayIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  restDayTitle: { fontSize: 18, fontWeight: '700', color: colors.black, letterSpacing: -0.3, marginBottom: 4 },
  restDaySub: { fontSize: 13, color: colors.grey, lineHeight: 18, fontWeight: '300' },
  restDayContent: { flex: 1 },

  nutritionCard: {
    backgroundColor: colors.white, borderRadius: 20, padding: 20, marginBottom: 20,
    borderWidth: 1, borderColor: colors.greyBorder,
    shadowColor: colors.black, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3, gap: 16,
  },
  nutritionExplanation: { flexDirection: 'row', gap: 8, alignItems: 'flex-start', backgroundColor: colors.blueLight, padding: 12, borderRadius: 12 },
  nutritionExplanationText: { fontSize: 13, color: colors.blueText, lineHeight: 18, flex: 1, fontWeight: '300' },
  nutritionGrid: { flexDirection: 'row', alignItems: 'center' },
  nutritionItem: { flex: 1, alignItems: 'center', gap: 4 },
  nutritionValue: { fontSize: 20, fontWeight: '700', color: colors.black, letterSpacing: -0.5 },
  nutritionLabel: { fontSize: 11, color: colors.grey, fontWeight: '300', marginBottom: 4 },
  nutritionBar: { width: '80%', height: 4, borderRadius: 2, overflow: 'hidden' },
  nutritionBarFill: { height: 4, borderRadius: 2 },
  nutritionDivider: { width: 0.5, height: 50, backgroundColor: colors.greyBorder },

  communityCard: {
    backgroundColor: colors.white, borderRadius: 20, padding: 20,
    borderWidth: 1, borderColor: colors.greyBorder,
    shadowColor: colors.black, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3,
  },
  communityPost: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 4,
  },
  communityAvatar: {
    width: 42, height: 42, borderRadius: 21,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  communityAvatarText: { fontSize: 13, fontWeight: '600' },
  communityPostContent: { flex: 1 },
  communityPostName: { fontSize: 13, fontWeight: '600', color: colors.black, marginBottom: 2 },
  communityPostText: {
    fontSize: 13, color: colors.grey, fontWeight: '300',
    lineHeight: 20, marginTop: 2,
  },
  communityDivider: { height: 0.5, backgroundColor: colors.greyBorder, marginVertical: 14 },

  mealPlanCard: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    backgroundColor: colors.white, borderRadius: 20, padding: 20, marginBottom: 20,
    borderWidth: 1, borderColor: colors.greyBorder,
    shadowColor: colors.black, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3,
  },
  mealPlanIcon: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: colors.blueLight, alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  mealPlanText: { flex: 1 },
  mealPlanTitle: { fontSize: 15, fontWeight: '600', color: colors.black },
  mealPlanSub: { fontSize: 13, color: colors.grey, fontWeight: '300', marginTop: 2 },
  mealPlanArrow: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: colors.blueLight, alignItems: 'center', justifyContent: 'center',
  },

  communityEmpty: { paddingVertical: 20, alignItems: 'center' },
  communityEmptyText: { fontSize: 13, color: colors.greyLight, fontWeight: '300' },
}); }
