import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { colors } from '../../constants/colors';
import ProgressBar from '../../components/ProgressBar';
import { useOnboarding } from '../../context/OnboardingContext';
import { useState } from 'react';
import { onboardingStyles as styles } from '../../components/onboardingStyles';
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import BackgroundCircles from '../../components/BackgroundCircles';
import ScreenWrapper, { FadeUpItem } from '../../components/ScreenWrapper';

export default function Step5() {
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

            <Text style={styles.question}>What equipment do you have?</Text>
            <Text style={styles.subtitle}>We'll build your plan around what you have access to.</Text>

            <View style={styles.options}>
                <FadeUpItem delay={150}>
                    <TouchableOpacity
                    style={[styles.option, selected === 'gym' && styles.optionSelected]}
                    onPress={() => setSelected('gym')}
                    >
                    <View style={[
                        styles.optionIconContainer,
                        selected === 'gym' && styles.optionIconContainerSelected
                    ]}>
                        <MaterialCommunityIcons
                            name="weight-lifter"
                            size={20}
                            color={selected === 'gym' ? '#FFFFFF' : colors.grey}
                        />
                    </View>
                    <View>
                        <Text style={[styles.optionTitle, selected === 'gym' && styles.optionTitleSelected]}>
                        Full gym access
                        </Text>
                        <Text style={styles.optionSub}>All equipment available</Text>
                    </View>
                    </TouchableOpacity>
                </FadeUpItem>

                <FadeUpItem delay={250}>
                    <TouchableOpacity
                    style={[styles.option, selected === 'dumbbells' && styles.optionSelected]}
                    onPress={() => setSelected('dumbbells')}
                    >
                    <View style={[
                        styles.optionIconContainer,
                        selected === 'dumbbells' && styles.optionIconContainerSelected
                    ]}>
                        <MaterialCommunityIcons
                            name="dumbbell"
                            size={20}
                            color={selected === 'dumbbells' ? '#FFFFFF' : colors.grey}
                        />
                    </View>
                    <View>
                        <Text style={[styles.optionTitle, selected === 'dumbbells' && styles.optionTitleSelected]}>
                        Dumbbells at home
                        </Text>
                        <Text style={styles.optionSub}>Home setup with weights</Text>
                    </View>
                    </TouchableOpacity>
                </FadeUpItem>

                <FadeUpItem delay={350}>
                    <TouchableOpacity
                    style={[styles.option, selected === 'bodyweight' && styles.optionSelected]}
                    onPress={() => setSelected('bodyweight')}
                    >
                    <View style={[
                        styles.optionIconContainer,
                        selected === 'bodyweight' && styles.optionIconContainerSelected
                    ]}>
                        <Feather
                        name="user"
                        size={20}
                        color={selected === 'bodyweight' ? '#FFFFFF' : colors.grey}
                        />
                    </View>
                    <View>
                        <Text style={[styles.optionTitle, selected === 'bodyweight' && styles.optionTitleSelected]}>
                        No equipment
                        </Text>
                        <Text style={styles.optionSub}>Bodyweight only</Text>
                    </View>
                    </TouchableOpacity>
                </FadeUpItem>

                <FadeUpItem delay={450}>
                    <TouchableOpacity
                    style={[styles.option, selected === 'both' && styles.optionSelected]}
                    onPress={() => setSelected('both')}
                    >
                    <View style={[
                        styles.optionIconContainer,
                        selected === 'both' && styles.optionIconContainerSelected
                    ]}>
                        <Feather
                        name="shuffle"
                        size={20}
                        color={selected === 'both' ? '#FFFFFF' : colors.grey}
                        />
                    </View>
                    <View>
                        <Text style={[styles.optionTitle, selected === 'both' && styles.optionTitleSelected]}>
                        Both gym and home
                        </Text>
                        <Text style={styles.optionSub}>I switch between both</Text>
                    </View>
                    </TouchableOpacity>
                </FadeUpItem>

            </View>

            <FadeUpItem delay={350}>
                <TouchableOpacity
                    style={[styles.button, !selected && styles.buttonDisabled]}
                    onPress={handleContinue}
                >
                    <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
            </FadeUpItem>

        </ScreenWrapper>
    );
    }