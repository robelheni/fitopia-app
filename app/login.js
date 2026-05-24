import {View, Text, TouchableOpacity, StyleSheet, TextInput} from 'react-native';
import  { router }from 'expo-router';
import {colors} from '../constants/colors';
import { useState } from 'react';
import BackgroundCircles from '../components/BackgroundCircles';
import { FadeUpItem } from '../components/ScreenWrapper';


export default function LoginScreen () {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [ error, setError] = useState('');


    function handleLogin(){
        setError('');

        if(!email || !password){
            setError('please fill in all fields');
            return;
        }

        router.replace('/(tabs)');
    }

    return(
        <View style={styles.container}>
            <BackgroundCircles variant="topLeft" />

        {/* Header */}
        <View style={styles.header}>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Log in to continue your journey</Text>
            </View>

            
            {/* Input fields */}
            <View style={styles.inputs}>
            <FadeUpItem delay={100}>
            <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor={colors.greyLight}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />
            </FadeUpItem>
            
            <FadeUpItem delay={100}>
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={colors.greyLight}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            </FadeUpItem>

            {/* Error message - only shows if there is an error */}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            </View>

            <FadeUpItem delay={100}>
            {/* Login button */}
            <TouchableOpacity
                style={styles.button}
                onPress={handleLogin}
                >
                <Text style={styles.buttonText}>Log in</Text>
            </TouchableOpacity>

            {/* Link to signup */}
                <TouchableOpacity onPress={() => router.navigate('/signup')}>
                <Text style={styles.signupLink}>
                    Don't have an account?{' '}
                    <Text style={styles.signupLinkBlue}>Sign up</Text>
                </Text>
            </TouchableOpacity>
            </FadeUpItem>

    </View>
);
    
}

const styles = StyleSheet.create({
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
    color: colors.white,
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
    color: colors.blue,
    fontWeight: '500',
},
});
