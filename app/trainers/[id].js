import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { lightColors } from '../../constants/colors';
import { FadeUpItem } from '../../components/ScreenWrapper';

const trainerData = {
  t1: {
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
    price: 45,
    currency: '£',
    available: true,
    bio: 'Certified personal trainer specialising in muscle building and strength training for the Ethiopian diaspora. I understand our food culture and how to work around fasting schedules. I have helped over 140 clients achieve real transformations while respecting their cultural identity.',
    tags: ['Muscle Building', 'Strength', 'Fasting Fitness'],
    certifications: ['Level 3 Personal Trainer', 'Nutrition Coach', 'Strength and Conditioning'],
    languages: ['English', 'Amharic'],
    reviews: [
      {
        id: 'r1',
        name: 'Yonas B.',
        initials: 'YB',
        avatarColor: '#DC2626',
        rating: 5,
        text: 'Dawit completely transformed my approach to training. He understood my fasting schedule and built a plan around it. Down 8kg in 3 months.',
        time: '2 weeks ago',
      },
      {
        id: 'r2',
        name: 'Meron H.',
        initials: 'MH',
        avatarColor: '#D4A843',
        rating: 5,
        text: 'Finally a trainer who knows Ethiopian food. He told me exactly what to eat from our cuisine to hit my protein goals. No more guessing.',
        time: '1 month ago',
      },
      {
        id: 'r3',
        name: 'Sara T.',
        initials: 'ST',
        avatarColor: '#059669',
        rating: 5,
        text: 'Professional, knowledgeable and genuinely cares about results. Best investment I have made in my health.',
        time: '2 months ago',
      },
    ],
  },
  t2: {
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
    price: 55,
    currency: '$',
    available: true,
    bio: 'Specialising in sustainable weight loss using Ethiopian nutrition principles. My approach combines traditional Ethiopian diet wisdom with modern fitness science. I believe you do not have to give up your culture to get results.',
    tags: ['Weight Loss', 'Nutrition', 'Ethiopian Diet'],
    certifications: ['Certified Personal Trainer', 'Sports Nutritionist'],
    languages: ['English', 'Amharic', 'Tigrinya'],
    reviews: [
      {
        id: 'r1',
        name: 'Dawit K.',
        initials: 'DK',
        avatarColor: '#7C3AED',
        rating: 5,
        text: 'Sara helped me lose 12kg without giving up injera. She showed me exactly how much to eat and when. Game changer.',
        time: '3 weeks ago',
      },
      {
        id: 'r2',
        name: 'Abebu T.',
        initials: 'AT',
        avatarColor: '#2563EB',
        rating: 5,
        text: 'Very knowledgeable about Ethiopian food. She created a meal plan using foods I actually enjoy eating.',
        time: '6 weeks ago',
      },
    ],
  },
  t3: {
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
    price: 50,
    currency: '$',
    available: false,
    bio: 'Expert in Orthodox fasting fitness protocols. I have helped hundreds of Ethiopians maintain and improve their fitness during Tsom without compromising their faith or health.',
    tags: ['Fasting Fitness', 'Orthodox Fasting', 'Bodyweight'],
    certifications: ['Certified Personal Trainer', 'Corrective Exercise Specialist'],
    languages: ['English', 'Amharic'],
    reviews: [
      {
        id: 'r1',
        name: 'Meron G.',
        initials: 'MG',
        avatarColor: '#D97706',
        rating: 5,
        text: 'Yonas is the only trainer I have found who truly understands Orthodox fasting. My fitness improved even during the 55 day fast.',
        time: '1 month ago',
      },
    ],
  },
  t4: {
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
    price: 20,
    currency: '$',
    available: true,
    bio: 'Based in Addis Ababa helping Ethiopians build sustainable fitness habits. Specialising in home workouts and bodyweight training for beginners.',
    tags: ['General Fitness', 'Home Workouts', 'Beginners'],
    certifications: ['Fitness Instructor Certificate'],
    languages: ['Amharic', 'English'],
    reviews: [
      {
        id: 'r1',
        name: 'Biruk A.',
        initials: 'BA',
        avatarColor: '#2563EB',
        rating: 5,
        text: 'Great trainer for beginners. Very patient and explains everything clearly in Amharic.',
        time: '2 months ago',
      },
    ],
  },
  t5: {
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
    price: 60,
    currency: '€',
    available: true,
    bio: 'One of the most experienced Ethiopian personal trainers in Europe with a decade of experience. I have helped over 200 clients achieve remarkable transformations while respecting their cultural identity and lifestyle.',
    tags: ['Strength Training', 'Advanced', 'Competition Prep'],
    certifications: ['Master Personal Trainer', 'Strength and Conditioning Coach', 'Sports Nutrition'],
    languages: ['English', 'Amharic', 'Swedish'],
    reviews: [
      {
        id: 'r1',
        name: 'Tigist B.',
        initials: 'TB',
        avatarColor: '#7C3AED',
        rating: 5,
        text: 'Abebu is simply the best. 10 years of experience shows in every session. My strength has doubled in 6 months.',
        time: '1 week ago',
      },
      {
        id: 'r2',
        name: 'Kebede M.',
        initials: 'KM',
        avatarColor: '#059669',
        rating: 5,
        text: 'Worth every cent. Professional, results driven and understands the Ethiopian lifestyle completely.',
        time: '3 weeks ago',
      },
      {
        id: 'r3',
        name: 'Hiwot S.',
        initials: 'HS',
        avatarColor: '#D97706',
        rating: 5,
        text: 'I competed in my first fitness competition thanks to Abebu. His knowledge is unmatched.',
        time: '2 months ago',
      },
    ],
  },
};

