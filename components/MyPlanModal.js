import { Feather } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { useEffect, useState } from 'react';
import { getToken } from '../services/api';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.0.186:8000';

export default function MyPlanModal({ visible, onClose }) {
  const [editingWeight, setEditingWeight] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [currentWeight, setCurrentWeight] = useState('75');
  const [showFoodPicker, setShowFoodPicker] = useState(false);
  const [foodPreferences, setFoodPreferences] = useState([]);
  const [saving, setSaving] = useState(false);
  

  // Load current preferences and weight from backend
  useEffect(() => {
    async function loadProfile() {
      try {
        const token = await getToken();
        const response = await fetch(`${BASE_URL}/plan/nutrition?token=${token}`);
        const data = await response.json();
        const prefs = data.user.food_preferences?.split(',').filter(Boolean) || [];
        setFoodPreferences(prefs);
        if (data.user.weight) setCurrentWeight(String(data.user.weight));
      } catch (e) {
        console.log('Load profile error:', e.message);
      }
    }
    if (visible) loadProfile();
  }, [visible]);

  function getFoodPreferenceLabel() {
    if (foodPreferences.length === 0) return 'Not set';
    const labels = {
      meat: 'Meat eater',
      ethiopian: 'Ethiopian diet',
      fasting: 'Orthodox fasting',
      vegetarian: 'Vegetarian',
    };
    return foodPreferences.map(p => labels[p] || p).join(', ');
  }

  async function saveToBackend(fields) {
    const token = await getToken();
    await fetch(`${BASE_URL}/auth/onboarding?token=${token}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields),
    });
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.handle} />

        <View style={styles.header}>
          <Text style={styles.title}>My Plan</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Feather name="x" size={20} color={colors.black} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Training profile */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Training profile</Text>
            <View style={styles.planCard}>

              <View style={styles.planItem}>
                <View style={styles.planIconContainer}>
                  <Feather name="trending-up" size={16} color={colors.blue} />
                </View>
                <View style={styles.planItemContent}>
                  <Text style={styles.planItemLabel}>Fitness level</Text>
                  <Text style={styles.planItemValue}>Intermediate</Text>
                </View>
                <Feather name="chevron-right" size={16} color={colors.greyLight} />
              </View>

              <View style={styles.planDivider} />

              <View style={styles.planItem}>
                <View style={styles.planIconContainer}>
                  <Feather name="target" size={16} color={colors.blue} />
                </View>
                <View style={styles.planItemContent}>
                  <Text style={styles.planItemLabel}>Goal</Text>
                  <Text style={styles.planItemValue}>Build muscle</Text>
                </View>
                <Feather name="chevron-right" size={16} color={colors.greyLight} />
              </View>

              <View style={styles.planDivider} />

              <View style={styles.planItem}>
                <View style={styles.planIconContainer}>
                  <Feather name="calendar" size={16} color={colors.blue} />
                </View>
                <View style={styles.planItemContent}>
                  <Text style={styles.planItemLabel}>Training days</Text>
                  <Text style={styles.planItemValue}>Mon, Wed, Fri, Sun</Text>
                </View>
                <Feather name="chevron-right" size={16} color={colors.greyLight} />
              </View>

              <View style={styles.planDivider} />

              <View style={styles.planItem}>
                <View style={styles.planIconContainer}>
                  <Feather name="clock" size={16} color={colors.blue} />
                </View>
                <View style={styles.planItemContent}>
                  <Text style={styles.planItemLabel}>Duration</Text>
                  <Text style={styles.planItemValue}>45 minutes</Text>
                </View>
                <Feather name="chevron-right" size={16} color={colors.greyLight} />
              </View>

              <View style={styles.planDivider} />

              {/* Weight — editable */}
              <View style={styles.planItem}>
                <View style={styles.planIconContainer}>
                  <Feather name="trending-up" size={16} color={colors.blue} />
                </View>
                <View style={styles.planItemContent}>
                  <Text style={styles.planItemLabel}>Current weight</Text>
                  {editingWeight ? (
                    <View style={styles.weightEditRow}>
                      <TextInput
                        style={styles.weightInput}
                        value={newWeight}
                        onChangeText={setNewWeight}
                        keyboardType="number-pad"
                        placeholder={currentWeight}
                        placeholderTextColor={colors.greyLight}
                        maxLength={3}
                        autoFocus
                      />
                      <Text style={styles.weightUnit}>kg</Text>
                      <TouchableOpacity
                        style={styles.weightSaveButton}
                        onPress={() => {
                          if (newWeight) setCurrentWeight(newWeight);
                          setEditingWeight(false);
                          setNewWeight('');
                        }}
                      >
                        <Text style={styles.weightSaveText}>Save</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => { setEditingWeight(false); setNewWeight(''); }}>
                        <Feather name="x" size={16} color={colors.greyLight} />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <Text style={styles.planItemValue}>{currentWeight} kg</Text>
                  )}
                </View>
                {!editingWeight && (
                  <TouchableOpacity onPress={() => setEditingWeight(true)}>
                    <Feather name="edit-2" size={16} color={colors.blue} />
                  </TouchableOpacity>
                )}
              </View>

            </View>
          </View>

          {/* Equipment */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Equipment and location</Text>
            <View style={styles.planCard}>
              <View style={styles.planItem}>
                <View style={styles.planIconContainer}>
                  <Feather name="home" size={16} color={colors.blue} />
                </View>
                <View style={styles.planItemContent}>
                  <Text style={styles.planItemLabel}>Equipment</Text>
                  <Text style={styles.planItemValue}>Dumbbells at home</Text>
                </View>
                <Feather name="chevron-right" size={16} color={colors.greyLight} />
              </View>
              <View style={styles.planDivider} />
              <View style={styles.planItem}>
                <View style={styles.planIconContainer}>
                  <Feather name="map-pin" size={16} color={colors.blue} />
                </View>
                <View style={styles.planItemContent}>
                  <Text style={styles.planItemLabel}>Location</Text>
                  <Text style={styles.planItemValue}>United Kingdom</Text>
                </View>
                <Feather name="chevron-right" size={16} color={colors.greyLight} />
              </View>
            </View>
          </View>

          {/* Food and fasting */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Food and fasting</Text>
            <View style={styles.planCard}>
              <TouchableOpacity
                style={styles.planItem}
                onPress={() => setShowFoodPicker(true)}
              >
                <View style={styles.planIconContainer}>
                  <Feather name="sun" size={16} color={colors.blue} />
                </View>
                <View style={styles.planItemContent}>
                  <Text style={styles.planItemLabel}>Food choices</Text>
                  <Text style={styles.planItemValue}>{getFoodPreferenceLabel()}</Text>
                </View>
                <Feather name="chevron-right" size={16} color={colors.greyLight} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Update my plan button — saves weight + preferences + navigates home */}
          <TouchableOpacity
            style={styles.updateButton}
            onPress={async () => {
              try {
                setSaving(true);
                await saveToBackend({
                  weight: parseFloat(currentWeight),
                  food_preferences: foodPreferences.join(','),
                });
                await AsyncStorage.removeItem('cached_weekly_plan');
                onClose();
                router.replace('/(tabs)');
              } catch (e) {
                console.log('Update plan error:', e.message);
              } finally {
                setSaving(false);
              }
            }}
          >
            <Text style={styles.updateButtonText}>
              {saving ? 'Updating...' : 'Update my plan'}
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </View>

      {/* Food preference picker — separate modal */}
      <Modal
        visible={showFoodPicker}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowFoodPicker(false)}
      >
        <View style={styles.pickerContainer}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <Text style={styles.title}>Food choices</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowFoodPicker(false)}
            >
              <Feather name="x" size={20} color={colors.black} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.pickerContent}>
            <Text style={styles.pickerSubtitle}>
              Select all that apply. Your meal plan will update when you tap Update my plan.
            </Text>

            {[
              { id: 'meat', label: 'Meat eater', desc: 'Includes chicken, beef, fish and lamb', icon: '🥩' },
              { id: 'ethiopian', label: 'Ethiopian diet', desc: 'Includes injera, tibs, shiro and kitfo', icon: '🇪🇹' },
              { id: 'fasting', label: 'Orthodox fasting', desc: 'No meat, dairy or eggs — plant based only', icon: '🕊️' },
              { id: 'vegetarian', label: 'Vegetarian', desc: 'No meat but includes dairy and eggs', icon: '🌱' },
            ].map(option => {
              const selected = foodPreferences.includes(option.id);
              return (
                <TouchableOpacity
                  key={option.id}
                  style={[styles.prefOption, selected && styles.prefOptionSelected]}
                  onPress={() => {
                    setFoodPreferences(prev =>
                      prev.includes(option.id)
                        ? prev.filter(p => p !== option.id)
                        : [...prev, option.id]
                    );
                  }}
                >
                  <Text style={styles.prefEmoji}>{option.icon}</Text>
                  <View style={styles.prefContent}>
                    <Text style={[styles.prefLabel, selected && styles.prefLabelSelected]}>
                      {option.label}
                    </Text>
                    <Text style={styles.prefDesc}>{option.desc}</Text>
                  </View>
                  <View style={[styles.prefCheck, selected && styles.prefCheckSelected]}>
                    {selected && <Feather name="check" size={12} color="white" />}
                  </View>
                </TouchableOpacity>
              );
            })}

            {/* Confirm food choices — just closes picker, actual save happens on Update my plan */}
            <TouchableOpacity
              style={[styles.updateButton, { marginTop: 24 }]}
              onPress={() => setShowFoodPicker(false)}
            >
              <Text style={styles.updateButtonText}>Done</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: 12,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.greyBorder,
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.black,
    letterSpacing: -0.5,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.greyCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.grey,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  planCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.greyBorder,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  planItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  planIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.blueLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planItemContent: {
    flex: 1,
  },
  planItemLabel: {
    fontSize: 12,
    color: colors.grey,
    fontWeight: '300',
    marginBottom: 2,
  },
  planItemValue: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.black,
  },
  planDivider: {
    height: 0.5,
    backgroundColor: colors.greyBorder,
    marginHorizontal: 16,
  },
  updateButton: {
    backgroundColor: colors.blue,
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: 'center',
    shadowColor: colors.blue,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  updateButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  weightEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  weightInput: {
    borderWidth: 1.5,
    borderColor: colors.blue,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 15,
    color: colors.black,
    width: 60,
  },
  weightUnit: {
    fontSize: 14,
    color: colors.grey,
    fontWeight: '300',
  },
  weightSaveButton: {
    backgroundColor: colors.blue,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  weightSaveText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.white,
  },
  pickerContainer: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: 12,
  },
  pickerContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  pickerSubtitle: {
    fontSize: 14,
    color: colors.grey,
    fontWeight: '300',
    marginBottom: 20,
    lineHeight: 20,
  },
  prefOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.greyBorder,
    marginBottom: 10,
  },
  prefOptionSelected: {
    borderColor: colors.blue,
    backgroundColor: colors.blueLight,
  },
  prefEmoji: {
    fontSize: 24,
  },
  prefContent: {
    flex: 1,
    gap: 2,
  },
  prefLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.black,
  },
  prefLabelSelected: {
    color: colors.blue,
  },
  prefDesc: {
    fontSize: 12,
    color: colors.grey,
    fontWeight: '300',
  },
  prefCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.greyBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prefCheckSelected: {
    backgroundColor: colors.blue,
    borderColor: colors.blue,
  },
});