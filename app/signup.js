import { View, Text, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import { router } from 'expo-router';
import {colors} from '../constants/colors';
import {useState } from 'react';

export default function SignupScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [referral, setReferral] = useState('');
    
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        });

        function handleSignup() {
    // Build a new errors object checking all fields at once
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
    };

    // Update the errors state with all errors at once
    setErrors(newErrors);

    // Check if any errors exist - if so stop here
    const hasErrors = Object.values(newErrors).some(error => error !== '');
    if (hasErrors) return;

    // No errors - go to onboarding
    router.navigate('/onboarding');
    }
    return (
        <View style = {styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Create your account</Text>
                <Text style={styles.subtitle}>Join thousands of Ethiopians on their fitness journey</Text>
            </View>

            <View style = {styles.inputs}>
                <TextInput
                    style = {styles.input}
                    placeholder = "Full name"
                    placeholderTextColor={colors.greyLight}
                    autoCapitalize= "words"
                    value ={name}
                    onChangeText={setName}
                />

                {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

                <TextInput
                    style = {styles.input}
                    placeholder="Email address"
                    placeholderTextColor={colors.greyLight}
                    keyboardType="email-address"
                    autoCapitalize='none'
                    value = {email}
                    onChangeText={setEmail}
                
                />
                {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor={colors.greyLight}
                    secureTextEntry={true}
                    value = {password}
                    onChangeText={setPassword}
                />
                <View style={styles.requirements}>
                    <Text style={styles.requirementText}>Password must have:</Text>
                    <Text style={[
                        styles.requirementItem,
                        password.length >= 8 ? styles.requirementMet : styles.requirementNotMet
                    ]}>• At least 8 characters</Text>
                    <Text style={[
                        styles.requirementItem,
                        /\d/.test(password) ? styles.requirementMet : styles.requirementNotMet
                    ]}>• At least one number</Text>
                    <Text style={[
                        styles.requirementItem,
                        /[A-Z]/.test(password) ? styles.requirementMet : styles.requirementNotMet
                    ]}>• At least one capital letter</Text>
                </View>

                {/* Optional referral code for affiliate tracking */}
                <TextInput
                    style={styles.input}
                    placeholder="Referral code (optional)"
                    placeholderTextColor={colors.greyLight}
                    autoCapitalize="none"
                    value={referral}
                    onChangeText={setReferral}
                />


            </View>

            
            <TouchableOpacity 
                style = {styles.button}
                onPress = {handleSignup}
            >
                <Text style = {styles.buttonText}>Create account</Text>
                
            </TouchableOpacity>

            <TouchableOpacity onPress = {() => router.navigate('/login')}>
                <Text style = {styles.loginLink}>Already have an account?<Text style ={styles.loginLinkBlue}>Log in</Text>  </Text>
            </TouchableOpacity>
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
    
    loginLink: {
    textAlign: 'center',
    fontSize: 14,
    color: colors.grey,
    },
    
    loginLinkBlue: {
    color: colors.blue,
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
});