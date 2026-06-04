import { View, Text, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { colors } from '../../constants/colors';
import ProgressBar from '../../components/ProgressBar';
import { useOnboarding } from '../../context/OnboardingContext';
import { useState } from 'react';
import { onboardingStyles as styles } from '../../components/onboardingStyles';
import BackgroundCircles from '../../components/BackgroundCircles';
import ScreenWrapper, { FadeUpItem } from '../../components/ScreenWrapper';


export default function step9(){
    const [selected, setSelected] = useState([]);
    const {updateAnswer} = useOnboarding();
    const [other, setOther] = useState('');

    function toggleOption(option) {
        setSelected(prev =>
            prev.includes(option)
            ? prev.filter(item => item !== option)
            : [...prev, option]
        );
    }

    function handleContinue(){
        updateAnswer('injuries', {selected, other});
        router.replace('/signup');
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: colors.white }}
            behavior={Platform.OS === 'ios' ? 'position' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
            <ScrollView
            contentContainerStyle={{
                paddingHorizontal: 24,
                paddingTop: 60,
                paddingBottom: 200,
                backgroundColor: colors.white,
            }}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
            >
                <BackgroundCircles variant="topLeft" />
    
                <ProgressBar currentStep={9} totalSteps={9} />
            
                <Text style={styles.question}>Any injuries or limitations?</Text>
                <Text style={styles.subtitle}>We'll make sure your plan works around them. Skip if none.</Text>
            
                <View style={styles.options}>

                    <FadeUpItem delay={100}>
                        <TouchableOpacity
                        style={[styles.option, selected.includes('back') && styles.optionSelected]}
                        onPress={() => toggleOption('back')}
                        >
                        <Text style={styles.optionEmoji}>🔙</Text>
                        <View>
                            <Text style={[styles.optionTitle, selected.includes('back') && styles.optionTitleSelected]}>Back pain</Text>
                            <Text style={styles.optionSub}>Lower or upper back issues</Text>
                        </View>
                        </TouchableOpacity>
                    </FadeUpItem>
                
                    <FadeUpItem delay={200}>
                        <TouchableOpacity
                        style={[styles.option, selected.includes('knee') && styles.optionSelected]}
                        onPress={() => toggleOption('knee')}
                        >
                        <Text style={styles.optionEmoji}>🦵</Text>
                        <View>
                            <Text style={[styles.optionTitle, selected.includes('knee') && styles.optionTitleSelected]}>Knee problems</Text>
                            <Text style={styles.optionSub}>Pain or previous injury</Text>
                        </View>
                        </TouchableOpacity>
                    </FadeUpItem>

                    <FadeUpItem delay={300}>
                        <TouchableOpacity
                        style={[styles.option, selected.includes('shoulder') && styles.optionSelected]}
                        onPress={() => toggleOption('shoulder')}
                        >
                        <Text style={styles.optionEmoji}>💪</Text>
                        <View>
                            <Text style={[styles.optionTitle, selected.includes('shoulder') && styles.optionTitleSelected]}>Shoulder issues</Text>
                            <Text style={styles.optionSub}>Rotator cuff or joint pain</Text>
                        </View>
                        </TouchableOpacity>
                    </FadeUpItem>

                    
                    

                    <FadeUpItem delay={350}>
                        <TouchableOpacity
                        style={[styles.option, selected.includes('wrist') && styles.optionSelected]}
                        onPress={() => toggleOption('wrist')}
                        >
                        <Text style={styles.optionEmoji}>🤝</Text>
                        <View>
                            <Text style={[styles.optionTitle, selected.includes('wrist') && styles.optionTitleSelected]}>Wrist pain</Text>
                            <Text style={styles.optionSub}>Wrist or forearm discomfort</Text>
                        </View>
                        </TouchableOpacity>
                    </FadeUpItem>

                    <FadeUpItem delay={400}>
                        <TouchableOpacity
                        style={[styles.option, selected.includes('ankle') && styles.optionSelected]}
                        onPress={() => toggleOption('ankle')}
                        >
                        <Text style={styles.optionEmoji}>🦶</Text>
                        <View>
                            <Text style={[styles.optionTitle, selected.includes('ankle') && styles.optionTitleSelected]}>Ankle pain</Text>
                            <Text style={styles.optionSub}>Ankle or foot issues</Text>
                        </View>
                        </TouchableOpacity>
                    </FadeUpItem>

                    <FadeUpItem delay={400}>
                        <TouchableOpacity
                        style={[styles.option, selected.includes('none') && styles.optionSelected]}
                        onPress={() => toggleOption('none')}
                        >
                        <Text style={styles.optionEmoji}>✅</Text>
                        <View>
                            <Text style={[styles.optionTitle, selected.includes('none') && styles.optionTitleSelected]}>No injuries</Text>
                            <Text style={styles.optionSub}>I'm good to go</Text>
                        </View>
                        </TouchableOpacity>
                    </FadeUpItem>
                    <FadeUpItem delay={500}>
                    <TouchableOpacity
                    style={[styles.option, selected.includes('other') && styles.optionSelected]}
                    onPress={() => toggleOption('other')}
                    >
                    <Text style={styles.optionEmoji}>✏️</Text>
                    <View>
                        <Text style={[styles.optionTitle, selected.includes('other') && styles.optionTitleSelected]}>Other</Text>
                        <Text style={styles.optionSub}>Tap to describe your limitation</Text>
                    </View>
                    </TouchableOpacity>
                </FadeUpItem>

                {/* Text input only shows when Other is selected */}
                {selected.includes('other') && (
                    <TextInput
                        style={styles.otherInput}
                        placeholder="Describe your injury or limitation..."
                        placeholderTextColor={colors.greyLight}r
                        value={other}
                        onChangeText={setOther}
                        multiline
                        numberOfLines={3}
                    />
                )}


                    
            
                </View>
            
                {/* Continue is always enabled on this step — injuries are optional */}
                <FadeUpItem delay={300}>
                    <TouchableOpacity
                        style={[styles.button, { marginTop: 24 }]}
                        onPress={handleContinue}
                    >
                        <Text style={styles.buttonText}>Finish</Text>
                    </TouchableOpacity>
                
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Text style={styles.backText}>Back</Text>
                    </TouchableOpacity>
                </FadeUpItem>
        
            </ScrollView>
        </KeyboardAvoidingView>
    );
}