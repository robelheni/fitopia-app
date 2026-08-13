import { useState, useCallback } from 'react';
import {
  View, Text, Image, ScrollView, StyleSheet, TouchableOpacity,
  ActivityIndicator, Modal, TextInput, Alert, KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../context/ThemeContext';
import { lightColors } from '../constants/colors';
import { FadeUpItem } from '../components/ScreenWrapper';
import BackgroundCircles from '../components/BackgroundCircles';
import { getTrainers, submitTrainerApplication, uploadPostImage } from '../services/api';

// ── Static placeholder trainers shown until real ones are loaded ──────────────
const PLACEHOLDER_TRAINERS = [
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
    tags: ['Strength Training', 'Advanced', 'Competition Prep'],
    available: true,
  },
];

const LOCATION_FILTERS = [
  { key: 'all',      label: 'All' },
  { key: 'uk',       label: 'UK' },
  { key: 'us',       label: 'US' },
  { key: 'canada',   label: 'Canada' },
  { key: 'ethiopia', label: 'Ethiopia' },
  { key: 'europe',   label: 'Europe' },
];

function matchesFilter(location, key) {
  const loc = (location || '').toLowerCase();
  if (key === 'all')      return true;
  if (key === 'uk')       return loc.includes('uk') || loc.includes('united kingdom');
  if (key === 'us')       return loc.includes('us') || loc.includes('united states');
  if (key === 'canada')   return loc.includes('ca') || loc.includes('canada');
  if (key === 'ethiopia') return loc.includes('ethiopia');
  if (key === 'europe')   return loc.includes('se') || loc.includes('de') || loc.includes('no') || loc.includes('stockholm') || loc.includes('europe');
  return true;
}

const EMPTY_FORM = {
  full_name: '', email: '', speciality: '', location: '',
  languages: '', years_experience: '', clients_trained: '', certifications: '',
  hourly_rate: '', instagram: '', whatsapp: '', bio: '',
  profile_picture: '',
  transformation_pictures: '',
};

