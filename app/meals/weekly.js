import { useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { lightColors } from '../../constants/colors';
import { FadeUpItem } from '../../components/ScreenWrapper';
import BackgroundCircles from '../../components/BackgroundCircles';
import { getToken } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://web-production-9079c.up.railway.app';

const DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const DAY_NAMES = {
  mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday',
  thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday'
};
const DAY_SHORT = {
  mon: 'Mon', tue: 'Tue', wed: 'Wed',
  thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun'
};
const MEAL_ORDER = ['breakfast', 'lunch', 'snack', 'snack2', 'dinner'];

export const weeklyPlan = [];

export default function WeeklyMealPlanScreen() {
  const theme = useTheme();
  const isDark = theme ? theme.isDark : false;
  const colors = theme ? theme.colors : lightColors;

  const { startDay } = useLocalSearchParams();

  const todayIndex = (() => {
    const day = new Date().getDay();
    return day === 0 ? 6 : day - 1;
  })();

  const initialIndex = startDay ? DAY_KEYS.indexOf(startDay) : todayIndex;

  const [selectedDayIndex, setSelectedDayIndex] = useState(initialIndex >= 0 ? initialIndex : todayIndex);
  const [weeklyData, setWeeklyData] = useState(null);
  const [nutritionTargets, setNutritionTargets] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedBoosts, setSavedBoosts] = useState({});
  const [savedSwaps, setSavedSwaps] = useState({});

  const styles = makeStyles(colors, isDark);

  useEffect(() => {
    fetchWeekly();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadStoredData();
    }, [])
  );

  async function loadStoredData() {
    try {
      const keys = await AsyncStorage.getAllKeys();

      const boostKeys = keys.filter(k => k.startsWith('boost_'));
      const boosts = {};
      for (const key of boostKeys) {
        const val = await AsyncStorage.getItem(key);
        if (val) {
          const boost = JSON.parse(val);
          boosts[`${boost.day}_${boost.mealId}`] = boost;
        }
      }
      setSavedBoosts(boosts);

      const swapKeys = keys.filter(k => k.startsWith('swap_'));
      const swaps = {};
      for (const key of swapKeys) {
        const val = await AsyncStorage.getItem(key);
        if (val) {
          const swap = JSON.parse(val);
          swaps[`${swap.day}_${swap.mealType}`] = swap;
        }
      }
      setSavedSwaps(swaps);
    } catch (error) {
      console.log('Storage load error:', error.message);
    }
  }

  async function fetchWeekly() {
    try {
      setLoading(true);
      const token = await getToken();

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(
        `${BASE_URL}/plan/meals/weekly?token=${token}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal
        }
      );
      clearTimeout(timeoutId);

      const data = await response.json();
      console.log('Weekly data response:', JSON.stringify(data).substring(0, 1000));
      console.log('Response status:', response.status);

      if (!response.ok) {
        console.log('Backend error:', data.detail);
        return;
      }

      setWeeklyData(data.week);
      setNutritionTargets(data.nutrition_targets);

      const dayMap = { 0: 'mon', 1: 'tue', 2: 'wed', 3: 'thu', 4: 'fri', 5: 'sat', 6: 'sun' };
      const todayKey = dayMap[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
      await AsyncStorage.setItem('todays_meals', JSON.stringify(data.week[todayKey]));

      await loadStoredData();
    } catch (error) {
      console.log('Weekly fetch error type:', error.constructor.name);
      console.log('Weekly fetch error message:', error.message);
    } finally {
      setLoading(false);
    }
  }

  const selectedDayKey = DAY_KEYS[selectedDayIndex];
  const currentDayMeals = weeklyData ? weeklyData[selectedDayKey] : null;

  const totalCalories = currentDayMeals
    ? MEAL_ORDER.reduce((sum, type) => {
        const baseMeal = currentDayMeals[type];
        if (!baseMeal) return sum;
        const displayType = type === 'snack2' ? 'snack' : type;
        const swap = savedSwaps[`${selectedDayKey}_${displayType}`];
        const meal = swap ? swap.meal : baseMeal;
        const boost = savedBoosts[`${selectedDayKey}_${String(meal.id)}`];
        return sum + meal.calories + (boost ? boost.totalCalories || 0 : 0);
      }, 0)
    : 0;

  const totalProtein = currentDayMeals
    ? MEAL_ORDER.reduce((sum, type) => {
        const baseMeal = currentDayMeals[type];
        if (!baseMeal) return sum;
        const displayType = type === 'snack2' ? 'snack' : type;
        const swap = savedSwaps[`${selectedDayKey}_${displayType}`];
        const meal = swap ? swap.meal : baseMeal;
        const boost = savedBoosts[`${selectedDayKey}_${String(meal.id)}`];
        return sum + meal.protein + (boost ? boost.totalProtein || 0 : 0);
      }, 0)
    : 0;

  const calorieTarget = nutritionTargets?.calories || 2000;
  const proteinTarget = nutritionTargets?.protein || 100;
  const calorieGap = calorieTarget - totalCalories;
  const proteinGap = proteinTarget - totalProtein;

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Weekly Meal Plan</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={{ height: 64, borderBottomWidth: 0.5, borderBottomColor: colors.greyBorder }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.daySelectorInner}
        >
          {DAY_KEYS.map((dayKey, index) => (
            <TouchableOpacity
              key={dayKey}
              style={[
                styles.dayTab,
                selectedDayIndex === index && styles.dayTabActive,
                todayIndex === index && selectedDayIndex !== index && styles.dayTabToday,
              ]}
              onPress={() => setSelectedDayIndex(index)}
            >
              <Text style={[
                styles.dayTabText,
                selectedDayIndex === index && styles.dayTabTextActive,
                todayIndex === index && selectedDayIndex !== index && styles.dayTabTextToday,
              ]}>
                {DAY_SHORT[dayKey]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <BackgroundCircles variant="topLeft" />

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.blue} />
            <Text style={styles.loadingText}>Building your week...</Text>
          </View>
        ) : !weeklyData ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Complete onboarding to see your weekly plan</Text>
          </View>
        ) : (
          <>
            <FadeUpItem delay={0}>
              <View style={styles.daySummary}>
                <Text style={styles.dayTitle}>
                  {DAY_NAMES[selectedDayKey]}
                  {todayIndex === selectedDayIndex && (
                    <Text style={styles.todayLabel}> — Today</Text>
                  )}
                </Text>
                <View style={styles.daySummaryStats}>
                  <View style={styles.daySummaryStat}>
                    <Feather name="zap" size={14} color={colors.blue} />
                    <Text style={styles.daySummaryStatText}>{totalCalories} kcal</Text>
                  </View>
                  <View style={styles.daySummaryStat}>
                    <Feather name="activity" size={14} color={colors.blue} />
                    <Text style={styles.daySummaryStatText}>{totalProtein}g protein</Text>
                  </View>
                </View>

                {(calorieGap > 200 || proteinGap > 10 || proteinGap < -5) && (
                  <View style={styles.gapMessage}>
                    <Feather name="info" size={14} color="#D97706" />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.gapMessageText}>
                        {proteinGap < -5
                          ? `Great work — you are ${Math.abs(Math.round(proteinGap))}g over your protein target today. Your calories are ${calorieGap > 0 ? `${Math.round(calorieGap)} short` : `${Math.abs(Math.round(calorieGap))} over target`}.`
                          : `You are ${Math.round(calorieGap)} cal and ${Math.round(proteinGap)}g protein short today. Tap any meal below to add a protein boost alongside it.`
                        }
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </FadeUpItem>

            <FadeUpItem delay={100}>
              <View style={styles.mealsList}>
                {currentDayMeals && MEAL_ORDER.map((mealType) => {
                  const displayType = mealType === 'snack2' ? 'snack' : mealType;
                  const swapKey = `${selectedDayKey}_${displayType}`;
                  const swap = savedSwaps[swapKey];
                  const meal = swap ? swap.meal : currentDayMeals[mealType];
                  if (!meal) return null;
                  const boost = savedBoosts[`${selectedDayKey}_${String(meal.id)}`];

                  return (
                    <TouchableOpacity
                      key={mealType}
                      style={styles.mealCard}
                      onPress={() => router.push({
                        pathname: `/meals/${meal.id}`,
                        params: { day: selectedDayKey }
                      })}
                    >
                      <View style={styles.mealImagePlaceholder}>
                        <Feather name="coffee" size={24} color={colors.greyLight} />
                      </View>

                      <View style={styles.mealInfo}>
                        <View style={styles.mealTopRow}>
                          <Text style={styles.mealType}>
                            {displayType.charAt(0).toUpperCase() + displayType.slice(1)}
                          </Text>
                          {meal.is_ethiopian && <Text style={styles.flagEmoji}>🇪🇹</Text>}
                          {swap && (
                            <View style={styles.swappedBadge}>
                              <Text style={styles.swappedBadgeText}>Swapped</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.mealName}>{meal.name}</Text>
                        <View style={styles.mealStats}>
                          <Text style={styles.mealStat}>{meal.calories} kcal</Text>
                          <Text style={styles.mealStatDot}>·</Text>
                          <Text style={styles.mealStat}>{meal.protein}g protein</Text>
                        </View>

                        {boost && boost.boosts && boost.boosts.map((b, i) => (
                          <View key={i} style={styles.boostBadge}>
                            <Feather name="plus" size={10} color="#059669" />
                            <Text style={styles.boostBadgeText}>{b.name} added</Text>
                          </View>
                        ))}

                        {meal.tag && (
                          <View style={[styles.mealTag, { backgroundColor: meal.tag_bg || colors.blueLight }]}>
                            <Text style={[styles.mealTagText, { color: meal.tag_color || colors.blue }]}>
                              {meal.tag}
                            </Text>
                          </View>
                        )}
                      </View>

                      <TouchableOpacity
                        style={styles.swapButton}
                        onPress={(e) => {
                          e.stopPropagation();
                          router.push({
                            pathname: '/meals/swap',
                            params: {
                              mealId: meal.id,
                              mealType: displayType,
                              swapGroup: meal.swap_group,
                              targetCalories: meal.calories,
                              day: selectedDayKey
                            }
                          });
                        }}
                      >
                        <Feather name="refresh-cw" size={14} color={colors.grey} />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </FadeUpItem>

            <FadeUpItem delay={200}>
              <View style={styles.tipCard}>
                <Feather name="sun" size={18} color={colors.blue} />
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>Daily tip</Text>
                  <Text style={styles.tipText}>
                    Drink at least 2 litres of water today. Staying hydrated improves performance and helps with muscle recovery.
                  </Text>
                </View>
              </View>
            </FadeUpItem>
          </>
        )}
      </ScrollView>
    </View>
  );
}

function makeStyles(c, dark) {
  const colors = c || lightColors;
  const isDark = dark || false;
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.white },
    header: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: 24, paddingTop: 60, paddingBottom: 16,
      borderBottomWidth: 0.5, borderBottomColor: colors.greyBorder,
    },
    backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.greyCard, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 17, fontWeight: '600', color: colors.black },
    daySelectorInner: { paddingHorizontal: 16, paddingVertical: 12, gap: 8, flexDirection: 'row', alignItems: 'center' },
    dayTab: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, backgroundColor: colors.greyCard, alignItems: 'center', justifyContent: 'center' },
    dayTabActive: { backgroundColor: colors.blue, shadowColor: colors.blue, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
    dayTabToday: { borderWidth: 1.5, borderColor: colors.blue, backgroundColor: colors.white },
    dayTabText: { fontSize: 13, fontWeight: '500', color: colors.grey },
    dayTabTextActive: { color: '#FFFFFF', fontWeight: '600' },
    dayTabTextToday: { color: colors.blueText, fontWeight: '600' },
    content: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 120 },
    loadingContainer: { paddingTop: 80, alignItems: 'center', gap: 12 },
    loadingText: { fontSize: 14, color: colors.grey, fontWeight: '300' },
    daySummary: { marginBottom: 20, gap: 10 },
    dayTitle: { fontSize: 22, fontWeight: '700', color: colors.black, letterSpacing: -0.5 },
    todayLabel: { color: colors.blueText, fontWeight: '400' },
    daySummaryStats: { flexDirection: 'row', gap: 16 },
    daySummaryStat: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.blueLight, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 100 },
    daySummaryStatText: { fontSize: 13, color: colors.blueText, fontWeight: '500' },
    gapMessage: { flexDirection: 'row', gap: 8, backgroundColor: '#FEF3C7', padding: 12, borderRadius: 12, alignItems: 'flex-start', borderWidth: 1, borderColor: '#D97706' },
    gapMessageText: { fontSize: 12, color: '#92400E', lineHeight: 18, fontWeight: '300' },
    mealsList: { gap: 12, marginBottom: 20 },
    mealCard: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: colors.white, borderRadius: 16, padding: 12, borderWidth: 1, borderColor: colors.greyBorder, shadowColor: colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2, gap: 12 },
    mealImagePlaceholder: { width: 72, height: 72, borderRadius: 12, backgroundColor: colors.greyCard, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 },
    mealInfo: { flex: 1, gap: 4 },
    mealTopRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
    mealType: { fontSize: 11, fontWeight: '600', color: colors.grey, textTransform: 'uppercase', letterSpacing: 0.5 },
    flagEmoji: { fontSize: 12 },
    swappedBadge: { backgroundColor: colors.blueLight, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 100 },
    swappedBadgeText: { fontSize: 10, color: colors.blueText, fontWeight: '500' },
    mealName: { fontSize: 15, fontWeight: '600', color: colors.black, letterSpacing: -0.3 },
    mealStats: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    mealStat: { fontSize: 12, color: colors.grey, fontWeight: '300' },
    mealStatDot: { fontSize: 12, color: colors.greyLight },
    boostBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#D1FAE5', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 100, alignSelf: 'flex-start' },
    boostBadgeText: { fontSize: 10, color: '#059669', fontWeight: '500' },
    mealTag: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 100, marginTop: 2 },
    mealTagText: { fontSize: 10, fontWeight: '500' },
    swapButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.greyCard, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 },
    tipCard: { flexDirection: 'row', gap: 12, backgroundColor: colors.blueLight, borderRadius: 16, padding: 16, alignItems: 'flex-start' },
    tipContent: { flex: 1, gap: 4 },
    tipTitle: { fontSize: 14, fontWeight: '600', color: colors.blueText },
    tipText: { fontSize: 13, color: colors.blueText, lineHeight: 18, fontWeight: '300', opacity: 0.8 },
  });
}
