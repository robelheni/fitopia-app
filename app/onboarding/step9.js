import { View, Text, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
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

export default function Step9() {
    const theme = useTheme();
    const colors = theme ? theme.colors : lightColors;
    const styles = makeOnboardingStyles(colors);

    const { language } = useLanguage();
    const t = getTabTranslation(language);
    const [selected, setSelected] = useState([]);
    const { updateAnswer } = useOnboarding();
    const [other, setOther] = useState('');

    function toggleOption(option) {
        setSelected(prev =>
            prev.includes(option)
                ? prev.filter(item => item !== option)
                : [...prev, option]
        );
    }

    function handleContinue() {
        updateAnswer('injuries', { selected, other });
        router.replace('/signup');
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: colors.white }}
            behavior={Platform.OS === 'ios' ? 'position' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
            <ScrollView
                contentContainerStyle={{
                    paddingHorizontal: 24,
                    paddingTop: 60,
                    paddingBottom: 200,
                    backgroundColor: colors.white,
                }}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                showsVerticalScrollIndicator={false}
            >
                <BackgroundCircles variant="topLeft" />

                <ProgressBar currentStep={9} totalSteps={9} />

                <Text style={styles.question}>{t.injuryQuestion}</Text>
                <Text style={styles.subtitle}>{t.injurySub}</Text>

                <View style={styles.options}>
                    <FadeUpItem delay={100}>
                        <TouchableOpacity
                            style={[styles.option, selected.includes('back') && styles.optionSelected]}
                            onPress={() => toggleOption('back')}
                        >
                            <Text style={styles.optionEmoji}>🔙</Text>
                            <View>
                                <Text style={[styles.optionTitle, selected.includes('back') && styles.optionTitleSelected]}>{t.backPain}</Text>
                                <Text style={styles.optionSub}>{t.backPainSub}</Text>
                            </View>
                        </TouchableOpacity>
                    </FadeUpItem>

                    <FadeUpItem delay={200}>
                        <TouchableOpacity
                            style={[styles.option, selected.includes('knee') && styles.optionSelected]}
                            onPress={() => toggleOption('knee')}
                        >
                            <Text style={styles.optionEmoji}>🦵</Text>
                            <View>
                                <Text style={[styles.optionTitle, selected.includes('knee') && styles.optionTitleSelected]}>{t.kneeProblems}</Text>
                                <Text style={styles.optionSub}>{t.kneeSub}</Text>
                            </View>
                        </TouchableOpacity>
                    </FadeUpItem>

                    <FadeUpItem delay={300}>
                        <TouchableOpacity
                            style={[styles.option, selected.includes('shoulder') && styles.optionSelected]}
                            onPress={() => toggleOption('shoulder')}
                        >
                            <Text style={styles.optionEmoji}>💪</Text>
                            <View>
                                <Text style={[styles.optionTitle, selected.includes('shoulder') && styles.optionTitleSelected]}>{t.shoulderIssues}</Text>
                                <Text style={styles.optionSub}>{t.shoulderSub}</Text>
                            </View>
                        </TouchableOpacity>
                    </FadeUpItem>

                    <FadeUpItem delay={350}>
                        <TouchableOpacity
                            style={[styles.option, selected.includes('wrist') && styles.optionSelected]}
                            onPress={() => toggleOption('wrist')}
                        >
                            <Text style={styles.optionEmoji}>🤝</Text>
                            <View>
                                <Text style={[styles.optionTitle, selected.includes('wrist') && styles.optionTitleSelected]}>{t.wristPain}</Text>
                                <Text style={styles.optionSub}>{t.wristSub}</Text>
                            </View>
                        </TouchableOpacity>
                    </FadeUpItem>

                    <FadeUpItem delay={400}>
                        <TouchableOpacity
                            style={[styles.option, selected.includes('ankle') && styles.optionSelected]}
                            onPress={() => toggleOption('ankle')}
                        >
                            <Text style={styles.optionEmoji}>🦶</Text>
                            <View>
                                <Text style={[styles.optionTitle, selected.includes('ankle') && styles.optionTitleSelected]}>{t.anklePain}</Text>
                                <Text style={styles.optionSub}>{t.ankleSub}</Text>
                            </View>
                        </TouchableOpacity>
                    </FadeUpItem>

                    <FadeUpItem delay={400}>
                        <TouchableOpacity
                            style={[styles.option, selected.includes('none') && styles.optionSelected]}
                            onPress={() => toggleOption('none')}
                        >
                            <Text style={styles.optionEmoji}>✅</Text>
                            <View>
                                <Text style={[styles.optionTitle, selected.includes('none') && styles.optionTitleSelected]}>{t.noInjuries}</Text>
                                <Text style={styles.optionSub}>{t.noInjuriesSub}</Text>
                            </View>
                        </TouchableOpacity>
                    </FadeUpItem>

                    <FadeUpItem delay={500}>
                        <TouchableOpacity
                            style={[styles.option, selected.includes('other') && styles.optionSelected]}
                            onPress={() => toggleOption('other')}
                        >
                            <Text style={styles.optionEmoji}>✏️</Text>
                            <View>
                                <Text style={[styles.optionTitle, selected.includes('other') && styles.optionTitleSelected]}>{t.other}</Text>
                                <Text style={styles.optionSub}>{t.otherInjurySub}</Text>
                            </View>
                        </TouchableOpacity>
                    </FadeUpItem>

                    {selected.includes('other') && (
                        <TextInput
                            style={styles.otherInput}
                            placeholder={t.describeInjury}
                            placeholderTextColor={colors.greyLight}
                            value={other}
                            onChangeText={setOther}
                            multiline
                            numberOfLines={3}
                        />
                    )}
                </View>

                <FadeUpItem delay={300}>
                    <TouchableOpacity
                        style={[styles.button, { marginTop: 24 }]}
                        onPress={handleContinue}
                    >
                        <Text style={styles.buttonText}>{t.finish}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Text style={styles.backText}>{t.back}</Text>
                    </TouchableOpacity>
                </FadeUpItem>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
