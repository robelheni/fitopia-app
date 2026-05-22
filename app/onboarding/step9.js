import { View, Text, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { colors } from '../../constants/colors';
import ProgressBar from '../../components/ProgressBar';
import { useOnboarding } from '../../context/OnboardingContext';
import { useState } from 'react';
import { onboardingStyles as styles } from '../../components/onboardingStyles';


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
        router.replace('onboarding/complete');
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
    
                <ProgressBar currentStep={9} totalSteps={9} />
            
                <Text style={styles.question}>Any injuries or limitations?</Text>
                <Text style={styles.subtitle}>We'll make sure your plan works around them. Skip if none.</Text>
            
                <View style={styles.options}>
            
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

                        {/* Text input only shows when Other is selected */}
                        {selected.includes('other') && (
                        <TextInput
                            style={styles.otherInput}
                            placeholder="Describe your injury or limitation..."
                            placeholderTextColor={colors.greyLight}
                            value={other}
                            onChangeText={setOther}
                            multiline
                            numberOfLines={3}
                        />
                        )}

                    
            
                </View>
            
                {/* Continue is always enabled on this step — injuries are optional */}
                <TouchableOpacity
                    style={[styles.button, { marginTop: 24 }]}
                    onPress={handleContinue}
                >
                    <Text style={styles.buttonText}>Finish</Text>
                </TouchableOpacity>
            
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
        
            </ScrollView>
        </KeyboardAvoidingView>
    );
}