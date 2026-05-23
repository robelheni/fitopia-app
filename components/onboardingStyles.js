import { StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

// Shared styles used across all onboarding steps
// Import this in every step instead of rewriting the same styles
export const onboardingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 24,
    paddingTop: 60,
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
    marginBottom: 32,
    fontWeight: '300',
  },
  options: {
    flex: 1,
    gap: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.greyBorder,
    backgroundColor: colors.white,
  },
  optionSelected: {
    borderColor: colors.blue,
    backgroundColor: colors.blueLight,
  },
  optionEmoji: {
    fontSize: 28,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 2,
  },
  optionTitleSelected: {
    color: colors.blue,
  },
  optionSub: {
    fontSize: 13,
    color: colors.grey,
    fontWeight: '300',
  },
  button: {
    backgroundColor: colors.blue,
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: 'center',
    marginBottom: 12,
    // Elevated shadow — makes it feel like it floats
    shadowColor: colors.blue,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
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


otherInput: {
  borderWidth: 1.5,
  borderColor: colors.blue,
  borderRadius: 12,
  paddingHorizontal: 16,
  paddingVertical: 12,
  fontSize: 14,
  color: colors.black,
  marginTop: 4,
  minHeight: 80,
  textAlignVertical: 'top',
},
});