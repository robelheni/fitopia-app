import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { lightColors } from '../../constants/colors';
import { FadeUpItem } from '../../components/ScreenWrapper';
import BackgroundCircles from '../../components/BackgroundCircles';

const trainers = [
  {
    id: 't1',
    name: 'Dawit Bekele',
    initials: 'DB',
    avatarColor: '#2563EB',
    verified: true,
    speciality: 'Muscle Building',
    location: 'London, UK',
    experience: 8,
    clients: 142,
    sessions: 1240,
    rating: 4.9,
    reviews: 87,
    price: 45,
    currency: '£',
    bio: 'Certified personal trainer specialising in muscle building and strength training for the Ethiopian diaspora. I understand our food culture and how to work around fasting schedules.',
    tags: ['Muscle Building', 'Strength', 'Fasting Fitness'],
    available: true,
  },
  {
    id: 't2',
    name: 'Sara Haile',
    initials: 'SH',
    avatarColor: '#059669',
    verified: true,
    speciality: 'Weight Loss',
    location: 'Minneapolis, US',
    experience: 6,
    clients: 98,
    sessions: 890,
    rating: 4.8,
    reviews: 64,
    price: 55,
    currency: '$',
    bio: 'Specialising in sustainable weight loss using Ethiopian nutrition principles. My approach combines traditional Ethiopian diet wisdom with modern fitness science.',
    tags: ['Weight Loss', 'Nutrition', 'Ethiopian Diet'],
    available: true,
  },
  {
    id: 't3',
    name: 'Yonas Tadesse',
    initials: 'YT',
    avatarColor: '#7C3AED',
    verified: true,
    speciality: 'Fasting Fitness',
    location: 'Toronto, CA',
    experience: 5,
    clients: 76,
    sessions: 620,
    rating: 4.7,
    reviews: 43,
    price: 50,
    currency: '$',
    bio: 'Expert in Orthodox fasting fitness protocols. I have helped hundreds of Ethiopians maintain and improve their fitness during Tsom without compromising their faith.',
    tags: ['Fasting Fitness', 'Orthodox Fasting', 'Bodyweight'],
    available: false,
  },
  {
    id: 't4',
    name: 'Meron Girma',
    initials: 'MG',
    avatarColor: '#D97706',
    verified: false,
    speciality: 'General Fitness',
    location: 'Addis Ababa, Ethiopia',
    experience: 3,
    clients: 45,
    sessions: 380,
    rating: 4.6,
    reviews: 28,
    price: 20,
    currency: '$',
    bio: 'Based in Addis Ababa helping Ethiopians build sustainable fitness habits. Specialising in home workouts and bodyweight training.',
    tags: ['General Fitness', 'Home Workouts', 'Beginners'],
    available: true,
  },
  {
    id: 't5',
    name: 'Abebu Worku',
    initials: 'AW',
    avatarColor: '#DC2626',
    verified: true,
    speciality: 'Strength Training',
    location: 'Stockholm, SE',
    experience: 10,
    clients: 203,
    sessions: 2100,
    rating: 5.0,
    reviews: 112,
    price: 60,
    currency: '€',
    bio: 'One of the most experienced Ethiopian personal trainers in Europe. Decade of experience helping the diaspora achieve real results while respecting their culture and lifestyle.',
    tags: ['Strength Training', 'Advanced', 'Competition Prep'],
    available: true,
  },
];

const filters = [
  { key: 'all', label: 'All' },
  { key: 'uk', label: 'UK' },
  { key: 'us', label: 'US' },
  { key: 'canada', label: 'Canada' },
  { key: 'ethiopia', label: 'Ethiopia' },
  { key: 'europe', label: 'Europe' },
];

