import { router } from 'expo-router';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { onboardingStyles as styles } from '../../components/onboardingStyles';
import ProgressBar from '../../components/ProgressBar';
import { colors } from '../../constants/colors';
import { useOnboarding } from '../../context/OnboardingContext';


export default function Step1() {
    const [selected, setSelected] = useState(null);
    // Get the updateAnswer function from our context
    const { updateAnswer } = useOnboarding();

    function handleContinue(){
        if (!selected) return;

        updateAnswer('fitnessLevel', selected);
        router.navigate('/onboarding/step2');

    }

    return (
        <View style={styles.container}>

      {/* Progress bar - step 1 of 9 */}
        <ProgressBar currentStep={1} totalSteps={9} />

        {/* Question */}
        <Text style={styles.question}>What is your fitness level?</Text>
        <Text style={styles.subtitle}>Be honest — this helps us get your plan right.</Text>

        {/* Options */}
        <View style={styles.options}>

            <TouchableOpacity
            style={[
                styles.option,
                selected === 'beginner' && styles.optionSelected
            ]}
            onPress={() => setSelected('beginner')}
            >
            <Text style={styles.optionEmoji}>🌱</Text>
            <View>
                <Text style={[
                styles.optionTitle,
                selected === 'beginner' && styles.optionTitleSelected
                ]}>Beginner</Text>
                <Text style={styles.optionSub}>Just starting out</Text>
            </View>
            </TouchableOpacity>

            <TouchableOpacity
            style={[
                styles.option,
                selected === 'intermediate' && styles.optionSelected
            ]}
            onPress={() => setSelected('intermediate')}
            >
            <Text style={styles.optionEmoji}>⚡</Text>
            <View>
                <Text style={[
                styles.optionTitle,
                selected === 'intermediate' && styles.optionTitleSelected
                ]}>Intermediate</Text>
                <Text style={styles.optionSub}>Training 2–3 times a week</Text>
            </View>
            </TouchableOpacity>

            <TouchableOpacity
            style={[
                styles.option,
                selected === 'advanced' && styles.optionSelected
            ]}
            onPress={() => setSelected('advanced')}
            >
            <Text style={styles.optionEmoji}>🔥</Text>
            <View>
                <Text style={[
                styles.optionTitle,
                selected === 'advanced' && styles.optionTitleSelected
                ]}>Advanced</Text>
                <Text style={styles.optionSub}>Training 4+ times a week</Text>
            </View>
            </TouchableOpacity>

        </View>

        {/* Continue button */}
        <TouchableOpacity
            style={[
            styles.button,
            !selected && styles.buttonDisabled
            ]}
            onPress={handleContinue}
        >
            <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>

        {/* Back button */}
        <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
        >
            <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

    </View>

    );
}

