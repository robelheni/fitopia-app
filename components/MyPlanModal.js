import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { lightColors } from '../constants/colors';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { useEffect, useState } from 'react';
import { getToken } from '../services/api';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://web-production-9079c.up.railway.app';

export default function MyPlanModal({ visible, onClose }) {
  const theme = useTheme();
  const colors = theme ? theme.colors : lightColors;
  const styles = makeStyles(colors);

  const [editingWeight, setEditingWeight] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [currentWeight, setCurrentWeight] = useState('75');
  const [showFoodPicker, setShowFoodPicker] = useState(false);
  const [foodPreferences, setFoodPreferences] = useState([]);
  const [saving, setSaving] = useState(false);
  const [goal, setGoal] = useState('');
  const [fitnessLevel, setFitnessLevel] = useState('');
  const [equipment, setEquipment] = useState('');
  const [trainingDays, setTrainingDays] = useState([]);
  const [workoutDuration, setWorkoutDuration] = useState('');
  const [showGoalPicker, setShowGoalPicker] = useState(false);
  const [showFitnessLevelPicker, setShowFitnessLevelPicker] = useState(false);
  const [showEquipmentPicker, setShowEquipmentPicker] = useState(false);
  const [showTrainingDaysPicker, setShowTrainingDaysPicker] = useState(false);
  const [showDurationPicker, setShowDurationPicker] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const token = await getToken();
        const response = await fetch(`${BASE_URL}/plan/nutrition?token=${token}`);
        const data = await response.json();
        const prefs = data.user.food_preferences?.split(',').filter(Boolean) || [];
        setFoodPreferences(prefs);
        if (data.user.weight) setCurrentWeight(String(data.user.weight));

        if(data.user.goal) setGoal(data.user.goal);
        if (data.user.fitness_level) setFitnessLevel(data.user.fitness_level);
        if (data.user.equipment) setEquipment(data.user.equipment);
        if (data.user.training_days) {
          setTrainingDays(data.user.training_days.split(',').filter(Boolean));
        }
        if (data.user.workout_duration) setWorkoutDuration(data.user.workout_duration);
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

  function getGoalLabel() {
    const labels = {
        build_muscle: 'Build muscle',
        lose_weight: 'Lose weight',
        improve_fitness: 'Improve fitness',
        stay_active: 'Stay active',
    };
    return labels[goal] || 'Not set';
  }

  function getFitnessLevelLabel() {
    const labels = {
        beginner: 'Beginner',
        intermediate: 'Intermediate',
        advanced: 'Advanced',
    };
    return labels[fitnessLevel] || 'Not set';
  }

  function getEquipmentLabel() {
    const labels = {
        gym: 'Gym',
        dumbbells: 'Dumbbells at home',
        bodyweight: 'Bodyweight only',
        both: 'Gym and Home',
    };
    return labels[equipment] || 'Not set';
  }

  function getTrainingDaysLabel() {
    if (trainingDays.length === 0) return 'Not set';
    const dayNames = {
        mon: 'Mon', tue: 'Tue', wed: 'Wed',
        thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun',
    };
    return trainingDays.map(d => dayNames[d] || d).join(', ');
  }

  function getDurationLabel() {
    const labels = {
        '30': '30 minutes',
        '45': '45 minutes',
        '60': '60 minutes',
        '60+': '60+ minutes',
    };
    return labels[workoutDuration] || workoutDuration || 'Not set';
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

            <TouchableOpacity
                style={styles.planItem}
                onPress={() => setShowFitnessLevelPicker(true)}
            >
                <View style={styles.planIconContainer}>
                    <Feather name="trending-up" size={16} color={colors.blue} />
                </View>
                <View style={styles.planItemContent}>
                    <Text style={styles.planItemLabel}>Fitness level</Text>
                    <Text style={styles.planItemValue}>{getFitnessLevelLabel()}</Text>
                </View>
                <Feather name="chevron-right" size={16} color={colors.greyLight} />
            </TouchableOpacity>

              <View style={styles.planDivider} />

              <TouchableOpacity
                  style={styles.planItem}
                  onPress={() => setShowGoalPicker(true)}
              >
                  <View style={styles.planIconContainer}>
                      <Feather name="target" size={16} color={colors.blue} />
                  </View>
                  <View style={styles.planItemContent}>
                      <Text style={styles.planItemLabel}>Goal</Text>
                      <Text style={styles.planItemValue}>{getGoalLabel()}</Text>
                  </View>
                  <Feather name="chevron-right" size={16} color={colors.greyLight} />
              </TouchableOpacity>

              <View style={styles.planDivider} />

              <TouchableOpacity
                  style={styles.planItem}
                  onPress={() => setShowTrainingDaysPicker(true)}
              >
                  <View style={styles.planIconContainer}>
                      <Feather name="calendar" size={16} color={colors.blue} />
                  </View>
                  <View style={styles.planItemContent}>
                      <Text style={styles.planItemLabel}>Training days</Text>
                      <Text style={styles.planItemValue}>{getTrainingDaysLabel()}</Text>
                  </View>
                  <Feather name="chevron-right" size={16} color={colors.greyLight} />
              </TouchableOpacity>

              <View style={styles.planDivider} />

              <TouchableOpacity
                style={styles.planItem}
                onPress={() => setShowDurationPicker(true)}
            >
                <View style={styles.planIconContainer}>
                    <Feather name="clock" size={16} color={colors.blue} />
                </View>
                <View style={styles.planItemContent}>
                    <Text style={styles.planItemLabel}>Duration</Text>
                    <Text style={styles.planItemValue}>{getDurationLabel()}</Text>
                </View>
                <Feather name="chevron-right" size={16} color={colors.greyLight} />
            </TouchableOpacity>

              <View style={styles.planDivider} />

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
                  <TouchableOpacity
                      style={styles.planItem}
                      onPress={() => setShowEquipmentPicker(true)}
                  >
                      <View style={styles.planIconContainer}>
                          <Feather name="home" size={16} color={colors.blue} />
                      </View>
                      <View style={styles.planItemContent}>
                          <Text style={styles.planItemLabel}>Equipment</Text>
                          <Text style={styles.planItemValue}>{getEquipmentLabel()}</Text>
                      </View>
                      <Feather name="chevron-right" size={16} color={colors.greyLight} />
                  </TouchableOpacity>
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

          <TouchableOpacity
            style={styles.updateButton}
            onPress={async () => {
              try {
                setSaving(true);
                await saveToBackend({
                  weight: parseFloat(currentWeight),
                  food_preferences: foodPreferences.join(','),
                  goal: goal || undefined,
                  fitness_level: fitnessLevel || undefined,
                  equipment: equipment || undefined,
                  training_days: trainingDays.length > 0 ? trainingDays.join(',') : undefined,
                  workout_duration: workoutDuration || undefined,
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

      {/* Food preference picker */}
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

            <TouchableOpacity
              style={[styles.updateButton, { marginTop: 24 }]}
              onPress={() => setShowFoodPicker(false)}
            >
              <Text style={styles.updateButtonText}>Done</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* Goal picker */}
      <Modal
          visible={showGoalPicker}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowGoalPicker(false)}
      >
          <View style={styles.pickerContainer}>
              <View style={styles.handle} />
              <View style={styles.header}>
                  <Text style={styles.title}>Your goal</Text>
                  <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setShowGoalPicker(false)}
                  >
                      <Feather name="x" size={20} color={colors.black} />
                  </TouchableOpacity>
              </View>

              <ScrollView contentContainerStyle={styles.pickerContent}>
                  <Text style={styles.pickerSubtitle}>
                      Your goal shapes your entire workout and meal plan.
                  </Text>

                  {[
                      { id: 'build_muscle', label: 'Build muscle', desc: 'Strength focused sessions with progressive overload', icon: '💪' },
                      { id: 'lose_weight', label: 'Lose weight', desc: 'Strength plus cardio circuits to maximise calorie burn', icon: '🔥' },
                      { id: 'improve_fitness', label: 'Improve fitness', desc: 'Mix of strength and cardio to build overall fitness', icon: '⚡' },
                      { id: 'stay_active', label: 'Stay active', desc: 'Light sessions to keep you moving and feeling good', icon: '🏃' },
                  ].map(option => {
                      const selected = goal === option.id;
                      return (
                          <TouchableOpacity
                              key={option.id}
                              style={[styles.prefOption, selected && styles.prefOptionSelected]}
                              onPress={() => setGoal(option.id)}
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

                  <TouchableOpacity
                      style={[styles.updateButton, { marginTop: 24 }]}
                      onPress={() => setShowGoalPicker(false)}
                  >
                      <Text style={styles.updateButtonText}>Done</Text>
                  </TouchableOpacity>
              </ScrollView>
          </View>
      </Modal>

      {/* Fitness level picker */}
      <Modal
          visible={showFitnessLevelPicker}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowFitnessLevelPicker(false)}
      >
          <View style={styles.pickerContainer}>
              <View style={styles.handle} />
              <View style={styles.header}>
                  <Text style={styles.title}>Fitness level</Text>
                  <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setShowFitnessLevelPicker(false)}
                  >
                      <Feather name="x" size={20} color={colors.black} />
                  </TouchableOpacity>
              </View>
              <ScrollView contentContainerStyle={styles.pickerContent}>
                  <Text style={styles.pickerSubtitle}>
                      Your fitness level determines exercise difficulty and session length.
                  </Text>
                  {[
                      { id: 'beginner', label: 'Beginner', desc: 'New to training or returning after a long break', icon: '🌱' },
                      { id: 'intermediate', label: 'Intermediate', desc: 'Training consistently for 6 months or more', icon: '⚡' },
                      { id: 'advanced', label: 'Advanced', desc: 'Training seriously for 2 or more years', icon: '🔥' },
                  ].map(option => {
                      const selected = fitnessLevel === option.id;
                      return (
                          <TouchableOpacity
                              key={option.id}
                              style={[styles.prefOption, selected && styles.prefOptionSelected]}
                              onPress={() => setFitnessLevel(option.id)}
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
                  <TouchableOpacity
                      style={[styles.updateButton, { marginTop: 24 }]}
                      onPress={() => setShowFitnessLevelPicker(false)}
                  >
                      <Text style={styles.updateButtonText}>Done</Text>
                  </TouchableOpacity>
              </ScrollView>
          </View>
      </Modal>

      {/* Equipment picker */}
      <Modal
          visible={showEquipmentPicker}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowEquipmentPicker(false)}
      >
          <View style={styles.pickerContainer}>
              <View style={styles.handle} />
              <View style={styles.header}>
                  <Text style={styles.title}>Equipment</Text>
                  <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setShowEquipmentPicker(false)}
                  >
                      <Feather name="x" size={20} color={colors.black} />
                  </TouchableOpacity>
              </View>
              <ScrollView contentContainerStyle={styles.pickerContent}>
                  <Text style={styles.pickerSubtitle}>
                      Your equipment determines which exercises appear in your plan.
                  </Text>
                  {[
                      { id: 'gym', label: 'Gym', desc: 'Full gym access — barbells, cables, machines', icon: '🏋️' },
                      { id: 'dumbbells', label: 'Dumbbells at home', desc: 'Dumbbells only — home or hotel workouts', icon: '💪' },
                      { id: 'bodyweight', label: 'Bodyweight only', desc: 'No equipment needed — anywhere, anytime', icon: '🤸' },
                      { id: 'both', label: 'Gym and Home', desc: 'Mix of gym and home equipment', icon: '⚡' },
                  ].map(option => {
                      const selected = equipment === option.id;
                      return (
                          <TouchableOpacity
                              key={option.id}
                              style={[styles.prefOption, selected && styles.prefOptionSelected]}
                              onPress={() => setEquipment(option.id)}
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
                  <TouchableOpacity
                      style={[styles.updateButton, { marginTop: 24 }]}
                      onPress={() => setShowEquipmentPicker(false)}
                  >
                      <Text style={styles.updateButtonText}>Done</Text>
                  </TouchableOpacity>
              </ScrollView>
          </View>
      </Modal>

      {/* Training days picker */}
      <Modal
          visible={showTrainingDaysPicker}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowTrainingDaysPicker(false)}
      >
          <View style={styles.pickerContainer}>
              <View style={styles.handle} />
              <View style={styles.header}>
                  <Text style={styles.title}>Training days</Text>
                  <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setShowTrainingDaysPicker(false)}
                  >
                      <Feather name="x" size={20} color={colors.black} />
                  </TouchableOpacity>
              </View>
              <ScrollView contentContainerStyle={styles.pickerContent}>
                  <Text style={styles.pickerSubtitle}>
                      Select the days you want to train each week.
                  </Text>
                  {[
                      { id: 'mon', label: 'Monday' },
                      { id: 'tue', label: 'Tuesday' },
                      { id: 'wed', label: 'Wednesday' },
                      { id: 'thu', label: 'Thursday' },
                      { id: 'fri', label: 'Friday' },
                      { id: 'sat', label: 'Saturday' },
                      { id: 'sun', label: 'Sunday' },
                  ].map(option => {
                      const selected = trainingDays.includes(option.id);
                      return (
                          <TouchableOpacity
                              key={option.id}
                              style={[styles.prefOption, selected && styles.prefOptionSelected]}
                              onPress={() => {
                                  setTrainingDays(prev =>
                                      prev.includes(option.id)
                                          ? prev.filter(d => d !== option.id)
                                          : [...prev, option.id]
                                  );
                              }}
                          >
                              <Text style={styles.prefEmoji}>
                                  {selected ? '✅' : '📅'}
                              </Text>
                              <View style={styles.prefContent}>
                                  <Text style={[styles.prefLabel, selected && styles.prefLabelSelected]}>
                                      {option.label}
                                  </Text>
                              </View>
                              <View style={[styles.prefCheck, selected && styles.prefCheckSelected]}>
                                  {selected && <Feather name="check" size={12} color="white" />}
                              </View>
                          </TouchableOpacity>
                      );
                  })}
                  <TouchableOpacity
                      style={[styles.updateButton, { marginTop: 24 }]}
                      onPress={() => setShowTrainingDaysPicker(false)}
                  >
                      <Text style={styles.updateButtonText}>Done</Text>
                  </TouchableOpacity>
              </ScrollView>
          </View>
      </Modal>

      {/* Duration picker */}
      <Modal
          visible={showDurationPicker}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowDurationPicker(false)}
      >
          <View style={styles.pickerContainer}>
              <View style={styles.handle} />
              <View style={styles.header}>
                  <Text style={styles.title}>Workout duration</Text>
                  <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setShowDurationPicker(false)}
                  >
                      <Feather name="x" size={20} color={colors.black} />
                  </TouchableOpacity>
              </View>
              <ScrollView contentContainerStyle={styles.pickerContent}>
                  <Text style={styles.pickerSubtitle}>
                      How long do you want each workout session to be?
                  </Text>
                  {[
                      { id: '30', label: '30 minutes', desc: 'Short and efficient — perfect for busy days', icon: '⚡' },
                      { id: '45', label: '45 minutes', desc: 'The sweet spot for most people', icon: '✅' },
                      { id: '60', label: '60 minutes', desc: 'Full session with time for warm up and cool down', icon: '💪' },
                      { id: '60+', label: '60+ minutes', desc: 'Extended session for serious training', icon: '🔥' },
                  ].map(option => {
                      const selected = workoutDuration === option.id;
                      return (
                          <TouchableOpacity
                              key={option.id}
                              style={[styles.prefOption, selected && styles.prefOptionSelected]}
                              onPress={() => setWorkoutDuration(option.id)}
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
                  <TouchableOpacity
                      style={[styles.updateButton, { marginTop: 24 }]}
                      onPress={() => setShowDurationPicker(false)}
                  >
                      <Text style={styles.updateButtonText}>Done</Text>
                  </TouchableOpacity>
              </ScrollView>
          </View>
      </Modal>

    </Modal>
  );
}

function makeStyles(colors) {
  return StyleSheet.create({
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
      color: '#FFFFFF',
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
      color: '#FFFFFF',
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
}
