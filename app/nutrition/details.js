import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { lightColors } from '../../constants/colors';
import { FadeUpItem } from '../../components/ScreenWrapper';
import { useEffect, useState } from 'react';
import { getNutrition, getToken } from '../../services/api';

export default function NutritionDetailsScreen() {
  const theme = useTheme();
  const isDark = theme ? theme.isDark : false;
  const colors = theme ? theme.colors : lightColors;

  const [nutritionProfile, setNutritionProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const [newGoalWeight, setNewGoalWeight] = useState('');
  const [newGoal, setNewGoal] = useState('build_muscle');
  const [savingGoal, setSavingGoal] = useState(false);

  const styles = makeStyles(colors, isDark);

  useEffect(() => {
    async function fetchNutrition() {
      try {
        const data = await getNutrition();
        setNutritionProfile({
          age: data.user.age,
          gender: data.user.gender,
          height: data.user.height,
          weight: data.user.weight,
          goalWeight: data.user.goal_weight,
          goal: data.user.goal,
          foodPreferences: data.user.food_preferences || '',
          calories: data.nutrition.calories,
          protein: data.nutrition.protein,
          carbs: data.nutrition.carbs,
          fats: data.nutrition.fats,
          water: data.nutrition.water,
          maintenanceCalories: data.nutrition.tdee,
          surplus: data.user.goal === 'build_muscle' ? 300 : -500,
          weeksToGoal: data.nutrition.weeks_to_goal,
          bmi: Math.round((data.user.weight / Math.pow(data.user.height / 100, 2)) * 10) / 10,
          bmiCategory: getBMICategory(data.user.weight, data.user.height),
          activityLevel: `${data.user.training_days?.split(',').length || 3} days per week`,
          explanation: data.nutrition.explanation,
          startingWeight: data.user.starting_weight ?? data.user.weight,
        });

        const goalReached =
          (data.user.goal === 'build_muscle' &&
            data.user.weight >= data.user.goal_weight &&
            data.user.weight > (data.user.starting_weight || 0)) ||
          (data.user.goal === 'lose_weight' &&
            data.user.weight <= data.user.goal_weight &&
            data.user.weight < (data.user.starting_weight || 999));
        if (goalReached) setShowCelebration(true);
      } catch (error) {
        console.log('Failed to fetch nutrition:', error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchNutrition();
  }, []);

  function getBMICategory(weight, height) {
    const bmi = weight / Math.pow(height / 100, 2);
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Healthy weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Feather name="arrow-left" size={20} color={colors.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your nutrition</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: colors.grey }}>Loading your plan...</Text>
        </View>
      </View>
    );
  }

  if (!nutritionProfile) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Feather name="arrow-left" size={20} color={colors.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your nutrition</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: colors.grey }}>Complete onboarding to see your plan</Text>
        </View>
      </View>
    );
  }

  const progressPercent = (() => {
    const start = nutritionProfile.startingWeight;
    const current = nutritionProfile.weight;
    const goal = nutritionProfile.goalWeight;
    if (goal === start) return 0;
    const progress = Math.abs(current - start) / Math.abs(goal - start);
    return Math.round(Math.min(Math.max(progress, 0), 1) * 100);
  })();

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your nutrition</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

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
                <Text style={[styles.surplusValue, { color: colors.blueText }]}>+{nutritionProfile.surplus}</Text>
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

        <FadeUpItem delay={225}>
          {(() => {
            const prefs = nutritionProfile.foodPreferences?.split(',') || [];
            const isFasting = prefs.includes('fasting');
            const isEthiopian = prefs.includes('ethiopian');
            const isMeat = prefs.includes('meat');
            const isVegetarian = prefs.includes('vegetarian');

            let title = '';
            let description = '';
            let foods = [];
            let color = colors.blue;
            let bgColor = colors.blueLight;

            if (isFasting && isEthiopian) {
              title = '🕊️ Ethiopian Orthodox Fasting';
              description = 'Your meal plan follows Orthodox fasting guidelines — no meat, dairy or eggs. All meals are plant based and fasting compliant.';
              foods = ['Shiro with Injera', 'Misir Wot', 'Atkilt Wot', 'Tofu Stir Fry', 'Lentil Soup', 'Roasted Chickpeas', 'Edamame'];
              color = '#7C3AED';
              bgColor = '#EDE9FE';
            } else if (isFasting) {
              title = '🕊️ Fasting Diet';
              description = 'Your meal plan is fully plant based with no animal products. We have selected high protein plant foods to help you hit your targets.';
              foods = ['Tofu Stir Fry', 'Lentil Soup', 'Chickpea Curry', 'Edamame', 'Roasted Chickpeas', 'Peanut Butter on Toast'];
              color = '#7C3AED';
              bgColor = '#EDE9FE';
            } else if (isEthiopian && isMeat) {
              title = '🇪🇹 Ethiopian Meat Diet';
              description = 'Your meal plan includes a mix of Ethiopian dishes and international meals. You will get at least one Ethiopian meal per day — either lunch or dinner.';
              foods = ['Doro Wot', 'Tibs with Injera', 'Kitfo with Ayib', 'Asa Tibs', 'Firfir with Egg', 'Gomen with Eggs'];
              color = '#D97706';
              bgColor = '#FEF3C7';
            } else if (isEthiopian) {
              title = '🇪🇹 Ethiopian Diet';
              description = 'Your meal plan is built around Ethiopian cuisine. You will get at least one Ethiopian meal per day alongside international options.';
              foods = ['Shiro', 'Misir Wot', 'Tibs', 'Doro Wot', 'Firfir', 'Kitfo'];
              color = '#D97706';
              bgColor = '#FEF3C7';
            } else if (isMeat) {
              title = '🥩 Meat Based Diet';
              description = 'Your meal plan prioritises high protein meat dishes to help you hit your muscle building targets efficiently.';
              foods = ['Chicken Breast with Rice', 'Beef Stew', 'Grilled Fish', 'Turkey Meatballs', 'Salmon with Sweet Potato', 'Lamb Chops'];
              color = '#059669';
              bgColor = '#D1FAE5';
            } else if (isVegetarian) {
              title = '🌱 Vegetarian Diet';
              description = 'Your meal plan is fully vegetarian. We have selected high protein plant and dairy sources to help you hit your targets.';
              foods = ['Greek Yogurt', 'Cottage Cheese', 'Eggs', 'Tofu', 'Lentils', 'Chickpeas'];
              color = '#059669';
              bgColor = '#D1FAE5';
            } else {
              return null;
            }

            return (
              <View style={[styles.foodPrefCard, { borderColor: color, backgroundColor: bgColor }]}>
                <Text style={[styles.foodPrefTitle, { color }]}>{title}</Text>
                <Text style={[styles.foodPrefDescription, { color }]}>{description}</Text>
                <Text style={[styles.foodPrefSubtitle, { color }]}>Foods in your plan:</Text>
                <View style={styles.foodPrefList}>
                  {foods.map((food, i) => (
                    <View key={i} style={[styles.foodPrefChip, { backgroundColor: 'rgba(0,0,0,0.06)' }]}>
                      <Text style={[styles.foodPrefChipText, { color }]}>{food}</Text>
                    </View>
                  ))}
                </View>
              </View>
            );
          })()}
        </FadeUpItem>

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
                <Text style={[styles.progressValue, { color: colors.blueText }]}>{nutritionProfile.goalWeight}kg</Text>
              </View>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarTrack}>
                <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
              </View>
              <Text style={styles.progressBarLabel}>{progressPercent}% of the way there</Text>
            </View>
          </View>
        </FadeUpItem>

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

        <FadeUpItem delay={400}>
          <View style={styles.aiCard}>
            <View style={styles.aiCardTop}>
              <View style={styles.aiIconContainer}>
                <Feather name="zap" size={20} color={'#FFFFFF'} />
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
              onPress={() => Alert.alert('Coming soon', 'AI nutrition coaching is coming in the next update. Stay tuned.', [{ text: 'OK' }])}
            >
              <Feather name="message-circle" size={16} color={'#FFFFFF'} />
              <Text style={styles.aiButtonText}>Chat with AI</Text>
            </TouchableOpacity>
          </View>
        </FadeUpItem>

      </ScrollView>

      <Modal
        visible={showCelebration}
        animationType="fade"
        transparent
        onRequestClose={() => setShowCelebration(false)}
      >
        <View style={styles.celebrationOverlay}>
          <View style={styles.celebrationCard}>
            <Text style={styles.celebrationEmoji}>🎉</Text>
            <Text style={styles.celebrationTitle}>Goal reached!</Text>
            <Text style={styles.celebrationSub}>
              You hit {nutritionProfile.goalWeight}kg. That is a massive achievement. Time to set a new target.
            </Text>

            <Text style={styles.celebrationLabel}>New goal type</Text>
            <View style={styles.goalOptions}>
              {[
                { id: 'build_muscle', label: '💪 Build muscle' },
                { id: 'lose_weight', label: '🔥 Lose weight' },
                { id: 'stay_active', label: '⚡ Stay active' },
              ].map(option => (
                <TouchableOpacity
                  key={option.id}
                  style={[styles.goalOption, newGoal === option.id && styles.goalOptionSelected]}
                  onPress={() => setNewGoal(option.id)}
                >
                  <Text style={[styles.goalOptionText, newGoal === option.id && styles.goalOptionTextSelected]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.celebrationLabel}>New goal weight (kg)</Text>
            <TextInput
              style={styles.goalWeightInput}
              value={newGoalWeight}
              onChangeText={setNewGoalWeight}
              keyboardType="number-pad"
              placeholder={String(nutritionProfile.goalWeight || '')}
              placeholderTextColor={colors.greyLight}
              maxLength={3}
            />

            <TouchableOpacity
              style={styles.celebrationButton}
              onPress={async () => {
                if (!newGoalWeight) return;
                try {
                  setSavingGoal(true);
                  const token = await getToken();
                  await fetch(`https://web-production-9079c.up.railway.app/auth/onboarding?token=${token}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      goal: newGoal,
                      goal_weight: parseFloat(newGoalWeight),
                      starting_weight: nutritionProfile.weight,
                    }),
                  });
                  setShowCelebration(false);
                  setNutritionProfile(prev => ({
                    ...prev,
                    goal: newGoal,
                    goalWeight: parseFloat(newGoalWeight),
                    startingWeight: prev.weight,
                  }));
                } catch (e) {
                  console.log('Save goal error:', e.message);
                } finally {
                  setSavingGoal(false);
                }
              }}
            >
              <Text style={styles.celebrationButtonText}>
                {savingGoal ? 'Saving...' : 'Set new goal'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.celebrationSkip} onPress={() => setShowCelebration(false)}>
              <Text style={styles.celebrationSkipText}>Remind me later</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
    content: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40 },
    profileCard: {
      backgroundColor: colors.blue, borderRadius: 20, padding: 20, marginBottom: 16,
      shadowColor: colors.blue, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6, gap: 16,
    },
    profileTitle: { fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: '300' },
    profileGrid: { flexDirection: 'row', alignItems: 'center' },
    profileItem: { flex: 1, alignItems: 'center', gap: 4 },
    profileValue: { fontSize: 22, fontWeight: '700', color: '#FFFFFF', letterSpacing: -0.5 },
    profileLabel: { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: '300' },
    profileDivider: { width: 0.5, height: 40, backgroundColor: 'rgba(255,255,255,0.3)' },
    bmiCard: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 100, alignSelf: 'flex-start' },
    bmiText: { fontSize: 13, color: '#FFFFFF', fontWeight: '500' },
    goalCard: {
      backgroundColor: colors.white, borderRadius: 20, padding: 20, marginBottom: 24,
      borderWidth: 1, borderColor: colors.greyBorder,
      shadowColor: colors.black, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3, gap: 12,
    },
    goalHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    goalTitle: { fontSize: 16, fontWeight: '700', color: colors.black, letterSpacing: -0.3 },
    goalExplanation: { fontSize: 14, color: colors.grey, lineHeight: 20, fontWeight: '300' },
    surplusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.greyCard, borderRadius: 12, padding: 16 },
    surplusItem: { alignItems: 'center', gap: 2 },
    surplusLabel: { fontSize: 11, color: colors.grey, fontWeight: '300' },
    surplusValue: { fontSize: 20, fontWeight: '700', color: colors.black, letterSpacing: -0.5 },
    surplusUnit: { fontSize: 10, color: colors.greyLight },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.black, letterSpacing: -0.5, marginBottom: 12 },
    macroCard: {
      flexDirection: 'row', gap: 12, alignItems: 'flex-start', backgroundColor: colors.white,
      borderRadius: 16, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: colors.greyBorder,
      shadowColor: colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
    },
    macroContent: { flex: 1, gap: 6 },
    macroTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    macroName: { fontSize: 15, fontWeight: '600', color: colors.black },
    macroValue: { fontSize: 15, fontWeight: '700', color: colors.blueText },
    macroExplanation: { fontSize: 13, color: colors.grey, lineHeight: 18, fontWeight: '300' },
    waterCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#CFFAFE', borderRadius: 16, padding: 16, marginBottom: 24 },
    waterLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    waterTitle: { fontSize: 15, fontWeight: '600', color: '#0891B2' },
    waterSub: { fontSize: 12, color: '#0891B2', fontWeight: '300', opacity: 0.7 },
    waterValue: { fontSize: 28, fontWeight: '700', color: '#0891B2', letterSpacing: -1 },
    foodPrefCard: { borderRadius: 16, padding: 16, marginBottom: 24, borderWidth: 1, gap: 8 },
    foodPrefTitle: { fontSize: 16, fontWeight: '700', letterSpacing: -0.3 },
    foodPrefDescription: { fontSize: 13, lineHeight: 20, fontWeight: '300', opacity: 0.8 },
    foodPrefSubtitle: { fontSize: 12, fontWeight: '600', marginTop: 4 },
    foodPrefList: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    foodPrefChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100 },
    foodPrefChipText: { fontSize: 12, fontWeight: '500' },
    timingList: {
      backgroundColor: colors.white, borderRadius: 16, borderWidth: 1, borderColor: colors.greyBorder,
      marginBottom: 24, shadowColor: colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
    },
    timingItem: { flexDirection: 'row', gap: 12, padding: 16, alignItems: 'flex-start' },
    timingIconContainer: { width: 34, height: 34, borderRadius: 10, backgroundColor: colors.greyCard, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    timingContent: { flex: 1, gap: 4 },
    timingTitle: { fontSize: 14, fontWeight: '600', color: colors.black },
    timingText: { fontSize: 13, color: colors.grey, lineHeight: 18, fontWeight: '300' },
    timingDivider: { height: 0.5, backgroundColor: colors.greyBorder, marginHorizontal: 16 },
    progressCard: {
      backgroundColor: colors.white, borderRadius: 16, padding: 16, marginBottom: 24,
      borderWidth: 1, borderColor: colors.greyBorder,
      shadowColor: colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2, gap: 16,
    },
    progressRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    progressItem: { alignItems: 'center', gap: 4 },
    progressLabel: { fontSize: 12, color: colors.grey, fontWeight: '300' },
    progressValue: { fontSize: 24, fontWeight: '700', color: colors.black, letterSpacing: -0.5 },
    progressBarContainer: { gap: 8 },
    progressBarTrack: { height: 8, backgroundColor: colors.greyCard, borderRadius: 4, overflow: 'hidden' },
    progressBarFill: { height: 8, backgroundColor: colors.blue, borderRadius: 4 },
    progressBarLabel: { fontSize: 12, color: colors.grey, fontWeight: '300' },
    tipsList: { gap: 10, marginBottom: 24 },
    tipItem: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
    tipDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.blue, marginTop: 7, flexShrink: 0 },
    tipText: { fontSize: 14, color: colors.black, lineHeight: 20, flex: 1, fontWeight: '300' },
    aiCard: {
      backgroundColor: colors.blue, borderRadius: 20, padding: 20, gap: 16,
      shadowColor: colors.blue, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6, marginBottom: 20,
    },
    aiCardTop: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
    aiIconContainer: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    aiCardContent: { flex: 1, gap: 4 },
    aiCardTitle: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', letterSpacing: -0.3 },
    aiCardSub: { fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 18, fontWeight: '300' },
    aiButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: 'rgba(255,255,255,0.2)', paddingVertical: 14, borderRadius: 100 },
    aiButtonText: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
    celebrationOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', padding: 24 },
    celebrationCard: { backgroundColor: colors.white, borderRadius: 24, padding: 24, width: '100%', gap: 12, alignItems: 'center' },
    celebrationEmoji: { fontSize: 56 },
    celebrationTitle: { fontSize: 26, fontWeight: '700', color: colors.black, letterSpacing: -0.5 },
    celebrationSub: { fontSize: 14, color: colors.grey, fontWeight: '300', textAlign: 'center', lineHeight: 20 },
    celebrationLabel: { fontSize: 13, fontWeight: '600', color: colors.black, alignSelf: 'flex-start', marginTop: 4 },
    goalOptions: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', width: '100%' },
    goalOption: { flex: 1, paddingVertical: 10, paddingHorizontal: 8, borderRadius: 12, borderWidth: 1.5, borderColor: colors.greyBorder, alignItems: 'center' },
    goalOptionSelected: { borderColor: colors.blue, backgroundColor: colors.blueLight },
    goalOptionText: { fontSize: 12, fontWeight: '500', color: colors.grey, textAlign: 'center' },
    goalOptionTextSelected: { color: colors.blueText },
    goalWeightInput: { width: '100%', borderWidth: 1.5, borderColor: colors.greyBorder, borderRadius: 12, padding: 14, fontSize: 16, color: colors.black },
    celebrationButton: {
      width: '100%', backgroundColor: colors.blue, paddingVertical: 16, borderRadius: 100,
      alignItems: 'center', shadowColor: colors.blue, shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3, shadowRadius: 8, elevation: 4, marginTop: 4,
    },
    celebrationButtonText: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
    celebrationSkip: { paddingVertical: 8 },
    celebrationSkipText: { fontSize: 13, color: colors.grey, fontWeight: '300' },
  });
}
