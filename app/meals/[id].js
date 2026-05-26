import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { FadeUpItem } from '../../components/ScreenWrapper';


const mealImages = {
    'firfir-egg': require('../../assets/images/firfir-egg.png'),
  };

const mealData = {
  'firfir-egg': {
    name: 'Firfir with Egg',
    type: 'Breakfast',
    isEthiopian: true,
    calories: 520,
    protein: 28,
    carbs: 48,
    fats: 18,
    prepTime: '15 mins',
    bestTime: 'Best eaten 30-60 minutes before your workout',
    why: 'Firfir is a high energy Ethiopian breakfast that combines complex carbs from injera with protein from eggs. Perfect for fuelling a morning workout without feeling heavy.',
    ingredients: [
      { item: 'Injera', amount: '2 palm sized pieces' },
      { item: 'Eggs', amount: '2 whole eggs' },
      { item: 'Berbere spice', amount: '1 tablespoon' },
      { item: 'Onion', amount: '1 small onion — fist sized' },
      { item: 'Olive oil', amount: '1 tablespoon' },
      { item: 'Tomato', amount: '1 medium tomato' },
      { item: 'Salt', amount: 'A pinch' },
    ],
    steps: [
      'Heat oil in a pan over medium heat',
      'Dice the onion and fry until golden — about 5 minutes',
      'Add berbere spice and stir for 1 minute',
      'Add diced tomato and cook for 3 minutes until soft',
      'Tear the injera into small pieces and add to the pan',
      'Mix everything together and cook for 2 minutes',
      'Push the firfir to one side and crack the eggs into the pan',
      'Cook the eggs to your liking — scrambled or fried',
      'Serve immediately while hot',
    ],
  },
  'chicken-rice': {
    name: 'Chicken Breast with Rice',
    type: 'Lunch',
    isEthiopian: false,
    calories: 650,
    protein: 52,
    carbs: 68,
    fats: 12,
    prepTime: '25 mins',
    bestTime: 'Best eaten 1-2 hours after your workout for muscle recovery',
    why: 'Chicken breast is one of the leanest protein sources available. Combined with brown rice for complex carbs this meal is ideal for muscle building and recovery.',
    ingredients: [
      { item: 'Chicken breast', amount: '1 piece — palm sized and 2cm thick' },
      { item: 'Brown rice', amount: 'A cupped handful' },
      { item: 'Olive oil', amount: '1 tablespoon' },
      { item: 'Garlic', amount: '2 cloves' },
      { item: 'Lemon', amount: 'Half a lemon' },
      { item: 'Mixed vegetables', amount: 'Two handfuls' },
      { item: 'Salt and pepper', amount: 'A pinch of each' },
    ],
    steps: [
      'Cook the rice according to packet instructions — usually 20 minutes',
      'Season the chicken with salt, pepper and crushed garlic',
      'Heat oil in a pan over medium-high heat',
      'Cook the chicken for 6-7 minutes each side until golden',
      'Squeeze lemon juice over the chicken while cooking',
      'Steam or boil the vegetables for 5 minutes',
      'Rest the chicken for 2 minutes before slicing',
      'Serve chicken over rice with vegetables on the side',
    ],
  },
  'tibs-injera': {
    name: 'Tibs with Injera',
    type: 'Dinner',
    isEthiopian: true,
    calories: 720,
    protein: 48,
    carbs: 62,
    fats: 22,
    prepTime: '20 mins',
    bestTime: 'Best eaten at least 2 hours before bed for proper digestion',
    why: 'Tibs is a protein rich Ethiopian dish made with sautéed beef. The injera provides complex carbs that digest slowly keeping you full through the night and fuelling recovery.',
    ingredients: [
      { item: 'Beef', amount: '1 palm sized piece cut into small cubes' },
      { item: 'Injera', amount: '2 large pieces' },
      { item: 'Rosemary', amount: '2 sprigs' },
      { item: 'Jalapeño', amount: '1 small — optional' },
      { item: 'Onion', amount: '1 medium onion' },
      { item: 'Butter or oil', amount: '1 tablespoon' },
      { item: 'Garlic', amount: '3 cloves' },
      { item: 'Salt', amount: 'A pinch' },
    ],
    steps: [
      'Cut the beef into small bite sized cubes',
      'Heat butter in a pan over high heat',
      'Add the beef and cook for 3-4 minutes until browned',
      'Add sliced onion and cook for 3 minutes',
      'Add crushed garlic, rosemary and jalapeño',
      'Stir everything together for 2 minutes',
      'Season with salt to taste',
      'Serve on top of injera — let the injera soak up the juices',
    ],
  },
  'shiro-injera': {
    name: 'Shiro with Injera',
    type: 'Lunch',
    isEthiopian: true,
    calories: 580,
    protein: 28,
    carbs: 72,
    fats: 14,
    prepTime: '20 mins',
    bestTime: 'Great as a midday meal — provides sustained energy for the afternoon',
    why: 'Shiro is made from ground chickpeas and is one of the best plant based protein sources in Ethiopian cuisine. High in fibre and protein it keeps you full and energised.',
    ingredients: [
      { item: 'Shiro powder', amount: '3 tablespoons' },
      { item: 'Water', amount: '2 cups' },
      { item: 'Onion', amount: '1 medium onion' },
      { item: 'Berbere', amount: '1 teaspoon' },
      { item: 'Oil', amount: '2 tablespoons' },
      { item: 'Garlic', amount: '2 cloves' },
      { item: 'Injera', amount: '2 large pieces' },
    ],
    steps: [
      'Finely dice the onion and fry in oil until very soft — about 8 minutes',
      'Add garlic and berbere and stir for 1 minute',
      'Mix shiro powder with a little cold water to make a paste',
      'Add the shiro paste to the pan and stir well',
      'Slowly add the remaining water while stirring',
      'Cook on low heat for 10 minutes stirring regularly',
      'The shiro should be thick and smooth — add more water if too thick',
      'Serve over injera',
    ],
  },
  'kitfo': {
    name: 'Kitfo with Ayib',
    type: 'Lunch',
    isEthiopian: true,
    calories: 680,
    protein: 58,
    carbs: 42,
    fats: 28,
    prepTime: '10 mins',
    bestTime: 'Excellent post-workout meal — very high in protein for muscle recovery',
    why: 'Kitfo is one of the highest protein Ethiopian dishes available. Made from lean minced beef it is incredibly effective for muscle building. Ayib adds extra protein and probiotics.',
    ingredients: [
      { item: 'Lean minced beef', amount: '1 palm sized portion' },
      { item: 'Mitmita spice', amount: '1 teaspoon' },
      { item: 'Niter kibbeh', amount: '1 tablespoon' },
      { item: 'Ayib cheese', amount: '2 tablespoons' },
      { item: 'Injera', amount: '1 piece' },
      { item: 'Salt', amount: 'A pinch' },
    ],
    steps: [
      'Warm the niter kibbeh in a pan over low heat',
      'Add the minced beef and mix well with the spiced butter',
      'Add mitmita and salt and mix thoroughly',
      'Cook lightly or serve raw depending on preference',
      'Plate with ayib on the side',
      'Serve with injera',
    ],
  },
  'misir-wot': {
    name: 'Misir Wot with Injera',
    type: 'Dinner',
    isEthiopian: true,
    calories: 560,
    protein: 24,
    carbs: 78,
    fats: 10,
    prepTime: '30 mins',
    bestTime: 'Light evening meal — easy to digest before bed',
    why: 'Misir Wot is a spiced red lentil stew that is high in plant protein and fibre. It is one of the most nutritious Ethiopian dishes and perfect for a lighter evening meal.',
    ingredients: [
      { item: 'Red lentils', amount: 'A cupped handful' },
      { item: 'Berbere', amount: '2 tablespoons' },
      { item: 'Onion', amount: '1 large onion' },
      { item: 'Oil', amount: '2 tablespoons' },
      { item: 'Garlic', amount: '3 cloves' },
      { item: 'Water', amount: '2 cups' },
      { item: 'Injera', amount: '2 pieces' },
    ],
    steps: [
      'Fry onion in oil over medium heat for 10 minutes until very soft',
      'Add berbere and garlic and cook for 2 minutes',
      'Rinse the lentils and add to the pan',
      'Add water and stir everything together',
      'Cook on low heat for 20 minutes stirring occasionally',
      'Add more water if it gets too thick',
      'Season with salt and serve over injera',
    ],
  },
  'grilled-fish': {
    name: 'Grilled Fish with Vegetables',
    type: 'Dinner',
    isEthiopian: false,
    calories: 620,
    protein: 55,
    carbs: 32,
    fats: 18,
    prepTime: '20 mins',
    bestTime: 'Light and protein rich — great evening meal for fat loss days',
    why: 'White fish is one of the leanest protein sources available. Very low in fat and high in protein it is ideal for days when you want to keep calories lower while still hitting your protein target.',
    ingredients: [
      { item: 'White fish fillet', amount: '1 piece — palm sized' },
      { item: 'Olive oil', amount: '1 tablespoon' },
      { item: 'Lemon', amount: '1 whole lemon' },
      { item: 'Garlic', amount: '2 cloves' },
      { item: 'Mixed vegetables', amount: 'Two handfuls' },
      { item: 'Salt and pepper', amount: 'A pinch of each' },
    ],
    steps: [
      'Season the fish with salt, pepper and crushed garlic',
      'Drizzle with olive oil and lemon juice',
      'Heat a grill pan over high heat',
      'Grill the fish for 4-5 minutes each side',
      'Steam or roast the vegetables for 10 minutes',
      'Serve fish with vegetables and extra lemon on the side',
    ],
  },
  'oats-banana': {
    name: 'Oats with Banana',
    type: 'Breakfast',
    isEthiopian: false,
    calories: 420,
    protein: 14,
    carbs: 72,
    fats: 8,
    prepTime: '5 mins',
    bestTime: 'Perfect pre-workout breakfast — quick energy from oats and banana',
    why: 'Oats are one of the best pre-workout foods available. They digest slowly releasing steady energy. The banana adds natural sugars for a quick energy boost right before training.',
    ingredients: [
      { item: 'Rolled oats', amount: 'A cupped handful' },
      { item: 'Banana', amount: '1 medium banana' },
      { item: 'Milk or water', amount: '1 cup' },
      { item: 'Honey', amount: '1 teaspoon' },
      { item: 'Cinnamon', amount: 'A pinch' },
    ],
    steps: [
      'Add oats and milk to a pot over medium heat',
      'Stir regularly for 3-4 minutes until thick and creamy',
      'Pour into a bowl',
      'Slice the banana and place on top',
      'Drizzle with honey and sprinkle cinnamon',
      'Eat immediately while warm',
    ],
  },
  'eggs-toast': {
    name: 'Scrambled Eggs with Toast',
    type: 'Breakfast',
    isEthiopian: false,
    calories: 480,
    protein: 24,
    carbs: 42,
    fats: 18,
    prepTime: '10 mins',
    bestTime: 'Quick and filling — great when you are short on time in the morning',
    why: 'Eggs are a complete protein containing all essential amino acids. Combined with wholegrain toast this breakfast provides balanced macronutrients to start the day right.',
    ingredients: [
      { item: 'Eggs', amount: '3 whole eggs' },
      { item: 'Wholegrain bread', amount: '2 slices' },
      { item: 'Butter', amount: '1 teaspoon' },
      { item: 'Salt and pepper', amount: 'A pinch of each' },
      { item: 'Chives or spring onion', amount: 'Optional — a small handful' },
    ],
    steps: [
      'Toast the bread until golden',
      'Crack eggs into a bowl and whisk with salt and pepper',
      'Melt butter in a pan over low heat',
      'Add eggs and stir slowly with a spatula',
      'Remove from heat while still slightly soft — they continue cooking',
      'Serve on toast immediately',
    ],
  },
  'greek-yogurt': {
    name: 'Greek Yogurt with Honey',
    type: 'Breakfast',
    isEthiopian: false,
    calories: 380,
    protein: 20,
    carbs: 38,
    fats: 10,
    prepTime: '2 mins',
    bestTime: 'Light breakfast — good on rest days or fasting adjacent days',
    why: 'Greek yogurt has almost double the protein of regular yogurt. It is also high in probiotics which support gut health and immune function. Quick and requires no cooking.',
    ingredients: [
      { item: 'Greek yogurt', amount: '1 large cup — fist sized portion' },
      { item: 'Honey', amount: '1 tablespoon' },
      { item: 'Banana or berries', amount: 'Optional — a small handful' },
    ],
    steps: [
      'Spoon yogurt into a bowl',
      'Drizzle honey over the top',
      'Add fruit if using',
      'Eat immediately',
    ],
  },
  'beef-stew': {
    name: 'Beef Stew with Rice',
    type: 'Lunch',
    isEthiopian: false,
    calories: 720,
    protein: 52,
    carbs: 65,
    fats: 20,
    prepTime: '35 mins',
    bestTime: 'Filling midday meal — great after a morning workout',
    why: 'Beef is one of the richest sources of complete protein and creatine which directly supports muscle growth. Combined with rice this is one of the most effective muscle building meals.',
    ingredients: [
      { item: 'Beef', amount: '1 palm sized piece cut into cubes' },
      { item: 'Brown rice', amount: 'A cupped handful' },
      { item: 'Carrots', amount: '2 medium carrots' },
      { item: 'Onion', amount: '1 medium onion' },
      { item: 'Garlic', amount: '3 cloves' },
      { item: 'Tomato paste', amount: '2 tablespoons' },
      { item: 'Oil', amount: '1 tablespoon' },
      { item: 'Salt and pepper', amount: 'A pinch of each' },
    ],
    steps: [
      'Cook rice according to packet instructions',
      'Brown the beef in oil over high heat for 3-4 minutes',
      'Add onion and cook for 3 minutes',
      'Add garlic, tomato paste and stir for 1 minute',
      'Add carrots and enough water to cover',
      'Simmer on low heat for 25 minutes',
      'Season with salt and pepper',
      'Serve over rice',
    ],
  },
  'chicken-salad': {
    name: 'Chicken Salad Bowl',
    type: 'Dinner',
    isEthiopian: false,
    calories: 540,
    protein: 45,
    carbs: 28,
    fats: 22,
    prepTime: '15 mins',
    bestTime: 'Light evening meal — low carb option great for fat loss',
    why: 'A chicken salad bowl is high in protein and low in carbs making it ideal for evenings especially on days when fat loss is the priority. The healthy fats from olive oil and avocado support hormone production.',
    ingredients: [
      { item: 'Chicken breast', amount: '1 palm sized piece' },
      { item: 'Mixed leaves', amount: 'Two large handfuls' },
      { item: 'Cherry tomatoes', amount: 'A small handful' },
      { item: 'Cucumber', amount: 'Half a cucumber' },
      { item: 'Avocado', amount: 'Half an avocado' },
      { item: 'Olive oil', amount: '1 tablespoon' },
      { item: 'Lemon juice', amount: 'Half a lemon' },
      { item: 'Salt and pepper', amount: 'A pinch of each' },
    ],
    steps: [
      'Grill or pan fry the chicken for 6-7 minutes each side',
      'Rest the chicken for 2 minutes then slice',
      'Arrange the leaves in a bowl',
      'Add tomatoes, cucumber and avocado',
      'Place sliced chicken on top',
      'Drizzle with olive oil and lemon juice',
      'Season with salt and pepper and serve',
    ],
  },
};

export default function MealDetailScreen() {
  const { id } = useLocalSearchParams();
  const meal = mealData[id];

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
        {mealImages[id] ? (
            <Image
                source={mealImages[id]}
                style={styles.mealImage}
                resizeMode="cover"
            />
            ) : (
            <View style={styles.imagePlaceholder}>
                <Feather name="camera" size={40} color="rgba(255,255,255,0.4)" />
                <Text style={styles.imagePlaceholderText}>Photo coming soon</Text>
                {meal.isEthiopian && (
                <View style={styles.ethiopianBadge}>
                    <Text style={styles.ethiopianBadgeText}>🇪🇹 Ethiopian dish</Text>
                </View>
                )}
            </View>
            )}
          
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
});