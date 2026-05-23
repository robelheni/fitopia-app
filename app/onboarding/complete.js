import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {router} from 'expo-router';
import {colors} from '../../constants/colors';


export default function(){
    return (
        <View style = {styles.container}>
            <View style={styles.iconContainer} >
                <Text style = {StyleSheet.icon}>🎉</Text>
            </View>

            <Text style={styles.title}>You're all set.</Text>
            <Text style={styles.subtitle}>
            Your personalised plan is ready. Let's get to work.
            </Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => router.replace('/welcome')}
            >
                <Text style={styles.buttonText}>See my plan</Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },

    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.blueLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
    },

    icon: {
        
    },

    title: {
        fontSize: 32,
        fontWeight: '700',
        color: colors.black,
        letterSpacing: -1,
        marginBottom: 16,
        textAlign: 'center',
    },

    subtitle: {
        fontSize: 16,
        color: colors.grey,
        fontWeight: '300',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 48,
    },

    button: {
        backgroundColor: colors.blue,
        paddingVertical: 16,
        paddingHorizontal: 48,
        borderRadius: 100,
        alignItems: 'center',
        width: '100%',
    },

    buttonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '500',
    },
});