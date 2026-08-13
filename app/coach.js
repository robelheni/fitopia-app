import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { lightColors } from '../constants/colors';
import { FadeUpItem } from '../components/ScreenWrapper';

const FEATURES = [
  {
    icon: 'activity',
    title: 'Weekly workout analysis',
    subtitle: "Understand what's working and what needs adjusting",
  },
  {
    icon: 'trending-up',
    title: 'Progressive overload tracking',
    subtitle: 'Automatically knows when to increase your weights and reps',
  },
  {
    icon: 'message-circle',
    title: 'Real-time form feedback',
    subtitle: 'Get coaching tips based on your exercise history',
  },
  {
    icon: 'refresh-cw',
    title: 'Smart plan adjustments',
    subtitle: "Your plan evolves as you improve, not just at week 8",
  },
];

export default function CoachScreen() {
  const theme = useTheme();
  const colors = theme ? theme.colors : lightColors;
  const styles = makeStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Feather name="x" size={20} color={colors.black} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <FadeUpItem delay={100}>
          <View style={styles.hero}>
            <View style={styles.iconCircle}>
              <Feather name="cpu" size={40} color={'#FFFFFF'} />
            </View>
            <Text style={styles.title}>AI Coach</Text>
            <Text style={styles.subtitle}>Your personal fitness intelligence</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Coming soon</Text>
            </View>
          </View>
        </FadeUpItem>

        <FadeUpItem delay={200}>
          <View style={styles.featuresCard}>
            {FEATURES.map((feature, index) => (
              <View key={feature.icon}>
                <View style={styles.featureRow}>
                  <View style={styles.featureIconWrap}>
                    <Feather name={feature.icon} size={18} color={colors.blue} />
                  </View>
                  <View style={styles.featureText}>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Text style={styles.featureSub}>{feature.subtitle}</Text>
                  </View>
                </View>
                {index < FEATURES.length - 1 && <View style={styles.featureDivider} />}
              </View>
            ))}
          </View>
        </FadeUpItem>

        <FadeUpItem delay={300}>
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.notifyButton}
              activeOpacity={0.85}
              onPress={() =>
                Alert.alert(
                  "You're on the list!",
                  "We'll let you know as soon as AI coaching goes live."
                )
              }
            >
              <Text style={styles.notifyButtonText}>Notify me when it's ready</Text>
            </TouchableOpacity>
            <Text style={styles.proNote}>Available for Pro members at launch</Text>
          </View>
        </FadeUpItem>
      </ScrollView>
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
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 8,
    },
    headerSpacer: { width: 40 },
    closeButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.greyCard,
      alignItems: 'center',
      justifyContent: 'center',
    },

    scroll: { flex: 1 },
    content: {
      paddingHorizontal: 24,
      paddingTop: 8,
      paddingBottom: 60,
      gap: 24,
    },

    hero: {
      alignItems: 'center',
      gap: 12,
      paddingVertical: 8,
    },
    iconCircle: {
      width: 88,
      height: 88,
      borderRadius: 44,
      backgroundColor: colors.blue,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
      shadowColor: colors.blue,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.35,
      shadowRadius: 16,
      elevation: 8,
    },
    title: {
      fontSize: 32,
      fontWeight: '700',
      color: colors.black,
      letterSpacing: -1,
    },
    subtitle: {
      fontSize: 16,
      color: colors.grey,
      fontWeight: '300',
    },
    badge: {
      backgroundColor: colors.blue,
      paddingHorizontal: 14,
      paddingVertical: 5,
      borderRadius: 100,
      marginTop: 4,
    },
    badgeText: {
      fontSize: 12,
      color: '#FFFFFF',
      fontWeight: '600',
      letterSpacing: 0.3,
    },

    featuresCard: {
      backgroundColor: colors.white,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.greyBorder,
      padding: 20,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 12,
      elevation: 3,
    },
    featureRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 14,
      paddingVertical: 14,
    },
    featureIconWrap: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: colors.blueLight,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    featureText: {
      flex: 1,
      gap: 3,
    },
    featureTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.black,
      letterSpacing: -0.2,
    },
    featureSub: {
      fontSize: 13,
      color: colors.grey,
      fontWeight: '300',
      lineHeight: 18,
    },
    featureDivider: {
      height: 0.5,
      backgroundColor: colors.greyBorder,
    },

    footer: {
      gap: 12,
      alignItems: 'center',
    },
    notifyButton: {
      backgroundColor: colors.blue,
      paddingVertical: 16,
      borderRadius: 100,
      alignItems: 'center',
      width: '100%',
      shadowColor: colors.blue,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 12,
      elevation: 6,
    },
    notifyButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    proNote: {
      fontSize: 13,
      color: colors.greyLight,
      fontWeight: '300',
    },
  });
}
