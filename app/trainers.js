import { useState, useCallback } from 'react';
import {
  View, Text, Image, ScrollView, StyleSheet, TouchableOpacity,
  ActivityIndicator, Modal, TextInput, Alert, KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { lightColors } from '../constants/colors';
import { FadeUpItem } from '../components/ScreenWrapper';
import { getTrainers, submitTrainerApplication } from '../services/api';

export default function TrainersScreen() {
  const theme = useTheme();
  const isDark = theme ? theme.isDark : false;
  const colors = theme ? theme.colors : lightColors;
  const styles = makeStyles(colors, isDark);

  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyVisible, setApplyVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    speciality: '',
    location: '',
    languages: '',
    years_experience: '',
    certifications: '',
    hourly_rate: '',
    instagram: '',
    bio: '',
  });

  useFocusEffect(
    useCallback(() => {
      async function load() {
        try {
          setLoading(true);
          const data = await getTrainers();
          setTrainers(Array.isArray(data) ? data : []);
        } catch (err) {
          console.log('Trainers fetch error:', err.message);
        } finally {
          setLoading(false);
        }
      }
      load();
    }, [])
  );

  function setField(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function handleSubmitApplication() {
    if (!form.full_name.trim() || !form.email.trim()) {
      Alert.alert('Missing info', 'Full name and email are required.');
      return;
    }
    try {
      setSubmitting(true);
      await submitTrainerApplication({
        ...form,
        years_experience: form.years_experience ? parseInt(form.years_experience) : null,
        hourly_rate: form.hourly_rate ? parseFloat(form.hourly_rate) : null,
      });
      setApplyVisible(false);
      setForm({ full_name: '', email: '', speciality: '', location: '', languages: '', years_experience: '', certifications: '', hourly_rate: '', instagram: '', bio: '' });
      Alert.alert('Application submitted!', "We'll review it shortly and get back to you.");
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function renderLanguageTags(languages) {
    if (!languages) return null;
    return (
      <View style={styles.tagRow}>
        {languages.split(',').map((lang, i) => (
          <View key={i} style={styles.tag}>
            <Text style={styles.tagText}>{lang.trim()}</Text>
          </View>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trainers</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.blue} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {trainers.length === 0 ? (
            <View style={styles.emptyState}>
              <Feather name="users" size={48} color={colors.greyLight} />
              <Text style={styles.emptyTitle}>No trainers yet</Text>
              <Text style={styles.emptyBody}>Check back soon — we're verifying our first trainers.</Text>
            </View>
          ) : (
            trainers.map((trainer, index) => (
              <FadeUpItem key={trainer.id} delay={index * 60}>
                <TouchableOpacity
                  style={styles.trainerCard}
                  activeOpacity={0.85}
                  onPress={() => router.push({ pathname: '/trainer/[id]', params: { id: trainer.id } })}
                >
                  <View style={styles.trainerTop}>
                    {trainer.profile_picture ? (
                      <Image source={{ uri: trainer.profile_picture }} style={styles.avatar} />
                    ) : (
                      <View style={[styles.avatar, styles.avatarPlaceholder]}>
                        <Text style={styles.avatarInitial}>
                          {trainer.name.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                    )}
                    <View style={styles.trainerInfo}>
                      <Text style={styles.trainerName}>{trainer.name}</Text>
                      {!!trainer.speciality && (
                        <Text style={styles.trainerSpeciality}>{trainer.speciality}</Text>
                      )}
                      <View style={styles.metaRow}>
                        {!!trainer.location && (
                          <View style={styles.metaItem}>
                            <Feather name="map-pin" size={11} color={colors.greyLight} />
                            <Text style={styles.metaText}>{trainer.location}</Text>
                          </View>
                        )}
                        {!!trainer.years_experience && (
                          <View style={styles.metaItem}>
                            <Feather name="award" size={11} color={colors.greyLight} />
                            <Text style={styles.metaText}>{trainer.years_experience} yrs</Text>
                          </View>
                        )}
                        {!!trainer.hourly_rate && (
                          <View style={styles.metaItem}>
                            <Text style={styles.rateText}>£{trainer.hourly_rate}/hr</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>

                  {renderLanguageTags(trainer.languages)}

                  <TouchableOpacity
                    style={styles.viewButton}
                    onPress={() => router.push({ pathname: '/trainer/[id]', params: { id: trainer.id } })}
                  >
                    <Text style={styles.viewButtonText}>View profile</Text>
                    <Feather name="arrow-right" size={14} color={colors.blue} />
                  </TouchableOpacity>
                </TouchableOpacity>
              </FadeUpItem>
            ))
          )}

          <TouchableOpacity
            style={styles.applyButton}
            onPress={() => setApplyVisible(true)}
          >
            <Feather name="briefcase" size={16} color="#FFFFFF" />
            <Text style={styles.applyButtonText}>Apply to be a trainer</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Application Modal */}
      <Modal
        visible={applyVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setApplyVisible(false)}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setApplyVisible(false)}>
                <Text style={styles.modalCancel}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Apply as Trainer</Text>
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
              {[
                { label: 'Full name *', key: 'full_name', placeholder: 'Your full name' },
                { label: 'Email *', key: 'email', placeholder: 'your@email.com', keyboard: 'email-address' },
                { label: 'What do you specialize in?', key: 'speciality', placeholder: 'e.g. Strength & Conditioning' },
                { label: 'Location', key: 'location', placeholder: 'e.g. London, UK' },
                { label: 'Languages spoken', key: 'languages', placeholder: 'e.g. English, Amharic' },
                { label: 'Years of experience', key: 'years_experience', placeholder: '0', keyboard: 'numeric' },
                { label: 'Hourly rate (£)', key: 'hourly_rate', placeholder: '0.00', keyboard: 'decimal-pad' },
                { label: 'Instagram handle', key: 'instagram', placeholder: '@yourhandle' },
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
                    autoCapitalize={key === 'email' || key === 'instagram' ? 'none' : 'sentences'}
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

              <Text style={styles.fieldLabel}>Bio / About you</Text>
              <TextInput
                style={[styles.fieldInput, styles.multilineInput]}
                value={form.bio}
                onChangeText={v => setField('bio', v)}
                placeholder="Tell us about yourself, your experience, and your training style..."
                placeholderTextColor={colors.greyLight}
                multiline
                maxLength={500}
              />
              <Text style={styles.charCount}>{form.bio.length}/500</Text>
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
    centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
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
    content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 120 },

    trainerCard: {
      backgroundColor: colors.white, borderRadius: 18, padding: 18,
      marginBottom: 14, borderWidth: 1, borderColor: colors.greyBorder,
      shadowColor: colors.black, shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04, shadowRadius: 8, elevation: 2, gap: 12,
    },
    trainerTop: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
    avatar: { width: 60, height: 60, borderRadius: 30, flexShrink: 0 },
    avatarPlaceholder: {
      backgroundColor: colors.blueLight, alignItems: 'center', justifyContent: 'center',
    },
    avatarInitial: { fontSize: 24, fontWeight: '700', color: colors.blueText },
    trainerInfo: { flex: 1, gap: 4 },
    trainerName: { fontSize: 16, fontWeight: '700', color: colors.black, letterSpacing: -0.3 },
    trainerSpeciality: { fontSize: 13, color: colors.grey, fontWeight: '400' },
    metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 4 },
    metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    metaText: { fontSize: 12, color: colors.greyLight },
    rateText: { fontSize: 12, fontWeight: '600', color: colors.blue },

    tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    tag: {
      backgroundColor: colors.greyCard, paddingHorizontal: 10, paddingVertical: 4,
      borderRadius: 100,
    },
    tagText: { fontSize: 11, color: colors.grey, fontWeight: '500' },

    viewButton: {
      flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start',
    },
    viewButtonText: { fontSize: 13, fontWeight: '600', color: colors.blue },

    applyButton: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      gap: 8, backgroundColor: colors.blue, borderRadius: 100,
      paddingVertical: 16, marginTop: 8,
    },
    applyButtonText: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },

    emptyState: { alignItems: 'center', paddingTop: 80, gap: 12 },
    emptyTitle: { fontSize: 18, fontWeight: '600', color: colors.black },
    emptyBody: { fontSize: 14, color: colors.grey, textAlign: 'center', lineHeight: 20 },

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
    fieldInput: {
      borderWidth: 1.5, borderColor: colors.greyBorder, borderRadius: 12,
      paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: colors.black,
    },
    multilineInput: { minHeight: 90, textAlignVertical: 'top' },
    charCount: { fontSize: 11, color: colors.greyLight, textAlign: 'right', marginTop: 4 },
  });
}
