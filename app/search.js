import { useState, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, FlatList, ActivityIndicator
} from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { searchUsers } from '../services/api';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // useRef stores the timer ID between renders without causing re-renders
  // We need this to cancel the previous timer when the user types again
  const debounceTimer = useRef(null);

  function handleQueryChange(text) {
    setQuery(text);

    // Cancel the previous timer every time the user types
    // This is the debounce — we reset the countdown on every keystroke
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // If the query is too short, clear results and stop
    if (text.trim().length < 2) {
      setResults([]);
      setSearched(false);
      return;
    }

    // Start a new 300ms timer — only fires if user stops typing
    debounceTimer.current = setTimeout(async () => {
      try {
        setLoading(true);
        const data = await searchUsers(text.trim());
        setResults(data);
        setSearched(true);
      } catch (err) {
        console.log('Search error:', err.message);
      } finally {
        setLoading(false);
      }
    }, 300);
  }

  // Gets avatar colour based on gender — same pattern as community and profile screens
  function getAvatarColor(gender) {
    if (gender === 'female') return { bg: '#EDE9FE', color: '#7C3AED' };
    if (gender === 'male') return { bg: colors.blueLight, color: colors.blue };
    return { bg: colors.greyCard, color: colors.grey };
  }

  // Gets initials from name — "Heni Bekele" → "HB"
  function getInitials(name) {
    if (!name) return '??';
    const parts = name.split(' ');
    if (parts.length === 1) return name.substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  function renderUser({ item }) {
    const avatarColor = getAvatarColor(item.gender);
    return (
      <TouchableOpacity
        style={styles.userCard}
        onPress={() => router.push({
          pathname: '/profile/[id]',
          params: { id: item.id, name: item.name }
        })}
      >
        {/* Avatar */}
        <View style={[styles.avatar, { backgroundColor: avatarColor.bg }]}>
          <Text style={[styles.avatarText, { color: avatarColor.color }]}>
            {getInitials(item.name)}
          </Text>
        </View>

        {/* Name and username */}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name}</Text>
          {item.username && (
            <Text style={styles.userUsername}>@{item.username}</Text>
          )}
          {item.bio && (
            <Text style={styles.userBio} numberOfLines={1}>{item.bio}</Text>
          )}
        </View>

        <Feather name="chevron-right" size={16} color={colors.greyLight} />
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.black} />
        </TouchableOpacity>

        {/* Search input */}
        <View style={styles.searchBar}>
          <Feather name="search" size={16} color={colors.greyLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search people..."
            placeholderTextColor={colors.greyLight}
            value={query}
            onChangeText={handleQueryChange}
            autoFocus
            autoCapitalize="none"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => {
              setQuery('');
              setResults([]);
              setSearched(false);
            }}>
              <Feather name="x" size={16} color={colors.greyLight} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Loading spinner */}
      {loading && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.blue} />
        </View>
      )}

      {/* Results */}
      {!loading && (
        <FlatList
          data={results}
          keyExtractor={item => item.id.toString()}
          renderItem={renderUser}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            searched ? (
              <View style={styles.emptyState}>
                <Feather name="search" size={40} color={colors.greyLight} />
                <Text style={styles.emptyText}>No users found</Text>
                <Text style={styles.emptySub}>Try a different name or username</Text>
              </View>
            ) : query.length === 0 ? (
              <View style={styles.emptyState}>
                <Feather name="users" size={40} color={colors.greyLight} />
                <Text style={styles.emptyText}>Find people</Text>
                <Text style={styles.emptySub}>Search by name or username</Text>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.greyBorder,
  },

  backButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.greyCard,
    alignItems: 'center', justifyContent: 'center',
  },

  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.greyCard,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.greyBorder,
  },

  searchInput: {
    flex: 1, fontSize: 15, color: colors.black,
  },

  centered: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
  },

  list: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 120,
  },

  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.greyBorder,
  },

  avatar: {
    width: 48, height: 48, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },

  avatarText: { fontSize: 16, fontWeight: '700' },

  userInfo: { flex: 1 },

  userName: {
    fontSize: 15, fontWeight: '600',
    color: colors.black, marginBottom: 2,
  },

  userUsername: {
    fontSize: 13, color: colors.grey, fontWeight: '300',
  },

  userBio: {
    fontSize: 12, color: colors.greyLight,
    fontWeight: '300', marginTop: 2,
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },

  emptyText: {
    fontSize: 16, fontWeight: '600', color: colors.grey,
  },

  emptySub: {
    fontSize: 13, color: colors.greyLight, fontWeight: '300',
  },
});