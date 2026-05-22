
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { colors } from '../../constants/colors';
import ProgressBar from '../../components/ProgressBar';
import { useOnboarding } from '../../context/OnboardingContext';
import { useState } from 'react';
import { onboardingStyles as styles } from '../../components/onboardingStyles';

export default function Step3() {
    const [selected, setSelected] = useState('');
    const {updateAnswer} = useOnboarding();

    function handleContinue() {
        if(!selected) return;
        updateAnswer('daysPerWeek', selected);
        router.navigate('/onboarding/step4');

    }

    return (
        <View style={styles.container}>

            <ProgressBar currentStep={3} totalSteps={9} />

            <Text style={styles.question}>How many days a week can you work out?</Text>
            <Text style={styles.subtitle}>Be realistic — consistency beats intensity.</Text>

            <View style={styles.options}>

                <TouchableOpacity
                style={[styles.option, selected === '2' && styles.optionSelected]}
                onPress={() => setSelected('2')}
                >
                <Text style={styles.optionEmoji}>🌱</Text>
                <View>
                    <Text style={[styles.optionTitle, selected === '2' && styles.optionTitleSelected]}>2 days</Text>
                    <Text style={styles.optionSub}>Light schedule</Text>
                </View>
                </TouchableOpacity>

                <TouchableOpacity
                style={[styles.option, selected === '3' && styles.optionSelected]}
                onPress={() => setSelected('3')}
                >
                <Text style={styles.optionEmoji}>⚡</Text>
                <View>
                    <Text style={[styles.optionTitle, selected === '3' && styles.optionTitleSelected]}>3 days</Text>
                    <Text style={styles.optionSub}>Good balance</Text>
                </View>
                </TouchableOpacity>

                <TouchableOpacity
                style={[styles.option, selected === '4' && styles.optionSelected]}
                onPress={() => setSelected('4')}
                >
                <Text style={styles.optionEmoji}>💪</Text>
                <View>
                    <Text style={[styles.optionTitle, selected === '4' && styles.optionTitleSelected]}>4 days</Text>
                    <Text style={styles.optionSub}>Serious commitment</Text>
                </View>
                </TouchableOpacity>

                <TouchableOpacity
                style={[styles.option, selected === '5+' && styles.optionSelected]}
                onPress={() => setSelected('5+')}
                >
                <Text style={styles.optionEmoji}>🔥</Text>
                <View>
                    <Text style={[styles.optionTitle, selected === '5+' && styles.optionTitleSelected]}>5+ days</Text>
                    <Text style={styles.optionSub}>Full dedication</Text>
                </View>
                </TouchableOpacity>

            </View>

            <TouchableOpacity
                style={[styles.button, !selected && styles.buttonDisabled]}
                onPress={handleContinue}
            >
                <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

        </View>

    );
}