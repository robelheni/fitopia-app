import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { FadeUpItem } from '../../components/ScreenWrapper';

const swapOptions = {
  Breakfast: [
    {
      id: 'eggs-toast',
      name: 'Scrambled Eggs with Toast',
      calories: 480,
      protein: 24,
      isEthiopian: false,
      reason: 'Quick and high protein',
    },
    {
      id: 'greek-yogurt',
      name: 'Greek Yogurt with Honey',
      calories: 380,
      protein: 20,
      isEthiopian: false,
      reason: 'Light and quick — no cooking needed',
    },
    {
      id: 'oats-banana',
      name: 'Oats with Banana',
      calories: 420,
      protein: 14,
      isEthiopian: false,
      reason: 'Best pre-workout energy boost',
    },
    {
      id: 'firfir-egg',
      name: 'Firfir with Egg',
      calories: 520,
      protein: 28,
      isEthiopian: true,
      reason: 'Highest protein Ethiopian breakfast',
    },
  ],
  Lunch: [
    {
      id: 'chicken-rice',
      name: 'Chicken Breast with Rice',
      calories: 650,
      protein: 52,
      isEthiopian: false,
      reason: 'Highest protein lunch option',
    },
    {
      id: 'shiro-injera',
      name: 'Shiro with Injera',
      calories: 580,
      protein: 28,
      isEthiopian: true,
      reason: 'Classic Ethiopian plant protein',
    },
    {
      id: 'kitfo',
      name: 'Kitfo with Ayib',
      calories: 680,
      protein: 58,
      isEthiopian: true,
      reason: 'Best for muscle building days',
    },
    {
      id: 'beef-stew',
      name: 'Beef Stew with Rice',
      calories: 720,
      protein: 52,
      isEthiopian: false,
      reason: 'Filling and high in creatine',
    },
  ],
  Dinner: [
    {
      id: 'tibs-injera',
      name: 'Tibs with Injera',
      calories: 720,
      protein: 48,
      isEthiopian: true,
      reason: 'Rich Ethiopian protein dinner',
    },
    {
      id: 'grilled-fish',
      name: 'Grilled Fish with Vegetables',
      calories: 620,
      protein: 55,
      isEthiopian: false,
      reason: 'Lightest high protein option',
    },
    {
      id: 'misir-wot',
      name: 'Misir Wot with Injera',
      calories: 560,
      protein: 24,
      isEthiopian: true,
      reason: 'Light plant based Ethiopian dinner',
    },
    {
      id: 'chicken-salad',
      name: 'Chicken Salad Bowl',
      calories: 540,
      protein: 45,
      isEthiopian: false,
      reason: 'Best for fat loss days',
    },
  ],
};

export default function SwapMealScreen() {
  const { mealId, mealType } = useLocalSearchParams();
  const options = swapOptions[mealType] || swapOptions['Lunch'];

  function handleSwap(meal) {
    // For now just go back — later this saves to backend
    router.back();
    router.back();
  }

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
        <Text style={styles.headerTitle}>Swap {mealType}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        <FadeUpItem delay={0}>
          <Text style={styles.subtitle}>
            Choose a replacement that fits your goal. All options are matched to your calorie and protein targets.
          </Text>
        </FadeUpItem>

        <FadeUpItem delay={100}>
          <View style={styles.optionsList}>
            {options.filter(o => o.id !== mealId).map((option, index) => (
              <TouchableOpacity
                key={option.id}
                style={styles.optionCard}
                onPress={() => handleSwap(option)}
              >
                {/* Image placeholder */}
                <View style={styles.optionImage}>
                  <Feather name="coffee" size={20} color={colors.greyLight} />
                </View>

                {/* Option info */}
                <View style={styles.optionInfo}>
                  <View style={styles.optionTopRow}>
                    <Text style={styles.optionName}>{option.name}</Text>
                    {option.isEthiopian && (
                      <Text style={styles.flagEmoji}>🇪🇹</Text>
                    )}
                  </View>
                  <Text style={styles.optionReason}>{option.reason}</Text>
                  <View style={styles.optionStats}>
                    <Text style={styles.optionStat}>{option.calories} kcal</Text>
                    <Text style={styles.optionStatDot}>·</Text>
                    <Text style={styles.optionStat}>{option.protein}g protein</Text>
                  </View>
                </View>

                {/* Select button */}
                <View style={styles.selectButton}>
                  <Feather name="check" size={16} color={colors.blue} />
                </View>

              </TouchableOpacity>
            ))}
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
    paddingTop: 20,
    paddingBottom: 40,
  },

  subtitle: {
    fontSize: 14,
    color: colors.grey,
    lineHeight: 20,
    fontWeight: '300',
    marginBottom: 20,
  },

  optionsList: {
    gap: 12,
  },

  optionCard: {
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

  optionImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: colors.greyCard,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    borderWidth: 1,
    borderColor: colors.greyBorder,
  },

  optionInfo: {
    flex: 1,
    gap: 4,
  },

  optionTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  optionName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.black,
    letterSpacing: -0.3,
    flex: 1,
  },

  flagEmoji: {
    fontSize: 14,
  },

  optionReason: {
    fontSize: 12,
    color: colors.blue,
    fontWeight: '400',
  },

  optionStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  optionStat: {
    fontSize: 12,
    color: colors.grey,
    fontWeight: '300',
  },

  optionStatDot: {
    fontSize: 12,
    color: colors.greyLight,
  },

  selectButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.blueLight,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
});