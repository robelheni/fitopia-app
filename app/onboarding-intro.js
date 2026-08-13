import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { lightColors } from '../constants/colors';
import BackgroundCircles from '../components/BackgroundCircles';
import ScreenWrapper, { FadeUpItem } from '../components/ScreenWrapper';
import { useLanguage } from '../context/LanguageContext';
import { getTabTranslation } from '../constants/tabTranslations';

export default function OnboardingScreen() {
    const theme = useTheme();
    const colors = theme ? theme.colors : lightColors;
    const styles = makeStyles(colors);

    const { language } = useLanguage();
    const t = getTabTranslation(language);

    return (
        <ScreenWrapper style={styles.container}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.navigate('/welcome')}
            >
                <Feather name="arrow-left" size={20} color={colors.black} />
            </TouchableOpacity>

            <BackgroundCircles variant="centered" />

            <View style={styles.top}>
                <FadeUpItem delay={0}>
                    <Feather name="user-check" size={98} color={colors.blue} />
                </FadeUpItem>

                <FadeUpItem delay={150}>
                    <Text style={styles.title}>{t.getToKnowYou}</Text>
                </FadeUpItem>

                <FadeUpItem delay={350}>
                    <Text style={styles.subtitle}>{t.onboardingIntro}</Text>
                </FadeUpItem>
            </View>

            <FadeUpItem delay={450}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.navigate('/onboarding/step1')}
                >
                    <Text style={styles.buttonText}>{t.letsGo}</Text>
                </TouchableOpacity>
            </FadeUpItem>
        </ScreenWrapper>
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

        top: {
            flex: 1,
            justifyContent: 'center',
        },

        title: {
            fontSize: 32,
            fontWeight: '700',
            color: colors.black,
            letterSpacing: -1,
            marginBottom: 16,
            lineHeight: 38,
        },

        subtitle: {
            fontSize: 16,
            color: colors.grey,
            fontWeight: '300',
            lineHeight: 26,
            marginBottom: 48,
        },

        button: {
            backgroundColor: colors.blue,
            paddingVertical: 16,
            borderRadius: 100,
            alignItems: 'center',
            marginBottom: 32,
        },

        buttonText: {
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: '500',
        },

        backButton: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.greyCard,
            alignItems: 'center',
            justifyContent: 'center',
        },
    });
}
