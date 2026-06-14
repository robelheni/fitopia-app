import { useFocusEffect } from 'expo-router';
import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import BackgroundCircles from '../../components/BackgroundCircles';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../../constants/colors';
import { FadeUpItem } from '../../components/ScreenWrapper';
import { useTabBar } from '../../context/TabBarContext';
import { useCallback, useRef } from 'react';
import { router } from 'expo-router';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getNutrition, getWeeklyMeals, getStreak, completeWorkout } from '../../services/api';



export default function HomeScreen() {
  const [contentKey, setContentKey] = useState(0);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(8);
  const { setCollapsed } = useTabBar();
  const [trainingDays, setTrainingDays] = useState([]);
  const lastScrollY = useRef(0);
  const [userName, setUserName] = useState('');
  const [streak, setStreak] = useState(0);
  const [completedDays, setCompletedDays] = useState([]);


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
      setContentKey(prev => prev + 1);
      opacity.value = 0;
      translateY.value = 8;
      requestAnimationFrame(() => {
        opacity.value = withTiming(1, { duration: 300 });
        translateY.value = withTiming(0, { duration: 300 });
      });

      async function fetchPlan() {
        try {
          // Get nutrition
          const nutritionData = await getNutrition();
          setUserName(nutritionData.user.name);
          const days = nutritionData.user.training_days?.split(',') || ['mon', 'wed', 'fri'];
          setTrainingDays(days);
          const streakData = await getStreak();
          setStreak(streakData.streak);
          setCompletedDays(streakData.completed_days);
          setNutritionTargets({
            calories: nutritionData.nutrition.calories,
            protein: nutritionData.nutrition.protein,
            carbs: nutritionData.nutrition.carbs,
            fats: nutritionData.nutrition.fats,
            goal: nutritionData.user.goal,
            explanation: nutritionData.nutrition.explanation,
          });
      
          // Try to read today's meals from AsyncStorage (saved by weekly screen)
          const cached = await AsyncStorage.getItem('todays_meals');
          if (cached) {
            setTodaysMeals(JSON.parse(cached));
          } else {
            // No cache yet — fetch weekly and cache it
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

      fetchPlan();
    }, [])
  );

  function getMealTime(mealType) {
    switch (mealType) {
      case 'breakfast': return '7:00 - 9:00 AM';
      case 'lunch': return '12:00 - 2:00 PM';
      case 'snack': return '3:00 - 5:00 PM';
      case 'dinner': return '6:00 - 8:00 PM';
      default: return '';
    }
  }

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
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
  const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const todayIndex = new Date().getDay();
  const reorderedIndex = todayIndex === 0 ? 6 : todayIndex - 1;
  const todayKey = DAY_KEYS[reorderedIndex];
  const isTrainingDay = trainingDays.includes(todayKey);

  const nextTrainingDay = (() => {
    for (let i = 1; i <= 7; i++) {
      const nextIndex = (reorderedIndex + i) % 7;
      if (trainingDays.includes(DAY_KEYS[nextIndex])) {
        return DAY_NAMES[nextIndex];
      }
    }
    return 'soon';
  })();

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <BackgroundCircles variant="default" />

      <Animated.View style={[styles.fixedHeader, headerAnimStyle]}>
        <View>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.name}>{userName ? `Welcome back, ${userName.split(' ')[0]}` : 'Welcome back'}</Text>
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

          <FadeUpItem delay={200}>
            <View style={styles.streakCard}>
              <View style={styles.streakLeft}>
                <Text style={styles.streakNumber}>{streak}</Text>
                <Text style={styles.streakLabel}>day streak</Text>
              </View>
              <View style={styles.streakDivider} />
              <View style={styles.streakRight}>
                <Text style={styles.streakWeekLabel}>This week</Text>
                <View style={styles.streakDots}>
                {DAY_KEYS.map((day, index) => {
                    const isTrainingDay = trainingDays.includes(day);
                    const isCompleted = completedDays.includes(day);
                    const isToday = day === todayKey;
                    const isPast = index < DAY_KEYS.indexOf(todayKey);

                    let dotStyle = styles.streakDotRest;
                    if (isCompleted) dotStyle = styles.streakDotCompleted;
                    else if (isToday && isTrainingDay && !isCompleted) dotStyle = styles.streakDotActive;
                    else if (isPast && isTrainingDay && !isCompleted) dotStyle = styles.streakDotMissed;
                    else if (isTrainingDay) dotStyle = styles.streakDotPending;

                    const labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

                    return (
                      <View key={index} style={styles.streakDayContainer}>
                        <View style={[styles.streakDot, dotStyle, isToday && styles.streakDotToday]} />
                        <Text style={styles.streakDayLabel}>{labels[index]}</Text>
                      </View>
                    );
                })}
                </View>
              </View>
            </View>
          </FadeUpItem>

          <FadeUpItem delay={300}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Today's workout</Text>
              <TouchableOpacity onPress={() => router.navigate('/(tabs)/workouts')}>
                <Text style={styles.sectionLink}>See all</Text>
              </TouchableOpacity>
            </View>

            {isTrainingDay ? (
                <TouchableOpacity style={styles.workoutCard}>
                    
                    <View style={styles.workoutFooter}>
                    <View style={styles.workoutStat}>
                        <Feather name="clock" size={12} color={colors.grey} />
                        <Text style={styles.workoutStatText}>45 min</Text>
                    </View>
                    <View style={styles.workoutStat}>
                        <Feather name="activity" size={12} color={colors.grey} />
                        <Text style={styles.workoutStatText}>6 exercises</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.startButton}
                        onPress={() => router.push('/workout/upper-body')}
                    >
                        <Text style={styles.startButtonText}>Start</Text>
                        <Feather name="arrow-right" size={14} color={colors.white} />
                    </TouchableOpacity>
                    </View>

                    {/* Complete button */}
                    {!completedDays.includes(todayKey) ? (
                    <TouchableOpacity
                        style={styles.completeButton}
                        onPress={async () => {
                        try {
                            await completeWorkout('Upper Body Strength');
                            const streakData = await getStreak();
                            setStreak(streakData.streak);
                            setCompletedDays(streakData.completed_days);
                        } catch (e) {
                            console.log('Complete error:', e.message);
                        }
                        }}
                    >
                        <Feather name="check" size={16} color={colors.white} />
                        <Text style={styles.completeButtonText}>Mark as complete</Text>
                    </TouchableOpacity>
                    ) : (
                    <View style={styles.completedBadge}>
                        <Feather name="check-circle" size={16} color="#059669" />
                        <Text style={styles.completedBadgeText}>Completed today</Text>
                    </View>
                    )}
                </TouchableOpacity>
            ) : (
              <View style={styles.restDayCard}>
                <View style={styles.restDayIcon}>
                  <Feather name="moon" size={24} color={colors.blue} />
                </View>
                <View style={styles.restDayContent}>
                  <Text style={styles.restDayTitle}>Rest day</Text>
                  <Text style={styles.restDaySub}>
                    Recovery is part of the plan. Your next workout is on {nextTrainingDay}.
                  </Text>
                </View>
              </View>
            )}
          </FadeUpItem>

          <FadeUpItem delay={400}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your nutrition</Text>
              <TouchableOpacity onPress={() => router.push('/nutrition/details')}>
                <Text style={styles.sectionLink}>Details</Text>
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
                  <Text style={styles.nutritionLabel}>Calories</Text>
                  <View style={[styles.nutritionBar, { backgroundColor: '#FEF3C7' }]}>
                    <View style={[styles.nutritionBarFill, { backgroundColor: '#D97706', width: '60%' }]} />
                  </View>
                </View>
                <View style={styles.nutritionDivider} />
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{nutritionTargets.protein}g</Text>
                  <Text style={styles.nutritionLabel}>Protein</Text>
                  <View style={[styles.nutritionBar, { backgroundColor: colors.blueLight }]}>
                    <View style={[styles.nutritionBarFill, { backgroundColor: colors.blue, width: '40%' }]} />
                  </View>
                </View>
                <View style={styles.nutritionDivider} />
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{nutritionTargets.carbs}g</Text>
                  <Text style={styles.nutritionLabel}>Carbs</Text>
                  <View style={[styles.nutritionBar, { backgroundColor: '#D1FAE5' }]}>
                    <View style={[styles.nutritionBarFill, { backgroundColor: '#059669', width: '70%' }]} />
                  </View>
                </View>
                <View style={styles.nutritionDivider} />
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{nutritionTargets.fats}g</Text>
                  <Text style={styles.nutritionLabel}>Fats</Text>
                  <View style={[styles.nutritionBar, { backgroundColor: '#FEE2E2' }]}>
                    <View style={[styles.nutritionBarFill, { backgroundColor: '#DC2626', width: '30%' }]} />
                  </View>
                </View>
              </View>
            </View>
          </FadeUpItem>

          <FadeUpItem delay={450}>
  <TouchableOpacity
    style={styles.mealPlanBanner}
    onPress={() => router.push({
      pathname: '/meals/weekly',
      params: { startDay: todayKey }
    })}
    activeOpacity={0.9}
  >
    {/* Background glow */}
    <View style={styles.mealPlanGlow} />

    <View style={styles.mealPlanContent}>
    <View style={styles.mealPlanIconContainer}>
  <MaterialCommunityIcons name="noodles" size={32} color={colors.blue} />