export default function TrainersScreen() {
  const theme = useTheme();
  const isDark = theme ? theme.isDark : false;
  const colors = theme ? theme.colors : lightColors;
  const styles = makeStyles(colors, isDark);

  const [apiTrainers, setApiTrainers] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [applyVisible, setApplyVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  // Local image URIs (before upload)
  const [profilePicUri, setProfilePicUri] = useState(null);
  const [transformationUris, setTransformationUris] = useState([null, null, null, null]);
  const [uploadingPic, setUploadingPic] = useState(false);

  useFocusEffect(
    useCallback(() => {
      async function load() {
        try {
          const data = await getTrainers();
          if (Array.isArray(data)) setApiTrainers(data);
        } catch {
          // silently fall back to placeholders
        }
      }
      load();
    }, [])
  );

  function setField(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function pickProfilePicture() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.[0]) {
      setProfilePicUri(result.assets[0].uri);
    }
  }

  async function pickTransformationPhoto(index) {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.[0]) {
      const updated = [...transformationUris];
      updated[index] = result.assets[0].uri;
      setTransformationUris(updated);
    }
  }

  // Merge: real API trainers first, then placeholders
  const allTrainers = [
    ...apiTrainers.map(t => ({
      id: String(t.id),
      name: t.name,
      initials: t.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase(),
      avatarColor: '#2563EB',
      verified: t.is_verified,
      speciality: t.speciality || '',
      location: t.location || '',
      experience: t.years_experience,
      clients: t.clients_trained,
      sessions: null,
      rating: null,
      reviews: null,
      price: t.hourly_rate,
      currency: '£',
      tags: t.speciality ? [t.speciality] : [],
      available: t.is_active,
    })),
    ...PLACEHOLDER_TRAINERS,
  ];

  const filtered = allTrainers.filter(t => matchesFilter(t.location, activeFilter));

  async function handleSubmitApplication() {
    if (!form.full_name.trim() || !form.email.trim()) {
      Alert.alert('Missing info', 'Full name and email are required.');
      return;
    }
    try {
      setSubmitting(true);

      // Upload profile picture if picked
      let profilePicUrl = '';
      if (profilePicUri) {
        const res = await uploadPostImage(profilePicUri);
        profilePicUrl = res.url || '';
      }

      // Upload transformation photos that were picked
      const uploadedTransformations = await Promise.all(
        transformationUris.map(async uri => {
          if (!uri) return null;
          const res = await uploadPostImage(uri);
          return res.url || null;
        })
      );
      const transformationUrls = uploadedTransformations.filter(Boolean).join(',');

      await submitTrainerApplication({
        ...form,
        years_experience: form.years_experience ? parseInt(form.years_experience) : null,
        hourly_rate: form.hourly_rate ? parseFloat(form.hourly_rate) : null,
        profile_picture: profilePicUrl || null,
        transformation_pictures: transformationUrls || null,
      });

      setApplyVisible(false);
      setForm(EMPTY_FORM);
      setProfilePicUri(null);
      setTransformationUris([null, null, null, null]);
      Alert.alert('Application submitted!', "We'll review it shortly and get back to you.");
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setSubmitting(false);
    }
  }

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
            {LOCATION_FILTERS.map(f => (
              <TouchableOpacity
                key={f.key}
                style={[styles.filterTab, activeFilter === f.key && styles.filterTabActive]}
                onPress={() => setActiveFilter(f.key)}
              >
                <Text style={[styles.filterText, activeFilter === f.key && styles.filterTextActive]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </FadeUpItem>

        <FadeUpItem delay={150}>
          <Text style={styles.trainerCount}>{filtered.length} trainers available</Text>
        </FadeUpItem>

        <FadeUpItem delay={200}>
          <View style={styles.trainerList}>
            {filtered.map(trainer => (
              <TouchableOpacity
                key={trainer.id}
                style={styles.trainerCard}
                onPress={() => router.push({ pathname: '/trainer/[id]', params: { id: trainer.id } })}
              >
                {/* Top row: avatar + info + price */}
                <View style={styles.trainerTop}>
                  <View style={[styles.avatar, { backgroundColor: trainer.avatarColor }]}>
                    <Text style={styles.avatarText}>{trainer.initials}</Text>
                  </View>
                  <View style={styles.trainerInfo}>
                    <View style={styles.nameRow}>
                      <Text style={styles.trainerName}>{trainer.name}</Text>
                      {trainer.verified && (
                        <View style={styles.verifiedBadge}>
                          <Feather name="check" size={10} color="#FFFFFF" />
                          <Text style={styles.verifiedText}>Verified</Text>
                        </View>
                      )}
                    </View>
                    {!!trainer.speciality && (
                      <Text style={styles.trainerSpeciality}>{trainer.speciality}</Text>
                    )}
                    {!!trainer.location && (
                      <View style={styles.locationRow}>
                        <Feather name="map-pin" size={11} color={colors.greyLight} />
                        <Text style={styles.trainerLocation}>{trainer.location}</Text>
                      </View>
                    )}
                  </View>
                  {trainer.price != null && (
                    <View style={styles.priceContainer}>
                      <Text style={styles.price}>{trainer.currency}{trainer.price}</Text>
                      <Text style={styles.priceLabel}>per session</Text>
                    </View>
                  )}
                </View>

                {/* Stats row */}
                <View style={styles.statsRow}>
                  {trainer.experience != null && (
                    <View style={styles.stat}>
                      <Text style={styles.statValue}>{trainer.experience}</Text>
                      <Text style={styles.statLabel}>Years</Text>
                    </View>
                  )}
                  {trainer.experience != null && trainer.clients != null && (
                    <View style={styles.statDivider} />
                  )}
                  {trainer.clients != null && (
                    <View style={styles.stat}>
                      <Text style={styles.statValue}>{trainer.clients}</Text>
                      <Text style={styles.statLabel}>Clients</Text>
                    </View>
                  )}
                  {trainer.rating != null && (
                    <>
                      <View style={styles.statDivider} />
                      <View style={styles.stat}>
                        <View style={styles.ratingRow}>
                          <Feather name="star" size={11} color="#D97706" />
                          <Text style={styles.statValue}>{trainer.rating}</Text>
                        </View>
                        <Text style={styles.statLabel}>{trainer.reviews} reviews</Text>
                      </View>
                    </>
                  )}
                  <View style={{ flex: 1 }} />
                  <View style={[styles.availabilityBadge, !trainer.available && styles.availabilityBadgeUnavailable]}>
                    <View style={[styles.availabilityDot, !trainer.available && styles.availabilityDotUnavailable]} />
                    <Text style={[styles.availabilityText, !trainer.available && styles.availabilityTextUnavailable]}>
                      {trainer.available ? 'Available' : 'Busy'}
                    </Text>
                  </View>
                </View>

                {/* Tags */}
                {trainer.tags.length > 0 && (
                  <View style={styles.tags}>
                    {trainer.tags.map((tag, i) => (
                      <View key={i} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </FadeUpItem>

        {/* Become a trainer CTA */}
        <FadeUpItem delay={300}>
          <TouchableOpacity style={styles.becomeTrainerCard} onPress={() => setApplyVisible(true)}>
            <Feather name="user-plus" size={20} color={colors.blue} />
            <View style={styles.becomeTrainerContent}>
              <Text style={styles.becomeTrainerTitle}>Are you a trainer?</Text>
              <Text style={styles.becomeTrainerSub}>Join Fitopia and connect with Ethiopian clients worldwide</Text>
            </View>
            <View style={styles.applyButton}>
              <Text style={styles.applyButtonText}>Apply</Text>
            </View>
          </TouchableOpacity>
        </FadeUpItem>

      </ScrollView>

      {/* ── Apply to be a trainer modal ─────────────────────────────────────── */}
      <Modal
        visible={applyVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setApplyVisible(false)}
      >
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setApplyVisible(false)}>
                <Text style={styles.modalCancel}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Trainer Application</Text>
              <TouchableOpacity onPress={handleSubmitApplication} disabled={submitting}>
                <Text style={[styles.modalSave, submitting && { opacity: 0.4 }]}>
                  {submitting ? 'Sending...' : 'Submit'}
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              contentContainerStyle={styles.modalContent}
              keyboardShouldPersistTaps="handled"
            >
              {/* Profile picture */}
              <Text style={styles.fieldLabel}>Profile picture</Text>
              <TouchableOpacity style={styles.profilePicPicker} onPress={pickProfilePicture}>
                {profilePicUri ? (
                  <Image source={{ uri: profilePicUri }} style={styles.profilePicPreview} />
                ) : (
                  <View style={styles.profilePicPlaceholder}>
                    <Feather name="camera" size={28} color={colors.greyLight} />
                    <Text style={styles.profilePicPlaceholderText}>Tap to add photo</Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Text fields */}
              {[
                { label: 'Full name *',      key: 'full_name',         placeholder: 'Your full name' },
                { label: 'Email *',          key: 'email',             placeholder: 'your@email.com', keyboard: 'email-address' },
                { label: 'Speciality',       key: 'speciality',        placeholder: 'e.g. Muscle Building' },
                { label: 'Location',         key: 'location',          placeholder: 'e.g. London, UK' },
                { label: 'Languages',        key: 'languages',         placeholder: 'e.g. English, Amharic' },
                { label: 'Years experience', key: 'years_experience',  placeholder: '0', keyboard: 'numeric' },
                { label: 'Clients trained',  key: 'clients_trained',   placeholder: '0', keyboard: 'numeric' },
                { label: 'Hourly rate (£)',  key: 'hourly_rate',       placeholder: '0.00', keyboard: 'decimal-pad' },
                { label: 'Instagram',        key: 'instagram',         placeholder: '@handle' },
                { label: 'WhatsApp',         key: 'whatsapp',          placeholder: '+44 7000 000000', keyboard: 'phone-pad' },
              ].map(({ label, key, placeholder, keyboard }) => (
                <View key={key}>
                  <Text style={styles.fieldLabel}>{label}</Text>
                  <TextInput
                    style={styles.fieldInput}
                    value={form[key]}
                    onChangeText={v => setField(key, v)}
                    placeholder={placeholder}
                    placeholderTextColor={colors.greyLight}
                    keyboardType={keyboard || 'default'}
                    autoCapitalize={keyboard ? 'none' : 'sentences'}
                  />
                </View>
              ))}

              <Text style={styles.fieldLabel}>Certifications</Text>
              <TextInput
                style={[styles.fieldInput, styles.multilineInput]}
                value={form.certifications}
                onChangeText={v => setField('certifications', v)}
                placeholder="List your certifications..."
                placeholderTextColor={colors.greyLight}
                multiline
              />

              <Text style={styles.fieldLabel}>Bio</Text>
              <TextInput
                style={[styles.fieldInput, styles.multilineInput]}
                value={form.bio}
                onChangeText={v => setField('bio', v)}
                placeholder="Tell clients about yourself..."
                placeholderTextColor={colors.greyLight}
                multiline
              />

              {/* Transformation photos */}
              <Text style={styles.fieldLabel}>Transformation photos</Text>
              <Text style={styles.fieldSubLabel}>Before and after client results (up to 4 photos)</Text>
              <View style={styles.transformationGrid}>
                {transformationUris.map((uri, i) => (
                  <TouchableOpacity
                    key={i}
                    style={styles.transformationBox}
                    onPress={() => pickTransformationPhoto(i)}
                  >
                    {uri ? (
                      <Image source={{ uri }} style={styles.transformationPreview} />
                    ) : (
                      <>
                        <Feather name="image" size={22} color={colors.greyLight} />
                        <Text style={styles.transformationBoxLabel}>Add photo</Text>
                      </>
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              {/* Reviews placeholder info */}
              <View style={styles.reviewsNote}>
                <Feather name="star" size={16} color="#D97706" />
                <Text style={styles.reviewsNoteText}>
                  Client reviews will appear on your profile once you start working with clients through Fitopia.
                </Text>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

function makeStyles(colors, isDark) {
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
      shadowColor: colors.blue, shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
    },
    filterText: { fontSize: 14, fontWeight: '500', color: colors.grey },
    filterTextActive: { color: '#FFFFFF' },

    trainerCount: { fontSize: 13, color: colors.grey, fontWeight: '300', marginBottom: 12 },
    trainerList: { gap: 12, marginBottom: 20 },

    trainerCard: {
      backgroundColor: colors.white, borderRadius: 20, padding: 16,
      borderWidth: 1, borderColor: colors.greyBorder,
      shadowColor: colors.black, shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06, shadowRadius: 12, elevation: 3, gap: 14,
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
    trainerSpeciality: { fontSize: 13, color: colors.grey },
    locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    trainerLocation: { fontSize: 12, color: colors.greyLight, fontWeight: '300' },
    priceContainer: { alignItems: 'flex-end', flexShrink: 0 },
    price: { fontSize: 18, fontWeight: '700', color: colors.black, letterSpacing: -0.5 },
    priceLabel: { fontSize: 10, color: colors.greyLight, fontWeight: '300' },

    statsRow: {
      flexDirection: 'row', alignItems: 'center',
      backgroundColor: colors.greyCard, borderRadius: 12, padding: 12, gap: 8,
    },
    stat: { alignItems: 'center', gap: 2, paddingHorizontal: 4 },
    statValue: { fontSize: 15, fontWeight: '700', color: colors.black },
    statLabel: { fontSize: 10, color: colors.greyLight, fontWeight: '300' },
    statDivider: { width: 0.5, height: 30, backgroundColor: colors.greyBorder },
    ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },

    availabilityBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
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

    // Modal
    modalContainer: { flex: 1, backgroundColor: colors.white, paddingTop: 12 },
    modalHandle: {
      width: 36, height: 4, borderRadius: 2,
      backgroundColor: colors.greyBorder, alignSelf: 'center', marginBottom: 8,
    },
    modalHeader: {
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
      paddingHorizontal: 24, paddingVertical: 16,
      borderBottomWidth: 0.5, borderBottomColor: colors.greyBorder,
    },
    modalCancel: { fontSize: 16, color: colors.grey },
    modalTitle: { fontSize: 17, fontWeight: '600', color: colors.black },
    modalSave: { fontSize: 16, fontWeight: '600', color: colors.blue },
    modalContent: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 60 },
    fieldLabel: { fontSize: 13, fontWeight: '600', color: colors.grey, marginBottom: 8, marginTop: 16 },
    fieldSubLabel: { fontSize: 12, color: colors.greyLight, marginBottom: 10, marginTop: -4 },
    fieldInput: {
      borderWidth: 1.5, borderColor: colors.greyBorder, borderRadius: 12,
      paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: colors.black,
    },
    multilineInput: { minHeight: 80, textAlignVertical: 'top' },

    // Profile picture picker
    profilePicPicker: { alignSelf: 'center', marginBottom: 8 },
    profilePicPreview: { width: 100, height: 100, borderRadius: 50 },
    profilePicPlaceholder: {
      width: 100, height: 100, borderRadius: 50,
      backgroundColor: colors.greyCard, borderWidth: 1.5,
      borderColor: colors.greyBorder, borderStyle: 'dashed',
      alignItems: 'center', justifyContent: 'center', gap: 4,
    },
    profilePicPlaceholderText: { fontSize: 11, color: colors.greyLight, fontWeight: '500' },

    // Transformation grid
    transformationGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 8 },
    transformationBox: {
      width: '47%', aspectRatio: 1,
      backgroundColor: colors.greyCard, borderRadius: 14,
      borderWidth: 1.5, borderColor: colors.greyBorder, borderStyle: 'dashed',
      alignItems: 'center', justifyContent: 'center', gap: 6, overflow: 'hidden',
    },
    transformationPreview: { width: '100%', height: '100%' },
    transformationBoxLabel: { fontSize: 11, color: colors.greyLight, fontWeight: '500' },

    // Reviews note
    reviewsNote: {
      flexDirection: 'row', alignItems: 'flex-start', gap: 10,
      backgroundColor: '#FEF3C7', borderRadius: 12, padding: 14, marginTop: 16,
    },
    reviewsNoteText: { flex: 1, fontSize: 13, color: '#B45309', lineHeight: 18 },
  });
}
