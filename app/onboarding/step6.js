import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { lightColors } from '../../constants/colors';
import { makeOnboardingStyles } from '../../components/onboardingStyles';
import ProgressBar from '../../components/ProgressBar';
import { useOnboarding } from '../../context/OnboardingContext';
import { useState } from 'react';
import BackgroundCircles from '../../components/BackgroundCircles';
import ScreenWrapper, { FadeUpItem } from '../../components/ScreenWrapper';
import { useLanguage } from '../../context/LanguageContext';
import { getTabTranslation } from '../../constants/tabTranslations';

export default function Step6() {
    const theme = useTheme();
    const colors = theme ? theme.colors : lightColors;
    const styles = makeOnboardingStyles(colors);

    const { language } = useLanguage();
    const t = getTabTranslation(language);
    const [selected, setSelected] = useState([]);
    const { updateAnswer } = useOnboarding();

    function toggleOption(option) {
        setSelected(prev =>
            prev.includes(option)
                ? prev.filter(item => item !== option)
                : [...prev, option]
        );
    }

    function handleContinue() {
        if (selected.length === 0) return;
        updateAnswer('foodChoices', selected);
        router.navigate('/onboarding/step7');
    }

    return (
        <ScreenWrapper style={styles.container}>
            <BackgroundCircles variant="topLeft" />

            <ProgressBar currentStep={6} totalSteps={8} />

            <Text style={styles.question}>{t.foodQuestion}</Text>
            <Text style={styles.subtitle}>{t.foodSub}</Text>

            <View style={styles.options}>
                <FadeUpItem delay={150}>
                    <TouchableOpacity
                        style={[styles.option, selected.includes('meat') && styles.optionSelected]}
                        onPress={() => toggleOption('meat')}
                    >
                        <Text style={styles.optionEmoji}>🥩</Text>
                        <View>
                            <Text style={[styles.optionTitle, selected.includes('meat') && styles.optionTitleSelected]}>{t.meatEater}</Text>
                            <Text style={styles.optionSub}>{t.meatSub}</Text>
                        </View>
                    </TouchableOpacity>
                </FadeUpItem>

                <FadeUpItem delay={250}>
                    <TouchableOpacity
                        style={[styles.option, selected.includes('vegetarian') && styles.optionSelected]}
                        onPress={() => toggleOption('vegetarian')}
                    >
                        <Text style={styles.optionEmoji}>🥗</Text>
                        <View>
                            <Text style={[styles.optionTitle, selected.includes('vegetarian') && styles.optionTitleSelected]}>{t.vegetarian}</Text>
                            <Text style={styles.optionSub}>{t.vegetarianSub}</Text>
                        </View>
                    </TouchableOpacity>
                </FadeUpItem>

                <FadeUpItem delay={350}>
                    <TouchableOpacity
                        style={[styles.option, selected.includes('fasting') && styles.optionSelected]}
                        onPress={() => toggleOption('fasting')}
                    >
                        <Text style={styles.optionEmoji}>🌙</Text>
                        <View>
                            <Text style={[styles.optionTitle, selected.includes('fasting') && styles.optionTitleSelected]}>{t.regularFasting}</Text>
                            <Text style={styles.optionSub}>{t.fastingSub}</Text>
                        </View>
                    </TouchableOpacity>
                </FadeUpItem>

                <FadeUpItem delay={450}>
                    <TouchableOpacity
                        style={[styles.option, selected.includes('ethiopian') && styles.optionSelected]}
                        onPress={() => toggleOption('ethiopian')}
                    >
                        <Text style={styles.optionEmoji}>🍽</Text>
                        <View>
                            <Text style={[styles.optionTitle, selected.includes('ethiopian') && styles.optionTitleSelected]}>{t.ethiopianDiet}</Text>
                            <Text style={styles.optionSub}>{t.ethiopianDietSub}</Text>
                        </View>
                    </TouchableOpacity>
                </FadeUpItem>
            </View>

            <FadeUpItem delay={600}>
                <TouchableOpacity
                    style={[styles.button, selected.length === 0 && styles.buttonDisabled]}
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
