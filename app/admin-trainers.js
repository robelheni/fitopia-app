import { useState, useCallback } from 'react';
import {
  View, Text, Image, ScrollView, StyleSheet, TouchableOpacity,
  ActivityIndicator, Alert, Modal, TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { lightColors } from '../constants/colors';
import { getAdminTrainers, createAdminTrainer, deleteAdminTrainer } from '../services/api';

const EMPTY_FORM = {
  name: '', bio: '', speciality: '', location: '', languages: '',
  years_experience: '', clients_trained: '', certifications: '',
  hourly_rate: '', instagram: '', contact_email: '',
};

export default function AdminTrainersScreen() {
  const theme = useTheme();
  const isDark = theme ? theme.isDark : false;
  const colors = theme ? theme.colors : lightColors;
  const styles = makeStyles(colors, isDark);

  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addVisible, setAddVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  async function load() {
    try {
      setLoading(true);
      const data = await getAdminTrainers();
      setTrainers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log('Admin trainers error:', err.message);
    } finally {
      setLoading(false);
    }
  }

  function setField(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    if (!form.name.trim()) {
      Alert.alert('Missing name', 'Trainer name is required.');
      return;
    }
    try {
      setSaving(true);
      await createAdminTrainer({
        ...form,
        years_experience: form.years_experience ? parseInt(form.years_experience) : null,
        clients_trained: form.clients_trained ? parseInt(form.clients_trained) : null,
        hourly_rate: form.hourly_rate ? parseFloat(form.hourly_rate) : null,
      });
      setAddVisible(false);
      setForm(EMPTY_FORM);
      await load();
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setSaving(false);
    }
  }

  function handleDelete(trainer) {
    Alert.alert(
      'Delete trainer',
      `Remove ${trainer.name} from the trainers list?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAdminTrainer(trainer.id);
              setTrainers(prev => prev.filter(t => t.id !== trainer.id));
            } catch (err) {
              Alert.alert('Error', err.message);
            }
          },
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Trainers</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setAddVisible(true)}
        >
          <Feather name="plus" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.blue} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {trainers.length === 0 ? (
            <View style={styles.emptyState}>
              <Feather name="users" size={40} color={colors.greyLight} />
              <Text style={styles.emptyText}>No trainers yet</Text>
              <Text style={styles.emptySubtext}>Tap + to add one manually</Text>
            </View>
          ) : (
            trainers.map(trainer => (
              <View key={trainer.id} style={styles.trainerRow}>
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
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(trainer)}
                >
                  <Feather name="trash-2" size={16} color="#DC2626" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
      )}

      {/* Add Trainer Modal */}
      <Modal
        visible={addVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setAddVisible(false)}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setAddVisible(false)}>
                <Text style={styles.modalCancel}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Add Trainer</Text>
              <TouchableOpacity onPress={handleSave} disabled={saving}>
                <Text style={[styles.modalSave, saving && { opacity: 0.4 }]}>
                  {saving ? 'Saving...' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              contentContainerStyle={styles.modalContent}
              keyboardShouldPersistTaps="handled"
            >
              {[
                { label: 'Name *', key: 'name', placeholder: 'Full name' },
                { label: 'Speciality', key: 'speciality', placeholder: 'e.g. Strength & Conditioning' },
                { label: 'Location', key: 'location', placeholder: 'e.g. London, UK' },
                { label: 'Languages', key: 'languages', placeholder: 'e.g. English, Amharic' },
                { label: 'Years experience', key: 'years_experience', placeholder: '0', keyboard: 'numeric' },
                { label: 'Clients trained', key: 'clients_trained', placeholder: '0', keyboard: 'numeric' },
                { label: 'Hourly rate (£)', key: 'hourly_rate', placeholder: '0.00', keyboard: 'decimal-pad' },
                { label: 'Instagram', key: 'instagram', placeholder: '@handle' },
                { label: 'Contact email', key: 'contact_email', placeholder: 'email@example.com', keyboard: 'email-address' },
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
              <Text style={styles.fieldLabel}>Bio</Text>
              <TextInput
                style={[styles.fieldInput, styles.multilineInput]}
                value={form.bio}
                onChangeText={v => setField('bio', v)}
                placeholder="Trainer bio..."
                placeholderTextColor={colors.greyLight}
                multiline
              />
              <Text style={styles.fieldLabel}>Certifications</Text>
              <TextInput
                style={[styles.fieldInput, styles.multilineInput]}
                value={form.certifications}
                onChangeText={v => setField('certifications', v)}
                placeholder="List certifications..."
                placeholderTextColor={colors.greyLight}
                multiline
              />
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
    addButton: {
      width: 40, height: 40, borderRadius: 20,
      backgroundColor: colors.blue, alignItems: 'center', justifyContent: 'center',
    },

    content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 80 },
    emptyState: { alignItems: 'center', paddingTop: 60, gap: 8 },
    emptyText: { fontSize: 16, fontWeight: '600', color: colors.black },
    emptySubtext: { fontSize: 13, color: colors.grey },

    trainerRow: {
      flexDirection: 'row', alignItems: 'center', gap: 14,
      paddingVertical: 14, borderBottomWidth: 0.5, borderBottomColor: colors.greyBorder,
    },
    avatar: { width: 48, height: 48, borderRadius: 24, flexShrink: 0 },
    avatarPlaceholder: { backgroundColor: colors.blueLight, alignItems: 'center', justifyContent: 'center' },
    avatarInitial: { fontSize: 18, fontWeight: '700', color: colors.blueText },
    trainerInfo: { flex: 1 },
    trainerName: { fontSize: 15, fontWeight: '600', color: colors.black },
    trainerSpeciality: { fontSize: 12, color: colors.grey, marginTop: 2 },
    deleteButton: {
      width: 36, height: 36, borderRadius: 18,
      backgroundColor: '#FEE2E2', alignItems: 'center', justifyContent: 'center',
    },

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
    multilineInput: { minHeight: 80, textAlignVertical: 'top' },
  });
}
