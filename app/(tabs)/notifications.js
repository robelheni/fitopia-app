import { useState, useCallback } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, Pressable, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import { useFocusEffect, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { lightColors } from '../../constants/colors';
import { useNotifications } from '../../context/NotificationContext';
import { getNotifications, markAllNotificationsRead } from '../../services/api';

const TYPE_CONFIG = {
  follow:       { icon: 'user-plus',      color: '#3B82F6' },
  like:         { icon: 'heart',          color: '#EF4444' },
  comment:      { icon: 'message-circle', color: '#10B981' },
  announcement: { icon: 'megaphone',      color: '#F59E0B' },
  challenge:    { icon: 'zap',            color: '#8B5CF6' },
  update:       { icon: 'bell',           color: '#6B7280' },
};

// Backend timestamps are UTC but may lack the 'Z' suffix — append it so
// JS parses them as UTC instead of local time.
function toUTC(dateStr) {
  if (!dateStr) return new Date();
  if (dateStr.endsWith('Z') || dateStr.includes('+')) return new Date(dateStr);
  return new Date(dateStr + 'Z');
}

function timeAgo(dateStr) {
  const diff = (Date.now() - toUTC(dateStr)) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return toUTC(dateStr).toLocaleDateString();
}

function goToProfile(item) {
  if (item.actor_id) {
    router.push({ pathname: '/profile/[id]', params: { id: item.actor_id, name: item.actor_name ?? '' } });
  }
}

function goToContent(item) {
  switch (item.type) {
    case 'follow':
      goToProfile(item);
      break;
    case 'like':
    case 'comment':
      if (item.post_id) {
        router.push({ pathname: '/comments', params: { postId: item.post_id } });
      }
      break;
    case 'announcement':
      router.push({
        pathname: '/announcement',
        params: {
          title: item.title,
          body: item.body ?? '',
          date: toUTC(item.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }),
        },
      });
      break;
    default:
      break;
  }
}

export default function NotificationsScreen() {
  const theme = useTheme();
  const isDark = theme ? theme.isDark : false;
  const colors = theme ? theme.colors : lightColors;
  const styles = makeStyles(colors, isDark);

  const { setUnreadCount } = useNotifications();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [apiError, setApiError] = useState(null);

  async function fetchNotifications() {
    try {
      setApiError(null);
      const data = await getNotifications();
      const list = Array.isArray(data) ? data : (data.notifications ?? data.results ?? []);
      setNotifications(list);
    } catch (err) {
      console.log('Notifications fetch error:', err.message);
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
      markAllNotificationsRead()
        .then(() => setUnreadCount(0))
        .catch(() => {});
    }, [])
  );

  async function onRefresh() {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  }

  function renderItem({ item }) {
    const config = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.update;
    const isUnread = !item.is_read;
    const hasProfile = !!item.actor_id;
    const hasContent = item.type === 'like' || item.type === 'comment' || item.type === 'announcement';

    return (
      <View style={[styles.row, isUnread && styles.rowUnread]}>

        {/* LEFT — avatar taps to profile */}
        <TouchableOpacity
          style={styles.avatarWrap}
          activeOpacity={hasProfile ? 0.5 : 1}
          onPress={() => hasProfile && goToProfile(item)}
          disabled={!hasProfile}
        >
          {item.actor_avatar ? (
            <Image source={{ uri: item.actor_avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: config.color + '22' }]}>
              {item.actor_name ? (
                <Text style={[styles.avatarInitial, { color: config.color }]}>
                  {item.actor_name.charAt(0).toUpperCase()}
                </Text>
              ) : (
                <Feather name={config.icon} size={20} color={config.color} />
              )}
            </View>
          )}
          <View style={[styles.typeBadge, { backgroundColor: config.color }]}>
            <Feather name={config.icon} size={9} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* RIGHT — text taps to post / announcement */}
        <Pressable
          style={({ pressed }) => [
            styles.rowContent,
            pressed && styles.rowContentPressed,
          ]}
          onPress={() => goToContent(item)}
        >
          <Text style={styles.rowTitle} numberOfLines={2}>{item.title}</Text>
          {!!item.body && (
            <Text style={styles.rowBody} numberOfLines={2}>{item.body}</Text>
          )}
          <Text style={styles.rowTime}>{timeAgo(item.created_at)}</Text>
        </Pressable>

        {isUnread && <View style={styles.unreadDot} />}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.blue} />
        </View>
      ) : apiError ? (
        <View style={styles.emptyState}>
          <View style={[styles.emptyIcon, { backgroundColor: isDark ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.08)' }]}>
            <Feather name="alert-circle" size={32} color="#EF4444" />
          </View>
          <Text style={styles.emptyTitle}>Couldn't load notifications</Text>
          <Text style={styles.emptyBody}>{apiError}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => { setLoading(true); fetchNotifications(); }}>
            <Text style={styles.retryText}>Try again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={notifications.length === 0 ? styles.emptyContainer : styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.blue} colors={[colors.blue]} />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Feather name="bell-off" size={32} color={colors.grey} />
              </View>
              <Text style={styles.emptyTitle}>No notifications yet</Text>
              <Text style={styles.emptyBody}>When someone follows you, likes or comments on your posts, or we have an announcement, it'll show up here.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

function makeStyles(colors, isDark) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.white },
    header: {
      paddingTop: 60,
      paddingBottom: 16,
      paddingHorizontal: 20,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
      backgroundColor: colors.white,
    },
    headerTitle: { fontSize: 24, fontWeight: '700', color: colors.black, letterSpacing: -0.5 },
    centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    listContent: { paddingBottom: 120 },
    emptyContainer: { flex: 1 },

    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 14,
      gap: 12,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
    },
    rowUnread: {
      backgroundColor: isDark ? 'rgba(59,130,246,0.08)' : 'rgba(59,130,246,0.05)',
    },

    // Avatar
    avatarWrap: { position: 'relative', flexShrink: 0 },
    avatar: { width: 48, height: 48, borderRadius: 24 },
    avatarPlaceholder: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarInitial: { fontSize: 20, fontWeight: '700' },
    typeBadge: {
      position: 'absolute',
      bottom: -1,
      right: -1,
      width: 18,
      height: 18,
      borderRadius: 9,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1.5,
      borderColor: colors.white,
    },

    rowContent: { flex: 1, gap: 2, paddingVertical: 6, paddingHorizontal: 8, borderRadius: 10, marginLeft: -8 },
    rowContentPressed: { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' },
    rowTitle: { fontSize: 14, fontWeight: '600', color: colors.black, lineHeight: 20 },
    rowBody: { fontSize: 13, color: colors.grey, lineHeight: 18 },
    rowTime: { fontSize: 12, color: colors.grey, marginTop: 2 },

    unreadDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.blue,
      flexShrink: 0,
    },

    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 40,
      paddingTop: 80,
      gap: 12,
    },
    emptyIcon: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
    },
    emptyTitle: { fontSize: 18, fontWeight: '600', color: colors.black, textAlign: 'center' },
    emptyBody: { fontSize: 14, color: colors.grey, textAlign: 'center', lineHeight: 20 },
    retryButton: {
      marginTop: 8,
      paddingVertical: 10,
      paddingHorizontal: 24,
      borderRadius: 20,
      backgroundColor: colors.blue,
    },
    retryText: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
  });
}
