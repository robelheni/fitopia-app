import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { lightColors } from '../../constants/colors';
import { makeOnboardingStyles } from '../../components/onboardingStyles';
import ProgressBar from '../../components/ProgressBar';
import { useOnboarding } from '../../context/OnboardingContext';
import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import BackgroundCircles from '../../components/BackgroundCircles';
import ScreenWrapper, { FadeUpItem } from '../../components/ScreenWrapper';
import { useLanguage } from '../../context/LanguageContext';
import { getTabTranslation } from '../../constants/tabTranslations';

export default function Step2() {
    const theme = useTheme();
    const colors = theme ? theme.colors : lightColors;
    const styles = makeOnboardingStyles(colors);

    const { language } = useLanguage();
    const t = getTabTranslation(language);
    const [selected, setSelected] = useState(null);
    const { updateAnswer } = useOnboarding();

    function handleContinue() {
        if (!selected) return;
        updateAnswer('goal', selected);
        router.navigate('/onboarding/step3');
    }

    return (
        <ScreenWrapper style={styles.container}>
            <BackgroundCircles variant="centered" />

            <ProgressBar currentStep={2} totalSteps={8} />

            <Text style={styles.question}>{t.goalQuestion}</Text>
            <Text style={styles.subtitle}>{t.goalSub}</Text>

            <View style={styles.options}>
                <FadeUpItem delay={150}>
                    <TouchableOpacity
                        style={[styles.option, selected === 'lose_weight' && styles.optionSelected]}
                        onPress={() => setSelected('lose_weight')}
                    >
                        <View style={[styles.optionIconContainer, selected === 'lose_weight' && styles.optionIconContainerSelected]}>
                            <Feather name="trending-down" size={20} color={selected === 'lose_weight' ? '#FFFFFF' : colors.grey} />
                        </View>
                        <View>
                            <Text style={[styles.optionTitle, selected === 'lose_weight' && styles.optionTitleSelected]}>{t.loseWeight}</Text>
                            <Text style={styles.optionSub}>{t.loseWeightSub}</Text>
                        </View>
                    </TouchableOpacity>
                </FadeUpItem>

                <FadeUpItem delay={250}>
                    <TouchableOpacity
                        style={[styles.option, selected === 'build_muscle' && styles.optionSelected]}
                        onPress={() => setSelected('build_muscle')}
                    >
                        <View style={[styles.optionIconContainer, selected === 'build_muscle' && styles.optionIconContainerSelected]}>
                            <Feather name="activity" size={20} color={selected === 'build_muscle' ? '#FFFFFF' : colors.grey} />
                        </View>
                        <View>
                            <Text style={[styles.optionTitle, selected === 'build_muscle' && styles.optionTitleSelected]}>{t.buildMuscle}</Text>
                            <Text style={styles.optionSub}>{t.buildMuscleSub}</Text>
                        </View>
                    </TouchableOpacity>
                </FadeUpItem>

                <FadeUpItem delay={350}>
                    <TouchableOpacity
                        style={[styles.option, selected === 'stay_active' && styles.optionSelected]}
                        onPress={() => setSelected('stay_active')}
                    >
                        <View style={[styles.optionIconContainer, selected === 'stay_active' && styles.optionIconContainerSelected]}>
                            <Feather name="heart" size={20} color={selected === 'stay_active' ? '#FFFFFF' : colors.grey} />
                        </View>
                        <View>
                            <Text style={[styles.optionTitle, selected === 'stay_active' && styles.optionTitleSelected]}>{t.stayActive}</Text>
                            <Text style={styles.optionSub}>{t.stayActiveSub}</Text>
                        </View>
                    </TouchableOpacity>
                </FadeUpItem>

                <FadeUpItem delay={450}>
                    <TouchableOpacity
                        style={[styles.option, selected === 'improve_fitness' && styles.optionSelected]}
                        onPress={() => setSelected('improve_fitness')}
                    >
                        <View style={[styles.optionIconContainer, selected === 'improve_fitness' && styles.optionIconContainerSelected]}>
                            <Feather name="bar-chart-2" size={20} color={selected === 'improve_fitness' ? '#FFFFFF' : colors.grey} />
                        </View>
                        <View>
                            <Text style={[styles.optionTitle, selected === 'improve_fitness' && styles.optionTitleSelected]}>{t.improveFitness}</Text>
                            <Text style={styles.optionSub}>{t.improveFitnessSub}</Text>
                        </View>
                    </TouchableOpacity>
                </FadeUpItem>
            </View>

            <FadeUpItem delay={600}>
                <TouchableOpacity
                    style={[styles.button, !selected && styles.buttonDisabled]}
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
