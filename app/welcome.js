import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { colors } from '../constants/colors';

export default function WelcomeScreen(){
    return (
        <View style = {styles.container}>

            <View style = {styles.logoRow}>
                <Text style = {styles.logoFit}>Fit</Text>
                <Text style = {styles.logoOpia}>opia</Text>
            </View>

            <View style={styles.buttonContainer}>

                {/* Primary button - Get started - takes user to sign up */}
                <TouchableOpacity
                    style={styles.buttonPrimary}
                    onPress={() => router.navigate('/signup')}
                    >
                    <Text style={styles.buttonPrimaryText}>Get started</Text>
                </TouchableOpacity>

                {/* Secondary button - already have account - takes user to login */}
                <TouchableOpacity
                    style={styles.buttonSecondary}
                    onPress={() => router.navigate('/login')}
                    >
                    <Text style={styles.buttonSecondaryText}>
                        I already have an account
                    </Text>
                </TouchableOpacity>

            </View>   


        </View>
    );
}



// All styles live here - same idea as CSS but written in JavaScript
const styles = StyleSheet.create({

  // Main container centres everything on screen
  container: {
    flex: 1, // fills entire screen height
    backgroundColor: colors.white,
    alignItems: 'center', // centres horizontally
    justifyContent: 'center', // centres vertically
    paddingHorizontal: 32,
  },

  // Logo row puts Fit and opia side by side
  logoRow: {
    flexDirection: 'row', // makes children sit side by side
    marginBottom: 16,
  },

  logoFit: {
    fontSize: 52,
    fontWeight: '700',
    color: colors.black,
    letterSpacing: -1,
  },

  // opia is blue to match our brand colour
  logoOpia: {
    fontSize: 52,
    fontWeight: '700',
    color: colors.blue,
    letterSpacing: -1,
  },

  tagline: {
    fontSize: 16,
    color: colors.grey,
    fontWeight: '300',
    marginBottom: 64, // big gap between tagline and buttons
    textAlign: 'center',
    lineHeight: 24,
  },

  // buttonContainer holds both buttons and stacks them vertically
  buttonContainer: {
    width: '100%', // buttons stretch full width
    gap: 12, // space between the two buttons
  },

  // Primary button is solid blue
  buttonPrimary: {
    backgroundColor: colors.blue,
    paddingVertical: 16,
    borderRadius: 100, // fully rounded pill shape
    alignItems: 'center',
  },

  buttonPrimaryText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '500',
  },

  // Secondary button is white with a grey border
  buttonSecondary: {
    backgroundColor: colors.white,
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.greyBorder,
  },

  buttonSecondaryText: {
    color: colors.black,
    fontSize: 16,
    fontWeight: '400',
  },

});