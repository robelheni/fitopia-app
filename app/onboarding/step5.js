import { View, Text, TouchableOpacity } from 'react-native';
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

export default function Step5() {
    const theme = useTheme();
    const colors = theme ? theme.colors : lightColors;
    const styles = makeOnboardingStyles(colors);

    const { language } = useLanguage();
    const t = getTabTranslation(language);
    const [selected, setSelected] = useState(null);
    const { updateAnswer } = useOnboarding();

    function handleContinue() {
        if (!selected) return;
        updateAnswer('equipment', selected);
        router.navigate('/onboarding/step6');
    }

    return (
        <ScreenWrapper style={styles.container}>
            <BackgroundCircles variant="default" />

            <ProgressBar currentStep={5} totalSteps={8} />

            <Text style={styles.question}>{t.equipmentQuestion}</Text>
            <Text style={styles.subtitle}>{t.equipmentSub}</Text>

            <View style={styles.options}>
                <FadeUpItem delay={150}>
                    <TouchableOpacity
                        style={[styles.option, selected === 'gym' && styles.optionSelected]}
                        onPress={() => setSelected('gym')}
                    >
                        <View style={[styles.optionIconContainer, selected === 'gym' && styles.optionIconContainerSelected]}>
                            <MaterialCommunityIcons name="weight-lifter" size={20} color={selected === 'gym' ? '#FFFFFF' : colors.grey} />
                        </View>
                        <View>
                            <Text style={[styles.optionTitle, selected === 'gym' && styles.optionTitleSelected]}>{t.fullGym}</Text>
                            <Text style={styles.optionSub}>{t.fullGymSub}</Text>
                        </View>
                    </TouchableOpacity>
                </FadeUpItem>

                <FadeUpItem delay={250}>
                    <TouchableOpacity
                        style={[styles.option, selected === 'dumbbells' && styles.optionSelected]}
                        onPress={() => setSelected('dumbbells')}
                    >
                        <View style={[styles.optionIconContainer, selected === 'dumbbells' && styles.optionIconContainerSelected]}>
                            <MaterialCommunityIcons name="dumbbell" size={20} color={selected === 'dumbbells' ? '#FFFFFF' : colors.grey} />
                        </View>
                        <View>
                            <Text style={[styles.optionTitle, selected === 'dumbbells' && styles.optionTitleSelected]}>{t.dumbbellsHome}</Text>
                            <Text style={styles.optionSub}>{t.dumbbellsHomeSub}</Text>
                        </View>
                    </TouchableOpacity>
                </FadeUpItem>

                <FadeUpItem delay={350}>
                    <TouchableOpacity
                        style={[styles.option, selected === 'bodyweight' && styles.optionSelected]}
                        onPress={() => setSelected('bodyweight')}
                    >
                        <View style={[styles.optionIconContainer, selected === 'bodyweight' && styles.optionIconContainerSelected]}>
                            <Feather name="user" size={20} color={selected === 'bodyweight' ? '#FFFFFF' : colors.grey} />
                        </View>
                        <View>
                            <Text style={[styles.optionTitle, selected === 'bodyweight' && styles.optionTitleSelected]}>{t.noEquipment}</Text>
                            <Text style={styles.optionSub}>{t.noEquipmentSub}</Text>
                        </View>
                    </TouchableOpacity>
                </FadeUpItem>

                <FadeUpItem delay={450}>
                    <TouchableOpacity
                        style={[styles.option, selected === 'both' && styles.optionSelected]}
                        onPress={() => setSelected('both')}
                    >
                        <View style={[styles.optionIconContainer, selected === 'both' && styles.optionIconContainerSelected]}>
                            <Feather name="shuffle" size={20} color={selected === 'both' ? '#FFFFFF' : colors.grey} />
                        </View>
                        <View>
                            <Text style={[styles.optionTitle, selected === 'both' && styles.optionTitleSelected]}>{t.gymHome}</Text>
                            <Text style={styles.optionSub}>{t.gymHomeSub}</Text>
                        </View>
                    </TouchableOpacity>
                </FadeUpItem>
            </View>

            <FadeUpItem delay={350}>
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
