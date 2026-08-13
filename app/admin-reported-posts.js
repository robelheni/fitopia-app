import { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  ActivityIndicator, Alert,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { lightColors } from '../constants/colors';
import { getReportedPosts, adminDeletePost } from '../services/api';

function formatDate(isoString) {
  if (!isoString) return '';
  const d = isoString.endsWith('Z') ? new Date(isoString) : new Date(isoString + 'Z');
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function AdminReportedPostsScreen() {
  const theme = useTheme();
  const isDark = theme ? theme.isDark : false;
  const colors = theme ? theme.colors : lightColors;
  const styles = makeStyles(colors, isDark);

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      async function load() {
        try {
          setLoading(true);
          const data = await getReportedPosts();
          setReports(Array.isArray(data) ? data : []);
        } catch (err) {
          console.log('Reports fetch error:', err.message);
        } finally {
          setLoading(false);
        }
      }
      load();
    }, [])
  );

  function handleDismiss(reportId) {
    setReports(prev => prev.filter(r => r.report_id !== reportId));
  }

  function handleDelete(report) {
    Alert.alert(
      'Delete post',
      `Delete this post by ${report.post_author}? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await adminDeletePost(report.post_id);
              setReports(prev => prev.filter(r => r.post_id !== report.post_id));
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
        <Text style={styles.headerTitle}>Reported Posts</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.blue} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {reports.length === 0 ? (
            <View style={styles.emptyState}>
              <Feather name="check-circle" size={48} color={colors.greyLight} />
              <Text style={styles.emptyTitle}>No reported posts</Text>
              <Text style={styles.emptyBody}>All clear — nothing has been flagged.</Text>
            </View>
          ) : (
            reports.map(report => (
              <View key={report.report_id} style={styles.card}>
                {/* Reporter info */}
                <View style={styles.reportMeta}>
                  <Feather name="flag" size={13} color="#DC2626" />
                  <Text style={styles.reportMetaText}>
                    Reported by <Text style={styles.reporterName}>{report.reporter_name}</Text>
                    {' · '}{formatDate(report.reported_at)}
                  </Text>
                </View>

                {/* Reason */}
                {!!report.reason && report.reason !== 'Not specified' && (
                  <View style={styles.reasonBadge}>
                    <Text style={styles.reasonText}>Reason: {report.reason}</Text>
                  </View>
                )}

                {/* Post content */}
                <View style={styles.postBox}>
                  <Text style={styles.postAuthorLabel}>Post by</Text>
                  <Text style={styles.postAuthor}>{report.post_author}</Text>
                  <Text style={styles.postText}>{report.post_text}</Text>
                </View>

                {/* Actions */}
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(report)}
                  >
                    <Feather name="trash-2" size={14} color="#DC2626" />
                    <Text style={styles.deleteButtonText}>Delete post</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.dismissButton}
                    onPress={() => handleDismiss(report.report_id)}
                  >
                    <Text style={styles.dismissButtonText}>Dismiss</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
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

    content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 80 },
    emptyState: { alignItems: 'center', paddingTop: 80, gap: 10 },
    emptyTitle: { fontSize: 18, fontWeight: '600', color: colors.black },
    emptyBody: { fontSize: 14, color: colors.grey },

    card: {
      backgroundColor: colors.white, borderRadius: 16, padding: 16,
      marginBottom: 14, borderWidth: 1, borderColor: '#FCA5A5',
      gap: 10,
    },

    reportMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    reportMetaText: { fontSize: 12, color: colors.grey, flex: 1 },
    reporterName: { fontWeight: '600', color: colors.black },

    reasonBadge: {
      alignSelf: 'flex-start', backgroundColor: '#FEE2E2',
      paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100,
    },
    reasonText: { fontSize: 11, fontWeight: '600', color: '#DC2626' },

    postBox: {
      backgroundColor: colors.greyCard, borderRadius: 12, padding: 14, gap: 4,
    },
    postAuthorLabel: { fontSize: 11, color: colors.greyLight },
    postAuthor: { fontSize: 13, fontWeight: '600', color: colors.black },
    postText: { fontSize: 14, color: colors.grey, lineHeight: 20, marginTop: 4 },

    actionRow: { flexDirection: 'row', gap: 10 },
    deleteButton: {
      flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      gap: 6, backgroundColor: '#FEE2E2', borderRadius: 10, paddingVertical: 11,
    },
    deleteButtonText: { fontSize: 13, fontWeight: '600', color: '#DC2626' },
    dismissButton: {
      flex: 1, alignItems: 'center', justifyContent: 'center',
      backgroundColor: colors.greyCard, borderRadius: 10, paddingVertical: 11,
    },
    dismissButtonText: { fontSize: 13, fontWeight: '600', color: colors.grey },
  });
}
