import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import BackgroundCircles from '../components/BackgroundCircles';
import ScreenWrapper,{FadeUpItem} from '../components/ScreenWrapper';

import {colors} from '../constants/colors'

export default function OnboardingScreen(){
    return (
        <ScreenWrapper style={styles.container}>

        <BackgroundCircles variant="centered" />
    
        {/* Top section - icon and messaging */}
        <View style={styles.top}>
        <FadeUpItem delay={0}>
            <Feather name="user-check" size={98} color={colors.blue} />
        </FadeUpItem>

        <FadeUpItem delay={150}>
            <Text style={styles.title}>Let's get to know you.</Text>
        </FadeUpItem>

        <FadeUpItem delay={350}>
            <Text style={styles.subtitle}>
            A few quick questions so we can build a plan that actually works for you.
            </Text>
        </FadeUpItem>
        </View>


        {/* Let's go button */}
        <FadeUpItem delay={450}>
        <TouchableOpacity
        style={styles.button}
        onPress={() => router.navigate('/onboarding/step1')}
        >
        <Text style={styles.buttonText}>Let's go</Text>
        </TouchableOpacity>
        </FadeUpItem>

    </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
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
    
    emoji: {
        fontSize: 48,
        marginBottom: 24,
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
        color: colors.white,
        fontSize: 16,
        fontWeight: '500',
    },
});


