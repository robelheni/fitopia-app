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

export default function Step1() {
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


        <ProgressBar currentStep={1} totalSteps={9} />

        <FadeUpItem delay={10}>
            <Text style={styles.question}>What is your fitness level?</Text>
            <Text style={styles.subtitle}>Be honest — this helps us get your plan right.</Text>
        </FadeUpItem>

        <View style={styles.options}>

        <FadeUpItem delay={150}>
            <TouchableOpacity
            style={[styles.option, selected === 'beginner' && styles.optionSelected]}
            onPress={() => setSelected('beginner')}
        
            >
            <View style={[
                styles.optionIconContainer,
                selected === 'beginner' && styles.optionIconContainerSelected
            ]}>
                <Feather
                name="smile"
                size={20}
                color={selected === 'beginner' ? colors.white : colors.grey}
                />
            </View>
            <View>
                <Text style={[styles.optionTitle, selected === 'beginner' && styles.optionTitleSelected]}>
                Beginner
                </Text>
                <Text style={styles.optionSub}>Just starting out . 0-6 months training</Text>
            </View>
            </TouchableOpacity>
        </FadeUpItem>

        <FadeUpItem delay={250}>
            <TouchableOpacity
            style={[styles.option, selected === 'intermediate' && styles.optionSelected]}
            onPress={() => setSelected('intermediate')}
            >
            <View style={[
                styles.optionIconContainer,
                selected === 'intermediate' && styles.optionIconContainerSelected
            ]}>
                <Feather
                name="zap"
                size={20}
                color={selected === 'intermediate' ? colors.white : colors.grey}
                />
            </View>
            <View>
                <Text style={[styles.optionTitle, selected === 'intermediate' && styles.optionTitleSelected]}>
                Intermediate
                </Text>
                <Text style={styles.optionSub}>6 months to 2 years training</Text>
            </View>
            </TouchableOpacity>
        </FadeUpItem>


        <FadeUpItem delay={350}>
            <TouchableOpacity
            style={[styles.option, selected === 'advanced' && styles.optionSelected]}
            onPress={() => setSelected('advanced')}
            >
            <View style={[
                styles.optionIconContainer,
                selected === 'advanced' && styles.optionIconContainerSelected
            ]}>
                <Feather
                name="award"
                size={20}
                color={selected === 'advanced' ? colors.white : colors.grey}
                />
            </View>
            <View>
                <Text style={[styles.optionTitle, selected === 'advanced' && styles.optionTitleSelected]}>
                Advanced
                </Text>
                <Text style={styles.optionSub}>2+ years of training</Text>
            </View>
            </TouchableOpacity>
        </FadeUpItem>

        </View>
            <FadeUpItem delay={500}>
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