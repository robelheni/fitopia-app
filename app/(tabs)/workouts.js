import { useFocusEffect } from 'expo-router';
import FloatingCoachButton from '../../components/FloatingCoachButton';

import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';
import { lightColors } from '../../constants/colors';
import BackgroundCircles from '../../components/BackgroundCircles';
import { FadeUpItem } from '../../components/ScreenWrapper';
import MyPlanModal from '../../components/MyPlanModal';
import { router } from 'expo-router';
import { useTabBar } from '../../context/TabBarContext';
import { useCallback, useState, useRef } from 'react';
import { Feather, Ionicons } from '@expo/vector-icons';
import { getWorkoutPlan, getStreak, getCurrentUser } from "../../services/api";



// Expandable weekly plan card
function WeeklyPlanCard({ item, isExpanded, onToggle }) {
    const theme = useTheme();
    const isDark = theme ? theme.isDark : false;
    const colors = theme ? theme.colors : lightColors;
    const styles = makeStyles(colors, isDark);
    return (
        <View style={styles.weeklyPlanCardContainer}>
            <TouchableOpacity
            style={[
                styles.weeklyPlanCard,
                item.isToday && styles.weeklyPlanCardActive,
                item.isPast && styles.weeklyPlanCardPast,
            ]}
            onPress={onToggle}
            activeOpacity={0.8}
            >
            <View style={styles.weeklyPlanLeft}>
                <Text style={[styles.weeklyPlanDay, item.isToday && styles.weeklyPlanDayActive]}>
                {item.day}
                </Text>
                <Text style={[styles.weeklyPlanWorkout, item.isToday && styles.weeklyPlanWorkoutActive]}>
                {item.workout}
                </Text>
                {item.isToday && (
                <View style={styles.todayBadge}>
                    <Text style={styles.todayBadgeText}>Today</Text>
                </View>
                )}
            </View>
    
            {/* Right side — status for past, chevron for today and future */}
            {item.isPast ? (
                <View style={[
                styles.statusBadge,
                item.completed ? styles.statusBadgeCompleted : styles.statusBadgeMissed
                ]}>
                <Text style={[
                    styles.statusBadgeText,
                    item.completed ? styles.statusBadgeTextCompleted : styles.statusBadgeTextMissed
                ]}>
                    {item.completed ? 'Completed' : 'Missed'}
                </Text>
                </View>
            ) : (
                <Feather
                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                size={16}
                color={item.isToday ? 'rgba(255,255,255,0.7)' : colors.greyLight}
                />
            )}
    
            </TouchableOpacity>
    
            {isExpanded &&  (
            <View style={[styles.weeklyPlanExpanded, item.isToday && styles.weeklyPlanExpandedActive]}>
                {item.exercises.map((exercise, i) => (
                <View key={i} style={styles.weeklyExerciseItem}>
                    <View style={[styles.weeklyExerciseDot, item.isToday && styles.weeklyExerciseDotActive]} />
                    <Text style={[styles.weeklyExerciseText, item.isToday && styles.weeklyExerciseTextActive]}>
                    {exercise}
                    </Text>
                </View>
                ))}
                <TouchableOpacity
                  style={[styles.weeklyStartButton, item.isToday && styles.weeklyStartButtonActive]}
                  onPress={() => router.push({
                    pathname: '/workout/[id]',
                    params: {
                        sessionData: JSON.stringify(item.sessionData),
                        dayKey: item.dayKey,
                        workoutName: item.workout,
                        id: item.dayKey,
                    }
                })}
>
                <Text style={[styles.weeklyStartText, item.isToday && styles.weeklyStartTextActive]}>
                {item.isPast ? 'View workout' : `Start ${item.workout}`}
                </Text>
                <Feather
                    name="arrow-right"
                    size={14}
                    color={item.isToday ? colors.blue : colors.white}
                />
                </TouchableOpacity>
            </View>
            )}
    
        </View>
    );
  }

