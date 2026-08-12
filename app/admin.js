import { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  ActivityIndicator, Alert, TextInput, Modal
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { getAdminOverview, getAdminUsers, toggleUserPro, logout, createChallenge } from '../services/api';

const CHALLENGE_COLORS = [
    { name: 'Blue', value: '#2563EB' },
    { name: 'Green', value: '#059669' },
    { name: 'Violet', value: '#7C3AED' },
    { name: 'Red', value: '#DC2626' },
    { name: 'Orange', value: '#D97706' },
    { name: 'Pink', value: '#DB2777' },
    { name: 'Teal', value: '#0891B2' },
    { name: 'Indigo', value: '#4338CA' },
    { name: 'Amber', value: '#B45309' },
    { name: 'Rose', value: '#E11D48' },
    { name: 'Lime', value: '#65A30D' },
    { name: 'Slate', value: '#475569' },
  ];

export default function AdminScreen() {
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [createChallengeVisible, setCreateChallengeVisible] = useState(false);
  const [challengeName, setChallengeName] = useState('');
  const [challengeDescription, setChallengeDescription] = useState('');
  const [challengeColor, setChallengeColor] = useState('#2563EB');
  const [creatingChallenge, setCreatingChallenge] = useState(false);

  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        try {
          setLoading(true);
          const [overviewData, usersData] = await Promise.all([
            getAdminOverview(),
            getAdminUsers(),
          ]);
          setOverview(overviewData);
          setUsers(usersData);
        } catch (err) {
          console.log('Admin fetch error:', err.message);
        } finally {
          setLoading(false);
        }
      }
      fetchData();
    }, [])
  );

  async function handleTogglePro(userId, currentStatus) {
    try {
      await toggleUserPro(userId);
      setUsers(prev => prev.map(u =>
        u.id === userId ? { ...u, is_pro: !currentStatus } : u
      ));
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  }

  async function handleCreateChallenge() {
    if (!challengeName.trim()) {
      Alert.alert('Missing name', 'Please enter a challenge name.');
      return;
    }

    try {
      setCreatingChallenge(true);
      await createChallenge({
        name: challengeName.trim(),
        description: challengeDescription.trim(),
        color: challengeColor,
      });
      setChallengeName('');
      setChallengeDescription('');
      setChallengeColor('#2563EB');
      setCreateChallengeVisible(false);
      Alert.alert('Created', 'Challenge created successfully.');
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setCreatingChallenge(false);
    }
  }

  async function handleLogout() {
    await logout();
    router.replace('/welcome');
  }

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.username && u.username.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.blue} />
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Feather name="log-out" size={18} color="#DC2626" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Overview stats */}
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{overview?.total_users || 0}</Text>
            <Text style={styles.statLabel}>Total users</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{overview?.total_pro_users || 0}</Text>
            <Text style={styles.statLabel}>Pro users</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{overview?.total_workouts_logged || 0}</Text>
            <Text style={styles.statLabel}>Workouts logged</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{overview?.total_posts || 0}</Text>
            <Text style={styles.statLabel}>Community posts</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{overview?.total_comments || 0}</Text>
            <Text style={styles.statLabel}>Comments</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{overview?.total_follows || 0}</Text>
            <Text style={styles.statLabel}>Follow relationships</Text>
          </View>
        </View>

        {/* Revenue placeholder */}
        <View style={styles.revenuePlaceholder}>
          <Feather name="dollar-sign" size={20} color={colors.greyLight} />
          <Text style={styles.revenuePlaceholderText}>Revenue tracking coming once payments are live</Text>
        </View>

        <Text style={styles.sectionTitle}>Challenges</Text>
        <View style={styles.challengeActionsRow}>
        <TouchableOpacity
            style={styles.challengeActionButton}
            onPress={() => setCreateChallengeVisible(true)}
        >
            <Feather name="plus" size={16} color={'#FFFFFF'} />
            <Text style={styles.challengeActionButtonText}>Create</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[styles.challengeActionButton, styles.challengeActionButtonSecondary]}
            onPress={() => router.push('/admin-challenges')}
        >
            <Feather name="list" size={16} color={colors.blue} />
            <Text style={[styles.challengeActionButtonText, styles.challengeActionButtonTextSecondary]}>Manage</Text>
        </TouchableOpacity>
