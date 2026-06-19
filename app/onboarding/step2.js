import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { colors } from '../../constants/colors';
import ProgressBar from '../../components/ProgressBar';
import { useOnboarding } from '../../context/OnboardingContext';
import { useState } from 'react';
import { onboardingStyles as styles } from '../../components/onboardingStyles';
import { Feather } from '@expo/vector-icons';
import BackgroundCircles from '../../components/BackgroundCircles';
import ScreenWrapper, {FadeUpItem} from '../../components/ScreenWrapper';

export default function Step2() {
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

        <Text style={styles.question}>What is your main goal?</Text>
        <Text style={styles.subtitle}>We'll build your plan around this.</Text>

        <View style={styles.options}>
            <FadeUpItem delay={150}>
                <TouchableOpacity
                style={[styles.option, selected === 'lose_weight' && styles.optionSelected]}
                onPress={() => setSelected('lose_weight')}
                >
                <View style={[
                    styles.optionIconContainer,
                    selected === 'lose_weight' && styles.optionIconContainerSelected
                ]}>
                    <Feather
                    name="trending-down"
                    size={20}
                    color={selected === 'lose_weight' ? colors.white : colors.grey}
                    />
                </View>
                <View>
                    <Text style={[styles.optionTitle, selected === 'lose_weight' && styles.optionTitleSelected]}>
                    Lose weight
                    </Text>
                    <Text style={styles.optionSub}>Burn fat and get leaner</Text>
                </View>
                </TouchableOpacity>
            </FadeUpItem>
            <FadeUpItem delay={250}>
                <TouchableOpacity
                style={[styles.option, selected === 'build_muscle' && styles.optionSelected]}
                onPress={() => setSelected('build_muscle')}
                >
                <View style={[
                    styles.optionIconContainer,
                    selected === 'build_muscle' && styles.optionIconContainerSelected
                ]}>
                    <Feather
                    name="activity"
                    size={20}
                    color={selected === 'build_muscle' ? colors.white : colors.grey}
                    />
                </View>
                <View>
                    <Text style={[styles.optionTitle, selected === 'build_muscle' && styles.optionTitleSelected]}>
                    Build muscle
                    </Text>
                    <Text style={styles.optionSub}>Get stronger and bigger</Text>
                </View>
                </TouchableOpacity>
            </FadeUpItem>

            <FadeUpItem delay={350}>
                <TouchableOpacity
                style={[styles.option, selected === 'stay_active' && styles.optionSelected]}
                onPress={() => setSelected('stay_active')}
                >
                <View style={[
                    styles.optionIconContainer,
                    selected === 'stay_active' && styles.optionIconContainerSelected
                ]}>
                    <Feather
                    name="heart"
                    size={20}
                    color={selected === 'stay_active' ? colors.white : colors.grey}
                    />
                </View>
                <View>
                    <Text style={[styles.optionTitle, selected === 'stay_active' && styles.optionTitleSelected]}>
                    Stay active
                    </Text>
                    <Text style={styles.optionSub}>Keep moving and feel good</Text>
                </View>
                </TouchableOpacity>
            </FadeUpItem>

            <FadeUpItem delay={450}>
                <TouchableOpacity
                style={[styles.option, selected === 'improve_fitness' && styles.optionSelected]}
                onPress={() => setSelected('improve_fitness')}
                >
                <View style={[
                    styles.optionIconContainer,
                    selected === 'improve_fitness' && styles.optionIconContainerSelected
                ]}>
                    <Feather
                    name="bar-chart-2"
                    size={20}
                    color={selected === 'improve_fitness' ? colors.white : colors.grey}
                    />
                </View>
                <View>
                    <Text style={[styles.optionTitle, selected === 'improve_fitness' && styles.optionTitleSelected]}>
                    Improve fitness
                    </Text>
                    <Text style={styles.optionSub}>Build endurance and stamina</Text>
                </View>
                </TouchableOpacity>
            </FadeUpItem>

        </View>

        <FadeUpItem delay={600}>
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