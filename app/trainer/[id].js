import { useState, useEffect } from 'react';
import {
  View, Text, Image, ScrollView, StyleSheet, TouchableOpacity,
  ActivityIndicator, Linking,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { lightColors } from '../../constants/colors';
import { getTrainer } from '../../services/api';

export default function TrainerDetailScreen() {
  const theme = useTheme();
  const isDark = theme ? theme.isDark : false;
  const colors = theme ? theme.colors : lightColors;
  const styles = makeStyles(colors, isDark);

  const { id } = useLocalSearchParams();
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getTrainer(id);
        setTrainer(data);
      } catch (err) {
        console.log('Trainer fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

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
        <Text style={styles.headerTitle} numberOfLines={1}>
          {trainer?.name || 'Trainer'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.blue} />
        </View>
      ) : !trainer ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>Trainer not found</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

          {/* Avatar + name */}
          <View style={styles.profileTop}>
            {trainer.profile_picture ? (
              <Image source={{ uri: trainer.profile_picture }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarInitial}>
                  {trainer.name.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <Text style={styles.name}>{trainer.name}</Text>
            {!!trainer.speciality && (
              <Text style={styles.speciality}>{trainer.speciality}</Text>
            )}
            {!!trainer.location && (
              <View style={styles.locationRow}>
                <Feather name="map-pin" size={13} color={colors.greyLight} />
                <Text style={styles.locationText}>{trainer.location}</Text>
              </View>
            )}
          </View>

          {/* Stats row */}
          <View style={styles.statsRow}>
            {trainer.years_experience != null && (
              <View style={styles.stat}>
                <Text style={styles.statValue}>{trainer.years_experience}</Text>
                <Text style={styles.statLabel}>Years exp.</Text>
              </View>
            )}
            {trainer.clients_trained != null && (
              <>
                <View style={styles.statDivider} />
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{trainer.clients_trained}</Text>
                  <Text style={styles.statLabel}>Clients</Text>
                </View>
              </>
            )}
            {trainer.hourly_rate != null && (
              <>
                <View style={styles.statDivider} />
                <View style={styles.stat}>
                  <Text style={styles.statValue}>£{trainer.hourly_rate}</Text>
                  <Text style={styles.statLabel}>Per hour</Text>
                </View>
              </>
            )}
          </View>

          {/* Languages */}
          {!!trainer.languages && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Languages</Text>
              {renderLanguageTags(trainer.languages)}
            </View>
          )}

          {/* Bio */}
          {!!trainer.bio && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.bodyText}>{trainer.bio}</Text>
            </View>
          )}

          {/* Certifications */}
          {!!trainer.certifications && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Certifications</Text>
              <Text style={styles.bodyText}>{trainer.certifications}</Text>
            </View>
          )}

          {/* Links */}
          {(!!trainer.instagram || !!trainer.contact_email) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact</Text>
              <View style={styles.contactRow}>
                {!!trainer.instagram && (
                  <TouchableOpacity
                    style={styles.contactButton}
                    onPress={() => Linking.openURL(`https://instagram.com/${trainer.instagram.replace('@', '')}`)}
                  >
                    <Feather name="instagram" size={16} color="#E1306C" />
                    <Text style={[styles.contactButtonText, { color: '#E1306C' }]}>
                      {trainer.instagram.startsWith('@') ? trainer.instagram : `@${trainer.instagram}`}
                    </Text>
                  </TouchableOpacity>
                )}
                {!!trainer.contact_email && (
                  <TouchableOpacity
                    style={styles.contactButton}
                    onPress={() => Linking.openURL(`mailto:${trainer.contact_email}`)}
                  >
                    <Feather name="mail" size={16} color={colors.blue} />
                    <Text style={[styles.contactButtonText, { color: colors.blue }]}>
                      Send email
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
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
    errorText: { fontSize: 15, color: colors.grey },

    header: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: 24, paddingTop: 60, paddingBottom: 16,
      borderBottomWidth: 0.5, borderBottomColor: colors.greyBorder,
    },
    backButton: {
      width: 40, height: 40, borderRadius: 20,
      backgroundColor: colors.greyCard, alignItems: 'center', justifyContent: 'center',
    },
    headerTitle: { fontSize: 17, fontWeight: '600', color: colors.black, flex: 1, textAlign: 'center' },

    content: { paddingHorizontal: 24, paddingTop: 28, paddingBottom: 100 },

    profileTop: { alignItems: 'center', gap: 8, marginBottom: 24 },
    avatar: { width: 96, height: 96, borderRadius: 48, marginBottom: 4 },
    avatarPlaceholder: { backgroundColor: colors.blueLight, alignItems: 'center', justifyContent: 'center' },
    avatarInitial: { fontSize: 36, fontWeight: '700', color: colors.blueText },
    name: { fontSize: 24, fontWeight: '700', color: colors.black, letterSpacing: -0.5 },
    speciality: { fontSize: 15, color: colors.grey },
    locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    locationText: { fontSize: 13, color: colors.greyLight },

    statsRow: {
      flexDirection: 'row', backgroundColor: colors.greyCard, borderRadius: 20,
      padding: 20, marginBottom: 24,
    },
    stat: { flex: 1, alignItems: 'center', gap: 4 },
    statValue: { fontSize: 22, fontWeight: '700', color: colors.black, letterSpacing: -0.5 },
    statLabel: { fontSize: 11, color: colors.grey, fontWeight: '300' },
    statDivider: { width: 0.5, backgroundColor: colors.greyBorder },

    section: { marginBottom: 24, gap: 10 },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.black, letterSpacing: -0.3 },
    bodyText: { fontSize: 14, color: colors.grey, lineHeight: 22, fontWeight: '300' },

    tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    tag: { backgroundColor: colors.greyCard, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 100 },
    tagText: { fontSize: 13, color: colors.grey, fontWeight: '500' },

    contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    contactButton: {
      flexDirection: 'row', alignItems: 'center', gap: 8,
      paddingHorizontal: 16, paddingVertical: 12,
      borderRadius: 12, borderWidth: 1.5, borderColor: colors.greyBorder,
    },
    contactButtonText: { fontSize: 14, fontWeight: '600' },
  });
}
