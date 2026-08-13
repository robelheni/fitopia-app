import { View, Text, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Modal, TextInput } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { lightColors } from '../../constants/colors';
import ProgressBar from '../../components/ProgressBar';
import { useOnboarding } from '../../context/OnboardingContext';
import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import BackgroundCircles from '../../components/BackgroundCircles';
import { FadeUpItem } from '../../components/ScreenWrapper';
import { useLanguage } from '../../context/LanguageContext';
import { getTabTranslation } from '../../constants/tabTranslations';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';

export default function Step7() {
  const theme = useTheme();
  const colors = theme ? theme.colors : lightColors;
  const styles = makeStyles(colors);

  const { language } = useLanguage();
  const t = getTabTranslation(language);
  const [age, setAge] = useState('');
  const [gender, setGender] = useState(null);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [goalWeight, setGoalWeight] = useState(null);
  const [customGoal, setCustomGoal] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [calculated, setCalculated] = useState(false);
  const [suggestedWeight, setSuggestedWeight] = useState(null);
  const { updateAnswer, answers } = useOnboarding();

  const isComplete = age && gender && height && weight && goalWeight;
  const canCalculate = age && gender && height && weight;

  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(1);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  function calculateIdealWeight() {
    if (!canCalculate) return;

    setCalculating(true);
    setCalculated(false);

    pulseScale.value = withRepeat(
      withSequence(withTiming(1.2, { duration: 600 }), withTiming(1, { duration: 600 })),
      -1,
      false
    );
    pulseOpacity.value = withRepeat(
      withSequence(withTiming(0.6, { duration: 600 }), withTiming(1, { duration: 600 })),
      -1,
      false
    );

    setTimeout(() => {
      const h = parseInt(height);
      const w = parseInt(weight);
      const goal = answers?.goal || 'build_muscle';

      let base;
      if (gender === 'male') {
        base = 50 + 2.3 * ((h - 152.4) / 2.54);
      } else {
        base = 45.5 + 2.3 * ((h - 152.4) / 2.54);
      }

      let ideal;
      if (goal === 'build_muscle') {
        ideal = Math.round(base + 7);
        if (w >= ideal) ideal = w + 3;
      } else if (goal === 'lose_weight') {
        ideal = Math.round(base);
        if (w <= base) ideal = w;
      } else {
        ideal = Math.round(base);
      }

      pulseScale.value = withTiming(1, { duration: 300 });
      pulseOpacity.value = withTiming(1, { duration: 300 });

      setSuggestedWeight(ideal);
      setCalculating(false);
      setCalculated(true);
    }, 2500);
  }

  function handleAccept() {
    setGoalWeight(suggestedWeight);
    setShowCustomInput(false);
    setCalculated(false);
  }

  function handleSetOwn() {
    setShowCustomInput(true);
    setCalculated(false);
  }

  function handleContinue() {
    if (!isComplete) return;
    updateAnswer('personalInfo', { age, gender, height, weight, goalWeight });
    router.navigate('/onboarding/step8');
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <BackgroundCircles variant="bottomRight" />

      <View style={styles.fixedTop}>
        <ProgressBar currentStep={7} totalSteps={8} />
        <Text style={styles.question}>{t.personalQuestion}</Text>
        <Text style={styles.subtitle}>{t.personalSub}</Text>
      </View>

      <Modal visible={calculating} transparent animationType="fade">
        <View style={styles.overlay}>
          <Animated.View style={[styles.overlayContent, pulseStyle]}>
            <View style={styles.overlayLogoRow}>
              <Text style={styles.overlayLogoFit}>Fit</Text>
              <Text style={styles.overlayLogoOpia}>opia</Text>
            </View>
            <Text style={styles.overlayText}>{t.analysing}</Text>
            <Text style={styles.overlaySubText}>{t.analysingSub}</Text>
          </Animated.View>
        </View>
      </Modal>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          <FadeUpItem delay={200}>
            <Text style={styles.label}>{t.gender}</Text>
            <View style={styles.genderRow}>
              <TouchableOpacity
                style={[styles.genderOption, gender === 'male' && styles.genderSelected]}
                onPress={() => setGender('male')}
              >
                <Text style={[styles.genderText, gender === 'male' && styles.genderTextSelected]}>{t.male}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.genderOption, gender === 'female' && styles.genderSelected]}
                onPress={() => setGender('female')}
              >
                <Text style={[styles.genderText, gender === 'female' && styles.genderTextSelected]}>{t.female}</Text>
              </TouchableOpacity>
            </View>
          </FadeUpItem>

          <FadeUpItem delay={250}>
            <Text style={styles.label}>{t.age}</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 25"
              placeholderTextColor={colors.greyLight}
              keyboardType="number-pad"
              value={age}
              onChangeText={setAge}
              maxLength={3}
            />
          </FadeUpItem>

          <FadeUpItem delay={300}>
            <Text style={styles.label}>{t.heightCm}</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 175"
              placeholderTextColor={colors.greyLight}
              keyboardType="number-pad"
              value={height}
              onChangeText={setHeight}
              maxLength={3}
            />
          </FadeUpItem>

          <FadeUpItem delay={350}>
            <Text style={styles.label}>{t.currentWeight}</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 70"
              placeholderTextColor={colors.greyLight}
              keyboardType="number-pad"
              value={weight}
              onChangeText={setWeight}
              maxLength={3}
            />
          </FadeUpItem>

          <FadeUpItem delay={400}>
            <TouchableOpacity
              style={[styles.calculateButton, !canCalculate && styles.calculateButtonDisabled]}
              onPress={calculateIdealWeight}
              disabled={!canCalculate}
            >
              <Feather name="cpu" size={18} color={canCalculate ? '#FFFFFF' : colors.grey} />
              <Text style={[styles.calculateButtonText, !canCalculate && styles.calculateButtonTextDisabled]}>
                {t.calculateIdeal}
              </Text>
            </TouchableOpacity>
          </FadeUpItem>

          {calculated && (
            <FadeUpItem delay={0}>
              <View style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <Feather name="check-circle" size={20} color="#059669" />
                  <Text style={styles.resultTitle}>{t.idealWeight}</Text>
                </View>
                <Text style={styles.resultWeight}>{suggestedWeight} kg</Text>
                <Text style={styles.resultExplanation}>{t.idealExplanation}</Text>
                <View style={styles.resultButtons}>
                  <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
                    <Feather name="check" size={16} color={'#FFFFFF'} />
                    <Text style={styles.acceptButtonText}>{t.accept} — {suggestedWeight}kg</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.ownGoalButton} onPress={handleSetOwn}>
                    <Text style={styles.ownGoalButtonText}>{t.setOwnGoal}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </FadeUpItem>
          )}

          {goalWeight && !showCustomInput && !calculated && (
            <FadeUpItem delay={0}>
              <View style={styles.goalSetCard}>
                <Feather name="target" size={16} color={colors.blue} />
                <Text style={styles.goalSetText}>{t.goalWeightSet} {goalWeight}kg</Text>
                <TouchableOpacity onPress={() => {
                  setGoalWeight(null);
                  setCalculated(false);
                  setShowCustomInput(false);
                }}>
                  <Feather name="x" size={16} color={colors.greyLight} />
                </TouchableOpacity>
              </View>
            </FadeUpItem>
          )}

          {showCustomInput && (
            <FadeUpItem delay={0}>
              <View style={styles.customInputCard}>
                <Text style={styles.label}>{t.goalWeight}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 80"
                  placeholderTextColor={colors.greyLight}
                  keyboardType="number-pad"
                  value={customGoal}
                  onChangeText={setCustomGoal}
                  maxLength={3}
                  autoFocus
                />
                <TouchableOpacity
                  style={[styles.confirmButton, !customGoal && styles.confirmButtonDisabled]}
                  disabled={!customGoal}
                  onPress={() => {
                    setGoalWeight(parseInt(customGoal));
                    setShowCustomInput(false);
                  }}
                >
                  <Text style={styles.confirmButtonText}>{t.confirmGoal}</Text>
                </TouchableOpacity>
              </View>
            </FadeUpItem>
          )}

          <FadeUpItem delay={450}>
            <TouchableOpacity
              style={[styles.button, !isComplete && styles.buttonDisabled]}
              onPress={handleContinue}
            >
              <Text style={styles.buttonText}>{t.continue}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Text style={styles.backText}>{t.back}</Text>
            </TouchableOpacity>
          </FadeUpItem>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function makeStyles(colors) {
  return StyleSheet.create({
    scrollContent: {
      paddingHorizontal: 24,
      paddingTop: 8,
      paddingBottom: 200,
      backgroundColor: colors.white,
    },

    fixedTop: {
      paddingHorizontal: 24,
      paddingTop: 52,
      paddingBottom: 0,
      backgroundColor: colors.white,
      zIndex: 10,
    },

    question: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.black,
      letterSpacing: -1,
      marginBottom: 8,
      lineHeight: 34,
    },

    subtitle: {
      fontSize: 14,
      color: colors.grey,
      marginBottom: 8,
      fontWeight: '300',
      lineHeight: 20,
    },

    label: {
      fontSize: 13,
      fontWeight: '500',
      color: colors.black,
      marginBottom: 6,
      marginTop: 16,
    },

    input: {
      borderWidth: 1.5,
      borderColor: colors.greyBorder,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 15,
      color: colors.black,
      backgroundColor: colors.white,
    },

    genderRow: {
      flexDirection: 'row',
      gap: 10,
    },

    genderOption: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: colors.greyBorder,
      alignItems: 'center',
    },

    genderSelected: {
      borderColor: colors.blue,
      backgroundColor: colors.blueLight,
    },

    genderText: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.black,
    },

    genderTextSelected: {
      color: colors.blueText,
    },

    calculateButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      backgroundColor: colors.black,
      paddingVertical: 16,
      borderRadius: 100,
      marginTop: 24,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 6,
    },

    calculateButtonDisabled: {
      backgroundColor: colors.greyBorder,
      shadowOpacity: 0,
      elevation: 0,
    },

    calculateButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
    },

    calculateButtonTextDisabled: {
      color: colors.grey,
    },

    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.75)',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 40,
    },

    overlayContent: {
      alignItems: 'center',
      gap: 16,
    },

    overlayLogoRow: {
      flexDirection: 'row',
    },

    overlayLogoFit: {
      fontSize: 48,
      fontWeight: '700',
      color: '#FFFFFF',
      letterSpacing: -2,
    },

    overlayLogoOpia: {
      fontSize: 48,
      fontWeight: '700',
      color: 'rgba(255,255,255,0.5)',
      letterSpacing: -2,
    },

    overlayText: {
      fontSize: 18,
      fontWeight: '600',
      color: '#FFFFFF',
      textAlign: 'center',
    },

    overlaySubText: {
      fontSize: 14,
      color: 'rgba(255,255,255,0.6)',
      textAlign: 'center',
      lineHeight: 20,
      fontWeight: '300',
    },

    resultCard: {
      backgroundColor: colors.white,
      borderRadius: 20,
      padding: 20,
      marginTop: 16,
      borderWidth: 1.5,
      borderColor: '#059669',
      shadowColor: '#059669',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 4,
      gap: 10,
    },

    resultHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },

    resultTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: '#059669',
    },

    resultWeight: {
      fontSize: 48,
      fontWeight: '700',
      color: colors.black,
      letterSpacing: -2,
    },

    resultExplanation: {
      fontSize: 13,
      color: colors.grey,
      lineHeight: 18,
      fontWeight: '300',
    },

    resultButtons: {
      gap: 10,
      marginTop: 4,
    },

    acceptButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: '#059669',
      paddingVertical: 14,
      borderRadius: 100,
      shadowColor: '#059669',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },

    acceptButtonText: {
      fontSize: 15,
      fontWeight: '600',
      color: '#FFFFFF',
    },

    ownGoalButton: {
      alignItems: 'center',
      paddingVertical: 12,
      borderRadius: 100,
      borderWidth: 1.5,
      borderColor: colors.greyBorder,
    },

    ownGoalButtonText: {
      fontSize: 15,
      color: colors.grey,
      fontWeight: '400',
    },

    goalSetCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      backgroundColor: colors.blueLight,
      padding: 14,
      borderRadius: 12,
      marginTop: 16,
    },

    goalSetText: {
      flex: 1,
      fontSize: 14,
      color: colors.blueText,
      fontWeight: '500',
    },

    customInputCard: {
      marginTop: 16,
      gap: 8,
    },

    confirmButton: {
      backgroundColor: colors.blue,
      paddingVertical: 14,
      borderRadius: 100,
      alignItems: 'center',
      marginTop: 8,
      shadowColor: colors.blue,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },

    confirmButtonDisabled: {
      backgroundColor: colors.greyBorder,
      shadowOpacity: 0,
      elevation: 0,
    },

    confirmButtonText: {
      fontSize: 15,
      fontWeight: '600',
      color: '#FFFFFF',
    },

    button: {
      backgroundColor: colors.blue,
      paddingVertical: 16,
      borderRadius: 100,
      alignItems: 'center',
      marginTop: 32,
      marginBottom: 12,
      shadowColor: colors.blue,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 12,
      elevation: 8,
    },

    buttonDisabled: {
      backgroundColor: colors.greyBorder,
      shadowOpacity: 0,
      elevation: 0,
    },

    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
      letterSpacing: -0.3,
    },

    backButton: {
      alignItems: 'center',
      paddingVertical: 12,
      marginBottom: 20,
    },

    backText: {
      fontSize: 15,
      color: colors.grey,
      fontWeight: '400',
    },
  });
}
