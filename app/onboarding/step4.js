import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { lightColors } from '../../constants/colors';
import { makeOnboardingStyles } from '../../components/onboardingStyles';
import ProgressBar from '../../components/ProgressBar';
import { useOnboarding } from '../../context/OnboardingContext';
import { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import BackgroundCircles from '../../components/BackgroundCircles';
import ScreenWrapper, { FadeUpItem } from '../../components/ScreenWrapper';
import { useLanguage } from '../../context/LanguageContext';
import { getTabTranslation } from '../../constants/tabTranslations';

export default function Step4() {
    const theme = useTheme();
    const colors = theme ? theme.colors : lightColors;
    const styles = makeOnboardingStyles(colors);

    const { language } = useLanguage();
    const t = getTabTranslation(language);
    const [selected, setSelected] = useState(null);
    const { updateAnswer } = useOnboarding();

    function handleContinue() {
        if (!selected) return;
        updateAnswer('duration', selected);
        router.navigate('/onboarding/step5');
    }

    return (
        <ScreenWrapper style={styles.container}>
            <BackgroundCircles variant="bottomRight" />

            <ProgressBar currentStep={4} totalSteps={8} />

            <Text style={styles.question}>{t.durationQuestion}</Text>
            <Text style={styles.subtitle}>{t.durationSub}</Text>

            <View style={styles.options}>
                <FadeUpItem delay={250}>
                    <TouchableOpacity
                        style={[styles.option, selected === '30' && styles.optionSelected]}
                        onPress={() => setSelected('30')}
                    >
                        <View style={[styles.optionIconContainer, selected === '30' && styles.optionIconContainerSelected]}>
                            <MaterialCommunityIcons name="timer-outline" size={20} color={selected === '30' ? '#FFFFFF' : colors.grey} />
                        </View>
                        <View>
                            <Text style={[styles.optionTitle, selected === '30' && styles.optionTitleSelected]}>{t.minutes30}</Text>
                            <Text style={styles.optionSub}>{t.quickSession}</Text>
                        </View>
                    </TouchableOpacity>
                </FadeUpItem>

                <FadeUpItem delay={350}>
                    <TouchableOpacity
                        style={[styles.option, selected === '45' && styles.optionSelected]}
                        onPress={() => setSelected('45')}
                    >
                        <View style={[styles.optionIconContainer, selected === '45' && styles.optionIconContainerSelected]}>
                            <MaterialCommunityIcons name="clock-check-outline" size={20} color={selected === '45' ? '#FFFFFF' : colors.grey} />
                        </View>
                        <View>
                            <Text style={[styles.optionTitle, selected === '45' && styles.optionTitleSelected]}>{t.minutes45}</Text>
                            <Text style={styles.optionSub}>{t.popularChoice}</Text>
                        </View>
                    </TouchableOpacity>
                </FadeUpItem>

                <FadeUpItem delay={450}>
                    <TouchableOpacity
                        style={[styles.option, selected === '60+' && styles.optionSelected]}
                        onPress={() => setSelected('60+')}
                    >
                        <View style={[styles.optionIconContainer, selected === '60+' && styles.optionIconContainerSelected]}>
                            <MaterialCommunityIcons name="clock-time-eight-outline" size={20} color={selected === '60+' ? '#FFFFFF' : colors.grey} />
                        </View>
                        <View>
                            <Text style={[styles.optionTitle, selected === '60+' && styles.optionTitleSelected]}>{t.minutes60}</Text>
                            <Text style={styles.optionSub}>{t.solidSession}</Text>
                        </View>
                    </TouchableOpacity>
                </FadeUpItem>

                <FadeUpItem delay={450}>
                    <TouchableOpacity
                        style={[styles.option, selected === '80' && styles.optionSelected]}
                        onPress={() => setSelected('80')}
                    >
                        <View style={[styles.optionIconContainer, selected === '80' && styles.optionIconContainerSelected]}>
                            <MaterialCommunityIcons name="clock-time-eight-outline" size={20} color={selected === '80' ? '#FFFFFF' : colors.grey} />
                        </View>
                        <View>
                            <Text style={[styles.optionTitle, selected === '80' && styles.optionTitleSelected]}>{t.minutes80}</Text>
                            <Text style={styles.optionSub}>{t.fullDedication}</Text>
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