</View>

        <View style={styles.searchBar}>
          <Feather name="search" size={16} color={colors.greyLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, email, or username"
            placeholderTextColor={colors.greyLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.usersList}>
          {filteredUsers.map(u => (
            <View key={u.id} style={styles.userCard}>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{u.name}</Text>
                <Text style={styles.userEmail}>{u.email}</Text>
                {u.username && <Text style={styles.userUsername}>@{u.username}</Text>}
              </View>
              <View style={styles.userActions}>
                {u.is_admin && (
                  <View style={styles.adminBadge}>
                    <Text style={styles.adminBadgeText}>Admin</Text>
                  </View>
                )}
                <TouchableOpacity
                  style={[styles.proToggle, u.is_pro && styles.proToggleActive]}
                  onPress={() => handleTogglePro(u.id, u.is_pro)}
                >
                  <Text style={[styles.proToggleText, u.is_pro && styles.proToggleTextActive]}>
                    {u.is_pro ? 'Pro' : 'Free'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>

      {/* Create Challenge Modal */}
      <Modal
        visible={createChallengeVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setCreateChallengeVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHandle} />
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setCreateChallengeVisible(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>New Challenge</Text>
            <TouchableOpacity onPress={handleCreateChallenge} disabled={creatingChallenge}>
              <Text style={[styles.modalSave, creatingChallenge && { opacity: 0.5 }]}>
                {creatingChallenge ? 'Creating...' : 'Create'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.fieldLabel}>Challenge name</Text>
            <TextInput
              style={styles.fieldInput}
              value={challengeName}
              onChangeText={setChallengeName}
              placeholder="e.g. 15 Pull-Ups"
              placeholderTextColor={colors.greyLight}
            />

            <Text style={styles.fieldLabel}>Description</Text>
            <TextInput
              style={[styles.fieldInput, styles.descriptionInput]}
              value={challengeDescription}
              onChangeText={setChallengeDescription}
              placeholder="Explain the challenge — what counts, why it's worth doing..."
              placeholderTextColor={colors.greyLight}
              multiline
            />

            <Text style={styles.fieldLabel}>Card colour</Text>
            <View style={styles.colorGrid}>
              {CHALLENGE_COLORS.map(c => (
                <TouchableOpacity
                  key={c.value}
                  style={[
                    styles.colorSwatch,
                    { backgroundColor: c.value },
                    challengeColor === c.value && styles.colorSwatchSelected,
                  ]}
                  onPress={() => setChallengeColor(c.value)}
                >
                  {challengeColor === c.value && (
                    <Feather name="check" size={18} color={'#FFFFFF'} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.fieldLabel}>Preview</Text>
            <View style={[styles.previewCard, { backgroundColor: challengeColor }]}>
              <Text style={styles.previewCardName}>{challengeName || 'Challenge name'}</Text>
              <Text style={styles.previewCardMembers}>0 posts</Text>
            </View>
          </ScrollView>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.greyBorder,
  },

  headerTitle: { fontSize: 22, fontWeight: '700', color: colors.black, letterSpacing: -0.5 },

  logoutButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#FEE2E2',
    alignItems: 'center', justifyContent: 'center',
  },

  content: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 80 },

  sectionTitle: {
    fontSize: 16, fontWeight: '700', color: colors.black,
    letterSpacing: -0.3, marginBottom: 12, marginTop: 8,
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },

  statCard: {
    width: '31%',
    backgroundColor: colors.greyCard,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    gap: 4,
  },

  statValue: { fontSize: 20, fontWeight: '700', color: colors.black, letterSpacing: -0.5 },
  statLabel: { fontSize: 10, color: colors.grey, fontWeight: '300', textAlign: 'center' },

  revenuePlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.greyCard,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },

  revenuePlaceholderText: {
    fontSize: 13, color: colors.greyLight, fontWeight: '300', flex: 1,
  },

  challengeActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  
  challengeActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.blue,
    paddingVertical: 14,
    borderRadius: 100,
  },
  
  challengeActionButtonSecondary: {
    backgroundColor: colors.blueLight,
  },
  
  challengeActionButtonText: {
    fontSize: 14, fontWeight: '600', color: '#FFFFFF',
  },
  
  challengeActionButtonTextSecondary: {
    color: colors.blue,
  },
  createChallengeButtonText: {
    fontSize: 15, fontWeight: '600', color: '#FFFFFF',
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.greyCard,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
  },

  searchInput: { flex: 1, fontSize: 14, color: colors.black },

  usersList: { gap: 10 },

  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.greyBorder,
  },

  userInfo: { flex: 1 },
  userName: { fontSize: 14, fontWeight: '600', color: colors.black },
  userEmail: { fontSize: 12, color: colors.grey, fontWeight: '300', marginTop: 2 },
  userUsername: { fontSize: 12, color: colors.greyLight, fontWeight: '300' },

  userActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },

  adminBadge: {
    backgroundColor: colors.blueLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
  },

  adminBadgeText: { fontSize: 10, fontWeight: '600', color: colors.blue },

  proToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    backgroundColor: colors.greyCard,
  },

  proToggleActive: { backgroundColor: '#D1FAE5' },

  proToggleText: { fontSize: 12, fontWeight: '600', color: colors.grey },
  proToggleTextActive: { color: '#059669' },

  modalContainer: { flex: 1, backgroundColor: colors.white, paddingTop: 12 },
  modalHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: colors.greyBorder, alignSelf: 'center', marginBottom: 8 },

  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingVertical: 16,
    borderBottomWidth: 0.5, borderBottomColor: colors.greyBorder,
  },

  modalCancel: { fontSize: 16, color: colors.grey },
  modalTitle: { fontSize: 17, fontWeight: '600', color: colors.black },
  modalSave: { fontSize: 16, fontWeight: '600', color: colors.blue },
  modalContent: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 60 },

  fieldLabel: { fontSize: 13, fontWeight: '600', color: colors.grey, marginBottom: 8, marginTop: 16 },

  fieldInput: {
    borderWidth: 1.5, borderColor: colors.greyBorder, borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: colors.black,
  },

  descriptionInput: { minHeight: 90, textAlignVertical: 'top' },

  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  colorSwatch: {
    width: 48, height: 48, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center',
  },

  colorSwatchSelected: {
    borderWidth: 3,
    borderColor: colors.black,
  },

  previewCard: {
    borderRadius: 20,
    padding: 16,
    width: 160,
  },

  previewCardName: {
    fontSize: 15, fontWeight: '700', color: '#FFFFFF',
    marginBottom: 4, letterSpacing: -0.3,
  },

  previewCardMembers: {
    fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: '300',
  },
});