</View>
      <Text style={styles.mealPlanTitle}>Your meal plan{'\n'}is ready</Text>
      <Text style={styles.mealPlanSub}>
        Every meal personalised to your body and {'\n'}your goals.
      </Text>

      <View style={styles.mealPlanStats}>
  <View style={styles.mealPlanStat}>
    <Feather name="sun" size={18} color={colors.blue} />
    <Text style={styles.mealPlanStatNumber}>4</Text>
    <Text style={styles.mealPlanStatLabel}>Meals today</Text>
  </View>
  <View style={styles.mealPlanStatDivider} />
  <View style={styles.mealPlanStat}>
    <Feather name="calendar" size={18} color={colors.blue} />
    <Text style={styles.mealPlanStatNumber}>7</Text>
    <Text style={styles.mealPlanStatLabel}>Days planned</Text>
  </View>
  <View style={styles.mealPlanStatDivider} />
  <View style={styles.mealPlanStat}>
  <Feather name="shuffle" size={18} color={colors.blue} />
    <Text style={styles.mealPlanStatNumber}>70+</Text>
    <Text style={styles.mealPlanStatLabel}>Food choices</Text>
</View>
</View>

<View style={styles.mealPlanButton}>
  <Text style={styles.mealPlanButtonText}>View my meal plan</Text>
  <Feather name="arrow-right" size={16} color={colors.blue} />
