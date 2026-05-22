import {View, Text, TouchableOpacity} from 'react-native';
import { onboardingStyles as styles } from '../../components/onboardingStyles';
import { router } from 'expo-router';
import { colors } from '../../constants/colors';
import ProgressBar from '../../components/ProgressBar';
import { useOnboarding } from '../../context/OnboardingContext';
import { useState } from 'react';


export default function Step2() {
    const[selected, setSelected] = useState(null);
    const {updateAnswer} = useOnboarding();

    function handleContinue(){
        if(!selected) return;
        updateAnswer('goal', selected);
        router.navigate('/onboarding/step3');
    }

    return (
        <View style={styles.container}>
            <ProgressBar currentStep={2} totalSteps={9} />

            <Text style={styles.question}>What is your main goal?</Text>
            <Text style={styles.subtitle}>We'll build your plan around this.</Text>

            <View style={styles.options}>

                <TouchableOpacity
                    style={[styles.option, selected === 'lose_weight' && styles.optionSelected]}
                    onPress={() => setSelected('lose_weight')}
                >
                <Text style={styles.optionEmoji}>⚖️</Text>
                <View>
                    <Text style={[styles.optionTitle, selected === 'lose_weight' && styles.optionTitleSelected]}>Lose weight</Text>
                    <Text style={styles.optionSub}>Burn fat and get leaner</Text>
                </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.option, selected === 'build_muscle' && styles.optionSelected]}
                    onPress={() => setSelected('build_muscle')}
                >
                <Text style={styles.optionEmoji}>💪</Text>
                <View>
                    <Text style={[styles.optionTitle, selected === 'build_muscle' && styles.optionTitleSelected]}>Build muscle</Text>
                    <Text style={styles.optionSub}>Get stronger and bigger</Text>
                </View>
                </TouchableOpacity>

                <TouchableOpacity
                style={[styles.option, selected === 'stay_active' && styles.optionSelected]}
                onPress={() => setSelected('stay_active')}
                >
                <Text style={styles.optionEmoji}>🏃</Text>
                <View>
                    <Text style={[styles.optionTitle, selected === 'stay_active' && styles.optionTitleSelected]}>Stay active</Text>
                    <Text style={styles.optionSub}>Keep moving and feel good</Text>
                </View>
                </TouchableOpacity>

                <TouchableOpacity
                style={[styles.option, selected === 'improve_fitness' && styles.optionSelected]}
                onPress={() => setSelected('improve_fitness')}
                >
                <Text style={styles.optionEmoji}>📈</Text>
                <View>
                    <Text style={[styles.optionTitle, selected === 'improve_fitness' && styles.optionTitleSelected]}>Improve fitness</Text>
                    <Text style={styles.optionSub}>Build endurance and stamina</Text>
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
