import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { router } from 'expo-router';
import { useState, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { lightColors } from '../constants/colors';
import BackgroundCircles from '../components/BackgroundCircles';
import { FadeUpItem } from '../components/ScreenWrapper';
import { Feather } from '@expo/vector-icons';
import { signupUser, saveOnboarding } from '../services/api';
import { useOnboarding } from '../context/OnboardingContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '../context/LanguageContext';
import { getTabTranslation } from '../constants/tabTranslations';

export default function SignupScreen() {
    const theme = useTheme();
    const colors = theme ? theme.colors : lightColors;
    const styles = makeStyles(colors);

    const { language } = useLanguage();
    const t = getTabTranslation(language);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [referral, setReferral] = useState('');
    const [username, setUsername] = useState('');
    const usernameRef = useRef('');

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        username: '',
    });

    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');
    const { answers } = useOnboarding();

    async function handleSignup() {
        const currentUsername = usernameRef.current || username;

        const newErrors = {
            name: !name ? 'Name is required' : '',
            email: !email
                ? 'Email is required'
                : !email.includes('@') || !email.includes('.')
                ? 'Please enter a valid email'
                : '',
            password: !password
                ? 'Password is required'
                : password.length < 8 || !/\d/.test(password) || !/[A-Z]/.test(password)
                ? 'Password must be at least 8 characters, contain one number and one capital letter'
                : '',
            username: !currentUsername
                ? 'Username is required'
                : currentUsername.length < 3
                ? 'Username must be at least 3 characters'
                : !/^[a-zA-Z0-9_]+$/.test(currentUsername)
                ? 'Username can only contain letters, numbers and underscores'
                : '',
        };
        setErrors(newErrors);
        const hasErrors = Object.values(newErrors).some(error => error !== '');
        if (hasErrors) return;

        try {
            setLoading(true);
            setServerError('');

            await signupUser(name, email, password, username, referral);

            await new Promise(resolve => setTimeout(resolve, 100));

            const savedAnswers = await AsyncStorage.getItem('onboarding_answers');
            const answers = savedAnswers ? JSON.parse(savedAnswers) : {};

            await saveOnboarding({
                fitness_level: answers.fitnessLevel,
                goal: answers.goal,
                days_per_week: answers.daysPerWeek,
                training_days: answers.trainingDays ? answers.trainingDays.join(',') : null,
                workout_duration: answers.duration,
                equipment: answers.equipment,
                food_preferences: answers.foodChoices ? answers.foodChoices.join(',') : null,
                location: answers.location,
                injuries: answers.injuries?.selected ? answers.injuries.selected.join(',') : null,
                gender: answers.personalInfo?.gender,
                age: answers.personalInfo?.age ? parseInt(answers.personalInfo.age) : null,
                height: answers.personalInfo?.height ? parseFloat(answers.personalInfo.height) : null,
                weight: answers.personalInfo?.weight ? parseFloat(answers.personalInfo.weight) : null,
                goal_weight: answers.personalInfo?.goalWeight ? parseFloat(answers.personalInfo.goalWeight) : null,
            });

            await AsyncStorage.removeItem('onboarding_answers');
            router.navigate('/onboarding/complete');
        } catch (error) {
            setServerError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                style={{ flex: 1, backgroundColor: colors.white }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag"
                    showsVerticalScrollIndicator={false}
                >
                    <BackgroundCircles variant="default" />

                    <FadeUpItem delay={0}>
                        <View style={styles.logoHeader}>
                            <TouchableOpacity onPress={() => router.replace('/onboarding-intro')}>
                                <View style={styles.logoContainer}>
                                    <Text style={styles.logoFit}>Fit</Text>
                                    <Text style={styles.logoOpia}>opia</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </FadeUpItem>

                    <FadeUpItem delay={100}>
                        <Text style={styles.title}>{t.almostThere}</Text>
                        <Text style={styles.subtitle}>{t.createAccountSubtitle}</Text>
                    </FadeUpItem>

                    <View style={styles.inputs}>
                        <FadeUpItem delay={100}>
                            <TextInput
                                style={styles.input}
                                placeholder={t.fullName}
                                placeholderTextColor={colors.greyLight}
                                autoCapitalize="words"
                                value={name}
                                onChangeText={setName}
                            />
                        </FadeUpItem>
                        {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

                        <FadeUpItem delay={150}>
                            <View style={styles.usernameInput}>
                                <Text style={styles.usernameAt}>@</Text>
                                <TextInput
                                    style={styles.usernameField}
                                    placeholder={t.username}
                                    placeholderTextColor={colors.greyLight}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    value={username}
                                    onChangeText={(text) => setUsername(text.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                                />
                            </View>
                        </FadeUpItem>
                        {errors.username ? <Text style={styles.errorText}>{errors.username}</Text> : null}

                        <FadeUpItem delay={200}>
                            <TextInput
                                style={styles.input}
                                placeholder={t.emailAddress}
                                placeholderTextColor={colors.greyLight}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                            />
                        </FadeUpItem>
                        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

                        <FadeUpItem delay={300}>
                            <TextInput
                                style={styles.input}
                                placeholder={t.password}
                                placeholderTextColor={colors.greyLight}
                                secureTextEntry={true}
                                value={password}
                                onChangeText={setPassword}
                            />
                        </FadeUpItem>

                        <FadeUpItem delay={400}>
                            <View style={styles.requirements}>
                                <Text style={styles.requirementText}>{t.passwordMustHave}</Text>
                                <Text style={[
                                    styles.requirementItem,
                                    password.length >= 8 ? styles.requirementMet : styles.requirementNotMet
                                ]}>{t.atLeastEight}</Text>
                                <Text style={[
                                    styles.requirementItem,
                                    /\d/.test(password) ? styles.requirementMet : styles.requirementNotMet
                                ]}>{t.oneNumber}</Text>
                                <Text style={[
                                    styles.requirementItem,
                                    /[A-Z]/.test(password) ? styles.requirementMet : styles.requirementNotMet
                                ]}>{t.oneCapital}</Text>
                            </View>
                        </FadeUpItem>

                        <FadeUpItem delay={500}>
                            <TextInput
                                style={styles.input}
                                placeholder={t.referralOptional}
                                placeholderTextColor={colors.greyLight}
                                autoCapitalize="none"
                                value={referral}
                                onChangeText={setReferral}
                            />
                        </FadeUpItem>
                    </View>

                    <FadeUpItem delay={600}>
                        {serverError ? <Text style={styles.errorText}>{serverError}</Text> : null}

                        <TouchableOpacity
                            style={[styles.button, loading && { opacity: 0.7 }]}
                            onPress={handleSignup}
                            disabled={loading}
                        >
                            <Text style={styles.buttonText}>
                                {loading ? t.creatingAccount : t.createAccount}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => router.push('/login')}>
                            <Text style={styles.loginLink}>
                                {t.haveAccount}
                                <Text style={styles.loginLinkBlue}> {t.login}</Text>
                            </Text>
                        </TouchableOpacity>
                    </FadeUpItem>
                </ScrollView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}

function makeStyles(colors) {
    return StyleSheet.create({
        scrollContent: {
            paddingHorizontal: 24,
            paddingTop: 60,
            paddingBottom: 40,
            backgroundColor: colors.white,
        },

        title: {
            fontSize: 24,
            fontWeight: '600',
            color: colors.black,
            letterSpacing: -1,
            marginBottom: 8,
        },

        subtitle: {
            fontSize: 15,
            color: colors.grey,
            fontWeight: '300',
            lineHeight: 22,
            marginBottom: 32,
        },

        logoContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },

        logoFit: {
            fontSize: 24,
            fontWeight: '700',
            color: colors.black,
            letterSpacing: -1,
        },

        logoOpia: {
            fontSize: 24,
            fontWeight: '700',
            color: colors.blueText,
            letterSpacing: -1,
        },

        inputs: {
            gap: 12,
            marginBottom: 24,
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

        button: {
            backgroundColor: colors.blue,
            paddingVertical: 16,
            borderRadius: 100,
            alignItems: 'center',
            marginBottom: 16,
            shadowColor: colors.blue,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.35,
            shadowRadius: 12,
            elevation: 8,
        },

        buttonText: {
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: '500',
        },

        loginLink: {
            textAlign: 'center',
            fontSize: 14,
            color: colors.grey,
        },

        loginLinkBlue: {
            color: colors.blueText,
            fontWeight: '500',
        },

        errorText: {
            color: 'red',
            fontSize: 12,
            marginTop: -6,
            marginLeft: 4,
        },

        requirements: {
            marginTop: 4,
            padding: 12,
            backgroundColor: colors.greyCard,
            borderRadius: 8,
        },

        requirementText: {
            fontSize: 12,
            color: colors.grey,
            fontWeight: '500',
            marginBottom: 4,
        },

        requirementItem: {
            fontSize: 12,
            color: colors.grey,
            lineHeight: 20,
        },

        requirementMet: {
            color: 'green',
        },

        requirementNotMet: {
            color: 'red',
        },

        logoHeader: {
            alignItems: 'flex-end',
            marginBottom: 16,
        },

        usernameInput: {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1.5,
            borderColor: colors.greyBorder,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 14,
            backgroundColor: colors.white,
        },

        usernameAt: {
            fontSize: 15,
            color: colors.blueText,
            fontWeight: '600',
            marginRight: 4,
        },

        usernameField: {
            flex: 1,
            fontSize: 15,
            color: colors.black,
        },
    });
}
