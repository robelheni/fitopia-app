import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { colors } from '../constants/colors';

export default function LanguageScreen() {
  return (
    <View style={styles.container}>

      {/* Header — same pattern as search.js */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Language</Text>
        {/* Spacer balances the back button so the title stays centred */}
        <View style={styles.headerSpacer} />
      </View>

      {/* Language options */}
      <View style={styles.optionsList}>

        {/* English — currently active */}
        <TouchableOpacity style={styles.optionRow} activeOpacity={0.7}>
          <Text style={styles.optionLabel}>English</Text>
          <Feather name="check" size={18} color={colors.blue} />
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* Amharic — not yet available */}
        <View style={[styles.optionRow, styles.optionRowDisabled]}>
          <View style={styles.optionLabelRow}>
            <Text style={styles.optionLabelDisabled}>አማርኛ (Amharic)</Text>
            <View style={styles.comingSoonBadge}>
              <Text style={styles.comingSoonText}>Coming soon</Text>
            </View>
          </View>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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

  optionRowDisabled: {
    opacity: 0.5,
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

  optionLabelDisabled: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.black,
  },

  comingSoonBadge: {
    backgroundColor: colors.greyCard,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 100,
  },

  comingSoonText: {
    fontSize: 11,
    color: colors.greyLight,
    fontWeight: '500',
  },

  divider: {
    height: 0.5,
    backgroundColor: colors.greyBorder,
    marginHorizontal: 16,
  },
});