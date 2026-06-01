import { View, Text, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { FadeUpItem } from '../../components/ScreenWrapper';
import { getMealById } from '../../services/api';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function MealDetailScreen() {
  const { id, day} = useLocalSearchParams();
  const [meal, setMeal] = useState(null);
  const [selectedBoosts, setSelectedBoosts] = useState([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    async function fetchMeal() {
      try {
        // Try backend first — numeric IDs come from backend
        if (!isNaN(id)) {
          const data = await getMealById(id);
          setMeal({
            name: data.name,
            type: data.meal_type,
            isEthiopian: data.is_ethiopian,
            calories: data.calories,
            protein: data.protein,
            carbs: data.carbs,
            fats: data.fats,
            prepTime: data.prep_time,
            bestTime: data.best_time,
            why: data.why,
            ingredients: data.ingredients,
            steps: data.steps,
            tag: data.tag,
            tagColor: data.tag_color,
            tagBg: data.tag_bg,
            protein_boosts: data.protein_boosts,
          });
        } else {
          // Fall back to hardcoded data for old string IDs
          const hardcoded = mealData[id];
          if (hardcoded) setMeal(hardcoded);
        }
      } catch (error) {
        console.log('Meal fetch error:', error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMeal();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: colors.grey }}>Loading meal...</Text>
        </View>
      </View>
    );
  }

  if (!meal) {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: colors.grey }}>Meal not found</Text>
        </View>
      </View>
    );
  }

  if (!meal) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Feather name="arrow-left" size={20} color={colors.black} />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>Meal not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{meal.type}</Text>
        <TouchableOpacity
          style={styles.swapButton}
          onPress={() => router.push({
            pathname: '/meals/swap',
            params: { mealId: id, mealType: meal.type }
          })}
        >
          <Feather name="refresh-cw" size={16} color={colors.grey} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* Image placeholder */}
        <FadeUpItem delay={0}>
          <View style={styles.imagePlaceholder}>
            <Feather name="camera" size={40} color="rgba(255,255,255,0.4)" />
            <Text style={styles.imagePlaceholderText}>Photo coming soon</Text>
            {meal.isEthiopian && (
            <View style={styles.ethiopianBadge}>
                <Text style={styles.ethiopianBadgeText}>🇪🇹 Ethiopian dish</Text>
            </View>
            )}
        </View>
          
        </FadeUpItem>

        {/* Meal name and prep time */}
        <FadeUpItem delay={100}>
          <Text style={styles.mealName}>{meal.name}</Text>
          <View style={styles.mealMeta}>
            <View style={styles.metaItem}>
              <Feather name="clock" size={14} color={colors.grey} />
              <Text style={styles.metaText}>{meal.prepTime}</Text>
            </View>
            <View style={styles.metaItem}>
              <Feather name="sun" size={14} color={colors.grey} />
              <Text style={styles.metaText}>{meal.type}</Text>
            </View>
          </View>
        </FadeUpItem>

        {/* Why this meal */}
        <FadeUpItem delay={150}>
          <View style={styles.whyCard}>
            <Feather name="info" size={16} color={colors.blue} />
            <Text style={styles.whyText}>{meal.why}</Text>
          </View>
        </FadeUpItem>

        {/* Best time to eat */}
        <FadeUpItem delay={175}>
          <View style={styles.bestTimeCard}>
            <Feather name="clock" size={16} color="#059669" />
            <Text style={styles.bestTimeText}>{meal.bestTime}</Text>
          </View>
        </FadeUpItem>

        {/* Nutrition stats */}
        <FadeUpItem delay={200}>
          <Text style={styles.sectionTitle}>Nutrition</Text>
          <View style={styles.nutritionRow}>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{meal.calories}</Text>
              <Text style={styles.nutritionLabel}>Calories</Text>
            </View>
            <View style={styles.nutritionDivider} />
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{meal.protein}g</Text>
              <Text style={styles.nutritionLabel}>Protein</Text>
            </View>
            <View style={styles.nutritionDivider} />
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{meal.carbs}g</Text>
              <Text style={styles.nutritionLabel}>Carbs</Text>
            </View>
            <View style={styles.nutritionDivider} />
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{meal.fats}g</Text>
              <Text style={styles.nutritionLabel}>Fats</Text>
            </View>
          </View>
        </FadeUpItem>

        {/* Ingredients */}
        <FadeUpItem delay={250}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          <Text style={styles.sectionSub}>No scales needed — use these simple measurements</Text>
          <View style={styles.ingredientsList}>
            {meal.ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientItem}>
                <View style={styles.ingredientDot} />
                <View style={styles.ingredientContent}>
                  <Text style={styles.ingredientName}>{ingredient.item}</Text>
                  <Text style={styles.ingredientAmount}>{ingredient.amount}</Text>
                </View>
              </View>
            ))}
          </View>
        </FadeUpItem>
        {meal.protein_boosts && (
          <FadeUpItem delay={320}>
            {/* Banner */}
            <View style={styles.fastingBanner}>
              <Feather name="zap" size={16} color="#D97706" />
              <Text style={styles.fastingBannerText}>
                {meal.protein_boosts.banner}
              </Text>
            </View>

            {/* Boost options */}
            <Text style={styles.sectionTitle}>Add a protein boost</Text>
            <Text style={styles.sectionSub}>
              You are {meal.protein_boosts.protein_gap}g short of your 
              protein target. Pick one to add alongside this meal.
            </Text>

            <View style={styles.boostList}>
              {meal.protein_boosts.options.map(boost => (
                <TouchableOpacity
                  key={boost.id}
                  style={[
                    styles.boostCard,
                    selectedBoosts.includes(boost.id) && styles.boostCardSelected
                  ]}
                  onPress={() => {
                    setSelectedBoosts(prev => {
                      if (prev.includes(boost.id)) {
                        return prev.filter(id => id !== boost.id);
                      } else if (prev.length < 2) {
                        return [...prev, boost.id];
                      } else {
                        return [prev[1], boost.id];
                      }
                    });
                  }}
                >
                  <View style={styles.boostLeft}>
                    <Text style={styles.boostName}>{boost.name}</Text>
                    <Text style={styles.boostAmount}>{boost.amount}</Text>
                    {selectedBoosts.includes(boost.id) && (
                      <Text style={styles.boostHowTo}>{boost.how_to}</Text>
                    )}
                  </View>
                  <View style={styles.boostRight}>
                    <Text style={styles.boostProtein}>+{boost.protein}g</Text>
                    <Text style={styles.boostCal}>{boost.calories} cal</Text>
                    <View style={[
                      styles.boostCheck,
                      selectedBoosts.includes(boost.id) && styles.boostCheckSelected
                    ]}>
                      {selectedBoosts.includes(boost.id) && (
                        <Feather name="check" size={12} color={colors.white} />
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* ← ADD THIS CONFIRM BUTTON */}
            {selectedBoosts.length > 0 && (
              <TouchableOpacity
                style={styles.boostConfirmButton}
                onPress={async () => {
                  const boosts = meal.protein_boosts.options.filter(
                    b => selectedBoosts.includes(b.id)
                  );
                  const totalProtein = boosts.reduce((sum, b) => sum + b.protein, 0);
                  const totalCalories = boosts.reduce((sum, b) => sum + b.calories, 0);
                
                  // Get current day key
                  const dayIndex = new Date().getDay();
                  const reorderedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
                  const dayKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
                  const todayKey = dayKeys[reorderedIndex];

                  const dayKey = day || (() => {
                    const dayIndex = new Date().getDay();
                    const reorderedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
                    return ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'][reorderedIndex];
                  })();
                  
                
                  // Save with day + meal ID as key
                  await AsyncStorage.setItem(
                    `boost_${dayKey}_${id}`,
                    JSON.stringify({
                      boosts: boosts,
                      totalProtein: totalProtein,
                      totalCalories: totalCalories,
                      mealId: id,
                      day: dayKey
                    })
                  );
                  router.back();
                }}
              >
                <Feather name="check" size={16} color={colors.white} />
                <Text style={styles.boostConfirmText}>
                  Add {selectedBoosts.length} boost{selectedBoosts.length > 1 ? 's' : ''} to my plan
                  {' '}(+{meal.protein_boosts.options
                    .filter(b => selectedBoosts.includes(b.id))
                    .reduce((sum, b) => sum + b.protein, 0)}g protein)
                </Text>
              </TouchableOpacity>
            )}
          </FadeUpItem>
        )}

        {/* How to make it */}
        <FadeUpItem delay={300}>
          <Text style={styles.sectionTitle}>How to make it</Text>
          <View style={styles.stepsList}>
            {meal.steps.map((step, index) => (
              <View key={index} style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        </FadeUpItem>

        {/* Swap button */}
        <FadeUpItem delay={350}>
          <TouchableOpacity
            style={styles.swapFullButton}
            onPress={() => router.push({
              pathname: '/meals/swap',
              params: { mealId: id, mealType: meal.type }
            })}
          >
            <Feather name="refresh-cw" size={16} color={colors.grey} />
            <Text style={styles.swapFullButtonText}>Swap this meal</Text>
          </TouchableOpacity>
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

  swapButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.greyCard,
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    paddingBottom: 40,
  },

  // Image placeholder
  imagePlaceholder: {
    height: 240,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },

  imagePlaceholderText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.4)',
  },

  ethiopianBadge: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },

  ethiopianBadgeText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '500',
  },

  mealName: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.black,
    letterSpacing: -0.5,
    marginBottom: 10,
    paddingHorizontal: 24,
  },

  mealMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
    paddingHorizontal: 24,
  },

  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  metaText: {
    fontSize: 13,
    color: colors.grey,
    fontWeight: '300',
  },

  // Why card
  whyCard: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: colors.blueLight,
    padding: 16,
    marginHorizontal: 24,
    borderRadius: 16,
    marginBottom: 10,
    alignItems: 'flex-start',
  },

  whyText: {
    fontSize: 13,
    color: colors.blue,
    lineHeight: 20,
    flex: 1,
    fontWeight: '300',
  },

  // Best time card
  bestTimeCard: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#D1FAE5',
    padding: 16,
    marginHorizontal: 24,
    borderRadius: 16,
    marginBottom: 24,
    alignItems: 'flex-start',
  },

  bestTimeText: {
    fontSize: 13,
    color: '#059669',
    lineHeight: 20,
    flex: 1,
    fontWeight: '300',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.black,
    letterSpacing: -0.5,
    marginBottom: 4,
    paddingHorizontal: 24,
  },

  sectionSub: {
    fontSize: 13,
    color: colors.grey,
    fontWeight: '300',
    marginBottom: 16,
    paddingHorizontal: 24,
  },

  // Nutrition
  nutritionRow: {
    flexDirection: 'row',
    backgroundColor: colors.blue,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 24,
    marginBottom: 24,
    shadowColor: colors.blue,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },

  nutritionItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },

  nutritionValue: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: -0.5,
  },

  nutritionLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '300',
  },

  nutritionDivider: {
    width: 0.5,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignSelf: 'center',
  },

  // Ingredients
  ingredientsList: {
    gap: 10,
    marginBottom: 24,
    paddingHorizontal: 24,
  },

  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: colors.greyCard,
    padding: 14,
    borderRadius: 12,
  },

  ingredientDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.blue,
    marginTop: 5,
    flexShrink: 0,
  },

  ingredientContent: {
    flex: 1,
  },

  ingredientName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 2,
  },

  ingredientAmount: {
    fontSize: 13,
    color: colors.grey,
    fontWeight: '300',
  },

  // Steps
  stepsList: {
    gap: 12,
    marginBottom: 24,
    paddingHorizontal: 24,
  },

  stepItem: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },

  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.blueLight,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 2,
  },

  stepNumberText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.blue,
  },

  stepText: {
    fontSize: 15,
    color: colors.black,
    lineHeight: 22,
    flex: 1,
    fontWeight: '300',
  },

  // Swap button
  swapFullButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 100,
    borderWidth: 1.5,
    borderColor: colors.greyBorder,
    marginBottom: 20,
  },

  swapFullButtonText: {
    fontSize: 15,
    color: colors.grey,
    fontWeight: '400',
  },

  mealImage: {
    height: 240,
    width: '100%',
    marginBottom: 20,
  },
  fastingBanner: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#FEF3C7',
    padding: 16,
    marginHorizontal: 24,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#D97706',
  },
  
  fastingBannerText: {
    fontSize: 13,
    color: '#92400E',
    lineHeight: 20,
    flex: 1,
    fontWeight: '300',
  },
  
  boostList: {
    gap: 10,
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  
  boostCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.greyBorder,
  },
  
  boostCardSelected: {
    borderColor: '#059669',
    backgroundColor: '#F0FDF4',
  },
  
  boostLeft: {
    flex: 1,
    gap: 4,
  },
  
  boostName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.black,
  },
  
  boostAmount: {
    fontSize: 13,
    color: colors.grey,
    fontWeight: '300',
  },
  
  boostHowTo: {
    fontSize: 12,
    color: '#059669',
    lineHeight: 18,
    fontWeight: '300',
    marginTop: 6,
  },
  
  boostRight: {
    alignItems: 'center',
    gap: 4,
  },
  
  boostProtein: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669',
  },
  
  boostCal: {
    fontSize: 11,
    color: colors.grey,
    fontWeight: '300',
  },
  
  boostCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.greyBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  
  boostCheckSelected: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  boostConfirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#059669',
    paddingVertical: 16,
    borderRadius: 100,
    marginHorizontal: 24,
    marginBottom: 12,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  boostConfirmText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.white,
  },
});