import {View, Text, TouchableOpacity} from 'react-native';
import {colors} from '../../constants/colors';
import {router} from 'expo-router';
import ProgressBar from '../../components/ProgressBar';
import { useOnboarding } from '../../context/OnboardingContext';
import {useState} from  'react';
import { onboardingStyles as styles } from '../../components/onboardingStyles';

export default function Step5(){
    const [selected, setSelected] = useState(null);
    const {updateAnswer} = useOnboarding();


    function handleContinue(){
        if(!selected) return;
        updateAnswer('equipment', selected);
        router.navigate('/onboarding/step6');
    
    }

    return (
        <View style={styles.container}>

        <ProgressBar currentStep={5} totalSteps={9} />

        <Text style={styles.question}>What equipment do you have?</Text>
        <Text style={styles.subtitle}>We'll build your plan around what you have access to.</Text>

        <View style={styles.options}>

            <TouchableOpacity
            style={[styles.option, selected === 'gym' && styles.optionSelected]}
            onPress={() => setSelected('gym')}
            >
            <Text style={styles.optionEmoji}>🏋️</Text>
            <View>
                <Text style={[styles.optionTitle, selected === 'gym' && styles.optionTitleSelected]}>Full gym access</Text>
                <Text style={styles.optionSub}>All equipment available</Text>
            </View>
            </TouchableOpacity>

            <TouchableOpacity
            style={[styles.option, selected === 'dumbbells' && styles.optionSelected]}
            onPress={() => setSelected('dumbbells')}
            >
            <Text style={styles.optionEmoji}>🏠</Text>
            <View>
                <Text style={[styles.optionTitle, selected === 'dumbbells' && styles.optionTitleSelected]}>Dumbbells at home</Text>
                <Text style={styles.optionSub}>Home setup with weights</Text>
            </View>
            </TouchableOpacity>

            <TouchableOpacity
            style={[styles.option, selected === 'bodyweight' && styles.optionSelected]}
            onPress={() => setSelected('bodyweight')}
            >
            <Text style={styles.optionEmoji}>🤸</Text>
            <View>
                <Text style={[styles.optionTitle, selected === 'bodyweight' && styles.optionTitleSelected]}>No equipment</Text>
                <Text style={styles.optionSub}>Bodyweight only</Text>
            </View>
            </TouchableOpacity>

            <TouchableOpacity
            style={[styles.option, selected === 'both' && styles.optionSelected]}
            onPress={() => setSelected('both')}
            >
            <Text style={styles.optionEmoji}>💪</Text>
            <View>
                <Text style={[styles.optionTitle, selected === 'both' && styles.optionTitleSelected]}>Both gym and home</Text>
                <Text style={styles.optionSub}>I switch between both</Text>
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



