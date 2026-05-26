import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { FadeUpItem } from '../../components/ScreenWrapper';

// Hardcoded — calculated from onboarding answers later
const nutritionProfile = {
  // User stats from onboarding
  age: 26,
  gender: 'Male',
  height: 178,
  weight: 75,
  goalWeight: 82,
  goal: 'Build muscle',
  activityLevel: '4 days per week',

  // Calculated targets
  calories: 2100,
  protein: 158,
  carbs: 210,
  fats: 70,
  water: 2.6,

  // Surplus or deficit
  maintenanceCalories: 1800,
  surplus: 300,

  // Estimated timeline
  weeksToGoal: 12,

  // BMI
  bmi: 23.7,
  bmiCategory: 'Healthy weight',
};

export default function NutritionDetailsScreen() {
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
        <Text style={styles.headerTitle}>Your nutrition</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* Profile summary */}
        <FadeUpItem delay={0}>
          <View style={styles.profileCard}>
            <Text style={styles.profileTitle}>Based on your profile</Text>
            <View style={styles.profileGrid}>
              <View style={styles.profileItem}>
                <Text style={styles.profileValue}>{nutritionProfile.age}</Text>
                <Text style={styles.profileLabel}>Age</Text>
              </View>
              <View style={styles.profileDivider} />
              <View style={styles.profileItem}>
                <Text style={styles.profileValue}>{nutritionProfile.height}cm</Text>
                <Text style={styles.profileLabel}>Height</Text>
              </View>
              <View style={styles.profileDivider} />
              <View style={styles.profileItem}>
                <Text style={styles.profileValue}>{nutritionProfile.weight}kg</Text>
                <Text style={styles.profileLabel}>Weight</Text>
              </View>
              <View style={styles.profileDivider} />
              <View style={styles.profileItem}>
                <Text style={styles.profileValue}>{nutritionProfile.bmi}</Text>
                <Text style={styles.profileLabel}>BMI</Text>
              </View>
            </View>
            <View style={styles.bmiCard}>
              <Feather name="check-circle" size={14} color="#059669" />
              <Text style={styles.bmiText}>{nutritionProfile.bmiCategory}</Text>
            </View>
          </View>
        </FadeUpItem>

        {/* Goal and surplus */}
        <FadeUpItem delay={100}>
          <View style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <Feather name="target" size={18} color={colors.blue} />
              <Text style={styles.goalTitle}>Your goal — {nutritionProfile.goal}</Text>
            </View>
            <Text style={styles.goalExplanation}>
              To build muscle you need to eat slightly more than your body burns each day. Your body uses the extra calories to build new muscle tissue.
            </Text>
            <View style={styles.surplusRow}>
              <View style={styles.surplusItem}>
                <Text style={styles.surplusLabel}>You burn</Text>
                <Text style={styles.surplusValue}>{nutritionProfile.maintenanceCalories}</Text>
                <Text style={styles.surplusUnit}>kcal/day</Text>
              </View>
              <Feather name="plus" size={20} color={colors.blue} />
              <View style={styles.surplusItem}>
                <Text style={styles.surplusLabel}>Surplus</Text>
                <Text style={[styles.surplusValue, { color: colors.blue }]}>+{nutritionProfile.surplus}</Text>
                <Text style={styles.surplusUnit}>kcal</Text>
              </View>
              <Feather name="equals" size={20} color={colors.black} />
              <View style={styles.surplusItem}>
                <Text style={styles.surplusLabel}>Your target</Text>
                <Text style={[styles.surplusValue, { color: '#059669' }]}>{nutritionProfile.calories}</Text>
                <Text style={styles.surplusUnit}>kcal/day</Text>
              </View>
            </View>
          </View>
        </FadeUpItem>

        {/* Macro breakdown */}
        <FadeUpItem delay={150}>
          <Text style={styles.sectionTitle}>Your daily targets</Text>

          <View style={styles.macroCard}>
            <Feather name="zap" size={18} color="#D97706" />
            <View style={styles.macroContent}>
              <View style={styles.macroTopRow}>
                <Text style={styles.macroName}>Calories</Text>
                <Text style={styles.macroValue}>{nutritionProfile.calories} kcal</Text>
              </View>
              <Text style={styles.macroExplanation}>
                Total energy your body needs each day to build muscle and recover from training.
              </Text>
            </View>
          </View>

          <View style={styles.macroCard}>
            <Feather name="activity" size={18} color={colors.blue} />
            <View style={styles.macroContent}>
              <View style={styles.macroTopRow}>
                <Text style={styles.macroName}>Protein</Text>
                <Text style={styles.macroValue}>{nutritionProfile.protein}g</Text>
              </View>
              <Text style={styles.macroExplanation}>
                The building block of muscle. Aim for protein with every single meal — eggs, chicken, beef, shiro, kitfo and ayib are all excellent sources.
              </Text>
            </View>
          </View>

          <View style={styles.macroCard}>
            <Feather name="battery-charging" size={18} color="#059669" />
            <View style={styles.macroContent}>
              <View style={styles.macroTopRow}>
                <Text style={styles.macroName}>Carbohydrates</Text>
                <Text style={styles.macroValue}>{nutritionProfile.carbs}g</Text>
              </View>
              <Text style={styles.macroExplanation}>
                Your main energy source. Injera, rice and oats are great options. Eat most of your carbs around your workout for best results.
              </Text>
            </View>
          </View>

          <View style={styles.macroCard}>
            <Feather name="droplet" size={18} color="#DC2626" />
            <View style={styles.macroContent}>
              <View style={styles.macroTopRow}>
                <Text style={styles.macroName}>Fats</Text>
                <Text style={styles.macroValue}>{nutritionProfile.fats}g</Text>
              </View>
              <Text style={styles.macroExplanation}>
                Essential for hormones and joint health. Niter kibbeh, olive oil, eggs and avocado are good sources. Do not cut fat too low.
              </Text>
            </View>
          </View>

        </FadeUpItem>

        {/* Water intake */}
        <FadeUpItem delay={200}>
          <View style={styles.waterCard}>
            <View style={styles.waterLeft}>
              <Feather name="droplet" size={20} color="#0891B2" />
              <View>
                <Text style={styles.waterTitle}>Daily water target</Text>
                <Text style={styles.waterSub}>Based on your body weight</Text>
              </View>
            </View>
            <Text style={styles.waterValue}>{nutritionProfile.water}L</Text>
          </View>
        </FadeUpItem>

        {/* Meal timing */}
        <FadeUpItem delay={250}>
          <Text style={styles.sectionTitle}>Meal timing</Text>
          <View style={styles.timingList}>

            <View style={styles.timingItem}>
              <View style={styles.timingIconContainer}>
                <Feather name="sunrise" size={16} color="#D97706" />
              </View>
              <View style={styles.timingContent}>
                <Text style={styles.timingTitle}>Before workout</Text>
                <Text style={styles.timingText}>Eat a carb and protein meal 1-2 hours before training. Firfir with egg or oats with banana work well.</Text>
              </View>
            </View>

            <View style={styles.timingDivider} />

            <View style={styles.timingItem}>
              <View style={styles.timingIconContainer}>
                <Feather name="zap" size={16} color={colors.blue} />
              </View>
              <View style={styles.timingContent}>
                <Text style={styles.timingTitle}>After workout</Text>
                <Text style={styles.timingText}>Eat within 30-60 minutes after training. This is your most important meal. High protein — chicken, tibs or kitfo are ideal.</Text>
              </View>
            </View>

            <View style={styles.timingDivider} />

            <View style={styles.timingItem}>
              <View style={styles.timingIconContainer}>
                <Feather name="moon" size={16} color="#7C3AED" />
              </View>
              <View style={styles.timingContent}>
                <Text style={styles.timingTitle}>Before bed</Text>
                <Text style={styles.timingText}>Have your last meal at least 2 hours before sleeping. Keep it lighter — misir wot or a chicken salad work well.</Text>
              </View>
            </View>

          </View>
        </FadeUpItem>

        {/* Progress */}
        <FadeUpItem delay={300}>
          <Text style={styles.sectionTitle}>Your progress</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressRow}>
              <View style={styles.progressItem}>
                <Text style={styles.progressLabel}>Current weight</Text>
                <Text style={styles.progressValue}>{nutritionProfile.weight}kg</Text>
              </View>
              <Feather name="arrow-right" size={20} color={colors.greyLight} />
              <View style={styles.progressItem}>
                <Text style={styles.progressLabel}>Goal weight</Text>
                <Text style={[styles.progressValue, { color: colors.blue }]}>{nutritionProfile.goalWeight}kg</Text>
              </View>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarTrack}>
                <View style={[styles.progressBarFill, { width: '15%' }]} />
              </View>
              <Text style={styles.progressBarLabel}>15% of the way there</Text>
            </View>
            <View style={styles.estimateRow}>
              <Feather name="clock" size={14} color={colors.grey} />
              <Text style={styles.estimateText}>
                At this rate you will reach your goal in approximately {nutritionProfile.weeksToGoal} weeks
              </Text>
            </View>
          </View>
        </FadeUpItem>

        {/* Simple tips */}
        <FadeUpItem delay={350}>
          <Text style={styles.sectionTitle}>Simple rules to follow</Text>
          <View style={styles.tipsList}>
            {[
              'Eat protein with every meal — no exceptions',
              'Drink water before you feel thirsty',
              'Do not skip breakfast — especially on training days',
              'Cook with niter kibbeh or olive oil — not vegetable oil',
              'Injera is fine — it is a complex carb that digests slowly',
              'Consistency beats perfection — one bad meal does not ruin progress',
            ].map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <View style={styles.tipDot} />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        </FadeUpItem>

        {/* AI nutritionist button */}
        <FadeUpItem delay={400}>
          <View style={styles.aiCard}>
            <View style={styles.aiCardTop}>
              <View style={styles.aiIconContainer}>
                <Feather name="zap" size={20} color={colors.white} />
              </View>
              <View style={styles.aiCardContent}>
                <Text style={styles.aiCardTitle}>Ask your AI nutritionist</Text>
                <Text style={styles.aiCardSub}>
                  Have a question about your meals or nutrition? Our AI understands Ethiopian food and your specific goals.
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.aiButton}
              onPress={() => Alert.alert(
                'Coming soon',
                'AI nutrition coaching is coming in the next update. Stay tuned.',
                [{ text: 'OK' }]
              )}
            >
              <Feather name="message-circle" size={16} color={colors.white} />
              <Text style={styles.aiButtonText}>Chat with AI</Text>
            </TouchableOpacity>
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

  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },

  // Profile card
  profileCard: {
    backgroundColor: colors.blue,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: colors.blue,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    gap: 16,
  },

  profileTitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '300',
  },

  profileGrid: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  profileItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },

  profileValue: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: -0.5,
  },

  profileLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '300',
  },

  profileDivider: {
    width: 0.5,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },

  bmiCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 100,
    alignSelf: 'flex-start',
  },

  bmiText: {
    fontSize: 13,
    color: colors.white,
    fontWeight: '500',
  },

  // Goal card
  goalCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.greyBorder,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    gap: 12,
  },

  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  goalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.black,
    letterSpacing: -0.3,
  },

  goalExplanation: {
    fontSize: 14,
    color: colors.grey,
    lineHeight: 20,
    fontWeight: '300',
  },

  surplusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.greyCard,
    borderRadius: 12,
    padding: 16,
  },

  surplusItem: {
    alignItems: 'center',
    gap: 2,
  },

  surplusLabel: {
    fontSize: 11,
    color: colors.grey,
    fontWeight: '300',
  },

  surplusValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.black,
    letterSpacing: -0.5,
  },

  surplusUnit: {
    fontSize: 10,
    color: colors.greyLight,
  },

  // Section title
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.black,
    letterSpacing: -0.5,
    marginBottom: 12,
  },

  // Macro cards
  macroCard: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.greyBorder,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  macroContent: {
    flex: 1,
    gap: 6,
  },

  macroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  macroName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.black,
  },

  macroValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.blue,
  },

  macroExplanation: {
    fontSize: 13,
    color: colors.grey,
    lineHeight: 18,
    fontWeight: '300',
  },

  // Water
  waterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#CFFAFE',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },

  waterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  waterTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0891B2',
  },

  waterSub: {
    fontSize: 12,
    color: '#0891B2',
    fontWeight: '300',
    opacity: 0.7,
  },

  waterValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0891B2',
    letterSpacing: -1,
  },

  // Meal timing
  timingList: {
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

  timingItem: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    alignItems: 'flex-start',
  },

  timingIconContainer: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.greyCard,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  timingContent: {
    flex: 1,
    gap: 4,
  },

  timingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.black,
  },

  timingText: {
    fontSize: 13,
    color: colors.grey,
    lineHeight: 18,
    fontWeight: '300',
  },

  timingDivider: {
    height: 0.5,
    backgroundColor: colors.greyBorder,
    marginHorizontal: 16,
  },

  // Progress
  progressCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.greyBorder,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    gap: 16,
  },

  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  progressItem: {
    alignItems: 'center',
    gap: 4,
  },

  progressLabel: {
    fontSize: 12,
    color: colors.grey,
    fontWeight: '300',
  },

  progressValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.black,
    letterSpacing: -0.5,
  },

  progressBarContainer: {
    gap: 8,
  },

  progressBarTrack: {
    height: 8,
    backgroundColor: colors.greyCard,
    borderRadius: 4,
    overflow: 'hidden',
  },

  progressBarFill: {
    height: 8,
    backgroundColor: colors.blue,
    borderRadius: 4,
  },

  progressBarLabel: {
    fontSize: 12,
    color: colors.grey,
    fontWeight: '300',
  },

  estimateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.greyCard,
    padding: 12,
    borderRadius: 12,
  },

  estimateText: {
    fontSize: 13,
    color: colors.grey,
    lineHeight: 18,
    flex: 1,
    fontWeight: '300',
  },

  // Tips
  tipsList: {
    gap: 10,
    marginBottom: 24,
  },

  tipItem: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },

  tipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.blue,
    marginTop: 7,
    flexShrink: 0,
  },

  tipText: {
    fontSize: 14,
    color: colors.black,
    lineHeight: 20,
    flex: 1,
    fontWeight: '300',
  },

  // AI card
  aiCard: {
    backgroundColor: colors.blue,
    borderRadius: 20,
    padding: 20,
    gap: 16,
    shadowColor: colors.blue,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 20,
  },

  aiCardTop: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },

  aiIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  aiCardContent: {
    flex: 1,
    gap: 4,
  },

  aiCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: -0.3,
  },

  aiCardSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 18,
    fontWeight: '300',
  },

  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 14,
    borderRadius: 100,
  },

  aiButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.white,
  },
});