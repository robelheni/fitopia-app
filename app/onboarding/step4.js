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

export default function Step4() {
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

            <ProgressBar currentStep={4} totalSteps={9} />

            <Text style={styles.question}>How long can you work out?</Text>
            <Text style={styles.subtitle}>We'll fit your plan around your schedule.</Text>

            <View style={styles.options}>

                <FadeUpItem delay={150}>
                    <TouchableOpacity
                    style={[styles.option, selected === '20' && styles.optionSelected]}
                    onPress={() => setSelected('20')}
                    >
                    <View style={[
                        styles.optionIconContainer,
                        selected === '20' && styles.optionIconContainerSelected
                    ]}>
                        <MaterialCommunityIcons name="lightning-bolt" size={20} color={selected === '5+' ? colors.white : colors.grey} />
                    </View>
                    <View>
                        <Text style={[styles.optionTitle, selected === '20' && styles.optionTitleSelected]}>
                        20 minutes
                        </Text>
                        <Text style={styles.optionSub}>Quick and effective</Text>
                    </View>
                    </TouchableOpacity>
                </FadeUpItem>

                <FadeUpItem delay={250}>
                    <TouchableOpacity
                    style={[styles.option, selected === '30' && styles.optionSelected]}
                    onPress={() => setSelected('30')}
                    >
                    <View style={[
                        styles.optionIconContainer,
                        selected === '30' && styles.optionIconContainerSelected
                    ]}>
                        <MaterialCommunityIcons name="timer-outline" size={20} color={selected === '5+' ? colors.white : colors.grey} />
                    </View>
                    <View>
                        <Text style={[styles.optionTitle, selected === '30' && styles.optionTitleSelected]}>
                        30 minutes
                        </Text>
                        <Text style={styles.optionSub}>Most popular choice</Text>
                    </View>
                    </TouchableOpacity>
                </FadeUpItem>

                <FadeUpItem delay={350}>    
                    <TouchableOpacity
                    style={[styles.option, selected === '45' && styles.optionSelected]}
                    onPress={() => setSelected('45')}
                    >
                    <View style={[
                        styles.optionIconContainer,
                        selected === '45' && styles.optionIconContainerSelected
                    ]}>
                        <MaterialCommunityIcons name="clock-check-outline" size={20} color={selected === '5+' ? colors.white : colors.grey} />
                    </View>
                    <View>
                        <Text style={[styles.optionTitle, selected === '45' && styles.optionTitleSelected]}>
                        45 minutes
                        </Text>
                        <Text style={styles.optionSub}>Solid session</Text>
                    </View>
                    </TouchableOpacity>
                </FadeUpItem>
                
                <FadeUpItem delay={450}>
                    <TouchableOpacity
                    style={[styles.option, selected === '60+' && styles.optionSelected]}
                    onPress={() => setSelected('60+')}
                    >
                    <View style={[
                        styles.optionIconContainer,
                        selected === '60+' && styles.optionIconContainerSelected
                    ]}>
                        <MaterialCommunityIcons name="clock-time-eight-outline" size={20} color={selected === '5+' ? colors.white : colors.grey} />
                    </View>
                    <View>
                        <Text style={[styles.optionTitle, selected === '60+' && styles.optionTitleSelected]}>
                        60+ minutes
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