</View>
    </View>
  </TouchableOpacity>
</FadeUpItem>
          <FadeUpItem delay={400}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>This week</Text>
            </View>
            <View style={styles.weeklyCard}>
              <View style={styles.weeklyItem}>
                <Text style={styles.weeklyNumber}>0</Text>
                <Text style={styles.weeklyLabel}>Workouts</Text>
              </View>
              <View style={styles.weeklyDivider} />
              <View style={styles.weeklyItem}>
                <Text style={styles.weeklyNumber}>3</Text>
                <Text style={styles.weeklyLabel}>Goal</Text>
              </View>
              <View style={styles.weeklyDivider} />
              <View style={styles.weeklyItem}>
                <Text style={styles.weeklyNumber}>0</Text>
                <Text style={styles.weeklyLabel}>Minutes</Text>
              </View>
            </View>
          </FadeUpItem>

          <FadeUpItem delay={500}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Community</Text>
              <TouchableOpacity onPress={() => router.navigate('/(tabs)/community')}>
                <Text style={styles.sectionLink}>See all</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.communityCard}>
              <View style={styles.communityPost}>
                <View style={styles.communityAvatar}>
                  <Text style={styles.communityAvatarText}>AT</Text>
                </View>
                <View style={styles.communityPostContent}>
                  <Text style={styles.communityPostName}>Abebu T.</Text>
                  <Text style={styles.communityPostText}>Completed week 3 of my plan. Feeling stronger every day.</Text>
                </View>
                <Feather name="heart" size={16} color={colors.greyLight} />
              </View>
              <View style={styles.communityDivider} />
              <View style={styles.communityPost}>
                <View style={[styles.communityAvatar, { backgroundColor: colors.gold }]}>
                  <Text style={styles.communityAvatarText}>MH</Text>
                </View>
                <View style={styles.communityPostContent}>
                  <Text style={styles.communityPostName}>Meron H.</Text>
                  <Text style={styles.communityPostText}>First fasting day workout done. The adapted plan really works.</Text>
                </View>
                <Feather name="heart" size={16} color={colors.greyLight} />
              </View>
            </View>
          </FadeUpItem>

        </View>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 120, paddingBottom: 120 },
  greeting: { fontSize: 14, color: colors.grey, fontWeight: '300', marginBottom: 4 },
  name: { fontSize: 24, fontWeight: '700', color: colors.black, letterSpacing: -0.5 },
  fixedHeader: {
    position: 'absolute', top: 0, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingTop: 52, paddingBottom: 16,
    zIndex: 10, backgroundColor: 'rgba(255,255,255,0.95)',
    borderBottomWidth: 0.5, borderBottomColor: colors.greyBorder,
  },
  streakCard: {
    backgroundColor: colors.blue, borderRadius: 20, padding: 20,
    flexDirection: 'row', alignItems: 'center', marginBottom: 20,
    shadowColor: colors.blue, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8,
  },
  streakLeft: { alignItems: 'center', paddingRight: 20 },
  streakNumber: { fontSize: 48, fontWeight: '700', color: colors.white, letterSpacing: -2, lineHeight: 52 },
  streakLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: '400' },
  streakDivider: { width: 0.5, height: 60, backgroundColor: 'rgba(255,255,255,0.3)', marginRight: 20 },
  streakRight: { flex: 1 },
  streakWeekLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 10, fontWeight: '400' },
  streakDots: { flexDirection: 'row', justifyContent: 'space-between' },
  streakDayContainer: { alignItems: 'center', gap: 4 },
  streakDot: { width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.2)' },
  streakDotCompleted: { backgroundColor: '#22C55E' },
  streakDotActive: { backgroundColor: colors.white },
  streakDotPending: { backgroundColor: '#EAB308' },
  streakDotRest: { backgroundColor: 'rgba(255,255,255,0.2)' },
  streakDotMissed: { backgroundColor: '#EF4444' },
  streakDotToday: { borderWidth: 2.5, borderColor: colors.white },
  streakDayLabel: { fontSize: 10, color: 'rgba(255,255,255,0.6)', fontWeight: '500' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.black, letterSpacing: -0.5 },
  sectionLink: { fontSize: 14, color: colors.blue, fontWeight: '500' },
  workoutCard: {
    backgroundColor: colors.white, borderRadius: 20, padding: 20, marginBottom: 20,
    borderWidth: 1, borderColor: colors.greyBorder,
    shadowColor: colors.black, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3,
  },
  workoutCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  workoutIconContainer: { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.blue, alignItems: 'center', justifyContent: 'center' },
  workoutBadge: { backgroundColor: colors.blueLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100 },
  workoutBadgeText: { fontSize: 11, color: colors.blue, fontWeight: '500' },
  workoutName: { fontSize: 20, fontWeight: '700', color: colors.black, letterSpacing: -0.5, marginBottom: 4 },
  workoutSub: { fontSize: 13, color: colors.grey, fontWeight: '300', marginBottom: 16 },
  workoutFooter: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  workoutStat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  workoutStatText: { fontSize: 12, color: colors.grey },
  startButton: {
    marginLeft: 'auto', backgroundColor: colors.blue, paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 100, flexDirection: 'row', alignItems: 'center', gap: 6,
    shadowColor: colors.blue, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  startButtonText: { fontSize: 13, color: colors.white, fontWeight: '600' },
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
  nutritionExplanationText: { fontSize: 13, color: colors.blue, lineHeight: 18, flex: 1, fontWeight: '300' },
  nutritionGrid: { flexDirection: 'row', alignItems: 'center' },
  nutritionItem: { flex: 1, alignItems: 'center', gap: 4 },
  nutritionValue: { fontSize: 20, fontWeight: '700', color: colors.black, letterSpacing: -0.5 },
  nutritionLabel: { fontSize: 11, color: colors.grey, fontWeight: '300', marginBottom: 4 },
  nutritionBar: { width: '80%', height: 4, borderRadius: 2, overflow: 'hidden' },
  nutritionBarFill: { height: 4, borderRadius: 2 },
  nutritionDivider: { width: 0.5, height: 50, backgroundColor: colors.greyBorder },
  mealsList: { gap: 12, marginBottom: 20 },
  mealCard: {
    backgroundColor: colors.white, borderRadius: 20, padding: 16,
    borderWidth: 1, borderColor: colors.greyBorder,
    shadowColor: colors.black, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3, gap: 6,
  },
  mealHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  mealTypeContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  mealType: { fontSize: 12, fontWeight: '600', color: colors.blue, textTransform: 'uppercase', letterSpacing: 0.5 },
  ethiopianBadge: { backgroundColor: colors.greyCard, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 100 },
  ethiopianBadgeText: { fontSize: 10 },
  mealTime: { fontSize: 11, color: colors.greyLight, fontWeight: '300' },
  mealName: { fontSize: 16, fontWeight: '700', color: colors.black, letterSpacing: -0.3 },
  mealDescription: { fontSize: 13, color: colors.grey, lineHeight: 18, fontWeight: '300' },
  mealStats: { flexDirection: 'row', gap: 16, marginTop: 4 },
  mealStat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  mealStatText: { fontSize: 12, color: colors.grey },
  weeklyCard: {
    backgroundColor: colors.white, borderRadius: 20, padding: 20,
    flexDirection: 'row', alignItems: 'center', marginBottom: 24,
    borderWidth: 1, borderColor: colors.greyBorder,
    shadowColor: colors.black, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3,
  },
  weeklyItem: { flex: 1, alignItems: 'center' },
  weeklyNumber: { fontSize: 32, fontWeight: '700', color: colors.black, letterSpacing: -1, marginBottom: 4 },
  weeklyLabel: { fontSize: 12, color: colors.grey, fontWeight: '300' },
  weeklyDivider: { width: 0.5, height: 40, backgroundColor: colors.greyBorder },
  communityCard: {
    backgroundColor: colors.white, borderRadius: 20, padding: 20,
    borderWidth: 1, borderColor: colors.greyBorder,
    shadowColor: colors.black, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3,
  },
  communityPost: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  communityAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.blue, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  communityAvatarText: { fontSize: 12, fontWeight: '600', color: colors.white },
  communityPostContent: { flex: 1 },
  communityPostName: { fontSize: 13, fontWeight: '600', color: colors.black, marginBottom: 2 },
  communityPostText: { fontSize: 12, color: colors.grey, fontWeight: '300', lineHeight: 18 },
  communityDivider: { height: 0.5, backgroundColor: colors.greyBorder, marginVertical: 14 },

  mealPlanBanner: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.greyBorder,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  mealPlanGlow: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  mealPlanContent: {
    padding: 24,
    gap: 16,
    alignItems: 'center',
  },
  mealPlanEmoji: {
    fontSize: 40,
  },
  mealPlanTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.black,
    letterSpacing: -1,
    lineHeight: 36,
    textAlign: 'center',
  },
  mealPlanSub: {
    fontSize: 14,
    color: colors.grey,
    fontWeight: '300',
    lineHeight: 20,
    textAlign: 'center',

  },
  mealPlanStats: {
    flexDirection: 'row',
    backgroundColor: colors.blueLight,
    borderRadius: 16,
    padding: 16,
  },
  mealPlanStat: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  mealPlanStatNumber: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.blue,
    letterSpacing: -0.5,
  },
  mealPlanStatLabel: {
    fontSize: 11,
    color: colors.blue,
    fontWeight: '300',
  },
  mealPlanStatDivider: {
    width: 0.5,
    backgroundColor: colors.greyBorder,
  },
  mealPlanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.blue,  // ← blue button
    paddingVertical: 16,
    borderRadius: 100,
    width: '100%',
    shadowColor: colors.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  mealPlanButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.white,
  },
  mealPlanIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.blueLight, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#059669',
    paddingVertical: 12,
    borderRadius: 100,
    marginTop: 12,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  completeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#D1FAE5',
    paddingVertical: 12,
    borderRadius: 100,
    marginTop: 12,
  },
  completedBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
});