import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import BackgroundCircles from '../components/BackgroundCircles';
import ScreenWrapper, { FadeUpItem }from '../components/ScreenWrapper';

export default function LanguageScreen() {
  function selectLanguage(lang) {
    router.replace('/welcome');
  }

  return (
    <ScreenWrapper style={styles.container}>
      <BackgroundCircles variant="topLeft" />
      

      <View style={styles.header}>
        <FadeUpItem delay={0}>
          <Text style={styles.title}>Choose your language</Text>
        </FadeUpItem>
        <FadeUpItem delay={150}>
        <Text style={styles.subtitle}>You can change this later in settings</Text>
        </FadeUpItem>
      </View>

      <View style={styles.options}>

      <FadeUpItem delay={350}>
        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => selectLanguage('amharic')}
        >
          <View style={styles.optionLeft}>
            <Text style={styles.optionTitle}>አማርኛ</Text>
            <Text style={styles.optionSub}>Amharic</Text>
          </View>
          <View style={styles.optionBadge}>
            <Text style={styles.optionBadgeText}>Recommended</Text>
          </View>
        </TouchableOpacity>
        </FadeUpItem>

        <FadeUpItem delay={550}>
        <TouchableOpacity
          style={styles.optionCardPlain}
          onPress={() => selectLanguage('english')}
        >
          <View style={styles.optionLeft}>
            <Text style={styles.optionTitle}>English</Text>
            <Text style={styles.optionSub}>Full app in English</Text>
          </View>
        </TouchableOpacity>
        </FadeUpItem>

      </View>

    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  header: {
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0a0a0a',
    letterSpacing: -1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#888780',
    fontWeight: '300',
  },
  options: {
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  optionCardPlain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#e8e8e8',
    backgroundColor: '#ffffff',
  },
  optionLeft: {
    gap: 4,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0a0a0a',
    letterSpacing: -0.5,
  },
  optionSub: {
    fontSize: 14,
    color: '#888780',
    fontWeight: '300',
  },
  optionBadge: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  optionBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
});