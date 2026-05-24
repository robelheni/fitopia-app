import {View, Text, TouchableOpacity} from 'react-native';
import {colors} from '../../constants/colors';
import {router} from 'expo-router';
import ProgressBar from '../../components/ProgressBar';
import { useOnboarding } from '../../context/OnboardingContext';
import {useState} from  'react';
import { onboardingStyles as styles } from '../../components/onboardingStyles';
import BackgroundCircles from '../../components/BackgroundCircles';
import ScreenWrapper, { FadeUpItem } from '../../components/ScreenWrapper';


export default function Step6(){
    const[selected, setSelected] = useState([]);
    const {updateAnswer} = useOnboarding()

    // Toggles an option on or off
  function toggleOption(option) {
    setSelected(prev =>
      // If already selected — remove it
        prev.includes(option)
            ? prev.filter(item => item !== option)
        // If not selected — add it
            : [...prev, option]
        );
    }

    function handleContinue(){
        if(!selected.length ===0) return;
        updateAnswer('foodChoices', selected);
        router.navigate('/onboarding/step7');
    }

    return (
        <ScreenWrapper style={styles.container}>
            <BackgroundCircles variant="topLeft" />
    
            <ProgressBar currentStep={6} totalSteps={9} />
        
            <Text style={styles.question}>What are your food choices?</Text>
            <Text style={styles.subtitle}>Select all that apply to you.</Text>
        
            <View style={styles.options}>

                <FadeUpItem delay={150}>
                    <TouchableOpacity
                    style={[styles.option, selected.includes('meat') && styles.optionSelected]}
                    onPress={() => toggleOption('meat')}
                    >
                    <Text style={styles.optionEmoji}>🥩</Text>
                    <View>
                        <Text style={[styles.optionTitle, selected.includes('meat') && styles.optionTitleSelected]}>Meat eater</Text>
                        <Text style={styles.optionSub}>I eat meat regularly</Text>
                    </View>
                    </TouchableOpacity>
                </FadeUpItem>

                <FadeUpItem delay={250}>
                    <TouchableOpacity
                    style={[styles.option, selected.includes('vegetarian') && styles.optionSelected]}
                    onPress={() => toggleOption('vegetarian')}
                    >
                    <Text style={styles.optionEmoji}>🥗</Text>
                    <View>
                        <Text style={[styles.optionTitle, selected.includes('vegetarian') && styles.optionTitleSelected]}>Vegetarian</Text>
                        <Text style={styles.optionSub}>I don't eat meat</Text>
                    </View>
                    </TouchableOpacity>
                </FadeUpItem>

                <FadeUpItem delay={350}>
                    <TouchableOpacity
                    style={[styles.option, selected.includes('fasting') && styles.optionSelected]}
                    onPress={() => toggleOption('fasting')}
                    >
                    <Text style={styles.optionEmoji}>🌙</Text>
                    <View>
                        <Text style={[styles.optionTitle, selected.includes('fasting') && styles.optionTitleSelected]}>I fast regularly</Text>
                        <Text style={styles.optionSub}>Weekly or seasonal fasting</Text>
                    </View>
                    </TouchableOpacity>
                </FadeUpItem>

                <FadeUpItem delay={450}>
                    <TouchableOpacity
                    style={[styles.option, selected.includes('ethiopian') && styles.optionSelected]}
                    onPress={() => toggleOption('ethiopian')}
                    >
                    <Text style={styles.optionEmoji}>🍽</Text>
                    <View>
                        <Text style={[styles.optionTitle, selected.includes('ethiopian') && styles.optionTitleSelected]}>Ethiopian diet</Text>
                        <Text style={styles.optionSub}>Injera, shiro, tibs and more</Text>
                    </View>
                    </TouchableOpacity>
                </FadeUpItem>
        
            </View>

            <FadeUpItem delay={600}>
                <TouchableOpacity
                    style={[styles.button, selected.length === 0 && styles.buttonDisabled]}
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