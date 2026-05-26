import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { FadeUpItem } from '../../components/ScreenWrapper';
import BackgroundCircles from '../../components/BackgroundCircles';

const mealImages = {
    'firfir-egg': require('../../assets/images/firfir-egg2.png'),
  };


export const weeklyPlan = [
  {
    day: 'Monday',
    short: 'Mon',
    isToday: true,
    meals: [
      {
        id: 'firfir-egg',
        type: 'Breakfast',
        name: 'Firfir with Egg',
        calories: 520,
        protein: 28,
        isEthiopian: true,
        tag: 'High protein',
        tagColor: colors.blue,
        tagBg: colors.blueLight,
      },
      {
        id: 'chicken-rice',
        type: 'Lunch',
        name: 'Chicken Breast with Rice',
        calories: 650,
        protein: 52,
        isEthiopian: false,
        tag: 'Lean protein',
        tagColor: '#059669',
        tagBg: '#D1FAE5',
      },
      {
        id: 'tibs-injera',
        type: 'Dinner',
        name: 'Tibs with Injera',
        calories: 720,
        protein: 48,
        isEthiopian: true,
        tag: 'Ethiopian',
        tagColor: '#D97706',
        tagBg: '#FEF3C7',
      },
    ],
  },
  {
    day: 'Tuesday',
    short: 'Tue',
    isToday: false,
    meals: [
      {
        id: 'eggs-toast',
        type: 'Breakfast',
        name: 'Scrambled Eggs with Toast',
        calories: 480,
        protein: 24,
        isEthiopian: false,
        tag: 'Quick meal',
        tagColor: '#7C3AED',
        tagBg: '#EDE9FE',
      },
      {
        id: 'shiro-injera',
        type: 'Lunch',
        name: 'Shiro with Injera',
        calories: 580,
        protein: 28,
        isEthiopian: true,
        tag: 'Ethiopian',
        tagColor: '#D97706',
        tagBg: '#FEF3C7',
      },
      {
        id: 'grilled-fish',
        type: 'Dinner',
        name: 'Grilled Fish with Vegetables',
        calories: 620,
        protein: 55,
        isEthiopian: false,
        tag: 'High protein',
        tagColor: colors.blue,
        tagBg: colors.blueLight,
      },
    ],
  },
  {
    day: 'Wednesday',
    short: 'Wed',
    isToday: false,
    meals: [
      {
        id: 'greek-yogurt',
        type: 'Breakfast',
        name: 'Greek Yogurt with Honey',
        calories: 380,
        protein: 20,
        isEthiopian: false,
        tag: 'Light',
        tagColor: '#059669',
        tagBg: '#D1FAE5',
      },
      {
        id: 'kitfo',
        type: 'Lunch',
        name: 'Kitfo with Ayib',
        calories: 680,
        protein: 58,
        isEthiopian: true,
        tag: 'Ethiopian',
        tagColor: '#D97706',
        tagBg: '#FEF3C7',
      },
      {
        id: 'chicken-salad',
        type: 'Dinner',
        name: 'Chicken Salad Bowl',
        calories: 540,
        protein: 45,
        isEthiopian: false,
        tag: 'Lean protein',
        tagColor: '#059669',
        tagBg: '#D1FAE5',
      },
    ],
  },
  {
    day: 'Thursday',
    short: 'Thu',
    isToday: false,
    meals: [
      {
        id: 'firfir-egg',
        type: 'Breakfast',
        name: 'Firfir with Egg',
        calories: 520,
        protein: 28,
        isEthiopian: true,
        tag: 'High protein',
        tagColor: colors.blue,
        tagBg: colors.blueLight,
      },
      {
        id: 'beef-stew',
        type: 'Lunch',
        name: 'Beef Stew with Rice',
        calories: 720,
        protein: 52,
        isEthiopian: false,
        tag: 'High protein',
        tagColor: colors.blue,
        tagBg: colors.blueLight,
      },
      {
        id: 'misir-wot',
        type: 'Dinner',
        name: 'Misir Wot with Injera',
        calories: 560,
        protein: 24,
        isEthiopian: true,
        tag: 'Ethiopian',
        tagColor: '#D97706',
        tagBg: '#FEF3C7',
      },
    ],
  },
  {
    day: 'Friday',
    short: 'Fri',
    isToday: false,
    meals: [
      {
        id: 'oats-banana',
        type: 'Breakfast',
        name: 'Oats with Banana',
        calories: 420,
        protein: 14,
        isEthiopian: false,
        tag: 'Energy boost',
        tagColor: '#7C3AED',
        tagBg: '#EDE9FE',
      },
      {
        id: 'chicken-rice',
        type: 'Lunch',
        name: 'Chicken Breast with Rice',
        calories: 650,
        protein: 52,
        isEthiopian: false,
        tag: 'Lean protein',
        tagColor: '#059669',
        tagBg: '#D1FAE5',
      },
      {
        id: 'tibs-injera',
        type: 'Dinner',
        name: 'Tibs with Injera',
        calories: 720,
        protein: 48,
        isEthiopian: true,
        tag: 'Ethiopian',
        tagColor: '#D97706',
        tagBg: '#FEF3C7',
      },
    ],
  },
  {
    day: 'Saturday',
    short: 'Sat',
    isToday: false,
    meals: [
      {
        id: 'eggs-toast',
        type: 'Breakfast',
        name: 'Scrambled Eggs with Toast',
        calories: 480,
        protein: 24,
        isEthiopian: false,
        tag: 'Quick meal',
        tagColor: '#7C3AED',
        tagBg: '#EDE9FE',
      },
      {
        id: 'shiro-injera',
        type: 'Lunch',
        name: 'Shiro with Injera',
        calories: 580,
        protein: 28,
        isEthiopian: true,
        tag: 'Ethiopian',
        tagColor: '#D97706',
        tagBg: '#FEF3C7',
      },
      {
        id: 'grilled-fish',
        type: 'Dinner',
        name: 'Grilled Fish with Vegetables',
        calories: 620,
        protein: 55,
        isEthiopian: false,
        tag: 'High protein',
        tagColor: colors.blue,
        tagBg: colors.blueLight,
      },
    ],
  },
  {
    day: 'Sunday',
    short: 'Sun',
    isToday: false,
    meals: [
      {
        id: 'firfir-egg',
        type: 'Breakfast',
        name: 'Firfir with Egg',
        calories: 520,
        protein: 28,
        isEthiopian: true,
        tag: 'High protein',
        tagColor: colors.blue,
        tagBg: colors.blueLight,
      },
      {
        id: 'kitfo',
        type: 'Lunch',
        name: 'Kitfo with Ayib',
        calories: 680,
        protein: 58,
        isEthiopian: true,
        tag: 'Ethiopian',
        tagColor: '#D97706',
        tagBg: '#FEF3C7',
      },
      {
        id: 'chicken-salad',
        type: 'Dinner',
        name: 'Chicken Salad Bowl',
        calories: 540,
        protein: 45,
        isEthiopian: false,
        tag: 'Lean protein',
        tagColor: '#059669',
        tagBg: '#D1FAE5',
      },
    ],
  },
];

