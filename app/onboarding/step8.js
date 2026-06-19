import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { colors } from '../../constants/colors';
import ProgressBar from '../../components/ProgressBar';
import { useOnboarding } from '../../context/OnboardingContext';
import { useState } from 'react';
import { onboardingStyles as styles } from '../../components/onboardingStyles';
import BackgroundCircles from '../../components/BackgroundCircles';
import ScreenWrapper, { FadeUpItem } from '../../components/ScreenWrapper';


export default function Step8(){
    const [selected, setSelected] = useState(null);
    const {updateAnswer} = useOnboarding();

    function handleContinue(){
        if(!selected) return;
        updateAnswer('location', selected);
        router.navigate('/signup'); 

    }

    return (
        <ScreenWrapper style={styles.container}>
            <BackgroundCircles variant="centered" />

            <ProgressBar currentStep={8} totalSteps={8} />

            <FadeUpItem delay={100}>
                <Text style={styles.question}>Where are you based?</Text>
                <Text style={styles.subtitle}>Helps us connect you with your local community.</Text>
            </FadeUpItem>

            <View style={styles.options}>

                <FadeUpItem delay={200}>
                    <TouchableOpacity
                    style={[styles.option, selected === 'uk' && styles.optionSelected]}
                    onPress={() => setSelected('uk')}
                    >
                    <Text style={styles.optionEmoji}>🇬🇧</Text>
                    <View>
                        <Text style={[styles.optionTitle, selected === 'uk' && styles.optionTitleSelected]}>United Kingdom</Text>
                        <Text style={styles.optionSub}>England, Scotland, Wales, N. Ireland</Text>
                    </View>
                    </TouchableOpacity>
                </FadeUpItem>

                <FadeUpItem delay={300}>
                    <TouchableOpacity
                    style={[styles.option, selected === 'us' && styles.optionSelected]}
                    onPress={() => setSelected('us')}
                    >
                    <Text style={styles.optionEmoji}>🇺🇸</Text>
                    <View>
                        <Text style={[styles.optionTitle, selected === 'us' && styles.optionTitleSelected]}>United States</Text>
                        <Text style={styles.optionSub}>All US states</Text>
                    </View>
                    </TouchableOpacity>
                </FadeUpItem>

                <FadeUpItem delay={400}>
                    <TouchableOpacity
                    style={[styles.option, selected === 'europe' && styles.optionSelected]}
                    onPress={() => setSelected('europe')}
                    >
                    <Text style={styles.optionEmoji}>🇪🇺</Text>
                    <View>
                        <Text style={[styles.optionTitle, selected === 'europe' && styles.optionTitleSelected]}>Europe</Text>
                        <Text style={styles.optionSub}>Sweden, Germany, Norway and more</Text>
                    </View>
                    </TouchableOpacity>
                </FadeUpItem>

                <FadeUpItem delay={500}>
                    <TouchableOpacity
                    style={[styles.option, selected === 'canada' && styles.optionSelected]}
                    onPress={() => setSelected('canada')}
                    >
                    <Text style={styles.optionEmoji}>🇨🇦</Text>
                    <View>
                        <Text style={[styles.optionTitle, selected === 'canada' && styles.optionTitleSelected]}>Canada</Text>
                        <Text style={styles.optionSub}>All Canadian provinces</Text>
                    </View>
                    </TouchableOpacity>
                </FadeUpItem>
            
                <FadeUpItem delay={600}>
                    <TouchableOpacity
                    style={[styles.option, selected === 'ethiopia' && styles.optionSelected]}
                    onPress={() => setSelected('ethiopia')}
                    >
                    <Text style={styles.optionEmoji}>🇪🇹</Text>
                    <View>
                        <Text style={[styles.optionTitle, selected === 'ethiopia' && styles.optionTitleSelected]}>Ethiopia</Text>
                        <Text style={styles.optionSub}>Based in Ethiopia</Text>
                    </View>
                    </TouchableOpacity>
                </FadeUpItem>

                <FadeUpItem delay={700}>
                    <TouchableOpacity
                    style={[styles.option, selected === 'other' && styles.optionSelected]}
                    onPress={() => setSelected('other')}
                    >
                    <Text style={styles.optionEmoji}>🌍</Text>
                    <View>
                        <Text style={[styles.optionTitle, selected === 'other' && styles.optionTitleSelected]}>Somewhere else</Text>
                        <Text style={styles.optionSub}>Other country</Text>
                    </View>
                    </TouchableOpacity>
                </FadeUpItem>

            </View>

            <FadeUpItem delay={850}>
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