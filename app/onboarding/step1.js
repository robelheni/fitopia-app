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

export default function Step1() {
    const theme = useTheme();
    const colors = theme ? theme.colors : lightColors;
    const styles = makeOnboardingStyles(colors);

    const { language } = useLanguage();
    const t = getTabTranslation(language);
    const [selected, setSelected] = useState(null);
    const { updateAnswer } = useOnboarding();

    function handleContinue() {
        if (!selected) return;
        updateAnswer('fitnessLevel', selected);
        router.navigate('/onboarding/step2');
    }

    return (
        <ScreenWrapper style={styles.container}>
            <BackgroundCircles variant="bottomRight" />

            <ProgressBar currentStep={1} totalSteps={8} />

            <FadeUpItem delay={10}>
                <Text style={styles.question}>{t.fitnessLevelQuestion}</Text>
                <Text style={styles.subtitle}>{t.fitnessLevelSub}</Text>
            </FadeUpItem>

            <View style={styles.options}>
                <FadeUpItem delay={150}>
                    <TouchableOpacity
                        style={[styles.option, selected === 'beginner' && styles.optionSelected]}
                        onPress={() => setSelected('beginner')}
                    >
                        <View style={[styles.optionIconContainer, selected === 'beginner' && styles.optionIconContainerSelected]}>
                            <Feather name="smile" size={20} color={selected === 'beginner' ? '#FFFFFF' : colors.grey} />
                        </View>
                        <View>
                            <Text style={[styles.optionTitle, selected === 'beginner' && styles.optionTitleSelected]}>{t.beginner}</Text>
                            <Text style={styles.optionSub}>{t.beginnerSub}</Text>
                        </View>
                    </TouchableOpacity>
                </FadeUpItem>

                <FadeUpItem delay={250}>
                    <TouchableOpacity
                        style={[styles.option, selected === 'intermediate' && styles.optionSelected]}
                        onPress={() => setSelected('intermediate')}
                    >
                        <View style={[styles.optionIconContainer, selected === 'intermediate' && styles.optionIconContainerSelected]}>
                            <Feather name="zap" size={20} color={selected === 'intermediate' ? '#FFFFFF' : colors.grey} />
                        </View>
                        <View>
                            <Text style={[styles.optionTitle, selected === 'intermediate' && styles.optionTitleSelected]}>{t.intermediate}</Text>
                            <Text style={styles.optionSub}>{t.intermediateSub}</Text>
                        </View>
                    </TouchableOpacity>
                </FadeUpItem>

                <FadeUpItem delay={350}>
                    <TouchableOpacity
                        style={[styles.option, selected === 'advanced' && styles.optionSelected]}
                        onPress={() => setSelected('advanced')}
                    >
                        <View style={[styles.optionIconContainer, selected === 'advanced' && styles.optionIconContainerSelected]}>
                            <Feather name="award" size={20} color={selected === 'advanced' ? '#FFFFFF' : colors.grey} />
                        </View>
                        <View>
                            <Text style={[styles.optionTitle, selected === 'advanced' && styles.optionTitleSelected]}>{t.advanced}</Text>
                            <Text style={styles.optionSub}>{t.advancedSub}</Text>
                        </View>
                    </TouchableOpacity>
                </FadeUpItem>
            </View>

            <FadeUpItem delay={500}>
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