export default function TrainersScreen() {
  const theme = useTheme();
  const isDark = theme ? theme.isDark : false;
  const colors = theme ? theme.colors : lightColors;

  const [activeFilter, setActiveFilter] = useState('all');

  const styles = makeStyles(colors, isDark);

  const filteredTrainers = activeFilter === 'all'
    ? trainers
    : trainers.filter(t => {
        const loc = t.location.toLowerCase();
        if (activeFilter === 'uk') return loc.includes('uk');
        if (activeFilter === 'us') return loc.includes('us');
        if (activeFilter === 'canada') return loc.includes('ca');
        if (activeFilter === 'ethiopia') return loc.includes('ethiopia');
        if (activeFilter === 'europe') return loc.includes('se') || loc.includes('de') || loc.includes('no');
        return true;
      });

  return (
    <View style={styles.container}>
      <BackgroundCircles variant="topLeft" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personal Trainers</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <FadeUpItem delay={0}>
          <Text style={styles.subtitle}>
            Work with a verified Ethiopian trainer who understands your culture, diet and lifestyle.
          </Text>
        </FadeUpItem>

        <FadeUpItem delay={100}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersContainer}>
            {filters.map(filter => (
              <TouchableOpacity
                key={filter.key}
                style={[styles.filterTab, activeFilter === filter.key && styles.filterTabActive]}
                onPress={() => setActiveFilter(filter.key)}
              >
                <Text style={[styles.filterText, activeFilter === filter.key && styles.filterTextActive]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </FadeUpItem>

        <FadeUpItem delay={150}>
          <Text style={styles.trainerCount}>{filteredTrainers.length} trainers available</Text>
        </FadeUpItem>

        <FadeUpItem delay={200}>
          <View style={styles.trainerList}>
            {filteredTrainers.map(trainer => (
              <TouchableOpacity
                key={trainer.id}
                style={styles.trainerCard}
                onPress={() => router.push(`/trainers/${trainer.id}`)}
              >
                <View style={styles.trainerTop}>
                  <View style={[styles.avatar, { backgroundColor: trainer.avatarColor }]}>
                    <Text style={styles.avatarText}>{trainer.initials}</Text>
                  </View>
                  <View style={styles.trainerInfo}>
                    <View style={styles.nameRow}>
                      <Text style={styles.trainerName}>{trainer.name}</Text>
                      {trainer.verified && (
                        <View style={styles.verifiedBadge}>
                          <Feather name="check" size={10} color={'#FFFFFF'} />
                          <Text style={styles.verifiedText}>Verified</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.trainerSpeciality}>{trainer.speciality}</Text>
                    <View style={styles.locationRow}>
                      <Feather name="map-pin" size={11} color={colors.greyLight} />
                      <Text style={styles.trainerLocation}>{trainer.location}</Text>
                    </View>
                  </View>
                  <View style={styles.priceContainer}>
                    <Text style={styles.price}>{trainer.currency}{trainer.price}</Text>
                    <Text style={styles.priceLabel}>per session</Text>
                  </View>
                </View>

                <View style={styles.statsRow}>
                  <View style={styles.stat}>
                    <Text style={styles.statValue}>{trainer.experience}</Text>
                    <Text style={styles.statLabel}>Years</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.stat}>
                    <Text style={styles.statValue}>{trainer.clients}</Text>
                    <Text style={styles.statLabel}>Clients</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.stat}>
                    <View style={styles.ratingRow}>
                      <Feather name="star" size={11} color="#D97706" />
                      <Text style={styles.statValue}>{trainer.rating}</Text>
                    </View>
                    <Text style={styles.statLabel}>{trainer.reviews} reviews</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={[styles.availabilityBadge, !trainer.available && styles.availabilityBadgeUnavailable]}>
                    <View style={[styles.availabilityDot, !trainer.available && styles.availabilityDotUnavailable]} />
                    <Text style={[styles.availabilityText, !trainer.available && styles.availabilityTextUnavailable]}>
                      {trainer.available ? 'Available' : 'Busy'}
                    </Text>
                  </View>
                </View>

                <View style={styles.tags}>
                  {trainer.tags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </FadeUpItem>

        <FadeUpItem delay={300}>
          <View style={styles.becomeTrainerCard}>
            <Feather name="user-plus" size={20} color={colors.blue} />
            <View style={styles.becomeTrainerContent}>
              <Text style={styles.becomeTrainerTitle}>Are you a trainer?</Text>
              <Text style={styles.becomeTrainerSub}>Join Fitopia and connect with Ethiopian clients worldwide</Text>
            </View>
            <TouchableOpacity style={styles.applyButton}>
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </FadeUpItem>
      </ScrollView>
    </View>
  );
}

function makeStyles(c, dark) {
  const colors = c || lightColors;
  const isDark = dark || false;
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.white },
    header: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: 24, paddingTop: 60, paddingBottom: 16,
      borderBottomWidth: 0.5, borderBottomColor: colors.greyBorder,
    },
    backButton: {
      width: 40, height: 40, borderRadius: 20,
      backgroundColor: colors.greyCard, alignItems: 'center', justifyContent: 'center',
    },
    headerTitle: { fontSize: 17, fontWeight: '600', color: colors.black },
    content: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 },
    subtitle: { fontSize: 14, color: colors.grey, lineHeight: 20, fontWeight: '300', marginBottom: 16 },
    filtersContainer: { gap: 8, paddingBottom: 16, paddingRight: 24 },
    filterTab: {
      paddingHorizontal: 20, paddingVertical: 10, borderRadius: 100,
      backgroundColor: colors.greyCard, borderWidth: 1, borderColor: colors.greyBorder,
    },
    filterTabActive: {
      backgroundColor: colors.blue, borderColor: colors.blue,
      shadowColor: colors.blue, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
    },
    filterText: { fontSize: 14, fontWeight: '500', color: colors.grey },
    filterTextActive: { color: '#FFFFFF' },
    trainerCount: { fontSize: 13, color: colors.grey, fontWeight: '300', marginBottom: 12 },
    trainerList: { gap: 12, marginBottom: 20 },
    trainerCard: {
      backgroundColor: colors.white, borderRadius: 20, padding: 16,
      borderWidth: 1, borderColor: colors.greyBorder,
      shadowColor: colors.black, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3,
      gap: 14,
    },
    trainerTop: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
    avatar: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    avatarText: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
    trainerInfo: { flex: 1, gap: 3 },
    nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
    trainerName: { fontSize: 16, fontWeight: '700', color: colors.black, letterSpacing: -0.3 },
    verifiedBadge: {
      flexDirection: 'row', alignItems: 'center', gap: 3,
      backgroundColor: colors.blue, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 100,
    },
    verifiedText: { fontSize: 10, color: '#FFFFFF', fontWeight: '600' },
    trainerSpeciality: { fontSize: 13, color: colors.grey, fontWeight: '400' },
    locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    trainerLocation: { fontSize: 12, color: colors.greyLight, fontWeight: '300' },
    priceContainer: { alignItems: 'flex-end', flexShrink: 0 },
    price: { fontSize: 18, fontWeight: '700', color: colors.black, letterSpacing: -0.5 },
    priceLabel: { fontSize: 10, color: colors.greyLight, fontWeight: '300' },
    statsRow: {
      flexDirection: 'row', alignItems: 'center',
      backgroundColor: colors.greyCard, borderRadius: 12, padding: 12,
    },
    stat: { flex: 1, alignItems: 'center', gap: 2 },
    statValue: { fontSize: 15, fontWeight: '700', color: colors.black },
    statLabel: { fontSize: 10, color: colors.greyLight, fontWeight: '300' },
    statDivider: { width: 0.5, height: 30, backgroundColor: colors.greyBorder },
    ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
    availabilityBadge: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
    availabilityBadgeUnavailable: { opacity: 0.6 },
    availabilityDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#059669' },
    availabilityDotUnavailable: { backgroundColor: colors.greyLight },
    availabilityText: { fontSize: 11, color: '#059669', fontWeight: '500' },
    availabilityTextUnavailable: { color: colors.greyLight },
    tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    tag: { backgroundColor: colors.blueLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100 },
    tagText: { fontSize: 11, color: colors.blueText, fontWeight: '500' },
    becomeTrainerCard: {
      flexDirection: 'row', alignItems: 'center', gap: 12,
      backgroundColor: colors.blueLight, borderRadius: 16, padding: 16,
    },
    becomeTrainerContent: { flex: 1, gap: 2 },
    becomeTrainerTitle: { fontSize: 14, fontWeight: '600', color: colors.blueText },
    becomeTrainerSub: { fontSize: 12, color: colors.blueText, fontWeight: '300', opacity: 0.8 },
    applyButton: { backgroundColor: colors.blue, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 100 },
    applyButtonText: { fontSize: 13, fontWeight: '600', color: '#FFFFFF' },
  });
}
