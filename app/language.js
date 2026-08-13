import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { lightColors } from '../constants/colors';

export default function LanguageScreen() {
  const { context } = useLocalSearchParams();
  const isSettings = context === 'settings';
  const theme = useTheme();
  const { language, setLanguage } = useLanguage();
  const colors = theme ? theme.colors : lightColors;
  const styles = makeStyles(colors);

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        {isSettings ? (
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Feather name="arrow-left" size={20} color={colors.black} />
          </TouchableOpacity>
        ) : (
          <View style={styles.backButton} />
        )}
        <Text style={styles.headerTitle}>Language</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.optionsList}>

        <TouchableOpacity
          style={styles.optionRow}
          activeOpacity={0.7}
          onPress={async () => {
            await setLanguage('English');
            if (isSettings) router.back();
            else router.replace('/welcome');
          }}
        >
          <Text style={styles.optionLabel}>English</Text>
          {language === 'English' && (
            <Feather name="check" size={18} color={colors.blue} />
          )}
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.optionRow}
          activeOpacity={0.7}
          onPress={async () => {
            await setLanguage('Amharic');
            if (isSettings) router.back();
            else router.replace('/welcome');
          }}
        >
          <View style={styles.optionLabelRow}>
            <Text style={styles.optionLabel}>አማርኛ (Amharic)</Text>
          </View>
          {language === 'Amharic' && (
            <Feather name="check" size={18} color={colors.blue} />
          )}
        </TouchableOpacity>

      </View>
    </View>
  );
}

function makeStyles(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingTop: 52,
      paddingBottom: 16,
      borderBottomWidth: 0.5,
      borderBottomColor: colors.greyBorder,
    },

    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.greyCard,
      alignItems: 'center',
      justifyContent: 'center',
    },

    headerTitle: {
      flex: 1,
      textAlign: 'center',
      fontSize: 17,
      fontWeight: '600',
      color: colors.black,
      marginLeft: -40,
    },

    headerSpacer: {
      width: 40,
    },

    optionsList: {
      marginTop: 24,
      marginHorizontal: 24,
      backgroundColor: colors.white,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.greyBorder,
      overflow: 'hidden',
    },

    optionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 18,
    },

    optionLabel: {
      fontSize: 15,
      fontWeight: '500',
      color: colors.black,
    },

    optionLabelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },

    divider: {
      height: 0.5,
      backgroundColor: colors.greyBorder,
      marginHorizontal: 16,
    },
  });
}