export default function WeeklyMealPlanScreen() {
  const [selectedDay, setSelectedDay] = useState(0);
  const currentDay = weeklyPlan[selectedDay];

  const totalCalories = currentDay.meals.reduce((sum, m) => sum + m.calories, 0);
  const totalProtein = currentDay.meals.reduce((sum, m) => sum + m.protein, 0);

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={20} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Weekly Meal Plan</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Day selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.daySelector}
      >
        {/* Day selector — grid style */}
<View style={styles.daySelector}>
  {weeklyPlan.map((day, index) => (
    <TouchableOpacity
      key={day.day}
      style={[
        styles.dayTab,
        selectedDay === index && styles.dayTabActive,
        day.isToday && selectedDay !== index && styles.dayTabToday,
      ]}
      onPress={() => setSelectedDay(index)}
    >
      <Text style={[
        styles.dayTabText,
        selectedDay === index && styles.dayTabTextActive,
        day.isToday && selectedDay !== index && styles.dayTabTextToday,
      ]}>
        {day.short}
      </Text>
    </TouchableOpacity>
  ))}
</View>
      </ScrollView>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <BackgroundCircles variant="topLeft" />

        {/* Day summary */}
        <FadeUpItem delay={0}>
          <View style={styles.daySummary}>
            <Text style={styles.dayTitle}>
              {currentDay.day}
              {currentDay.isToday && (
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
          </View>
        </FadeUpItem>

        {/* Meals list */}
        <FadeUpItem delay={100}>
          <View style={styles.mealsList}>
            {currentDay.meals.map((meal, index) => (
              <TouchableOpacity
                key={index}
                style={styles.mealCard}
                onPress={() => router.push({
                  pathname: `/meals/${meal.id}`,
                  params: { mealName: meal.name }
                })}
              >
                {/* Left — image placeholder */}
                {mealImages[meal.id] ? (
                <Image
                    source={mealImages[meal.id]}
                    style={styles.mealImagePlaceholder}
                    resizeMode="cover"
                />
                ) : (
                <View style={styles.mealImagePlaceholder}>
                    <Feather name="coffee" size={24} color={colors.greyLight} />
                </View>
                )}

                {/* Right — meal info */}
                <View style={styles.mealInfo}>
                  <View style={styles.mealTopRow}>
                    <Text style={styles.mealType}>{meal.type}</Text>
                    {meal.isEthiopian && (
                      <Text style={styles.flagEmoji}>🇪🇹</Text>
                    )}
                  </View>
                  <Text style={styles.mealName}>{meal.name}</Text>
                  <View style={styles.mealStats}>
                    <Text style={styles.mealStat}>{meal.calories} kcal</Text>
                    <Text style={styles.mealStatDot}>·</Text>
                    <Text style={styles.mealStat}>{meal.protein}g protein</Text>
                  </View>
                  <View style={[styles.mealTag, { backgroundColor: meal.tagBg }]}>
                    <Text style={[styles.mealTagText, { color: meal.tagColor }]}>
                      {meal.tag}
                    </Text>
                  </View>
                </View>

                {/* Swap button */}
                <TouchableOpacity
                  style={styles.swapButton}
                  onPress={() => router.push({
                    pathname: '/meals/swap',
                    params: { mealId: meal.id, mealType: meal.type }
                  })}
                >
                  <Feather name="refresh-cw" size={14} color={colors.grey} />
                </TouchableOpacity>

              </TouchableOpacity>
            ))}
          </View>
        </FadeUpItem>

        {/* Daily tip */}
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

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.greyBorder,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.greyCard,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.black,
  },

  // Day selector
  daySelector: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.greyBorder,
  },

  dayTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    backgroundColor: colors.greyCard,
    alignItems: 'center',
    gap: 4,
  },

  dayTabActive: {
    backgroundColor: colors.blue,
    shadowColor: colors.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  dayTabToday: {
    borderWidth: 1.5,
    borderColor: colors.blue,
  },

  dayTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.grey,
  },

  dayTabTextActive: {
    color: colors.white,
  },

  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.blue,
  },

  todayDotActive: {
    backgroundColor: colors.white,
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 120,
  },

  // Day summary
  daySummary: {
    marginBottom: 20,
  },

  dayTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.black,
    letterSpacing: -0.5,
    marginBottom: 8,
  },

  todayLabel: {
    color: colors.blue,
    fontWeight: '400',
  },

  daySummaryStats: {
    flexDirection: 'row',
    gap: 16,
  },

  daySummaryStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.blueLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },

  daySummaryStatText: {
    fontSize: 13,
    color: colors.blue,
    fontWeight: '500',
  },

  // Meals list
  mealsList: {
    gap: 12,
    marginBottom: 20,
  },

  mealCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.greyBorder,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    gap: 12,
  },

  // Image placeholder
  mealImagePlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: colors.greyCard,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    borderWidth: 1,
    borderColor: colors.greyBorder,
  },

  mealInfo: {
    flex: 1,
    gap: 4,
  },

  mealTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  mealType: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.grey,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  flagEmoji: {
    fontSize: 12,
  },

  mealName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.black,
    letterSpacing: -0.3,
  },

  mealStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  mealStat: {
    fontSize: 12,
    color: colors.grey,
    fontWeight: '300',
  },

  mealStatDot: {
    fontSize: 12,
    color: colors.greyLight,
  },

  mealTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 100,
    marginTop: 2,
  },

  mealTagText: {
    fontSize: 10,
    fontWeight: '500',
  },

  swapButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.greyCard,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  // Tip card
  tipCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.blueLight,
    borderRadius: 16,
    padding: 16,
    alignItems: 'flex-start',
  },

  tipContent: {
    flex: 1,
    gap: 4,
  },

  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.blue,
  },

  tipText: {
    fontSize: 13,
    color: colors.blue,
    lineHeight: 18,
    fontWeight: '300',
    opacity: 0.8,
  },
  daySelector: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.greyBorder,
  },
  
  dayTab: {
    width: 56,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.greyCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  dayTabActive: {
    backgroundColor: colors.blue,
    shadowColor: colors.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  
  dayTabToday: {
    borderWidth: 1.5,
    borderColor: colors.blue,
    backgroundColor: colors.white,
  },
  
  dayTabText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.grey,
  },
  
  dayTabTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  
  dayTabTextToday: {
    color: colors.blue,
    fontWeight: '600',
  },
});