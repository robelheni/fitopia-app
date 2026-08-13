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

export default function Step8() {
    const theme = useTheme();
    const colors = theme ? theme.colors : lightColors;
    const styles = makeOnboardingStyles(colors);

    const { language } = useLanguage();
    const t = getTabTranslation(language);
    const [selected, setSelected] = useState(null);
    const { updateAnswer } = useOnboarding();

    function handleContinue() {
        if (!selected) return;
        updateAnswer('location', selected);
        router.navigate('/signup');
    }

    return (
        <ScreenWrapper style={styles.container}>
            <BackgroundCircles variant="centered" />

            <ProgressBar currentStep={8} totalSteps={8} />

            <FadeUpItem delay={100}>
                <Text style={styles.question}>{t.locationQuestion}</Text>
                <Text style={styles.subtitle}>{t.locationSub}</Text>
            </FadeUpItem>

            <View style={styles.options}>
                <FadeUpItem delay={200}>
                    <TouchableOpacity
                        style={[styles.option, selected === 'uk' && styles.optionSelected]}
                        onPress={() => setSelected('uk')}
                    >
                        <Text style={styles.optionEmoji}>🇬🇧</Text>
                        <View>
                            <Text style={[styles.optionTitle, selected === 'uk' && styles.optionTitleSelected]}>{t.unitedKingdom}</Text>
                            <Text style={styles.optionSub}>{t.unitedKingdomSub}</Text>
                        </View>
                    </TouchableOpacity>
                </FadeUpItem>

                <FadeUpItem delay={300}>
                    <TouchableOpacity
                        style={[styles.option, selected === 'us' && styles.optionSelected]}
                        onPress={() => setSelected('us')}
                    >
                        <Text style={styles.optionEmoji}>🇺🇸</Text>
                        <View>
                            <Text style={[styles.optionTitle, selected === 'us' && styles.optionTitleSelected]}>{t.unitedStates}</Text>
                            <Text style={styles.optionSub}>{t.unitedStatesSub}</Text>
                        </View>
                    </TouchableOpacity>
                </FadeUpItem>

                <FadeUpItem delay={400}>
                    <TouchableOpacity
                        style={[styles.option, selected === 'europe' && styles.optionSelected]}
                        onPress={() => setSelected('europe')}
                    >
                        <Text style={styles.optionEmoji}>🇪🇺</Text>
                        <View>
                            <Text style={[styles.optionTitle, selected === 'europe' && styles.optionTitleSelected]}>{t.europe}</Text>
                            <Text style={styles.optionSub}>{t.europeSub}</Text>
                        </View>
                    </TouchableOpacity>
                </FadeUpItem>

                <FadeUpItem delay={500}>
                    <TouchableOpacity
                        style={[styles.option, selected === 'canada' && styles.optionSelected]}
                        onPress={() => setSelected('canada')}
                    >
                        <Text style={styles.optionEmoji}>🇨🇦</Text>
                        <View>
                            <Text style={[styles.optionTitle, selected === 'canada' && styles.optionTitleSelected]}>{t.canada}</Text>
                            <Text style={styles.optionSub}>{t.canadaSub}</Text>
                        </View>
                    </TouchableOpacity>
                </FadeUpItem>

                <FadeUpItem delay={600}>
                    <TouchableOpacity
                        style={[styles.option, selected === 'ethiopia' && styles.optionSelected]}
                        onPress={() => setSelected('ethiopia')}
                    >
                        <Text style={styles.optionEmoji}>🇪🇹</Text>
                        <View>
                            <Text style={[styles.optionTitle, selected === 'ethiopia' && styles.optionTitleSelected]}>{t.ethiopia}</Text>
                            <Text style={styles.optionSub}>{t.ethiopiaSub}</Text>
                        </View>
                    </TouchableOpacity>
                </FadeUpItem>

                <FadeUpItem delay={700}>
                    <TouchableOpacity
                        style={[styles.option, selected === 'other' && styles.optionSelected]}
                        onPress={() => setSelected('other')}
                    >
                        <Text style={styles.optionEmoji}>🌍</Text>
                        <View>
                            <Text style={[styles.optionTitle, selected === 'other' && styles.optionTitleSelected]}>{t.somewhereElse}</Text>
                            <Text style={styles.optionSub}>{t.otherCountry}</Text>
                        </View>
                    </TouchableOpacity>
                </FadeUpItem>
            </View>

            <FadeUpItem delay={850}>
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
