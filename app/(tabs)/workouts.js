import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import BackgroundCircles from '../../components/BackgroundCircles';
import { FadeUpItem } from '../../components/ScreenWrapper';
import MyPlanModal from '../../components/MyPlanModal';
import { router } from 'expo-router';

export default function WorkoutsScreen() {
    const [contentKey, setContentKey] = useState(0);
    const [activeFilter, setActiveFilter] = useState('forYou');
    const [myPlanVisible, setMyPlanVisible] = useState(false);
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(8);

    const filters = [
        { key: 'forYou', label: 'For You' },
        { key: 'home', label: 'Home' },
        { key: 'gym', label: 'Gym' },
        { key: 'fasting', label: 'Fasting' },
    ];
    const workouts = [
        { id: '1', name: 'Upper Body Strength', type: 'gym', duration: '45 min', difficulty: 'Intermediate', muscle: 'Upper body', exercises: 6, featured: true },
        { id: '2', name: 'Home Full Body', type: 'home', duration: '30 min', difficulty: 'Beginner', muscle: 'Full body', exercises: 5, featured: false },
        { id: '3', name: 'Fasting Day Flow', type: 'fasting', duration: '20 min', difficulty: 'Light', muscle: 'Full body', exercises: 4, featured: false },
        { id: '4', name: 'Lower Body Power', type: 'gym', duration: '45 min', difficulty: 'Intermediate', muscle: 'Lower body', exercises: 6, featured: false },
        { id: '5', name: 'Dumbbell Circuit', type: 'home', duration: '30 min', difficulty: 'Intermediate', muscle: 'Full body', exercises: 5, featured: false },
        { id: '6', name: 'Fasting Mobility', type: 'fasting', duration: '20 min', difficulty: 'Light', muscle: 'Flexibility', exercises: 6, featured: false },
    ];

    const filteredWorkouts = activeFilter === 'forYou'
        ? workouts
        : workouts.filter(w => w.type === activeFilter);

    const featuredWorkout = workouts.find(w => w.featured);

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
        }, [])
    );

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: translateY.value }],
    }));

    return (
        <Animated.View style={[styles.container, animatedStyle]}>
        <BackgroundCircles variant="topLeft" />
        <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            {/* key forces all FadeUpItems to remount and replay on focus */}
            <View key={contentKey}>

            <FadeUpItem delay={0}>
                <View style={styles.header}>
                <Text style={styles.title}>Workouts</Text>
                <TouchableOpacity
                    style={styles.myPlanButton}
                    onPress={() => setMyPlanVisible(true)}
                    activeOpacity={0.7}
                >
                    <View style={styles.myPlanInitials}>
                    <Text style={styles.myPlanInitialsText}>HE</Text>
                    </View>
                    <Text style={styles.myPlanText}>My Plan</Text>
                    <Feather name="chevron-right" size={14} color={colors.grey} />
                </TouchableOpacity>
                </View>
            </FadeUpItem>

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
                {/* Featured workout */}
                <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Today's pick</Text>
                </View>
                <TouchableOpacity style={styles.featuredCard}>
                <View style={styles.featuredTop}>
                    <View style={styles.featuredIconContainer}>
                    <Feather name="zap" size={22} color={colors.white} />
                    </View>
                    <View style={styles.featuredBadge}>
                    <Text style={styles.featuredBadgeText}>Crafted for you</Text>
                    </View>
                </View>
                <Text style={styles.featuredName}>{featuredWorkout.name}</Text>
                <View style={styles.featuredStats}>
                    <View style={styles.featuredStat}>
                    <Feather name="clock" size={12} color="rgba(255,255,255,0.7)" />
                    <Text style={styles.featuredStatText}>{featuredWorkout.duration}</Text>
                    </View>
                    <View style={styles.featuredStat}>
                    <Feather name="activity" size={12} color="rgba(255,255,255,0.7)" />
                    <Text style={styles.featuredStatText}>{featuredWorkout.exercises} exercises</Text>
                    </View>
                    <View style={styles.featuredStat}>
                    <Feather name="bar-chart-2" size={12} color="rgba(255,255,255,0.7)" />
                    <Text style={styles.featuredStatText}>{featuredWorkout.difficulty}</Text>
                    </View>
                </View>
                <View style={styles.featuredStartButton}>
                    <Text style={styles.featuredStartText}>Start workout</Text>
                    <Feather name="arrow-right" size={16} color={colors.blue} />
                </View>
                </TouchableOpacity>

                {/* Weekly plan preview */}
                <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Your week</Text>
                </View>
                <View style={styles.weeklyPlan}>
                {[
                    { day: 'Mon', workout: 'Upper Body', active: true },
                    { day: 'Wed', workout: 'Lower Body', active: false },
                    { day: 'Fri', workout: 'Full Body', active: false },
                ].map((item, index) => (
                    <View
                    key={index}
                    style={[styles.weeklyPlanCard, item.active && styles.weeklyPlanCardActive]}
                    >
                    <Text style={[styles.weeklyPlanDay, item.active && styles.weeklyPlanDayActive]}>
                        {item.day}
                    </Text>
                    <Text style={[styles.weeklyPlanWorkout, item.active && styles.weeklyPlanWorkoutActive]}>
                        {item.workout}
                    </Text>
                    {item.active && (
                        <View style={styles.todayBadge}>
                        <Text style={styles.todayBadgeText}>Today</Text>
                        </View>
                    )}
                    </View>
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
                    { name: 'Full Body', icon: 'user', color: '#059669', bg: '#D1FAE5', exercises: 8 },
                    { name: 'Upper Body', icon: 'trending-up', color: '#2563EB', bg: '#EFF6FF', exercises: 6 },
                    { name: 'Lower Body', icon: 'trending-down', color: '#7C3AED', bg: '#EDE9FE', exercises: 5 },
                    { name: 'Core', icon: 'target', color: '#D97706', bg: '#FEF3C7', exercises: 6 },
                    { name: 'Arms', icon: 'activity', color: '#DC2626', bg: '#FEE2E2', exercises: 4 },
                ].map((cat, index) => (
                    <TouchableOpacity key={index} style={styles.categoryCard}
                    onPress={() => router.push(`/workout/${cat.name.toLowerCase().replace(/ /g, '-')}`)}>
                    <View style={[styles.categoryIcon, { backgroundColor: cat.bg }]}>
                        <Feather name={cat.icon} size={22} color={cat.color} />
                    </View>
                    <Text style={styles.categoryName}>{cat.name}</Text>
                    <Text style={styles.categoryCount}>{cat.exercises} exercises</Text>
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
                    { name: 'Push Day', icon: 'chevrons-up', color: '#2563EB', bg: '#EFF6FF', exercises: 6 },
                    { name: 'Pull Day', icon: 'chevrons-down', color: '#7C3AED', bg: '#EDE9FE', exercises: 5 },
                    { name: 'Leg Day', icon: 'trending-down', color: '#059669', bg: '#D1FAE5', exercises: 6 },
                    { name: 'Upper Body', icon: 'trending-up', color: '#D97706', bg: '#FEF3C7', exercises: 8 },
                    { name: 'Lower Body', icon: 'arrow-down', color: '#DC2626', bg: '#FEE2E2', exercises: 6 },
                    { name: 'Full Body', icon: 'user', color: '#0891B2', bg: '#CFFAFE', exercises: 10 },
                ].map((cat, index) => (
                    <TouchableOpacity key={index} style={styles.categoryCard}
                    onPress={() => router.push(`/workout/${cat.name.toLowerCase().replace(/ /g, '-')}`)}>
                    <View style={[styles.categoryIcon, { backgroundColor: cat.bg }]}>
                        <Feather name={cat.icon} size={22} color={cat.color} />
                    </View>
                    <Text style={styles.categoryName}>{cat.name}</Text>
                    <Text style={styles.categoryCount}>{cat.exercises} exercises</Text>
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
                    { name: 'Light Full Body', icon: 'sun', color: '#D97706', bg: '#FEF3C7', exercises: 5 },
                    { name: 'Mobility', icon: 'wind', color: '#059669', bg: '#D1FAE5', exercises: 6 },
                    { name: 'Core and Balance', icon: 'target', color: '#7C3AED', bg: '#EDE9FE', exercises: 5 },
                    { name: 'Low Intensity Cardio', icon: 'heart', color: '#DC2626', bg: '#FEE2E2', exercises: 4 },
                ].map((cat, index) => (
                    <TouchableOpacity key={index} style={styles.categoryCard}
                    onPress={() => router.push(`/workout/${cat.name.toLowerCase().replace(/ /g, '-')}`)}>
                    <View style={[styles.categoryIcon, { backgroundColor: cat.bg }]}>
                        <Feather name={cat.icon} size={22} color={cat.color} />
                    </View>
                    <Text style={styles.categoryName}>{cat.name}</Text>
                    <Text style={styles.categoryCount}>{cat.exercises} exercises</Text>
                    <Feather name="chevron-right" size={16} color={colors.greyLight} style={styles.categoryArrow} />
                    </TouchableOpacity>
                ))}
                </View>
            </FadeUpItem>
            )}

            </View>
        </ScrollView>

        <MyPlanModal
            visible={myPlanVisible}
            onClose={() => setMyPlanVisible(false)}
        />
        </Animated.View>
    );
}

    const styles = StyleSheet.create({
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
    weeklyPlan: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
    },
    
    weeklyPlanCard: {
    flex: 1,
    backgroundColor: colors.greyCard,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.greyBorder,
    },
    
    weeklyPlanCardActive: {
    backgroundColor: colors.blue,
    borderColor: colors.blue,
    shadowColor: colors.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    },
    
    weeklyPlanDay: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.grey,
    marginBottom: 4,
    },
    
    weeklyPlanDayActive: {
    color: 'rgba(255,255,255,0.7)',
    },
    
    weeklyPlanWorkout: {
    fontSize: 11,
    color: colors.grey,
    fontWeight: '300',
    textAlign: 'center',
    },
    
    weeklyPlanWorkoutActive: {
    color: colors.white,
    fontWeight: '500',
    },
    
    todayBadge: {
    marginTop: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 100,
    },
    
    todayBadgeText: {
    fontSize: 9,
    color: colors.white,
    fontWeight: '500',
    },
    
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
});