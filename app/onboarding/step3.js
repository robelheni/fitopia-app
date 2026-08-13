import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { lightColors } from '../../constants/colors';
import { makeOnboardingStyles } from '../../components/onboardingStyles';
import ProgressBar from '../../components/ProgressBar';
import { useOnboarding } from '../../context/OnboardingContext';
import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import BackgroundCircles from '../../components/BackgroundCircles';
import ScreenWrapper, { FadeUpItem } from '../../components/ScreenWrapper';
import { useLanguage } from '../../context/LanguageContext';
import { getTabTranslation } from '../../constants/tabTranslations';

const allDays = [
  { key: 'mon', label: 'Mon' },
  { key: 'tue', label: 'Tue' },
  { key: 'wed', label: 'Wed' },
  { key: 'thu', label: 'Thu' },
  { key: 'fri', label: 'Fri' },
  { key: 'sat', label: 'Sat' },
  { key: 'sun', label: 'Sun' },
];

const maxDays = { '2': 2, '3': 3, '4': 4, '5+': 5 };

export default function Step3() {
  const theme = useTheme();
  const colors = theme ? theme.colors : lightColors;
  const styles = makeOnboardingStyles(colors);
  const step3Styles = makeStep3Styles(colors);

  const { language } = useLanguage();
  const t = getTabTranslation(language);
  const [selected, setSelected] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const { updateAnswer } = useOnboarding();

  const max = selected ? maxDays[selected] : 0;
  const isComplete = selected && selectedDays.length === max;

  function toggleDay(day) {
    if (selectedDays.includes(day)) {
      setSelectedDays(prev => prev.filter(d => d !== day));
    } else {
      if (selectedDays.length < max) {
        setSelectedDays(prev => [...prev, day]);
      }
    }
  }

  function handleSelectDays(value) {
    setSelected(value);
    setSelectedDays([]);
  }

  function handleContinue() {
    if (!isComplete) return;
    updateAnswer('daysPerWeek', selected);
    updateAnswer('trainingDays', selectedDays);
    router.navigate('/onboarding/step4');
  }

  return (
    <ScreenWrapper style={styles.container}>
      <BackgroundCircles variant="topLeft" />

      <ProgressBar currentStep={3} totalSteps={8} />

      <Text style={styles.question}>{t.daysQuestion}</Text>
      <Text style={styles.subtitle}>{t.daysSub}</Text>

      <View style={styles.options}>
        <FadeUpItem delay={150}>
          <TouchableOpacity
            style={[styles.option, selected === '2' && styles.optionSelected]}
            onPress={() => handleSelectDays('2')}
          >
            <View style={[styles.optionIconContainer, selected === '2' && styles.optionIconContainerSelected]}>
              <Feather name="moon" size={20} color={selected === '2' ? '#FFFFFF' : colors.grey} />
            </View>
            <View>
              <Text style={[styles.optionTitle, selected === '2' && styles.optionTitleSelected]}>{t.twoDays}</Text>
              <Text style={styles.optionSub}>{t.lightSchedule}</Text>
            </View>
          </TouchableOpacity>
        </FadeUpItem>

        <FadeUpItem delay={250}>
          <TouchableOpacity
            style={[styles.option, selected === '3' && styles.optionSelected]}
            onPress={() => handleSelectDays('3')}
          >
            <View style={[styles.optionIconContainer, selected === '3' && styles.optionIconContainerSelected]}>
              <Feather name="sun" size={20} color={selected === '3' ? '#FFFFFF' : colors.grey} />
            </View>
            <View>
              <Text style={[styles.optionTitle, selected === '3' && styles.optionTitleSelected]}>{t.threeDays}</Text>
              <Text style={styles.optionSub}>{t.goodBalance}</Text>
            </View>
          </TouchableOpacity>
        </FadeUpItem>

        <FadeUpItem delay={350}>
          <TouchableOpacity
            style={[styles.option, selected === '4' && styles.optionSelected]}
            onPress={() => handleSelectDays('4')}
          >
            <View style={[styles.optionIconContainer, selected === '4' && styles.optionIconContainerSelected]}>
              <Feather name="zap" size={20} color={selected === '4' ? '#FFFFFF' : colors.grey} />
            </View>
            <View>
              <Text style={[styles.optionTitle, selected === '4' && styles.optionTitleSelected]}>{t.fourDays}</Text>
              <Text style={styles.optionSub}>{t.seriousCommitment}</Text>
            </View>
          </TouchableOpacity>
        </FadeUpItem>

        <FadeUpItem delay={450}>
          <TouchableOpacity
            style={[styles.option, selected === '5+' && styles.optionSelected]}
            onPress={() => handleSelectDays('5+')}
          >
            <View style={[styles.optionIconContainer, selected === '5+' && styles.optionIconContainerSelected]}>
              <MaterialCommunityIcons name="fire" size={20} color={selected === '5+' ? '#FFFFFF' : colors.grey} />
            </View>
            <View>
              <Text style={[styles.optionTitle, selected === '5+' && styles.optionTitleSelected]}>{t.fiveDays}</Text>
              <Text style={styles.optionSub}>{t.fullDedication}</Text>
            </View>
          </TouchableOpacity>
        </FadeUpItem>
      </View>

      {selected && (
        <FadeUpItem delay={0}>
          <View style={step3Styles.daySection}>
            <Text style={step3Styles.dayTitle}>{t.whichDays}</Text>
            <Text style={step3Styles.daySub}>
              {t.selectDays} {max} — {selectedDays.length}/{max} {t.selected}
            </Text>
            <View style={step3Styles.dayGrid}>
              {allDays.map(day => {
                const isSelected = selectedDays.includes(day.key);
                const isDisabled = !isSelected && selectedDays.length >= max;
                return (
                  <TouchableOpacity
                    key={day.key}
                    style={[
                      step3Styles.dayButton,
                      isSelected && step3Styles.dayButtonSelected,
                      isDisabled && step3Styles.dayButtonDisabled,
                    ]}
                    onPress={() => toggleDay(day.key)}
                    disabled={isDisabled}
                  >
                    <Text style={[
                      step3Styles.dayButtonText,
                      isSelected && step3Styles.dayButtonTextSelected,
                      isDisabled && step3Styles.dayButtonTextDisabled,
                    ]}>
                      {t[day.key]}
                    </Text>
                    {isSelected && (
                      <View style={step3Styles.dayCheck}>
                        <Feather name="check" size={8} color={'#FFFFFF'} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </FadeUpItem>
      )}

      <FadeUpItem delay={600}>
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
    </ScreenWrapper>
  );
}

function makeStep3Styles(colors) {
  return StyleSheet.create({
    daySection: {
      marginTop: 0,
      paddingBottom: 45,
      marginBottom: 8,
    },

    dayTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.black,
      letterSpacing: -0.3,
      marginBottom: 4,
    },

    daySub: {
      fontSize: 13,
      color: colors.grey,
      fontWeight: '300',
      marginBottom: 12,
    },

    dayGrid: {
      flexDirection: 'row',
      gap: 8,
    },

    dayButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: colors.greyBorder,
      backgroundColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },

    dayButtonSelected: {
      backgroundColor: colors.blue,
      borderColor: colors.blue,
      shadowColor: colors.blue,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },

    dayButtonDisabled: {
      backgroundColor: colors.greyCard,
      borderColor: colors.greyBorder,
      opacity: 0.4,
    },

    dayButtonText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.black,
    },

    dayButtonTextSelected: {
      color: '#FFFFFF',
    },

    dayButtonTextDisabled: {
      color: colors.greyLight,
    },

    dayCheck: {
      position: 'absolute',
      top: 4,
      right: 4,
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: 'rgba(255,255,255,0.3)',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}
