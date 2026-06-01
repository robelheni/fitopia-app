import { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { FadeUpItem } from '../../components/ScreenWrapper';
import { getSwaps } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SwapScreen() {
  const { mealId, mealType, swapGroup, targetCalories, day } = useLocalSearchParams();
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    async function fetchSwaps() {
      try {
        const data = await getSwaps(mealId, swapGroup, targetCalories);
        setSwaps(data.swaps || []);
      } catch (error) {
        console.log('Swap fetch error:', error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchSwaps();
  }, []);

  async function confirmSwap() {
    if (!selected) return;

    // Save swap to AsyncStorage
    // Key: swap_mon_breakfast → meal id
    const swapKey = `swap_${day}_${mealType}`;
    await AsyncStorage.setItem(
      swapKey,
      JSON.stringify({
        meal: selected,
        day: day,
        mealType: mealType,
        originalMealId: mealId,
      })
    );

    router.back();
  }

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
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
            Choose a replacement meal with similar calories and protein.
          </Text>
        </FadeUpItem>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.blue} />
            <Text style={styles.loadingText}>Finding alternatives...</Text>
          </View>
        ) : swaps.length === 0 ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>
              No alternatives available for this meal.
            </Text>
          </View>
        ) : (
          <FadeUpItem delay={100}>
            <View style={styles.swapList}>
              {swaps.map((meal, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.swapCard,
                    selected?.id === meal.id && styles.swapCardSelected
                  ]}
                  onPress={() => setSelected(
                    selected?.id === meal.id ? null : meal
                  )}
                >
                  {/* Image placeholder */}
                  <View style={styles.mealImage}>
                    <Feather name="coffee" size={24} color={colors.greyLight} />
                  </View>

                  {/* Meal info */}
                  <View style={styles.mealInfo}>
                    <View style={styles.mealTopRow}>
                      <Text style={styles.mealType}>
                        {mealType?.charAt(0).toUpperCase() + mealType?.slice(1)}
                      </Text>
                      {meal.is_ethiopian && (
                        <Text style={styles.flagEmoji}>🇪🇹</Text>
                      )}
                    </View>
                    <Text style={styles.mealName}>{meal.name}</Text>
                    <View style={styles.mealStats}>
                      <Text style={styles.mealStat}>{meal.calories} kcal</Text>
                      <Text style={styles.mealStatDot}>·</Text>
                      <Text style={styles.mealStat}>{meal.protein}g protein</Text>
                    </View>
                    {meal.swap_reason && (
                      <Text style={styles.swapReason}>{meal.swap_reason}</Text>
                    )}
                    {meal.tag && (
                      <View style={[
                        styles.mealTag,
                        { backgroundColor: meal.tag_bg || colors.blueLight }
                      ]}>
                        <Text style={[
                          styles.mealTagText,
                          { color: meal.tag_color || colors.blue }
                        ]}>
                          {meal.tag}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Check */}
                  <View style={[
                    styles.checkCircle,
                    selected?.id === meal.id && styles.checkCircleSelected
                  ]}>
                    {selected?.id === meal.id && (
                      <Feather name="check" size={14} color={colors.white} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </FadeUpItem>
        )}

        {/* Confirm button */}
        {selected && (
          <FadeUpItem delay={0}>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={confirmSwap}
            >
              <Feather name="check" size={16} color={colors.white} />
              <Text style={styles.confirmText}>
                Swap to {selected.name}
              </Text>
            </TouchableOpacity>
          </FadeUpItem>
        )}
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
    paddingBottom: 120,
  },
  subtitle: {
    fontSize: 14,
    color: colors.grey,
    fontWeight: '300',
    marginBottom: 20,
    lineHeight: 20,
  },
  loadingContainer: {
    paddingTop: 60,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: colors.grey,
    fontWeight: '300',
  },
  swapList: {
    gap: 12,
    marginBottom: 20,
  },
  swapCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1.5,
    borderColor: colors.greyBorder,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    gap: 12,
  },
  swapCardSelected: {
    borderColor: colors.blue,
    backgroundColor: colors.blueLight,
  },
  mealImage: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: colors.greyCard,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
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
  swapReason: {
    fontSize: 12,
    color: colors.grey,
    fontWeight: '300',
    fontStyle: 'italic',
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
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.greyBorder,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 4,
  },
  checkCircleSelected: {
    backgroundColor: colors.blue,
    borderColor: colors.blue,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.blue,
    paddingVertical: 16,
    borderRadius: 100,
    shadowColor: colors.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.white,
  },
});