export default function TrainerDetailScreen() {
  const theme = useTheme();
  const isDark = theme ? theme.isDark : false;
  const colors = theme ? theme.colors : lightColors;

  const { id } = useLocalSearchParams();
  const trainer = trainerData[id];
  const styles = makeStyles(colors, isDark);

  if (!trainer) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Feather name="arrow-left" size={20} color={colors.black} />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: colors.black }}>Trainer not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trainer Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <FadeUpItem delay={0}>
          <View style={styles.profileCard}>
            <View style={[styles.avatar, { backgroundColor: trainer.avatarColor }]}>
              <Text style={styles.avatarText}>{trainer.initials}</Text>
            </View>
            <View style={styles.nameRow}>
              <Text style={styles.trainerName}>{trainer.name}</Text>
              {trainer.verified && (
                <View style={styles.verifiedBadge}>
                  <Feather name="check" size={10} color={'#FFFFFF'} />
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              )}
            </View>
            <Text style={styles.speciality}>{trainer.speciality}</Text>
            <View style={styles.locationRow}>
              <Feather name="map-pin" size={13} color={colors.grey} />
              <Text style={styles.location}>{trainer.location}</Text>
            </View>
            <View style={[styles.availabilityBadge, !trainer.available && styles.availabilityBadgeUnavailable]}>
              <View style={[styles.availabilityDot, !trainer.available && styles.availabilityDotUnavailable]} />
              <Text style={[styles.availabilityText, !trainer.available && styles.availabilityTextUnavailable]}>
                {trainer.available ? 'Available for new clients' : 'Currently fully booked'}
              </Text>
            </View>
          </View>
        </FadeUpItem>

        <FadeUpItem delay={100}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{trainer.experience}</Text>
              <Text style={styles.statLabel}>Years exp.</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{trainer.clients}</Text>
              <Text style={styles.statLabel}>Clients</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{trainer.sessions}</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <View style={styles.ratingRow}>
                <Feather name="star" size={13} color="#D97706" />
                <Text style={styles.statValue}>{trainer.rating}</Text>
              </View>
              <Text style={styles.statLabel}>{trainer.reviews.length} reviews</Text>
            </View>
          </View>
        </FadeUpItem>

        <FadeUpItem delay={150}>
          <View style={styles.bookingCard}>
            <View style={styles.priceRow}>
              <Text style={styles.price}>{trainer.currency}{trainer.price}</Text>
              <Text style={styles.priceLabel}>per session</Text>
            </View>
            <View style={styles.bookingButtons}>
              <TouchableOpacity
                style={[styles.bookButton, !trainer.available && styles.bookButtonDisabled]}
                onPress={() => Alert.alert('Coming soon', 'Session booking is coming in the next update.', [{ text: 'OK' }])}
              >
                <Feather name="calendar" size={16} color={'#FFFFFF'} />
                <View>
                  <Text style={styles.bookButtonText}>Book a session</Text>
                  <Text style={styles.bookButtonSub}>No commitment — one off session</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.messageButton}
                onPress={() => Alert.alert('Coming soon', 'Messaging is coming in the next update.', [{ text: 'OK' }])}
              >
                <Feather name="message-circle" size={16} color={colors.blue} />
                <Text style={styles.messageButtonText}>Ask a question</Text>
              </TouchableOpacity>
            </View>
          </View>
        </FadeUpItem>

        <FadeUpItem delay={200}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bioText}>{trainer.bio}</Text>
        </FadeUpItem>

        <FadeUpItem delay={220}>
          <View style={styles.tags}>
            {trainer.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </FadeUpItem>

        <FadeUpItem delay={240}>
          <Text style={styles.sectionTitle}>Certifications</Text>
          <View style={styles.certsList}>
            {trainer.certifications.map((cert, index) => (
              <View key={index} style={styles.certItem}>
                <Feather name="award" size={14} color={colors.blue} />
                <Text style={styles.certText}>{cert}</Text>
              </View>
            ))}
          </View>
        </FadeUpItem>

        <FadeUpItem delay={260}>
          <Text style={styles.sectionTitle}>Languages</Text>
          <View style={styles.languagesList}>
            {trainer.languages.map((lang, index) => (
              <View key={index} style={styles.languageTag}>
                <Text style={styles.languageText}>{lang}</Text>
              </View>
            ))}
          </View>
        </FadeUpItem>

        <FadeUpItem delay={280}>
          <Text style={styles.sectionTitle}>Transformations</Text>
          <Text style={styles.sectionSub}>Client before and after photos</Text>
          <View style={styles.transformationGrid}>
            {[1, 2, 3, 4].map(i => (
              <View key={i} style={styles.transformationPlaceholder}>
                <Feather name="image" size={20} color={colors.greyLight} />
              </View>
            ))}
          </View>
        </FadeUpItem>

        <FadeUpItem delay={300}>
          <Text style={styles.sectionTitle}>Reviews</Text>
          <View style={styles.reviewsList}>
            {trainer.reviews.map(review => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={[styles.reviewAvatar, { backgroundColor: review.avatarColor }]}>
                    <Text style={styles.reviewAvatarText}>{review.initials}</Text>
                  </View>
                  <View style={styles.reviewMeta}>
                    <Text style={styles.reviewName}>{review.name}</Text>
                    <Text style={styles.reviewTime}>{review.time}</Text>
                  </View>
                  <View style={styles.reviewRating}>
                    {[...Array(review.rating)].map((_, i) => (
                      <Feather key={i} name="star" size={12} color="#D97706" />
                    ))}
                  </View>
                </View>
                <Text style={styles.reviewText}>{review.text}</Text>
              </View>
            ))}
          </View>
        </FadeUpItem>

        <FadeUpItem delay={350}>
          <TouchableOpacity
            style={[styles.bottomBookButton, !trainer.available && styles.bookButtonDisabled]}
            onPress={() => Alert.alert('Coming soon', 'Session booking is coming in the next update.', [{ text: 'OK' }])}
          >
            <Text style={styles.bottomBookButtonText}>
              {trainer.available ? `Book a session — ${trainer.currency}${trainer.price}` : 'Currently fully booked'}
            </Text>
            {trainer.available && (
              <Text style={styles.bottomBookButtonSub}>No commitment — one off session</Text>
            )}
          </TouchableOpacity>
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
    content: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40 },
    profileCard: { alignItems: 'center', marginBottom: 20, gap: 8 },
    avatar: {
      width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center',
      marginBottom: 4,
      shadowColor: colors.black, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 6,
    },
    avatarText: { fontSize: 32, fontWeight: '700', color: '#FFFFFF' },
    nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    trainerName: { fontSize: 22, fontWeight: '700', color: colors.black, letterSpacing: -0.5 },
    verifiedBadge: {
      flexDirection: 'row', alignItems: 'center', gap: 3,
      backgroundColor: colors.blue, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 100,
    },
    verifiedText: { fontSize: 10, color: '#FFFFFF', fontWeight: '600' },
    speciality: { fontSize: 15, color: colors.grey, fontWeight: '400' },
    locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    location: { fontSize: 13, color: colors.grey, fontWeight: '300' },
    availabilityBadge: {
      flexDirection: 'row', alignItems: 'center', gap: 6,
      backgroundColor: '#D1FAE5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 100,
    },
    availabilityBadgeUnavailable: { backgroundColor: colors.greyCard },
    availabilityDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#059669' },
    availabilityDotUnavailable: { backgroundColor: colors.greyLight },
    availabilityText: { fontSize: 12, color: '#059669', fontWeight: '500' },
    availabilityTextUnavailable: { color: colors.greyLight },
    statsRow: {
      flexDirection: 'row', backgroundColor: colors.greyCard, borderRadius: 16, padding: 16, marginBottom: 16,
    },
    statItem: { flex: 1, alignItems: 'center', gap: 4 },
    statValue: { fontSize: 18, fontWeight: '700', color: colors.black, letterSpacing: -0.5 },
    statLabel: { fontSize: 10, color: colors.greyLight, fontWeight: '300' },
    statDivider: { width: 0.5, height: 35, backgroundColor: colors.greyBorder, alignSelf: 'center' },
    ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
    bookingCard: {
      backgroundColor: colors.white, borderRadius: 16, padding: 16, marginBottom: 24,
      borderWidth: 1, borderColor: colors.greyBorder, gap: 12,
      shadowColor: colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
    },
    priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
    price: { fontSize: 28, fontWeight: '700', color: colors.black, letterSpacing: -1 },
    priceLabel: { fontSize: 13, color: colors.grey, fontWeight: '300' },
    bookingButtons: { gap: 10 },
    bookButton: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
      backgroundColor: colors.blue, paddingVertical: 14, borderRadius: 100,
      shadowColor: colors.blue, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
    },
    bookButtonDisabled: { backgroundColor: colors.greyBorder, shadowOpacity: 0, elevation: 0 },
    bookButtonText: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
    bookButtonSub: { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: '300', textAlign: 'center' },
    messageButton: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
      backgroundColor: colors.blueLight, paddingVertical: 14, borderRadius: 100,
    },
    messageButtonText: { fontSize: 15, fontWeight: '500', color: colors.blue },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.black, letterSpacing: -0.5, marginBottom: 10 },
    sectionSub: { fontSize: 13, color: colors.grey, fontWeight: '300', marginBottom: 12, marginTop: -6 },
    bioText: { fontSize: 14, color: colors.grey, lineHeight: 22, fontWeight: '300', marginBottom: 16 },
    tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 24 },
    tag: { backgroundColor: colors.blueLight, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 100 },
    tagText: { fontSize: 12, color: colors.blue, fontWeight: '500' },
    certsList: { gap: 8, marginBottom: 24 },
    certItem: {
      flexDirection: 'row', alignItems: 'center', gap: 10,
      backgroundColor: colors.greyCard, padding: 12, borderRadius: 12,
    },
    certText: { fontSize: 14, color: colors.black, fontWeight: '400' },
    languagesList: { flexDirection: 'row', gap: 8, marginBottom: 24 },
    languageTag: {
      backgroundColor: colors.greyCard, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 100,
      borderWidth: 1, borderColor: colors.greyBorder,
    },
    languageText: { fontSize: 13, color: colors.black, fontWeight: '400' },
    transformationGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
    transformationPlaceholder: {
      width: '47.5%', height: 120, backgroundColor: colors.greyCard, borderRadius: 12,
      alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.greyBorder,
    },
    reviewsList: { gap: 12, marginBottom: 24 },
    reviewCard: { backgroundColor: colors.greyCard, borderRadius: 16, padding: 16, gap: 10 },
    reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    reviewAvatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    reviewAvatarText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },
    reviewMeta: { flex: 1 },
    reviewName: { fontSize: 13, fontWeight: '600', color: colors.black },
    reviewTime: { fontSize: 11, color: colors.greyLight },
    reviewRating: { flexDirection: 'row', gap: 2 },
    reviewText: { fontSize: 13, color: colors.grey, lineHeight: 20, fontWeight: '300' },
    bottomBookButton: {
      backgroundColor: colors.blue, paddingVertical: 16, borderRadius: 100, alignItems: 'center',
      shadowColor: colors.blue, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 8,
    },
    bottomBookButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
    bottomBookButtonSub: { fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: '300' },
  });
}
