import { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  ActivityIndicator, Alert,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { lightColors } from '../constants/colors';
import { getTrainerApplications, approveTrainerApplication, rejectTrainerApplication } from '../services/api';

const FILTERS = ['All', 'Pending', 'Approved', 'Rejected'];

const STATUS_CONFIG = {
  pending:  { label: 'Pending',  bg: '#FEF3C7', color: '#B45309' },
  approved: { label: 'Approved', bg: '#D1FAE5', color: '#059669' },
  rejected: { label: 'Rejected', bg: '#FEE2E2', color: '#DC2626' },
};

export default function AdminTrainerApplicationsScreen() {
  const theme = useTheme();
  const isDark = theme ? theme.isDark : false;
  const colors = theme ? theme.colors : lightColors;
  const styles = makeStyles(colors, isDark);

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [acting, setActing] = useState(null); // id of the application being acted on

  useFocusEffect(
    useCallback(() => {
      async function load() {
        try {
          setLoading(true);
          const data = await getTrainerApplications();
          setApplications(Array.isArray(data) ? data : []);
        } catch (err) {
          console.log('Applications fetch error:', err.message);
        } finally {
          setLoading(false);
        }
      }
      load();
    }, [])
  );

  const visible = applications.filter(a =>
    filter === 'All' || a.status === filter.toLowerCase()
  );

  async function handleApprove(id) {
    Alert.alert('Approve application', 'This will create a verified trainer profile.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Approve',
        onPress: async () => {
          try {
            setActing(id);
            await approveTrainerApplication(id);
            setApplications(prev =>
              prev.map(a => a.id === id ? { ...a, status: 'approved' } : a)
            );
          } catch (err) {
            Alert.alert('Error', err.message);
          } finally {
            setActing(null);
          }
        },
      },
    ]);
  }

  async function handleReject(id) {
    Alert.alert('Reject application', 'This will mark the application as rejected.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reject',
        style: 'destructive',
        onPress: async () => {
          try {
            setActing(id);
            await rejectTrainerApplication(id);
            setApplications(prev =>
              prev.map(a => a.id === id ? { ...a, status: 'rejected' } : a)
            );
          } catch (err) {
            Alert.alert('Error', err.message);
          } finally {
            setActing(null);
          }
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trainer Applications</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Filter tabs */}
      <View style={styles.filterRow}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterTab, filter === f && styles.filterTabActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterTabText, filter === f && styles.filterTabTextActive]}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.blue} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {visible.length === 0 ? (
            <View style={styles.emptyState}>
              <Feather name="inbox" size={40} color={colors.greyLight} />
              <Text style={styles.emptyText}>No applications</Text>
            </View>
          ) : (
            visible.map(app => {
              const statusStyle = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending;
              const isPending = app.status === 'pending';
              const isActing = acting === app.id;

              return (
                <View key={app.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={styles.cardHeaderLeft}>
                      <Text style={styles.applicantName}>{app.full_name}</Text>
                      <Text style={styles.applicantEmail}>{app.email}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                      <Text style={[styles.statusText, { color: statusStyle.color }]}>
                        {statusStyle.label}
                      </Text>
                    </View>
                  </View>

                  {!!app.speciality && (
                    <Text style={styles.fieldValue}>
                      <Text style={styles.fieldKey}>Speciality: </Text>{app.speciality}
                    </Text>
                  )}
                  {!!app.location && (
                    <Text style={styles.fieldValue}>
                      <Text style={styles.fieldKey}>Location: </Text>{app.location}
                    </Text>
                  )}
                  {app.years_experience != null && (
                    <Text style={styles.fieldValue}>
                      <Text style={styles.fieldKey}>Experience: </Text>{app.years_experience} years
                    </Text>
                  )}
                  {app.hourly_rate != null && (
                    <Text style={styles.fieldValue}>
                      <Text style={styles.fieldKey}>Rate: </Text>£{app.hourly_rate}/hr
                    </Text>
                  )}
                  {!!app.bio && (
                    <Text style={styles.bioText} numberOfLines={2}>{app.bio}</Text>
                  )}

                  {isPending && (
                    <View style={styles.actionRow}>
                      <TouchableOpacity
                        style={styles.approveButton}
                        onPress={() => handleApprove(app.id)}
                        disabled={isActing}
                      >
                        {isActing ? (
                          <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                          <Text style={styles.approveButtonText}>Approve</Text>
                        )}
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.rejectButton}
                        onPress={() => handleReject(app.id)}
                        disabled={isActing}
                      >
                        <Text style={styles.rejectButtonText}>Reject</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </ScrollView>
      )}
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

    filterRow: {
      flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 12,
      gap: 8, borderBottomWidth: 0.5, borderBottomColor: colors.greyBorder,
    },
    filterTab: {
      paddingHorizontal: 14, paddingVertical: 7, borderRadius: 100,
      backgroundColor: colors.greyCard,
    },
    filterTabActive: { backgroundColor: colors.blue },
    filterTabText: { fontSize: 13, fontWeight: '500', color: colors.grey },
    filterTabTextActive: { color: '#FFFFFF' },

    content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 80 },
    emptyState: { alignItems: 'center', paddingTop: 60, gap: 12 },
    emptyText: { fontSize: 15, color: colors.grey },

    card: {
      backgroundColor: colors.white, borderRadius: 16, padding: 16,
      marginBottom: 12, borderWidth: 1, borderColor: colors.greyBorder,
      gap: 8,
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    cardHeaderLeft: { flex: 1 },
    applicantName: { fontSize: 15, fontWeight: '700', color: colors.black },
    applicantEmail: { fontSize: 12, color: colors.grey, marginTop: 2 },

    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100 },
    statusText: { fontSize: 11, fontWeight: '600' },

    fieldKey: { fontWeight: '600', color: colors.black },
    fieldValue: { fontSize: 13, color: colors.grey },
    bioText: { fontSize: 13, color: colors.grey, fontStyle: 'italic', lineHeight: 18 },

    actionRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
    approveButton: {
      flex: 1, backgroundColor: '#059669', borderRadius: 10,
      paddingVertical: 11, alignItems: 'center',
    },
    approveButtonText: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
    rejectButton: {
      flex: 1, backgroundColor: '#FEE2E2', borderRadius: 10,
      paddingVertical: 11, alignItems: 'center',
    },
    rejectButtonText: { fontSize: 14, fontWeight: '600', color: '#DC2626' },
  });
}
