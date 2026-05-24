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

export default function Step3() {
    const [selected, setSelected] = useState(null);
    const { updateAnswer } = useOnboarding();

    function handleContinue() {
        if (!selected) return;
        updateAnswer('daysPerWeek', selected);
        router.navigate('/onboarding/step4');
    }

    return (
        <ScreenWrapper style={styles.container}>
        <BackgroundCircles variant="topLeft" />

        <ProgressBar currentStep={3} totalSteps={9} />

        <Text style={styles.question}>How many days a week can you work out?</Text>
        <Text style={styles.subtitle}>Be realistic — consistency beats intensity.</Text>

        <View style={styles.options}>

            <FadeUpItem delay={150}>
                <TouchableOpacity
                style={[styles.option, selected === '2' && styles.optionSelected]}
                onPress={() => setSelected('2')}
                >
                <View style={[
                    styles.optionIconContainer,
                    selected === '2' && styles.optionIconContainerSelected
                ]}>
                    <Feather name="moon" size={20} color={selected === '2' ? colors.white : colors.grey} />
                </View>
                <View>
                    <Text style={[styles.optionTitle, selected === '2' && styles.optionTitleSelected]}>
                    2 days
                    </Text>
                    <Text style={styles.optionSub}>Light schedule</Text>
                </View>
                </TouchableOpacity>
            </FadeUpItem>


            <FadeUpItem delay={250}>
                <TouchableOpacity
                style={[styles.option, selected === '3' && styles.optionSelected]}
                onPress={() => setSelected('3')}
                >
                <View style={[
                    styles.optionIconContainer,
                    selected === '3' && styles.optionIconContainerSelected
                ]}>
                    <Feather name="sun" size={20} color={selected === '3' ? colors.white : colors.grey} />
                    
                </View>
                <View>
                    <Text style={[styles.optionTitle, selected === '3' && styles.optionTitleSelected]}>
                    3 days
                    </Text>
                    <Text style={styles.optionSub}>Good balance</Text>
                </View>
                </TouchableOpacity>
            </FadeUpItem>

            <FadeUpItem delay={350}>
                <TouchableOpacity
                style={[styles.option, selected === '4' && styles.optionSelected]}
                onPress={() => setSelected('4')}
                >
                <View style={[
                    styles.optionIconContainer,
                    selected === '4' && styles.optionIconContainerSelected
                ]}>
                    <Feather name="zap" size={20} color={selected === '4' ? colors.white : colors.grey} />
                </View>
                <View>
                    <Text style={[styles.optionTitle, selected === '4' && styles.optionTitleSelected]}>
                    4 days
                    </Text>
                    <Text style={styles.optionSub}>Serious commitment</Text>
                </View>
                </TouchableOpacity>
            </FadeUpItem>

            <FadeUpItem delay={450}>
            <TouchableOpacity
            style={[styles.option, selected === '5+' && styles.optionSelected]}
            onPress={() => setSelected('5+')}
            >
            <View style={[
                styles.optionIconContainer,
                selected === '5+' && styles.optionIconContainerSelected
            ]}>
                <MaterialCommunityIcons name="fire" size={20} color={selected === '5+' ? colors.white : colors.grey} />
            </View>
            <View>
                <Text style={[styles.optionTitle, selected === '5+' && styles.optionTitleSelected]}>
                5+ days
                </Text>
                <Text style={styles.optionSub}>Full dedication</Text>
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