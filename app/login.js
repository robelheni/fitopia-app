import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { lightColors } from '../constants/colors';
import BackgroundCircles from '../components/BackgroundCircles';
import { FadeUpItem } from '../components/ScreenWrapper';
import { loginUser, getCurrentUser } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { getTabTranslation } from '../constants/tabTranslations';

export default function LoginScreen() {
    const theme = useTheme();
    const colors = theme ? theme.colors : lightColors;
    const styles = makeStyles(colors);

    const { language } = useLanguage();
    const t = getTabTranslation(language);
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');

    async function handleLogin() {
        setError('');
        if (!emailOrUsername || !password) {
            setError(t.fillFields);
            return;
        }
        try {
            setLoading(true);
            setServerError('');
            await loginUser(emailOrUsername, password);
            const user = await getCurrentUser();
            if (user?.is_admin) {
                router.replace('/admin');
            } else {
                router.replace('/(tabs)');
            }
        } catch (error) {
            setServerError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <BackgroundCircles variant="topLeft" />

            <View style={styles.header}>
                <Text style={styles.title}>{t.loginTitle}</Text>
                <Text style={styles.subtitle}>{t.loginSubtitle}</Text>
            </View>

            <View style={styles.inputs}>
                <FadeUpItem delay={100}>
                    <TextInput
                        style={styles.input}
                        placeholder={t.emailUsername}
                        placeholderTextColor={colors.greyLight}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={emailOrUsername}
                        onChangeText={setEmailOrUsername}
                    />
                </FadeUpItem>

                <FadeUpItem delay={100}>
                    <TextInput
                        style={styles.input}
                        placeholder={t.password}
                        placeholderTextColor={colors.greyLight}
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                </FadeUpItem>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </View>

            <FadeUpItem delay={100}>
                {serverError ? <Text style={styles.errorText}>{serverError}</Text> : null}
                <TouchableOpacity
                    style={[styles.button, loading && { opacity: 0.7 }]}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? t.loggingIn : t.login}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.navigate('/onboarding-intro')}>
                    <Text style={styles.signupLink}>
                        {t.noAccount}{' '}
                        <Text style={styles.signupLinkBlue}>{t.signUp}</Text>
                    </Text>
                </TouchableOpacity>
            </FadeUpItem>
        </View>
    );
}

function makeStyles(colors) {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.white,
            paddingHorizontal: 24,
            paddingTop: 80,
        },

        header: {
            marginBottom: 32,
        },

        title: {
            fontSize: 28,
            fontWeight: '700',
            color: colors.black,
            letterSpacing: -1,
            marginBottom: 8,
        },

        subtitle: {
            fontSize: 15,
            color: colors.grey,
            fontWeight: '300',
            lineHeight: 22,
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
        },

        buttonText: {
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: '500',
        },

        errorText: {
            color: 'red',
            fontSize: 12,
            marginLeft: 4,
        },

        signupLink: {
            textAlign: 'center',
            fontSize: 14,
            color: colors.grey,
        },

        signupLinkBlue: {
            color: colors.blueText,
            fontWeight: '500',
        },
    });
}
