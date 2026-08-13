import { StyleSheet } from 'react-native';

export function makeOnboardingStyles(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
      paddingHorizontal: 24,
      paddingTop: 60,
    },

    question: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.black,
      letterSpacing: -1,
      marginBottom: 8,
      lineHeight: 34,
    },

    subtitle: {
      fontSize: 14,
      color: colors.grey,
      marginBottom: 32,
      fontWeight: '300',
      lineHeight: 20,
    },

    options: {
      flex: 1,
      gap: 10,
    },

    option: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      padding: 18,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.greyBorder,
      backgroundColor: colors.white,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 8,
      elevation: 2,
    },

    optionSelected: {
      borderColor: colors.blue,
      backgroundColor: colors.blueLight,
      borderWidth: 1.5,
      shadowColor: colors.blue,
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 4,
    },

    optionIconContainer: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: colors.greyCard,
      alignItems: 'center',
      justifyContent: 'center',
    },

    optionIconContainerSelected: {
      backgroundColor: colors.blue,
    },

    optionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.black,
      marginBottom: 2,
      letterSpacing: -0.3,
    },

    optionTitleSelected: {
      color: colors.blueText,
    },

    optionSub: {
      fontSize: 13,
      color: colors.grey,
      fontWeight: '300',
    },

    optionEmoji: {
      fontSize: 22,
    },

    button: {
      backgroundColor: colors.blue,
      paddingVertical: 16,
      borderRadius: 100,
      alignItems: 'center',
      marginBottom: 12,
      shadowColor: colors.blue,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 12,
      elevation: 8,
    },

    buttonDisabled: {
      backgroundColor: colors.greyBorder,
      shadowOpacity: 0,
      elevation: 0,
    },

    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
      letterSpacing: -0.3,
    },

    backButton: {
      alignItems: 'center',
      paddingVertical: 12,
      marginBottom: 20,
    },

    backText: {
      fontSize: 15,
      color: colors.grey,
      fontWeight: '400',
    },

    otherInput: {
      borderWidth: 1.5,
      borderColor: colors.greyBorder,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 15,
      color: colors.black,
      backgroundColor: colors.white,
      marginTop: 8,
    },
  });
}
