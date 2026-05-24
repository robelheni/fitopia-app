import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { colors } from '../../constants/colors';
import ProgressBar from '../../components/ProgressBar';
import { useOnboarding } from '../../context/OnboardingContext';
import { useState } from 'react';
import BackgroundCircles from '../../components/BackgroundCircles';
import ScreenWrapper, { FadeUpItem } from '../../components/ScreenWrapper';

export default function Step7() {
    const [age, setAge] = useState('');
    const [gender, setGender] = useState(null);
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const { updateAnswer } = useOnboarding();

    const isComplete = age && gender && height && weight;

    function handleContinue() {
        if (!isComplete) return;
        updateAnswer('personalInfo', { age, gender, height, weight });
        router.navigate('/onboarding/step8');
    }

    return (
        
        <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: colors.white }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
        {/* Scrollable content */}
        <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="on-drag"
        >
            
            <BackgroundCircles variant="bottomRight" />
            <ProgressBar currentStep={7} totalSteps={9} />

            <Text style={styles.question}>Tell us about yourself.</Text>
            <Text style={styles.subtitle}>This helps us personalise your plan accurately.</Text>
            
            <FadeUpItem delay={100}>
                {/* Gender */}
                <Text style={styles.label}>Gender</Text>
                <View style={styles.genderRow}>
                <TouchableOpacity
                    style={[styles.genderOption, gender === 'male' && styles.genderSelected]}
                    onPress={() => setGender('male')}
                >
                    <Text style={[styles.genderText, gender === 'male' && styles.genderTextSelected]}>Male</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.genderOption, gender === 'female' && styles.genderSelected]}
                    onPress={() => setGender('female')}
                >
                    <Text style={[styles.genderText, gender === 'female' && styles.genderTextSelected]}>Female</Text>
                </TouchableOpacity>
            
            
                </View>
            </FadeUpItem>


            <FadeUpItem delay={200}>
                {/* Age */}
                <Text style={styles.label}>Age</Text>
                <TextInput
                style={styles.input}
                placeholder="e.g. 25"
                placeholderTextColor={colors.greyLight}
                keyboardType="number-pad"
                value={age}
                onChangeText={setAge}
                maxLength={3}
                />
            </FadeUpItem>

            <FadeUpItem delay={300}>
                {/* Height */}
                <Text style={styles.label}>Height (cm)</Text>
                <TextInput
                style={styles.input}
                placeholder="e.g. 175"
                placeholderTextColor={colors.greyLight}
                keyboardType="number-pad"
                value={height}
                onChangeText={setHeight}
                maxLength={3}
                />
            </FadeUpItem>
        
            <FadeUpItem delay={400}>
                {/* Weight */}
                <Text style={styles.label}>Weight (kg)</Text>
                <TextInput
                style={styles.input}
                placeholder="e.g. 70"
                placeholderTextColor={colors.greyLight}
                keyboardType="number-pad"
                value={weight}
                onChangeText={setWeight}
                maxLength={3}
                />
            </FadeUpItem>
            
            <FadeUpItem delay={500}>
                {/* Buttons */}
                <TouchableOpacity
                style={[styles.button, !isComplete && styles.buttonDisabled]}
                onPress={handleContinue}
                >
                <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
            </FadeUpItem>

        </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 40,
        backgroundColor: colors.white,
    },
    question: {
        fontSize: 26,
        fontWeight: '700',
        color: colors.black,
        letterSpacing: -0.5,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: colors.grey,
        marginBottom: 24,
        fontWeight: '300',
    },
    label: {
        fontSize: 13,
        fontWeight: '500',
        color: colors.black,
        marginBottom: 6,
        marginTop: 16,
    },
    input: {
        borderWidth: 1.5,
        borderColor: colors.greyBorder,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 15,
        color: colors.black,
        backgroundColor: colors.white,
    },
    genderRow: {
        flexDirection: 'row',
        gap: 10,
    },
    genderOption: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: colors.greyBorder,
        alignItems: 'center',
    },
    genderSelected: {
        borderColor: colors.blue,
        backgroundColor: colors.blueLight,
    },
    genderText: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.black,
    },
    genderTextSelected: {
        color: colors.blue,
    },
    button: {
        backgroundColor: colors.blue,
        paddingVertical: 16,
        borderRadius: 100,
        alignItems: 'center',
        marginTop: 32,
        marginBottom: 12,
    },
    buttonDisabled: {
        backgroundColor: colors.greyBorder,
    },
    buttonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '500',
    },
    backButton: {
        alignItems: 'center',
        paddingVertical: 12,
        marginBottom: 20,
    },
    backText: {
        fontSize: 15,
        color: colors.grey,
    },
});