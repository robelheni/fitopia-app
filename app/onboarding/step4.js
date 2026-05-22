import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { colors } from '../../constants/colors';
import ProgressBar from '../../components/ProgressBar';
import { useOnboarding } from '../../context/OnboardingContext';
import { useState } from 'react';
import { onboardingStyles as styles } from '../../components/onboardingStyles';



export default function Step4() {
    const[selected, setSelected] = useState(null);
    const {updateAnswer} = useOnboarding();


    function handleContinue(){
        if (!selected) return ;
        updateAnswer('duration', selected);
        router.navigate('/onboarding/step5');
    }

    return(
        <View style={styles.container}>

            <ProgressBar currentStep={4} totalSteps={9} />

            <Text style={styles.question}>How long can you work out?</Text>
            <Text style={styles.subtitle}>We'll fit your plan around your schedule.</Text>

            <View style={styles.options}>

                <TouchableOpacity
                style={[styles.option, selected === '20' && styles.optionSelected]}
                onPress={() => setSelected('20')}
                >
                <Text style={styles.optionEmoji}>⚡</Text>
                <View>
                    <Text style={[styles.optionTitle, selected === '20' && styles.optionTitleSelected]}>20 minutes</Text>
                    <Text style={styles.optionSub}>Quick and effective</Text>
                </View>
                </TouchableOpacity>

                <TouchableOpacity
                style={[styles.option, selected === '30' && styles.optionSelected]}
                onPress={() => setSelected('30')}
                >
                <Text style={styles.optionEmoji}>🕐</Text>
                <View>
                    <Text style={[styles.optionTitle, selected === '30' && styles.optionTitleSelected]}>30 minutes</Text>
                    <Text style={styles.optionSub}>Most popular choice</Text>
                </View>
                </TouchableOpacity>

                <TouchableOpacity
                style={[styles.option, selected === '45' && styles.optionSelected]}
                onPress={() => setSelected('45')}
                >
                <Text style={styles.optionEmoji}>💪</Text>
                <View>
                    <Text style={[styles.optionTitle, selected === '45' && styles.optionTitleSelected]}>45 minutes</Text>
                    <Text style={styles.optionSub}>Solid session</Text>
                </View>
                </TouchableOpacity>

                <TouchableOpacity
                style={[styles.option, selected === '60+' && styles.optionSelected]}
                onPress={() => setSelected('60+')}
                >
                <Text style={styles.optionEmoji}>🔥</Text>
                <View>
                    <Text style={[styles.optionTitle, selected === '60+' && styles.optionTitleSelected]}>60+ minutes</Text>
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