export default function WorkoutsScreen() {
    const theme = useTheme();
    const isDark = theme ? theme.isDark : false;
    const colors = theme ? theme.colors : lightColors;

    const [contentKey, setContentKey] = useState(0);
    const [activeFilter, setActiveFilter] = useState('forYou');
    const [myPlanVisible, setMyPlanVisible] = useState(false);
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(8);
    const [expandedDay, setExpandedDay] = useState(null);
    const [userInitials, setUserInitials] = useState('');
    const [userName, setUserName] = useState('');
    const [accountCreatedAt, setAccountCreatedAt] = useState(null);

    // Stores the raw plan from the backend
  const [workoutPlan, setWorkoutPlan] = useState(null);

  // Stores the transformed plan ready for the WeeklyPlanCard component
  const [weeklyPlanItems, setWeeklyPlanItems] = useState([]);

  // Stores the user's actual training days from their profile
  const [trainingDays, setTrainingDays] = useState([]);

  // Loading state while plan is being fetched
  const [planLoading, setPlanLoading] = useState(true);

  const filters = [
    { key: 'forYou', label: 'For You' },
    { key: 'home', label: 'Home' },
    { key: 'gym', label: 'Gym' },
    { key: 'fasting', label: 'Fasting' },
    { key: 'all', label: 'Library' },
  ];
    

    
    const { setCollapsed } = useTabBar();
    const lastScrollY = useRef(0);

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
      

      useFocusEffect(
        useCallback(() => {
            // Force remount of all FadeUpItem components
            setContentKey(prev => prev + 1);
            opacity.value = 0;
            translateY.value = 8;
            requestAnimationFrame(() => {
                opacity.value = withTiming(1, { duration: 300 });
                translateY.value = withTiming(0, { duration: 300 });
            });
    
            // Fetch user data for initials and name
            async function fetchUser(currentUser) {
              try {
                  const name = currentUser.name || '';
                  setAccountCreatedAt(currentUser.created_at);
                  const parts = name.trim().split(' ');
                  const initials = parts[0]?.[0] || 'M';
                  setUserInitials(initials.toUpperCase());
                  setUserName(parts[0]);
              } catch (e) {
                  console.log('Fetch user error:', e.message);
              }
          }
    
            // Fetch the workout plan from the backend
            // The plan comes back as a dictionary keyed by day
            // e.g. { mon: { session_type: 'upper', exercises: [...] } }
            // We transform it into the format WeeklyPlanCard expects
            async function fetchPlan(currentUser) {
              try {
                  setPlanLoading(true);

                  const plan = await getWorkoutPlan();
                  const accountCreated = currentUser?.created_at;
            
                  const streakData = await getStreak();
                  const completedDays = streakData.completed_days;
            
                  const sessionNames = {
                      push:       'Push Day',
                      pull:       'Pull Day',
                      legs:       'Leg Day',
                      upper:      'Upper Body',
                      lower:      'Lower Body',
                      full_body:  'Full Body',
                  };
            
                  const dayDisplayNames = {
                      mon: 'Mon', tue: 'Tue', wed: 'Wed',
                      thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun',
                  };
            
                  const dayOrder = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
            
                  const todayIndex = new Date().getDay();
                  const reorderedIndex = todayIndex === 0 ? 6 : todayIndex - 1;
                  const todayKey = dayOrder[reorderedIndex];
                  const todayPosition = dayOrder.indexOf(todayKey);
            
                  const dayOrderForSort = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
                  const planDays = Object.keys(plan).sort(
                    (a, b) => dayOrderForSort.indexOf(a) - dayOrderForSort.indexOf(b)
                  );
                  setTrainingDays(planDays);
            
                  const transformed = planDays.map(dayKey => {
                      const session = plan[dayKey];
                      const itemPosition = dayOrder.indexOf(dayKey);
                      const isPast = itemPosition < todayPosition;
                      const isToday = dayKey === todayKey;
            
                      const exerciseNames = session.exercises.map(ex => ex.name);
            
                      if (session.cardio_circuit && session.cardio_circuit.exercises) {
                          session.cardio_circuit.exercises.forEach(ex => {
                              exerciseNames.push(`${ex.name} (cardio)`);
                          });
                      }
            
                      const today = new Date();
                      const dayOffsetFromToday = itemPosition - todayPosition;
                      const itemDate = new Date(today);
                      itemDate.setDate(today.getDate() + dayOffsetFromToday);
                      itemDate.setHours(0, 0, 0, 0);
            
                      // Use the locally fetched accountCreated value directly —
                      // no longer relying on the accountCreatedAt state, which
                      // could still be stale/null due to React's state update timing
                      const isBeforeAccount = accountCreated &&
                          itemDate < new Date(new Date(accountCreated).setHours(0, 0, 0, 0));
            
                      return {
                          day: dayDisplayNames[dayKey] || dayKey,
                          workout: sessionNames[session.session_type] || session.session_type,
                          dayKey: dayKey,
                          sessionData: session,
                          completed: completedDays.includes(dayKey),
                          exercises: exerciseNames,
                          isPast: isPast && !isBeforeAccount,
                          isToday,
                      };
                  });
            
                  setWeeklyPlanItems(transformed);
            
              } catch (e) {
                  console.log('Fetch plan error:', e.message);
              } finally {
                  setPlanLoading(false);
              }
            }
    
            async function init() {
              const currentUser = await getCurrentUser();
              fetchUser(currentUser);
              fetchPlan(currentUser);
            }
            init();
    
        }, [])
    );
  // Day order and today calculation
// Used to determine if today is a training day
// and what the next training day is
const dayKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const todayIndex = new Date().getDay();
const reorderedIndex = todayIndex === 0 ? 6 : todayIndex - 1;
const todayKey = dayKeys[reorderedIndex];

// isTrainingDay now uses real training days from the backend
// instead of hardcoded ['mon', 'wed', 'fri']
const isTrainingDay = trainingDays.includes(todayKey);

// Find the next training day after today
// Loops through the week until it finds a scheduled day
const nextTrainingDay = (() => {
    for (let i = 1; i <= 7; i++) {
        const nextIndex = (reorderedIndex + i) % 7;
        if (trainingDays.includes(dayKeys[nextIndex])) {
            return dayNames[nextIndex];
        }
    }
    return 'soon';
})();

// Get today's session from the plan if it exists
// Used to populate the featured card with real workout data
const todaySession = weeklyPlanItems.find(item => item.isToday);

const animatedStyle = useAnimatedStyle(() => ({
  opacity: opacity.value,
  transform: [{ translateY: translateY.value }],
}));    

    const styles = makeStyles(colors, isDark);

    return (
        <Animated.View style={[styles.container, animatedStyle]}>
        <BackgroundCircles variant="topLeft" />

        
        <Animated.View style={[styles.fixedHeader, headerAnimStyle]}>
          <Text style={styles.title}>Workouts</Text>
          
          <View style={styles.headerRight}>
              {/* Saved exercises button */}
              <TouchableOpacity
                  style={styles.savedButton}
                  onPress={() => router.push('/workout/liked')}
              >
                  <Ionicons name="heart" size={18} color="#DC2626" />
              </TouchableOpacity>

              {/* My Plan button */}
              <TouchableOpacity
                  style={styles.myPlanButton}
                  onPress={() => setMyPlanVisible(true)}
                  activeOpacity={0.7}
              >
                  <View style={styles.myPlanInitials}>
                    <Text style={styles.myPlanInitialsText}>{userInitials}</Text>
                  </View>
                  <Text style={styles.myPlanText}>My Plan</Text>
                  <Feather name="chevron-right" size={14} color={colors.grey} />
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
            {/* key forces all FadeUpItems to remount and replay on focus */}
            <View key={contentKey}>

            
            <FadeUpItem delay={100}>
                <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filtersContainer}
                >
                {filters.map((filter) => (
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

            {/* Content changes based on active filter */}
            {activeFilter === 'forYou' && (
                <FadeUpItem delay={200}>

                    <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Today's pick</Text>
                    </View>

                    {isTrainingDay ? (
                    <TouchableOpacity 
                        style={styles.featuredCard}
                        onPress={() => todaySession && router.push({
                          pathname: '/workout/[id]',
                          params: { 
                              sessionData: JSON.stringify(todaySession.sessionData), 
                              dayKey: todayKey,
                              workoutName: todaySession.workout,
                              id: todayKey,
                          }
                      })}
                    >
                        <View style={styles.featuredTop}>
                            <View style={styles.featuredIconContainer}>
                                <Feather name="zap" size={22} color={colors.white} />
                            </View>
                            <View style={styles.featuredBadge}>
                                <Text style={styles.featuredBadgeText}>Crafted for you</Text>
                            </View>
                        </View>

                        {/* Show real workout name from backend or loading state */}
                        <Text style={styles.featuredName}>
                            {planLoading ? 'Loading...' : todaySession ? todaySession.workout : 'Rest Day'}
                        </Text>

                        <View style={styles.featuredStats}>
                            <View style={styles.featuredStat}>
                                <Feather name="activity" size={12} color="rgba(255,255,255,0.7)" />
                                <Text style={styles.featuredStatText}>
                                    {planLoading ? '...' : todaySession ? `${todaySession.exercises.length} exercises` : ''}
                                </Text>
                            </View>
                            <View style={styles.featuredStat}>
                                <Feather name="bar-chart-2" size={12} color="rgba(255,255,255,0.7)" />
                                <Text style={styles.featuredStatText}>
                                    {todaySession ? todaySession.workout : ''}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.featuredStartButton}>
                            <Text style={styles.featuredStartText}>
                                {planLoading ? 'Loading plan...' : 'Start workout'}
                            </Text>
                            <Feather name="arrow-right" size={16} color={colors.blue} />
                        </View>
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

                {/* Weekly plan with expandable exercises */}
                

                <View style={styles.weeklyPlan}>
                {weeklyPlanItems.map((item, index) => (
                <WeeklyPlanCard
                    key={index}
                    item={item}
                    isExpanded={expandedDay === index}
                    onToggle={() => setExpandedDay(expandedDay === index ? null : index)}
                />
                ))}
                </View>
            </FadeUpItem>
            )}

            {/* Home categories */}
            {activeFilter === 'home' && (
              <FadeUpItem delay={200}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Home workouts</Text>
                  <Text style={styles.sectionSub}>No gym needed</Text>
                </View>
                <View style={styles.categoryGrid}>
                  {[
                    { name: 'Full Body',   icon: 'user',          color: '#059669', bg: '#D1FAE5', categoryKey: 'full-body-home' },
                    { name: 'Upper Body',  icon: 'trending-up',   color: '#2563EB', bg: '#EFF6FF', categoryKey: 'upper-body-home' },
                    { name: 'Lower Body',  icon: 'trending-down', color: '#7C3AED', bg: '#EDE9FE', categoryKey: 'lower-body-home' },
                    { name: 'Core',        icon: 'target',        color: '#D97706', bg: '#FEF3C7', categoryKey: 'core-home' },
                    { name: 'Biceps',      icon: 'activity',      color: '#DC2626', bg: '#FEE2E2', categoryKey: 'biceps-home' },
                    { name: 'Triceps',     icon: 'zap',           color: '#0891B2', bg: '#CFFAFE', categoryKey: 'triceps-home' },
                    { name: 'Cardio',      icon: 'heart',         color: '#059669', bg: '#D1FAE5', categoryKey: 'cardio-home' },
                    { 
                      name: 'Intense Cardio', 
                      icon: 'zap', 
                      color: '#DC2626', 
                      bg: '#FEE2E2', 
                      categoryKey: 'intense-cardio-home',
                      isCircuit: true,
                      circuitType: 'home'
                    },
                  ].map((cat, index) => (
                    <TouchableOpacity key={index} style={styles.categoryCard}
                    onPress={() => cat.isCircuit
                      ? router.push({ pathname: '/workout/circuits', params: { type: cat.circuitType } })
                      : router.push({ pathname: '/workout/library', params: { category: cat.categoryKey } })
                    }>
                      <View style={[styles.categoryIcon, { backgroundColor: cat.bg }]}>
                        <Feather name={cat.icon} size={22} color={cat.color} />
                      </View>
                      <Text style={styles.categoryName}>{cat.name}</Text>
                      <Feather name="chevron-right" size={16} color={colors.greyLight} style={styles.categoryArrow} />
                    </TouchableOpacity>
                  ))}
                </View>
              </FadeUpItem>
            )}
            {/* Gym categories */}
            {activeFilter === 'gym' && (
              <FadeUpItem delay={200}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Gym workouts</Text>
                  <Text style={styles.sectionSub}>Full equipment</Text>
                </View>
                <View style={styles.categoryGrid}>
                  {[
                    { name: 'Chest',     icon: 'chevrons-up',   color: '#2563EB', bg: '#EFF6FF', categoryKey: 'chest-gym' },
                    { name: 'Back',      icon: 'chevrons-down', color: '#7C3AED', bg: '#EDE9FE', categoryKey: 'back-gym' },
                    { name: 'Shoulders', icon: 'trending-up',   color: '#D97706', bg: '#FEF3C7', categoryKey: 'shoulders-gym' },
                    { name: 'Triceps',   icon: 'zap',           color: '#DC2626', bg: '#FEE2E2', categoryKey: 'triceps-gym' },
                    { name: 'Biceps',    icon: 'activity',      color: '#059669', bg: '#D1FAE5', categoryKey: 'biceps-gym' },
                    { name: 'Legs',      icon: 'trending-down', color: '#0891B2', bg: '#CFFAFE', categoryKey: 'legs-gym' },
                    { name: 'Core',      icon: 'target',        color: '#7C3AED', bg: '#EDE9FE', categoryKey: 'core-gym' },
                    { name: 'Cardio',    icon: 'heart',         color: '#DC2626', bg: '#FEE2E2', categoryKey: 'cardio-gym' },
                    { 
                      name: 'Intense Cardio', 
                      icon: 'zap', 
                      color: '#DC2626', 
                      bg: '#FEE2E2', 
                      categoryKey: 'intense-cardio-gym',
                      isCircuit: true,
                      circuitType: 'gym'
                    },
                  ].map((cat, index) => (
                    <TouchableOpacity key={index} style={styles.categoryCard}
                    onPress={() => cat.isCircuit
                      ? router.push({ pathname: '/workout/circuits', params: { type: cat.circuitType } })
                      : router.push({ pathname: '/workout/library', params: { category: cat.categoryKey } })
                    }>
                      <View style={[styles.categoryIcon, { backgroundColor: cat.bg }]}>
                        <Feather name={cat.icon} size={22} color={cat.color} />
                      </View>
                      <Text style={styles.categoryName}>{cat.name}</Text>
                      <Feather name="chevron-right" size={16} color={colors.greyLight} style={styles.categoryArrow} />
                    </TouchableOpacity>
                  ))}
                </View>
              </FadeUpItem>
            )}

            {/* Fasting categories */}
            {activeFilter === 'fasting' && (
              <FadeUpItem delay={200}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Fasting workouts</Text>
                  <Text style={styles.sectionSub}>Low intensity, high benefit</Text>
                </View>
                <View style={styles.categoryGrid}>
                  {[
                    { name: 'Light Full Body',      icon: 'sun',    color: '#D97706', bg: '#FEF3C7', categoryKey: 'light-full-body' },
                    { name: 'Core and Balance',     icon: 'target', color: '#7C3AED', bg: '#EDE9FE', categoryKey: 'core-and-balance' },
                    { name: 'Low Intensity Cardio', icon: 'heart',  color: '#DC2626', bg: '#FEE2E2', categoryKey: 'low-intensity-cardio' },
                  ].map((cat, index) => (
                    <TouchableOpacity key={index} style={styles.categoryCard}
                      onPress={() => router.push({ pathname: '/workout/library', params: { category: cat.categoryKey } })}>
                      <View style={[styles.categoryIcon, { backgroundColor: cat.bg }]}>
                        <Feather name={cat.icon} size={22} color={cat.color} />
                      </View>
                      <Text style={styles.categoryName}>{cat.name}</Text>
                      <Feather name="chevron-right" size={16} color={colors.greyLight} style={styles.categoryArrow} />
                    </TouchableOpacity>
                  ))}
                </View>
              </FadeUpItem>
            )}

            {activeFilter === 'all' && (
              <FadeUpItem delay={200}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Exercise Library</Text>
                  <Text style={styles.sectionSub}>Discover New Exercises</Text>
                </View>
                <TouchableOpacity
                  style={styles.libraryButton}
                  onPress={() => router.push({ pathname: '/workout/library', params: { category: 'all' } })}
                >
                  <Feather name="search" size={20} color={colors.blue} />
                  <Text style={styles.libraryButtonText}>Browse all exercises</Text>
                  <Feather name="chevron-right" size={16} color={colors.greyLight} />
                </TouchableOpacity>
              </FadeUpItem>
            )}

            </View>
        </ScrollView>

        <MyPlanModal
            visible={myPlanVisible}
            onClose={() => setMyPlanVisible(false)}
        />
        <FloatingCoachButton />
        </Animated.View>
    );
}

function makeStyles(c, dark) {
  const colors = c || lightColors;
  const isDark = dark || false;
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.white },
    scroll: { flex: 1 },
    content: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 120 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    title: { fontSize: 28, fontWeight: '700', color: colors.black, letterSpacing: -1 },
    myPlanButton: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.greyCard, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 100 },
    myPlanInitials: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.blue, alignItems: 'center', justifyContent: 'center' },
    myPlanInitialsText: { fontSize: 10, fontWeight: '700', color: colors.white },
    myPlanText: { fontSize: 13, fontWeight: '500', color: colors.black },
    filtersContainer: { gap: 8, paddingBottom: 16, paddingRight: 24 },
    filterTab: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 100, backgroundColor: colors.greyCard, borderWidth: 1, borderColor: colors.greyBorder },
    filterTabActive: { backgroundColor: colors.blue, borderColor: colors.blue, shadowColor: colors.blue, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
    filterText: { fontSize: 14, fontWeight: '500', color: colors.grey },
    filterTextActive: { color: colors.white },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.black, letterSpacing: -0.5 },
    featuredCard: { backgroundColor: colors.blue, borderRadius: 24, padding: 24, marginBottom: 24, shadowColor: colors.blue, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 16, elevation: 8 },
    featuredTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    featuredIconContainer: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
    featuredBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 100 },
    featuredBadgeText: { fontSize: 12, color: colors.white, fontWeight: '500' },
    featuredName: { fontSize: 26, fontWeight: '700', color: colors.white, letterSpacing: -0.5, marginBottom: 12 },
    featuredStats: { flexDirection: 'row', gap: 16, marginBottom: 20 },
    featuredStat: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    featuredStatText: { fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: '300' },
    featuredStartButton: { backgroundColor: colors.white, borderRadius: 100, paddingVertical: 14, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
    featuredStartText: { fontSize: 15, fontWeight: '600', color: colors.blue },
    workoutCount: { fontSize: 13, color: colors.grey, fontWeight: '300' },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    workoutCard: { width: '47.5%', backgroundColor: colors.white, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: colors.greyBorder, shadowColor: colors.black, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 },
    cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    cardIconContainer: { width: 32, height: 32, borderRadius: 10, backgroundColor: colors.blue, alignItems: 'center', justifyContent: 'center' },
    cardIconFasting: { backgroundColor: '#7C3AED' },
    cardIconHome: { backgroundColor: '#059669' },
    typeBadge: { backgroundColor: colors.blueLight, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 100 },
    typeBadgeFasting: { backgroundColor: '#EDE9FE' },
    typeBadgeHome: { backgroundColor: '#D1FAE5' },
    typeBadgeText: { fontSize: 10, color: colors.blue, fontWeight: '500' },
    typeBadgeTextFasting: { color: '#7C3AED' },
    typeBadgeTextHome: { color: '#059669' },
    cardName: { fontSize: 15, fontWeight: '700', color: colors.black, letterSpacing: -0.3, marginBottom: 4 },
    cardMuscle: { fontSize: 12, color: colors.grey, fontWeight: '300', marginBottom: 12 },
    cardStats: { gap: 6, marginBottom: 14 },
    cardStat: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    cardStatText: { fontSize: 11, color: colors.grey },
    cardStartButton: { backgroundColor: colors.blue, borderRadius: 100, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, shadowColor: colors.blue, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 6, elevation: 3 },
    cardStartText: { fontSize: 12, color: colors.white, fontWeight: '600' },
    
    
    
    
    categoryGrid: {
    gap: 10,
    },
    
    categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
    
    categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    },
    
    categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
    letterSpacing: -0.3,
    flex: 1,
    },
    
    categoryCount: {
    fontSize: 12,
    color: colors.grey,
    fontWeight: '300',
    marginRight: 8,
    },
    
    categoryArrow: {
    marginLeft: 4,
    },
    
    sectionSub: {
    fontSize: 13,
    color: colors.grey,
    fontWeight: '300',
    },

    weeklyPlanCardContainer: {
        marginBottom: 10,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.greyBorder,
      },
      weeklyPlan: {
        gap: 0,
        marginBottom: 24,
      },
      
      weeklyPlanCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.greyCard,
        padding: 16,
      },
      
      weeklyPlanCardActive: {
        backgroundColor: colors.blue,
        borderColor: colors.blue,
      },

      weeklyPlanCardPast: {
        backgroundColor: colors.greyCard,
        opacity: 0.7,
      },
      
      weeklyPlanLeft: {
        gap: 4,
      },
      
      weeklyPlanDay: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.grey,
      },
      
      weeklyPlanDayActive: {
        color: 'rgba(255,255,255,0.7)',
      },
      
      weeklyPlanWorkout: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.black,
      },
      
      weeklyPlanWorkoutActive: {
        color: colors.white,
      },
      
      todayBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 100,
        alignSelf: 'flex-start',
      },
      
      todayBadgeText: {
        fontSize: 9,
        color: colors.white,
        fontWeight: '500',
      },
      
      weeklyPlanExpanded: {
        backgroundColor: colors.greyCard,
        padding: 16,
        gap: 10,
      },
      
      weeklyPlanExpandedActive: {
        backgroundColor: colors.blueLight,
      },
      
      weeklyExerciseItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
      },
      
      weeklyExerciseDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.greyLight,
      },
      
      weeklyExerciseDotActive: {
        backgroundColor: colors.blue,
      },
      
      weeklyExerciseText: {
        fontSize: 14,
        color: colors.grey,
        fontWeight: '300',
      },
      
      weeklyExerciseTextActive: {
        color: colors.black,
        fontWeight: '400',
      },
      
      weeklyStartButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        backgroundColor: colors.black,
        paddingVertical: 10,
        borderRadius: 100,
        marginTop: 4,
      },
      
      weeklyStartButtonActive: {
        backgroundColor: colors.white,
      },
      
      weeklyStartText: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.white,
      },
      
      weeklyStartTextActive: {
        color: colors.blue,
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
        paddingTop: 120,
        paddingBottom: 120,
      },

      restDayCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        backgroundColor: colors.blueLight,
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(37,99,235,0.15)',
      },
      
      restDayIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      },
      
      restDayTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.black,
        letterSpacing: -0.3,
        marginBottom: 4,
      },
      
      restDaySub: {
        fontSize: 13,
        color: colors.grey,
        lineHeight: 18,
        fontWeight: '300',
      },
      
      restDayContent: {
        flex: 1,
      },

      statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 100,
      },
      
      statusBadgeCompleted: {
        backgroundColor: '#D1FAE5',
      },
      
      statusBadgeMissed: {
        backgroundColor: '#FEE2E2',
      },
      
      statusBadgeText: {
        fontSize: 11,
        fontWeight: '600',
      },
      
      statusBadgeTextCompleted: {
        color: '#059669',
      },
      
      statusBadgeTextMissed: {
        color: '#DC2626',
      },

      libraryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: colors.greyBorder,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
      },
      libraryButtonText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: colors.black,
      },

      headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
      },
      
      savedButton: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: isDark ? '#3B0000' : '#FEE2E2',
        alignItems: 'center', justifyContent: 'center',
      },
}); }